import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: { projectId: "r6eh5fne", dataset: "production" },
  // Vaste hostname + appId, zodat `sanity deploy` niet interactief hoeft te vragen.
  studioHost: "mpetersmontage",
  deployment: { appId: "s5u562qtsibmzxblfahurk91" },
});
