// Testi del sito nelle due lingue. L'inglese sta su "/", l'italiano su "/it/".
// Per aggiungere un testo: una chiave in "en" e la stessa in "it" (TypeScript segnala quelle mancanti)
import { getCollection } from "astro:content";

export type Lang = "en" | "it";

const en = {
  metaTitle: "Marco Ceci — Web Developer & IT Specialist",
  metaDesc: "Web developer and IT specialist based in Latina, Italy. I build production web applications and manage IT infrastructure.",
  navAbout: "About",
  navSkills: "Skills",
  navProjects: "Projects",
  navContact: "Contact",
  switchLabel: "Versione italiana",
  footer: "made with curiosity",

  greeting: "// what's out there?",
  hi: "I'm",
  roles: ["Web Developer", "IT Specialist", "PHP Developer", "Next.js Developer", "Full-Stack Dev", "Curious Explorer"],
  sub: "Web developer and IT specialist based in Latina, Italy. I build production web applications and manage IT infrastructure — 3+ years of professional experience, including a document management system currently running in the chemical and pharmaceutical sector.",
  viewProjects: "View Projects",
  explore: "explore",
  aboutLabel: "About me",
  aboutTitle: "A developer who<br>keeps the lights on",
  aboutP1: "I started as a junior developer at <strong>Tecno Electric</strong>, where I built a document management system from the ground up for clients in the chemical and pharmaceutical sector — database design, PHP backend, JavaScript frontend, end to end.",
  aboutP2: "Since 2025 I've taken on <strong>IT infrastructure</strong> responsibilities too: managing workstations, networks, and Windows systems company-wide. I enjoy the combination — shipping features in the morning and solving hardware issues in the afternoon.",
  statYears: "Years of professional experience",
  statRoles: "Roles held at Tecno Electric",
  statFullstack: "Full-stack — from DB to UI",
  statInfra: "Infrastructure management",
  skillsLabel: "What I work with",
  skillsTitle: "Skills",
  advanced: "Advanced",
  intermediate: "Intermediate",
  windowsSystems: "Windows Systems",
  networking: "Networking",
  languages: "Languages",
  italianNative: "Italian — Native",
  englishIntermediate: "English — Intermediate",
  projectsLabel: "What I've built",
  projectsTitle: "Projects",
  liveInProduction: "Private — Live in production",
  dmsTitle: "Document Management System",
  dmsDesc: "A custom document management platform built from scratch for clients in the chemical and pharmaceutical sector. Handles document workflows, versioning, access control, and audit trails across multiple companies. Designed, built, and maintained solo over 3 years — currently in production.",
  gameTrackerDesc: "A personal game library manager. Track your wishlist, backlog, currently playing, and completed games across PC, PlayStation, and Nintendo Switch. Pulls cover art and metadata from the IGDB API, supports ratings and notes per game.",
  feldspatoDesc: "An IT support ticket management platform for companies. Designed to handle internal helpdesk workflows — creating, assigning, and tracking support requests across teams. Named after someone who wasn't afraid to go explore alone.",
  contactLabel: "Get in touch",
  contactTitle: "Let's work together",
  openTo: "Open to opportunities",
  contactText: "Some things are better experienced than explained — but an email works too.",
  sendEmail: "Send an email",

  blogLabel: "Notes from the field",
  blogDesc: "Notes from day-to-day IT work: real problems, how I diagnosed them, and what I learned.",
  blogEmpty: "First posts coming soon.",
  blogBack: "← All posts",
  draft: "draft",
  dateLocale: "en-GB",
};

