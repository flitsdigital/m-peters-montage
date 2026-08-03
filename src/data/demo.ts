/**
 * Voorbeeldcontent voor de /sections-showcase. Echte pagina-inhoud komt in
 * Fase 4 uit Sanity; dit bestand verdwijnt dan.
 */
import hero from "../assets/images/FLITS-2501-Groot_1.avif";
import portret from "../assets/images/FLITS-2532-Groot_1.avif";
import ladder from "../assets/images/FLITS-2510-Groot_1.avif";
import kozijn from "../assets/images/FLITS-2521-Groot_1.avif";
import veranda from "../assets/images/WhatsApp-Image-2024-12-21-at-13.34.50_1.webp";
import zonwering from "../assets/images/zonnewering_1.webp";
import schuifwanden from "../assets/images/houten-overkapping-met-schuifwanden.jpg";
import rolluiken from "../assets/images/rolluiken_1.webp";
import kozijnen from "../assets/images/kunststof-kozijnen.jpg";

export const IMAGES = {
  hero,
  portret,
  ladder,
  kozijn,
  veranda,
  zonwering,
  schuifwanden,
  rolluiken,
  kozijnen,
};

export const DIENST_CARDS = [
  {
    href: "/kunststof-kozijnen",
    title: "Kunststof kozijnen",
    text: "Duurzame en onderhoudsarme kozijnen die zorgen voor betere isolatie en een strakke uitstraling.",
    image: hero,
    alt: "m. peters montage een frame aan het opmeten",
  },
  {
    href: "/verandas",
    title: "Veranda's",
    text: "Creëer een gezellige buitenruimte waar je het hele jaar door van kunt genieten.",
    image: veranda,
    alt: "Een veranda buiten in de tuin",
  },
  {
    href: "/zonwering",
    title: "Zonwering",
    text: "Houd je huis koel en comfortabel met stijlvolle en functionele zonwering.",
    image: zonwering,
    alt: "Zonwering in emmen",
  },
  {
    href: "/glazen-schuifwanden",
    title: "Glazen schuifwanden",
    text: "Maak van je veranda of overkapping een afgesloten ruimte die je het hele jaar door kunt gebruiken.",
    image: schuifwanden,
    alt: "Glazen schuifwanden geplaatst buiten in de tuin.",
  },
  {
    href: "/rolluiken",
    title: "Rolluiken",
    text: "Extra privacy, isolatie en veiligheid met praktische en duurzame rolluiken.",
    image: rolluiken,
    alt: "Rolluik",
  },
];

/** Uit Reviews.csv. */
export const REVIEWS = [
  { name: "Henk de Vries", text: "Mooie kozijnen door Michael, topper!" },
  {
    name: "Joery Jonkeren",
    text: "Michael heeft mij echt perfect geholpen met een super mooie veranda! Ook heeft hij onze kozijnen geplaatst, echt een aanrader!",
  },
  {
    name: "Jordi Klavers",
    text: "Leuke samenwerking met Michael, altijd fijn contact, reageert snel en is makkelijk te bereiken als er een keertje wat is!",
  },
  {
    name: "Marc Post",
    text: "Nieuw kunstof kozijn laten plaatsen met hr+++ glas. Goede service. Komt afspraken na en alles netjes afgewerkt.",
  },
  {
    name: "Patrick Bruins",
    text: "Ons huidig kozijn op zolder met enkel glas was nodig toe aan vervanging. Vandaag heeft Michael er een nieuw kunststof kozijn met dubbel glas ingezet.",
  },
];

/** Uit Projecten.csv. */
export const PROJECTEN = [
  {
    href: "/projecten/29-oktober-kozijnen-klazienaveen",
    title: "Kunststof kozijnen met houtnerf in Klazienaveen",
    text: "In Klazienaveen hebben we deze prachtige kunststof kozijnen geplaatst! De kozijnen hebben buiten een prachtige bruine houtnerf.",
    image: kozijnen,
    alt: "Kunststof kozijnen in Klazienaveen",
    tags: ["Klazienaveen", "Kunststof Kozijnen"],
  },
  {
    href: "/projecten/22-jan-aluminium-tuinkamer-zwartemeer",
    title: "Aluminium overkapping in Zwartemeer",
    text: "Vorige week deze aluminium overkapping mogen leveren en plaatsen in Zwartemeer.",
    image: veranda,
    alt: "Aluminium overkapping",
    tags: ["Zwartemeer", "Overkapping"],
  },
  {
    href: "/projecten/10-sep-glazen-schuifwanden-klazienaveen",
    title: "Glazen schuifwanden in Klazienaveen",
    text: "In Klazienaveen hebben we deze houten overkapping mogen voorzien van glazenschuifwanden.",
    image: schuifwanden,
    alt: "Glazen schuifwanden",
    tags: ["Glazen Schuifwanden"],
  },
  {
    href: "/projecten/21-okt-zonwering-klazienaveen",
    title: "Voor 2 klanten zonwering!",
    text: "Een tijdje terug mochten we voor 2 klanten zonwering leveren en monteren.",
    image: zonwering,
    alt: "Zonwering",
    tags: ["Zonwering", "Rolluiken"],
  },
  {
    href: "/projecten/14-okt-voordeur-vervangen",
    title: "Nieuwe kunststof voordeur",
    text: "In Erica hebben we een oude houten voordeur vervangen door een nieuwe kunststof voordeur.",
    image: kozijn,
    alt: "Kunststof voordeur",
    tags: ["Erica", "Kunststof Kozijnen"],
  },
];

