import type { APIRoute } from "astro";

export const prerender = false;

/**
 * Stuurt het contactformulier door naar de n8n-webhook (besluit Checkpoint 0).
 * De webhook-URL blijft server-side — geen CORS, geen URL in de client-bundle.
 *
 * Antwoord: JSON bij een fetch-submit, redirect bij een gewone form-POST.
 *
 * Elke inzending logt één blok in de serverconsole (prefix [contact]) met de
 * stappen en, bij een fout, de exacte n8n-respons — zodat testen transparant is.
 */

/** Toont een webhook-URL zonder de volledige id te lekken in de logs. */
function maskWebhook(url: string): string {
  try {
    const u = new URL(url);
    const short = u.pathname.replace(/([0-9a-f-]{8})[0-9a-f-]+/i, "$1…");
    return `${u.host}${short}`;
  } catch {
    return "(ongeldige URL)";
  }
}

export const POST: APIRoute = async ({ request, redirect }) => {
  const t0 = Date.now();
  const webhook = import.meta.env.N8N_CONTACT_WEBHOOK_URL;
  const wantsJson = request.headers.get("accept")?.includes("application/json");
  const log = (...args: unknown[]) => console.log("[contact]", ...args);

  const fail = (status: number, message: string) => {
    console.warn(`[contact] ✗ ${status} — ${message} (${Date.now() - t0}ms)`);
    return wantsJson
      ? new Response(JSON.stringify({ ok: false, message }), {
          status,
          headers: { "content-type": "application/json" },
        })
      : redirect("/contact?verzonden=0", 303);
  };

  log("inzending ontvangen", wantsJson ? "(fetch)" : "(form-post)");

  if (!webhook) {
    console.error(
      "[contact] N8N_CONTACT_WEBHOOK_URL is niet gezet. Zet 'm in .env en herstart de dev-server.",
    );
    return fail(500, "Formulier is nog niet geconfigureerd.");
  }
  log("doel:", maskWebhook(webhook));

  const form = await request.formData();
  const payload = Object.fromEntries(form.entries());

  // Verplichte velden valideren voordat we iets doorsturen.
  const required = ["Naam", "Woonplaats", "Email", "Bericht"];
  const missing = required.filter((key) => !String(payload[key] ?? "").trim());
  if (missing.length > 0) {
    return fail(400, `Vul deze velden nog in: ${missing.join(", ")}`);
  }
  log("velden ok:", Object.keys(payload).join(", "));

  let response: Response;
  try {
    response = await fetch(webhook, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        ...payload,
        _meta: { url: request.headers.get("referer") ?? null },
      }),
    });
  } catch (error) {
    // Netwerkfout: n8n onbereikbaar, DNS, timeout.
    console.error("[contact] n8n onbereikbaar:", error);
    return fail(502, "Versturen mislukt. Probeer het later opnieuw.");
  }

  if (!response.ok) {
    // n8n reageerde, maar met een fout. De body bevat vaak de reden —
    // bv. 404 "The requested webhook … is not registered" als de workflow
    // niet actief is of de n8n-instance de webhook niet heeft geregistreerd.
    const body = await response.text().catch(() => "");
    console.error(
      `[contact] n8n gaf ${response.status} ${response.statusText}\n` +
        `          ${body.slice(0, 500) || "(lege body)"}`,
    );
    if (response.status === 404) {
      console.error(
        "[contact] → 404 betekent meestal: workflow niet actief, of de n8n-instance\n" +
          "          heeft de productie-webhook niet geregistreerd (plan gepauzeerd?).",
      );
    }
    return fail(502, "Versturen mislukt. Probeer het later opnieuw.");
  }

  log(`✓ verstuurd — n8n ${response.status} (${Date.now() - t0}ms)`);
  return wantsJson
    ? new Response(JSON.stringify({ ok: true }), {
        headers: { "content-type": "application/json" },
      })
    : redirect("/contact?verzonden=1", 303);
};
