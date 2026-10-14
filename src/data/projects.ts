import type { Locale } from "@/i18n/dictionaries";
import type { TechId } from "./tech";

/* ---------------------------------------------------------------------------
   Project registry.

   This file is the whole list. To add a project:

   1. Put its images in `public/projects/<slug>/` (16:10, 2400x1500 works well).
      Optionally add `mobile.jpg`: the phone version of the site, captured at
      390x844 and stitched top to bottom into one tall image. Phones then show
      the project in a phone frame that scrolls through it.
   2. Add one object to PROJECTS below. TypeScript will ask for every field,
      including the copy in all three languages.

   Nothing else needs touching: the counter, the order, the icons and the
   layout all follow from this array. `featured` projects get a full stage with
   a scrolling reel of their frames; the rest land in the compact list under
   it, where each row opens for detail.
--------------------------------------------------------------------------- */

export interface ProjectCopy {
  /** One line, shown at all times. */
  summary: string;
  /** Two or three sentences, shown when the project is opened. */
  description: string;
  /** What kind of thing it is: "Agency website", "Brand identity". */
  type: string;
  /** What I did on it. */
  role: string;
}

/** The phone viewport the `mobile` captures were taken at. */
export const MOBILE_VIEWPORT = { width: 390, height: 844 } as const;

export interface MobileCapture {
  src: string;
  /** Pixel size of the stitched image. */
  width: number;
  height: number;
}

export interface Project {
  slug: string;
  title: string;
  /** Where "Visit" goes. Every project has one. */
  url: string;
  /** The link as it should read on the page, without protocol. */
  displayUrl: string;
  year?: string;
  /** "soon" keeps the link but says the site is not public yet. */
  status: "live" | "soon";
  featured: boolean;
  /** Frames in the order the reel plays them. The first one is the cover. */
  frames: string[];
  /** The phone version of the site as one tall image, shown on phones. */
  mobile?: MobileCapture;
  stack: TechId[];
  /** Name of the matching GitHub repository, so it is not listed twice. */
  repo?: string;
  copy: Record<Locale, ProjectCopy>;
}