/** Uit Blogs.csv. */
export const BLOGS = [
  {
    href: "/blog/de-5-voordelen-van-kunststof-kozijnen-waarom-steeds-meer-mensen-overstappen",
    title: "De 5 voordelen van kunststof kozijnen",
    summary:
      "Wie op zoek is naar nieuwe kozijnen, komt al snel uit bij kunststof. En dat is niet voor niets.",
    image: kozijnen,
    alt: "Kunststof kozijnen",
  },
  {
    href: "/blog/hoe-kunststof-kozijnen-onderhouden-5-tips-van-michael-peters-montage",
    title: "Hoe kunststof kozijnen onderhouden? 5 tips",
    summary:
      "Kunststof kozijnen zijn duurzaam, isolerend en onderhoudsarm. Maar onderhoudsarm betekent niet onderhoudsvrij.",
    image: kozijn,
    alt: "Onderhoud kozijnen",
  },
  {
    href: "/blog/is-zonwering-goed-voor-energiebesparing",
    title: "Is zonwering goed voor energiebesparing?",
    summary:
      "Met de juiste zonwering kun je flink wat energie én kosten besparen. In deze blog leggen we uit hoe dat zit.",
    image: zonwering,
    alt: "Zonwering",
  },
];

export const WERKWIJZE_STAPPEN = [
  {
    title: "Offerte bespreken & inmeten",
    text: "Ik kom volledig vrijblijvend langs om de offerte te bespreken. En alles voor jouw project in te meten.",
  },
  {
    title: "Materialen uitzoeken & bestellen",
    text: "Als de offerte akkoord is, bestel ik de benodigde materialen en ga ik aan de slag!",
  },
  {
    title: "Nette oplevering",
    text: "Topservice vind ik belangrijk! Daarom doe ik mijn best om elk project tot een goed einde te brengen!",
  },
];

export const FAQ_ITEMS = [
  {
    question: "Wat zijn de voordelen van kunststof kozijnen?",
    answer:
      'Kunststof kozijnen zijn onderhoudsarm, duurzaam, energiebesparend en bieden uitstekende isolatie. <a href="/kunststof-kozijnen/voordelen">Lees hier meer over de voordelen</a>.',
  },
  {
    question: "Zijn kunststof kozijnen beter geïsoleerd dan houten kozijnen?",
    answer:
      "Ja. Dankzij meerkamerprofielen en een goede aansluiting op de gevel isoleren kunststof kozijnen doorgaans beter dan hout.",
  },
  {
    question: "Hoe lang gaan kunststof kozijnen mee?",
    answer: "Gemiddeld zo'n 50 jaar, zonder dat er intensief onderhoud nodig is.",
  },
  {
    question: "Zijn kunststof kozijnen kleurvast?",
    answer:
      "Moderne kunststof kozijnen zijn kleurvast en bestand tegen UV-straling — vaak 25 jaar of langer.",
  },
];

export const REGIOS = [
  {
    href: "/kunststof-kozijnen/regio/klazienaveen",
    title: "Klazienaveen",
    image: kozijnen,
    alt: "Kunststof kozijnen in Klazienaveen",
  },
  {
    href: "/kunststof-kozijnen/regio/emmen",
    title: "Emmen",
    image: kozijn,
    alt: "Kunststof kozijnen in Emmen",
  },
  {
    href: "/kunststof-kozijnen/regio/drenthe",
    title: "Drenthe",
    image: ladder,
    alt: "Kunststof kozijnen in Drenthe",
  },
];

export const HANDIGE_LINKS = [
  { label: "kunststofkozijnen", href: "http://kunststofkozijnen.expertpagina.nl" },
  { label: "kunststof-kozijn", href: "http://kunststof-kozijn.verzamelgids.nl" },
  { label: "kunststofkozijn", href: "http://kunststofkozijn.startbewijs.nl" },
  { label: "kunststof-kozijnen", href: "http://kunststof-kozijnen.startpagina.net" },
];