const it: typeof en = {
  metaTitle: "Marco Ceci — Web Developer & IT Specialist",
  metaDesc: "Web developer e IT specialist a Latina. Sviluppo applicazioni web in produzione e gestisco l'infrastruttura IT.",
  navAbout: "Chi sono",
  navSkills: "Competenze",
  navProjects: "Progetti",
  navContact: "Contatti",
  switchLabel: "English version",
  footer: "fatto con curiosità",

  greeting: "// cosa c'è là fuori?",
  hi: "Sono",
  roles: ["Web Developer", "IT Specialist", "Sviluppatore PHP", "Sviluppatore Next.js", "Full-Stack Dev", "Esploratore curioso"],
  sub: "Web developer e IT specialist a Latina. Sviluppo applicazioni web in produzione e gestisco l'infrastruttura IT: oltre 3 anni di esperienza professionale, tra cui un sistema di gestione documentale in uso nel settore chimico e farmaceutico.",
  viewProjects: "Vedi i progetti",
  explore: "esplora",
  aboutLabel: "Chi sono",
  aboutTitle: "Uno sviluppatore che<br>tiene le luci accese",
  aboutP1: "Ho iniziato come sviluppatore junior in <strong>Tecno Electric</strong>, dove ho costruito da zero un sistema di gestione documentale per clienti del settore chimico e farmaceutico: progettazione del database, backend in PHP, frontend in JavaScript, dall'inizio alla fine.",
  aboutP2: "Dal 2025 mi occupo anche dell'<strong>infrastruttura IT</strong>: postazioni di lavoro, reti e sistemi Windows di tutta l'azienda. Mi piace questa combinazione: sviluppare nuove funzioni la mattina e risolvere problemi hardware il pomeriggio.",
  statYears: "Anni di esperienza professionale",
  statRoles: "Ruoli ricoperti in Tecno Electric",
  statFullstack: "Full-stack: dal database all'interfaccia",
  statInfra: "Gestione dell'infrastruttura",
  skillsLabel: "Con cosa lavoro",
  skillsTitle: "Competenze",
  advanced: "Avanzato",
  intermediate: "Intermedio",
  windowsSystems: "Sistemi Windows",
  networking: "Reti",
  languages: "Lingue",
  italianNative: "Italiano — Madrelingua",
  englishIntermediate: "Inglese — Intermedio",
  projectsLabel: "Cosa ho costruito",
  projectsTitle: "Progetti",
  liveInProduction: "Privato — In produzione",
  dmsTitle: "Sistema di gestione documentale",
  dmsDesc: "Una piattaforma di gestione documentale costruita da zero per clienti del settore chimico e farmaceutico. Gestisce flussi documentali, versioni, controllo degli accessi e tracciabilità delle modifiche per più aziende. Progettata, sviluppata e mantenuta da solo in 3 anni, oggi in produzione.",
  gameTrackerDesc: "Un gestore personale della libreria di videogiochi. Tiene traccia di lista dei desideri, giochi da iniziare, in corso e completati su PC, PlayStation e Nintendo Switch. Recupera copertine e dati dall'API di IGDB e permette voti e note per ogni gioco.",
  feldspatoDesc: "Una piattaforma per gestire i ticket di assistenza IT in azienda. Pensata per l'helpdesk interno: creare, assegnare e seguire le richieste di supporto tra i vari team. Prende il nome da qualcuno che non ha avuto paura di andare a esplorare da solo.",
  contactLabel: "Contatti",
  contactTitle: "Lavoriamo insieme",
  openTo: "Aperto a nuove opportunità",
  contactText: "Certe cose vanno vissute più che spiegate, ma anche un'email va benissimo.",
  sendEmail: "Scrivimi un'email",

  blogLabel: "Appunti dal campo",
  blogDesc: "Appunti dal lavoro IT di tutti i giorni: problemi reali, come li ho diagnosticati e cosa ho imparato.",
  blogEmpty: "I primi articoli arriveranno presto.",
  blogBack: "← Tutti gli articoli",
  draft: "bozza",
  dateLocale: "it-IT",
};

export const ui = { en, it };

// Lingua della pagina, letta dall'indirizzo (configurazione i18n in astro.config.mjs)
export const langOf = (locale: string | undefined): Lang => (locale === "it" ? "it" : "en");

// Indirizzo di una pagina in una lingua: "/blog/" → "/it/blog/"
export const pathFor = (lang: Lang, path: string) => (lang === "it" ? `/it${path}` : path);

// La stessa pagina nell'altra lingua: ogni pagina esiste in tutte e due
export const otherLangPath = (pathname: string) =>
  pathname.startsWith("/it/") || pathname === "/it" ? pathname.slice(3) || "/" : `/it${pathname}`;

// Articoli: quelli inglesi in src/content/blog, le traduzioni italiane in src/content/blog/it, con lo stesso nome di file
export const slugOf = (id: string) => id.replace(/^it\//, "");

export async function getPosts(lang: Lang) {
  const posts = await getCollection(
    "blog",
    ({ id, data }) => (import.meta.env.DEV || !data.draft) && (lang === "it" ? id.startsWith("it/") : !id.includes("/")),
  );
  // più recenti prima; a parità di data, ordine alfabetico
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf() || a.data.title.localeCompare(b.data.title));
}