export const PROJECTS: Project[] = [
  {
    slug: "slide-agentur",
    title: "SLIDE Agentur",
    url: "https://slideagentur.ch",
    displayUrl: "slideagentur.ch",
    year: "2023",
    status: "live",
    featured: true,
    frames: [
      "/projects/slide-agentur/01.jpg",
      "/projects/slide-agentur/02.jpg",
      "/projects/slide-agentur/03.jpg",
    ],
    mobile: { src: "/projects/slide-agentur/mobile.jpg", width: 780, height: 6752 },
    stack: ["nextjs", "react", "typescript", "tailwind", "motion", "netlify"],
    copy: {
      en: {
        summary:
          "My digital agency in Bern: websites, social media and IT for Swiss small businesses.",
        description:
          "I founded SLIDE in 2023. The site is in German and English, shows the services and the client work, and lets a visitor put a project together in five steps with the price on screen straight away.",
        type: "Agency website",
        role: "Founder, design and development",
      },
      de: {
        summary:
          "Meine Digitalagentur in Bern: Websites, Social Media und IT für Schweizer KMU.",
        description:
          "SLIDE habe ich 2023 gegründet. Die Seite ist auf Deutsch und Englisch, zeigt die Leistungen und die Kundenarbeiten, und wer will, stellt sein Projekt in fünf Schritten zusammen und sieht den Preis sofort.",
        type: "Agentur-Website",
        role: "Gründer, Design und Entwicklung",
      },
      tr: {
        summary:
          "Bern'deki dijital ajansım: İsviçreli KOBİ'ler için web siteleri, sosyal medya ve BT.",
        description:
          "SLIDE'ı 2023'te kurdum. Site Almanca ve İngilizce; hizmetleri ve müşteri işlerini gösteriyor, ziyaretçi projesini beş adımda oluşturup fiyatı hemen görebiliyor.",
        type: "Ajans web sitesi",
        role: "Kurucu, tasarım ve geliştirme",
      },
    },
  },
  {
    slug: "indago-ai",
    title: "Indago AI",
    url: "https://indagoai.ch",
    displayUrl: "indagoai.ch",
    year: "2026",
    status: "live",
    featured: true,
    frames: [
      "/projects/indago-ai/01.jpg",
      "/projects/indago-ai/02.jpg",
      "/projects/indago-ai/03.jpg",
    ],
    mobile: { src: "/projects/indago-ai/mobile.jpg", width: 780, height: 6752 },
    stack: ["react", "vite", "python", "netlify"],
    copy: {
      en: {
        summary:
          "A person search for Switzerland: one name in, one dossier with sources out.",
        description:
          "Indago queries public sources at the same time, from the commercial register and directories to web, media and archives, and compiles a dossier in which every statement names its source. It is built for HR, law firms and newsrooms.",
        type: "Web product",
        role: "Product, design and development",
      },
      de: {
        summary:
          "Eine Personensuche für die Schweiz: ein Name rein, ein Dossier mit Quellen heraus.",
        description:
          "Indago fragt öffentliche Quellen gleichzeitig ab, vom Handelsregister über Verzeichnisse bis zu Web, Medien und Archiven, und stellt daraus ein Dossier zusammen, in dem jede Angabe ihre Quelle nennt. Gebaut für HR, Kanzleien und Redaktionen.",
        type: "Web-Produkt",
        role: "Produkt, Design und Entwicklung",
      },
      tr: {
        summary:
          "İsviçre için kişi araması: bir isim girer, kaynaklı bir dosya çıkar.",
        description:
          "Indago, ticaret sicilinden rehberlere, web, medya ve arşivlere kadar açık kaynakları aynı anda sorgular ve her bilginin kaynağını gösteren bir dosya hazırlar. İK ekipleri, hukuk büroları ve haber merkezleri için geliştirildi.",
        type: "Web ürünü",
        role: "Ürün, tasarım ve geliştirme",
      },
    },
  },
  {
    slug: "easysolve",
    title: "easysolve",
    url: "https://easysolve.ch",
    displayUrl: "easysolve.ch",
    year: "2026",
    // The domain is registered but not serving yet. Switch to "live" once it is.
    status: "soon",
    featured: true,
    frames: [
      "/projects/easysolve/01.jpg",
      "/projects/easysolve/02.jpg",
      "/projects/easysolve/03.jpg",
    ],
    mobile: { src: "/projects/easysolve/mobile.jpg", width: 780, height: 6752 },
    stack: ["nextjs", "react", "typescript", "gsap", "lenis", "netlify"],
    copy: {
      en: {
        summary:
          "Software and IT from Bern: websites, apps, platforms and tools that save time and money.",
        description:
          "My software studio. The site sets out the five services, walks through a project from the first conversation to measuring the result, and has a calculator for what routine work costs a business today.",
        type: "Company website",
        role: "Founder, design and development",
      },
      de: {
        summary:
          "Software und IT aus Bern: Webseiten, Apps, Plattformen und Tools, die Zeit und Geld sparen.",
        description:
          "Mein Softwarestudio. Die Seite stellt die fünf Leistungen vor, zeigt den Ablauf eines Projekts vom ersten Gespräch bis zum Nachmessen und hat einen Rechner dafür, was Routinearbeit einen Betrieb heute kostet.",
        type: "Firmen-Website",
        role: "Gründer, Design und Entwicklung",
      },
      tr: {
        summary:
          "Bern'den yazılım ve BT: zaman ve para kazandıran web siteleri, uygulamalar, platformlar ve araçlar.",
        description:
          "Yazılım stüdyom. Site beş hizmeti anlatıyor, bir projenin ilk görüşmeden sonucun ölçülmesine kadar nasıl ilerlediğini gösteriyor ve rutin işlerin bir işletmeye bugün neye mal olduğunu hesaplayan bir araç içeriyor.",
        type: "Şirket web sitesi",
        role: "Kurucu, tasarım ve geliştirme",
      },
    },
  },
  {
    slug: "apotheke",
    title: "Wegmühle Apotheke",
    url: "https://apotheke.akif.pw",
    displayUrl: "apotheke.akif.pw",
    status: "live",
    featured: false,
    frames: ["/projects/apotheke.png"],
    stack: ["html", "css", "javascript"],
    copy: {
      en: {
        summary:
          "A website for a pharmacy in Ostermundigen, hand-written in HTML, CSS and JavaScript.",
        description:
          "Home, team, services and contact for the Wegmühle pharmacy. No framework and no site builder, every line written by hand.",
        type: "Website",
        role: "Design and development",
      },
      de: {
        summary:
          "Eine Website für eine Apotheke in Ostermundigen, von Hand in HTML, CSS und JavaScript geschrieben.",
        description:
          "Home, Team, Angebote und Kontakt für die Wegmühle-Apotheke. Kein Framework und kein Baukasten, jede Zeile von Hand geschrieben.",
        type: "Website",
        role: "Design und Entwicklung",
      },
      tr: {
        summary:
          "Ostermundigen'deki bir eczane için elle HTML, CSS ve JavaScript ile yazılmış bir web sitesi.",
        description:
          "Wegmühle eczanesi için ana sayfa, ekip, hizmetler ve iletişim. Framework yok, hazır şablon yok; her satır elle yazıldı.",
        type: "Web sitesi",
        role: "Tasarım ve geliştirme",
      },
    },
  },
  {
    slug: "clothinglogos",
    title: "clothinglogos",
    url: "https://instagram.com/clothinglogos",
    displayUrl: "instagram.com/clothinglogos",
    status: "live",
    featured: false,
    frames: ["/projects/clothinglogos.png"],
    stack: [],
    copy: {
      en: {
        summary:
          "A clothing brand I built the identity for and sold through Instagram.",
        description:
          "I designed the wordmark and the look of the brand, then sold the customised designs and products through Instagram.",
        type: "Brand identity",
        role: "Identity and design",
      },
      de: {
        summary:
          "Eine Kleidermarke, deren Identität ich gestaltet und die ich über Instagram verkauft habe.",
        description:
          "Ich habe die Wortmarke und den Auftritt der Marke gestaltet und die individuellen Designs und Produkte über Instagram verkauft.",
        type: "Markenidentität",
        role: "Identität und Design",
      },
      tr: {
        summary:
          "Kimliğini tasarladığım ve Instagram üzerinden sattığım bir giyim markası.",
        description:
          "Markanın yazı logosunu ve görünümünü tasarladım, özel tasarım ve ürünleri Instagram üzerinden sattım.",
        type: "Marka kimliği",
        role: "Kimlik ve tasarım",
      },
    },
  },
];

export const FEATURED_PROJECTS = PROJECTS.filter((project) => project.featured);
export const OTHER_PROJECTS = PROJECTS.filter((project) => !project.featured);
