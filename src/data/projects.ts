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
   layout all follow from this array. Every project is a card that opens for
   its description, the facts about how it is built and its links.
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
  /** Three or four short statements about what is inside. */
  points: string[];
}

export type PartKey = "frontend" | "backend" | "database" | "hosting" | "auth";
export type LinkKind = "site" | "app" | "repo";

export interface ClientWork {
  name: string;
  /** Where it is shown on slideagentur.ch. */
  url: string;
  note: Record<Locale, string>;
}

export interface ProjectLink {
  kind: LinkKind;
  url: string;
  /** The link as it should read on the page, without protocol. */
  displayUrl: string;
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
  /** Where "Visit" goes. A private project has none. */
  url?: string;
  /** The link as it should read on the page, without protocol. */
  displayUrl?: string;
  year?: string;
  /** "soon" keeps the link but says the site is not public yet; "private"
      is a project that exists but is not open to visitors. */
  status: "live" | "soon" | "private";
  /** Frames shown in the opened card. The first one is the cover. */
  frames: string[];
  /** The phone version of the site as one tall image. */
  mobile?: MobileCapture;
  stack: TechId[];
  /** How it is built, one line per layer. Not translated: names only. */
  parts: Partial<Record<PartKey, string>>;
  /** More places to go than the main `url`: the app, the source code. */
  links?: ProjectLink[];
  /** Work done for clients, listed inside the agency's own card. */
  clients?: ClientWork[];
  /** Name of the matching GitHub repository, so it is not listed twice. */
  repo?: string;
  copy: Record<Locale, ProjectCopy>;
}

export const PROJECTS: Project[] = [
  {
    slug: "indago-ai",
    title: "Indago AI",
    url: "https://indagoai.ch",
    displayUrl: "indagoai.ch",
    year: "2026",
    status: "live",
    frames: [
      "/projects/indago-ai/01.jpg",
      "/projects/indago-ai/02.jpg",
      "/projects/indago-ai/03.jpg",
    ],
    mobile: { src: "/projects/indago-ai/mobile.jpg", width: 780, height: 6752 },
    stack: ["react", "vite", "python", "fastapi", "sqlite", "playwright", "claude", "netlify"],
    parts: {
      frontend: "React, Vite",
      backend: "Python, FastAPI, Playwright",
      database: "SQLite via SQLModel, fields encrypted at rest",
      hosting: "Netlify (front end), own Ubuntu VPS over SSH (back end)",
      auth: "Accounts with argon2id password hashing",
    },
    links: [
      { kind: "site", url: "https://indagoai.ch", displayUrl: "indagoai.ch" },
      { kind: "app", url: "https://app.indagoai.ch", displayUrl: "app.indagoai.ch" },
    ],
    copy: {
      en: {
        summary:
          "A person search for Switzerland: one name in, one dossier with sources out.",
        description:
          "Indago queries public sources at the same time, from the Swiss phone book and social networks to Reddit, GitHub and breach databases, and compiles a dossier in which every statement names its source. indagoai.ch is the public site, app.indagoai.ch is the product behind the sign-in. It is built for HR, law firms and newsrooms.",
        type: "Web product",
        role: "Product, design and development",
        points: [
          "One collector per source, run side by side, with a circuit breaker so a failing source does not stall the search.",
          "An AI model, Claude first and a local Ollama model as fallback, turns the findings into the dossier.",
          "The dossier exports as a PDF, rendered in a headless browser.",
          "Rate limits on search and export, and a scheduled job that deletes data after its retention period.",
        ],
      },
      de: {
        summary:
          "Eine Personensuche für die Schweiz: ein Name rein, ein Dossier mit Quellen heraus.",
        description:
          "Indago fragt öffentliche Quellen gleichzeitig ab, vom Schweizer Telefonbuch über soziale Netzwerke bis zu Reddit, GitHub und Datenleck-Datenbanken, und stellt daraus ein Dossier zusammen, in dem jede Angabe ihre Quelle nennt. indagoai.ch ist die öffentliche Seite, app.indagoai.ch ist das Produkt hinter der Anmeldung. Gebaut für HR, Kanzleien und Redaktionen.",
        type: "Web-Produkt",
        role: "Produkt, Design und Entwicklung",
        points: [
          "Pro Quelle ein eigener Collector, parallel abgefragt, mit Circuit Breaker, damit eine ausfallende Quelle die Suche nicht blockiert.",
          "Ein KI-Modell, zuerst Claude und als Ersatz ein lokales Ollama-Modell, macht aus den Funden das Dossier.",
          "Das Dossier lässt sich als PDF exportieren, gerendert in einem Headless-Browser.",
          "Limits für Suche und Export und ein geplanter Job, der Daten nach der Aufbewahrungsfrist löscht.",
        ],
      },
      tr: {
        summary:
          "İsviçre için kişi araması: bir isim girer, kaynaklı bir dosya çıkar.",
        description:
          "Indago, İsviçre telefon rehberinden sosyal ağlara, Reddit'ten GitHub'a ve veri sızıntısı veritabanlarına kadar açık kaynakları aynı anda sorgular ve her bilginin kaynağını gösteren bir dosya hazırlar. indagoai.ch herkese açık site, app.indagoai.ch ise girişin arkasındaki ürün. İK ekipleri, hukuk büroları ve haber merkezleri için geliştirildi.",
        type: "Web ürünü",
        role: "Ürün, tasarım ve geliştirme",
        points: [
          "Her kaynak için ayrı bir toplayıcı, yan yana çalışır; devre kesici sayesinde çöken bir kaynak aramayı durdurmaz.",
          "Bir yapay zekâ modeli, önce Claude, yedek olarak yerel Ollama, bulguları dosyaya dönüştürür.",
          "Dosya, başsız bir tarayıcıda oluşturulan PDF olarak dışa aktarılır.",
          "Arama ve dışa aktarma için sınırlar, ve verileri saklama süresi dolunca silen zamanlanmış bir iş.",
        ],
      },
    },
  },
  {
    slug: "slide-dashboard",
    title: "SLIDE Dashboard",
    url: "https://dashboard.slideagentur.ch",
    displayUrl: "dashboard.slideagentur.ch",
    year: "2026",
    status: "live",
    frames: ["/projects/slide-dashboard/01.jpg"],
    stack: ["nextjs", "react", "typescript", "tailwind", "prisma", "postgresql", "playwright", "docker"],
    parts: {
      frontend: "Next.js 16, React 19, Tailwind CSS 4",
      backend: "Next.js server, separate Playwright worker",
      database: "PostgreSQL 16 via Prisma 7, about 30 models",
      hosting: "Own VPS at Infomaniak, Switzerland (Docker, Caddy)",
      auth: "Own sessions, argon2id, TOTP two-factor",
    },
    copy: {
      en: {
        summary:
          "The CRM, customer portal and acquisition tool that runs SLIDE. Sign-in only.",
        description:
          "One app with two separate sides. Admins manage customers, projects, offers, invoices and contracts. Customers get a portal with their project status, files, contracts to sign and a chat with me. I built the sign-in myself instead of using a third-party service, and it is hosted in Switzerland.",
        type: "Internal platform",
        role: "Product, design and development",
        points: [
          "Invoices as PDFs with the Swiss QR payment slip, and contracts with an e-signature.",
          "Customers only ever see their own data, enforced per row. Two-factor login, audit log, an emergency kill switch and IP blocking.",
          "The acquisition module finds local businesses on OpenStreetMap and Google Maps, checks their website and scores the lead. It stores only what it observed. The code behind it has 194 automated tests.",
          "Encrypted backups, and it receives the project requests from the configurator on slideagentur.ch.",
        ],
      },
      de: {
        summary:
          "Das CRM, Kundenportal und Akquise-Werkzeug, mit dem SLIDE läuft. Nur mit Anmeldung.",
        description:
          "Eine App mit zwei getrennten Seiten. Admins verwalten Kunden, Projekte, Offerten, Rechnungen und Verträge. Kunden bekommen ein Portal mit Projektstatus, Dateien, Verträgen zum Unterschreiben und einem Chat mit mir. Die Anmeldung habe ich selbst gebaut statt einen Fremdanbieter zu nehmen, gehostet wird in der Schweiz.",
        type: "Interne Plattform",
        role: "Produkt, Design und Entwicklung",
        points: [
          "Rechnungen als PDF mit Schweizer QR-Zahlteil und Verträge mit E-Signatur.",
          "Kunden sehen immer nur ihre eigenen Daten, pro Zeile durchgesetzt. Zwei-Faktor-Login, Audit-Log, Not-Aus-Schalter und IP-Sperre.",
          "Das Akquise-Modul findet lokale Betriebe auf OpenStreetMap und Google Maps, prüft ihre Website und bewertet den Lead. Es speichert nur, was es beobachtet hat. Der Code dahinter hat 194 automatische Tests.",
          "Verschlüsselte Backups, und es nimmt die Projektanfragen aus dem Konfigurator auf slideagentur.ch entgegen.",
        ],
      },
      tr: {
        summary:
          "SLIDE'ı yürüten CRM, müşteri portalı ve müşteri bulma aracı. Yalnızca girişle.",
        description:
          "İki ayrı tarafı olan tek bir uygulama. Yöneticiler müşterileri, projeleri, teklifleri, faturaları ve sözleşmeleri yönetir. Müşteriler proje durumunu, dosyaları, imzalanacak sözleşmeleri ve benimle sohbeti içeren bir portal alır. Girişi hazır bir hizmet yerine kendim yazdım ve İsviçre'de barındırılıyor.",
        type: "İç platform",
        role: "Ürün, tasarım ve geliştirme",
        points: [
          "İsviçre QR ödeme bölümlü PDF faturalar ve e-imzalı sözleşmeler.",
          "Müşteriler yalnızca kendi verilerini görür, satır bazında uygulanır. İki adımlı giriş, denetim kaydı, acil durdurma anahtarı ve IP engeli.",
          "Müşteri bulma modülü yerel işletmeleri OpenStreetMap ve Google Maps'te bulur, web sitelerini kontrol eder ve adayı puanlar. Yalnızca gözlemlediğini kaydeder. Arkasındaki kodun 194 otomatik testi var.",
          "Şifreli yedekler; ayrıca slideagentur.ch'deki yapılandırıcıdan gelen proje taleplerini alır.",
        ],
      },
    },
  },
  {
    slug: "slide-agentur",
    title: "SLIDE Agentur",
    url: "https://slideagentur.ch",
    displayUrl: "slideagentur.ch",
    year: "2023",
    status: "live",
    frames: [
      "/projects/slide-agentur/01.jpg",
      "/projects/slide-agentur/02.jpg",
      "/projects/slide-agentur/03.jpg",
    ],
    mobile: { src: "/projects/slide-agentur/mobile.jpg", width: 780, height: 6752 },
    stack: ["nextjs", "react", "typescript", "tailwind", "motion", "netlify"],
    clients: [
      {
        name: "Shots by Levin",
        url: "https://slideagentur.ch/referenzen/shots-by-levin",
        note: {
          en: "Sports photographer, Bern. Website with portfolio, services and booking.",
          de: "Sportfotograf, Bern. Website mit Portfolio, Leistungen und Buchung.",
          tr: "Spor fotoğrafçısı, Bern. Portfolyo, hizmetler ve rezervasyonlu web sitesi.",
        },
      },
      {
        name: "N&J",
        url: "https://slideagentur.ch/referenzen/nj-clothing",
        note: {
          en: "Fashion label, Bern. Photo and video production and social media, over 10,000 views.",
          de: "Modemarke, Bern. Foto- und Videoproduktion und Social Media, über 10'000 Aufrufe.",
          tr: "Moda markası, Bern. Fotoğraf ve video üretimi ile sosyal medya, 10.000'den fazla izlenme.",
        },
      },
      {
        name: "Avanti Bistro Ittigen",
        url: "https://slideagentur.ch/referenzen/avanti-bistro",
        note: {
          en: "Restaurant, Ittigen. Responsive website.",
          de: "Gastronomie, Ittigen. Responsive Website.",
          tr: "Restoran, Ittigen. Duyarlı web sitesi.",
        },
      },
      {
        name: "ZeroTrace",
        url: "https://slideagentur.ch/referenzen/zerotrace",
        note: {
          en: "Tech and privacy. Took over the social channels, one or two posts a week.",
          de: "Tech und Privacy. Social-Media-Kanäle übernommen, ein bis zwei Beiträge pro Woche.",
          tr: "Teknoloji ve gizlilik. Sosyal medya kanalları devralındı, haftada bir iki paylaşım.",
        },
      },
    ],
    parts: {
      frontend: "Next.js, React, TypeScript, Tailwind CSS, Motion",
      backend: "Requests go to the SLIDE Dashboard",
      hosting: "Netlify",
    },
    copy: {
      en: {
        summary:
          "My digital agency in Bern: websites, social media and IT for Swiss small businesses.",
        description:
          "I founded SLIDE in 2023. The site is in German and English, shows the services and the client work, and lets a visitor put a project together in five steps with the price on screen straight away. The finished request lands in the SLIDE Dashboard.",
        type: "Agency website",
        role: "Founder, design and development",
        points: [
          "German and English.",
          "A five-step configurator with a live price.",
          "Connected to the dashboard, which also tells the site if it should be switched off.",
        ],
      },
      de: {
        summary:
          "Meine Digitalagentur in Bern: Websites, Social Media und IT für Schweizer KMU.",
        description:
          "SLIDE habe ich 2023 gegründet. Die Seite ist auf Deutsch und Englisch, zeigt die Leistungen und die Kundenarbeiten, und wer will, stellt sein Projekt in fünf Schritten zusammen und sieht den Preis sofort. Die fertige Anfrage landet im SLIDE Dashboard.",
        type: "Agentur-Website",
        role: "Gründer, Design und Entwicklung",
        points: [
          "Deutsch und Englisch.",
          "Ein Konfigurator in fünf Schritten mit Live-Preis.",
          "Mit dem Dashboard verbunden, das der Seite auch sagt, ob sie abgeschaltet werden soll.",
        ],
      },
      tr: {
        summary:
          "Bern'deki dijital ajansım: İsviçreli KOBİ'ler için web siteleri, sosyal medya ve BT.",
        description:
          "SLIDE'ı 2023'te kurdum. Site Almanca ve İngilizce; hizmetleri ve müşteri işlerini gösteriyor, ziyaretçi projesini beş adımda oluşturup fiyatı hemen görebiliyor. Tamamlanan talep SLIDE Dashboard'a düşer.",
        type: "Ajans web sitesi",
        role: "Kurucu, tasarım ve geliştirme",
        points: [
          "Almanca ve İngilizce.",
          "Canlı fiyatlı, beş adımlı yapılandırıcı.",
          "Siteye kapatılıp kapatılmayacağını da söyleyen dashboard'a bağlı.",
        ],
      },
    },
  },
  {
    slug: "ironlog",
    title: "IronLog",
    url: "https://gym.slideagentur.ch",
    displayUrl: "gym.slideagentur.ch",
    year: "2026",
    status: "live",
    frames: ["/projects/ironlog/01.jpg"],
    stack: ["nextjs", "react", "typescript", "pwa", "supabase", "netlify"],
    parts: {
      frontend: "Next.js 15, React 19, TypeScript, one global CSS system",
      database: "Dexie on IndexedDB on the device, optional Supabase Postgres",
      hosting: "Netlify",
      auth: "Optional account with Google, optional Face ID lock",
    },
    repo: "ironlog",
    links: [
      { kind: "app", url: "https://gym.slideagentur.ch", displayUrl: "gym.slideagentur.ch" },
      { kind: "repo", url: "https://github.com/ak0f/ironlog", displayUrl: "github.com/ak0f/ironlog" },
    ],
    copy: {
      en: {
        summary:
          "A gym tracker that works offline and keeps your training on your own device.",
        description:
          "IronLog logs workouts, sets, bodyweight and progress photos, spots personal records by itself and shows streaks and trends. Everything is stored on the phone first, so it works without an account. An account only adds sync, friends and leaderboards.",
        type: "Web app (PWA)",
        role: "Product, design and development",
        points: [
          "Local-first: the device is the source of truth, the cloud only receives a summary of the stats.",
          "Installable, with an offline service worker.",
          "Friends by username, and leaderboards by XP or a recomposition score.",
          "Progress photos side by side, and a timeline of workouts, records and weight.",
        ],
      },
      de: {
        summary:
          "Ein Gym-Tracker, der offline funktioniert und dein Training auf deinem eigenen Gerät lässt.",
        description:
          "IronLog hält Workouts, Sätze, Körpergewicht und Fortschrittsfotos fest, erkennt persönliche Rekorde selbst und zeigt Serien und Verläufe. Alles liegt zuerst auf dem Handy, deshalb geht es ohne Konto. Ein Konto bringt nur Sync, Freunde und Ranglisten dazu.",
        type: "Web-App (PWA)",
        role: "Produkt, Design und Entwicklung",
        points: [
          "Local-first: Das Gerät ist die Quelle der Wahrheit, die Cloud bekommt nur eine Zusammenfassung der Werte.",
          "Installierbar, mit Service Worker für den Offline-Betrieb.",
          "Freunde per Benutzername und Ranglisten nach XP oder Recomp-Score.",
          "Fortschrittsfotos im Vergleich und eine Timeline aus Workouts, Rekorden und Gewicht.",
        ],
      },
      tr: {
        summary:
          "Çevrimdışı çalışan ve antrenmanını kendi cihazında tutan bir spor takipçisi.",
        description:
          "IronLog antrenmanları, setleri, vücut ağırlığını ve ilerleme fotoğraflarını kaydeder, kişisel rekorları kendisi fark eder, seri ve eğilimleri gösterir. Her şey önce telefonda durur, bu yüzden hesapsız çalışır. Hesap yalnızca senkronizasyon, arkadaşlar ve sıralamalar ekler.",
        type: "Web uygulaması (PWA)",
        role: "Ürün, tasarım ve geliştirme",
        points: [
          "Önce yerel: gerçeğin kaynağı cihazdır, bulut yalnızca değerlerin özetini alır.",
          "Yüklenebilir, çevrimdışı çalışan servis işçisiyle.",
          "Kullanıcı adıyla arkadaşlar, XP veya rekomp puanına göre sıralamalar.",
          "Yan yana ilerleme fotoğrafları ve antrenman, rekor ve kilo zaman çizelgesi.",
        ],
      },
    },
  },
  {
    slug: "scribe",
    title: "Scribe",
    url: "https://scribe-journal.netlify.app",
    displayUrl: "scribe-journal.netlify.app",
    year: "2026",
    status: "live",
    frames: [],
    stack: ["nextjs", "react", "typescript", "pwa", "supabase", "netlify"],
    parts: {
      frontend: "Next.js static export, TypeScript, installable PWA",
      backend: "Supabase and Netlify functions, only ever sees ciphertext",
      database: "Dexie on IndexedDB, encrypted with AES-256-GCM",
      hosting: "Netlify",
      auth: "Supabase account, kept apart from the vault password",
    },
    copy: {
      en: {
        summary:
          "A private journal and planner whose server cannot read a single word of it.",
        description:
          "Scribe holds daily and monthly logs, tasks, projects, notes and events in one calm, book-like app. Everything is encrypted on the device before it goes anywhere, and the server stores ciphertext only. It works offline and syncs between phone and computer.",
        type: "Web app (PWA)",
        role: "Product, design and development",
        points: [
          "Zero-knowledge: the key is derived from a password on the device, so the server cannot decrypt anything.",
          "Local-first: it works without a connection and syncs when one comes back.",
          "A second device gets the same vault through a key wrapped under the password and a recovery key.",
          "Two-way Google Calendar sync and push reminders.",
        ],
      },
      de: {
        summary:
          "Ein privates Journal und ein Planer, dessen Server kein einziges Wort davon lesen kann.",
        description:
          "Scribe vereint Tages- und Monatslogs, Aufgaben, Projekte, Notizen und Termine in einer ruhigen, buchartigen App. Alles wird auf dem Gerät verschlüsselt, bevor es irgendwohin geht, der Server speichert nur Chiffretext. Es funktioniert offline und gleicht Handy und Computer ab.",
        type: "Web-App (PWA)",
        role: "Produkt, Design und Entwicklung",
        points: [
          "Zero-Knowledge: Der Schlüssel entsteht aus einem Passwort auf dem Gerät, der Server kann nichts entschlüsseln.",
          "Local-first: Es läuft ohne Verbindung und gleicht ab, sobald wieder eine da ist.",
          "Ein zweites Gerät bekommt denselben Tresor über einen Schlüssel, der unter Passwort und Wiederherstellungsschlüssel verpackt ist.",
          "Google-Kalender-Abgleich in beide Richtungen und Push-Erinnerungen.",
        ],
      },
      tr: {
        summary:
          "Sunucusunun tek bir kelimesini bile okuyamadığı özel bir günlük ve planlayıcı.",
        description:
          "Scribe günlük ve aylık kayıtları, görevleri, projeleri, notları ve etkinlikleri sakin, kitap gibi tek bir uygulamada toplar. Her şey bir yere gitmeden önce cihazda şifrelenir, sunucu yalnızca şifreli metni saklar. Çevrimdışı çalışır ve telefon ile bilgisayarı eşitler.",
        type: "Web uygulaması (PWA)",
        role: "Ürün, tasarım ve geliştirme",
        points: [
          "Sıfır bilgi: anahtar cihazdaki paroladan türetilir, sunucu hiçbir şeyi çözemez.",
          "Önce yerel: bağlantı olmadan çalışır, bağlantı gelince eşitler.",
          "İkinci cihaz aynı kasayı parola ve kurtarma anahtarı altında paketlenmiş bir anahtarla alır.",
          "İki yönlü Google Takvim eşitlemesi ve anlık bildirim hatırlatıcıları.",
        ],
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
    frames: [
      "/projects/easysolve/01.jpg",
      "/projects/easysolve/02.jpg",
      "/projects/easysolve/03.jpg",
    ],
    mobile: { src: "/projects/easysolve/mobile.jpg", width: 780, height: 6752 },
    stack: ["nextjs", "react", "typescript", "gsap", "lenis", "netlify"],
    parts: {
      frontend: "Next.js, React, TypeScript, GSAP, Lenis",
      hosting: "Netlify, static export",
    },
    copy: {
      en: {
        summary:
          "Software and IT from Bern: websites, apps, platforms and tools that save time and money.",
        description:
          "My software studio. The site sets out the five services, walks through a project from the first conversation to measuring the result, and has a calculator for what routine work costs a business today.",
        type: "Company website",
        role: "Founder, design and development",
        points: [
          "Five services and a project walk-through from first call to measured result.",
          "A calculator for the cost of routine work.",
          "Exported as static files.",
        ],
      },
      de: {
        summary:
          "Software und IT aus Bern: Webseiten, Apps, Plattformen und Tools, die Zeit und Geld sparen.",
        description:
          "Mein Softwarestudio. Die Seite stellt die fünf Leistungen vor, zeigt den Ablauf eines Projekts vom ersten Gespräch bis zum Nachmessen und hat einen Rechner dafür, was Routinearbeit einen Betrieb heute kostet.",
        type: "Firmen-Website",
        role: "Gründer, Design und Entwicklung",
        points: [
          "Fünf Leistungen und der Projektablauf vom ersten Gespräch bis zum gemessenen Ergebnis.",
          "Ein Rechner für die Kosten von Routinearbeit.",
          "Als statische Dateien exportiert.",
        ],
      },
      tr: {
        summary:
          "Bern'den yazılım ve BT: zaman ve para kazandıran web siteleri, uygulamalar, platformlar ve araçlar.",
        description:
          "Yazılım stüdyom. Site beş hizmeti anlatıyor, bir projenin ilk görüşmeden sonucun ölçülmesine kadar nasıl ilerlediğini gösteriyor ve rutin işlerin bir işletmeye bugün neye mal olduğunu hesaplayan bir araç içeriyor.",
        type: "Şirket web sitesi",
        role: "Kurucu, tasarım ve geliştirme",
        points: [
          "Beş hizmet ve ilk görüşmeden ölçülen sonuca proje akışı.",
          "Rutin işin maliyeti için bir hesaplayıcı.",
          "Statik dosyalar olarak dışa aktarılır.",
        ],
      },
    },
  },
  {
    slug: "akif-agent",
    title: "Claude Workflow",
    url: "https://github.com/ak0f/akif-s-agent",
    displayUrl: "github.com/ak0f/akif-s-agent",
    year: "2026",
    status: "live",
    frames: [],
    stack: ["powershell", "shell", "markdown", "claude"],
    parts: {
      backend: "Skills, agents and slash commands for Claude Code, installed by script",
    },
    repo: "akif-s-agent",
    copy: {
      en: {
        summary:
          "The workflow I build software with: an idea goes through planning, building, review and release.",
        description:
          "A set of specialised agents for Claude Code. One orchestrator moves a project from discovery and requirements through design and implementation to a review loop and release, and stops at approval gates for anything that costs money or goes live.",
        type: "Developer tooling",
        role: "Design and development",
        points: [
          "12 agents, 10 slash commands and 13 procedure skills behind one orchestrator.",
          "A review loop of QA, code review, security and an adversarial critic that sends findings back until they pass.",
          "Production deploys, DNS and secrets always need my explicit approval.",
        ],
      },
      de: {
        summary:
          "Der Workflow, mit dem ich Software baue: Eine Idee durchläuft Planung, Bau, Prüfung und Release.",
        description:
          "Ein Satz spezialisierter Agenten für Claude Code. Ein Orchestrator führt ein Projekt von der Klärung und den Anforderungen über Design und Umsetzung durch eine Prüfschleife bis zum Release und hält an Freigabe-Toren, wenn etwas Geld kostet oder live geht.",
        type: "Entwickler-Werkzeug",
        role: "Konzept und Entwicklung",
        points: [
          "12 Agenten, 10 Slash-Befehle und 13 Ablauf-Skills hinter einem Orchestrator.",
          "Eine Prüfschleife aus QA, Code-Review, Security und einem kritischen Gegenleser, die Funde zurückschickt, bis sie bestehen.",
          "Produktiv-Deploys, DNS und Secrets brauchen immer meine ausdrückliche Freigabe.",
        ],
      },
      tr: {
        summary:
          "Yazılımı kurduğum iş akışı: bir fikir planlama, yapım, denetim ve yayından geçer.",
        description:
          "Claude Code için uzmanlaşmış ajanlar kümesi. Bir orkestratör projeyi keşif ve gereksinimlerden tasarım ve uygulamaya, oradan denetim döngüsüne ve yayına taşır; para harcayan veya yayına çıkan her şeyde onay kapısında durur.",
        type: "Geliştirici aracı",
        role: "Tasarım ve geliştirme",
        points: [
          "Tek orkestratör arkasında 12 ajan, 10 slash komutu ve 13 prosedür becerisi.",
          "KG, kod incelemesi, güvenlik ve bulguları geçene kadar geri gönderen eleştirmenden oluşan denetim döngüsü.",
          "Canlıya alma, DNS ve gizli anahtarlar her zaman açık onayımı gerektirir.",
        ],
      },
    },
  },
  {
    slug: "unteams",
    title: "UnTeams",
    url: "https://github.com/ak0f/UnTeams",
    displayUrl: "github.com/ak0f/UnTeams",
    year: "2026",
    status: "live",
    frames: [],
    stack: ["javascript", "nodejs"],
    parts: {
      frontend: "Panel injected into the Teams window, plain JavaScript and CSS",
      backend: "Node.js launcher, no server of its own",
    },
    repo: "UnTeams",
    copy: {
      en: {
        summary:
          "A Windows tool that deletes your own Microsoft Teams messages in bulk.",
        description:
          "Teams gives you no way to clear your own messages in one go. UnTeams restarts Teams with a local debug port and adds a panel to it that does what a person would do: open a chat, find your messages, tick them and delete. It is open source and unofficial.",
        type: "Desktop tool",
        role: "Design and development",
        points: [
          "Preview before deleting, with text, regex and date filters.",
          "Adjustable speed, and it pauses by itself when Teams is slow.",
          "Nothing leaves the machine: the debug port is local and there is no server.",
        ],
      },
      de: {
        summary:
          "Ein Windows-Tool, das deine eigenen Microsoft-Teams-Nachrichten auf einmal löscht.",
        description:
          "Teams bietet keine Möglichkeit, die eigenen Nachrichten in einem Schritt zu löschen. UnTeams startet Teams mit einem lokalen Debug-Port neu und setzt ein Panel hinein, das tut, was ein Mensch täte: Chat öffnen, eigene Nachrichten finden, anhaken und löschen. Open Source und inoffiziell.",
        type: "Desktop-Tool",
        role: "Konzept und Entwicklung",
        points: [
          "Vorschau vor dem Löschen, mit Text-, Regex- und Datumsfiltern.",
          "Einstellbares Tempo, und es pausiert von selbst, wenn Teams langsam ist.",
          "Nichts verlässt den Rechner: Der Debug-Port ist lokal und es gibt keinen Server.",
        ],
      },
      tr: {
        summary:
          "Kendi Microsoft Teams mesajlarını toplu silen bir Windows aracı.",
        description:
          "Teams kendi mesajlarını tek seferde silmeye izin vermez. UnTeams, Teams'i yerel bir hata ayıklama portuyla yeniden başlatır ve içine bir insanın yapacağını yapan bir panel koyar: sohbeti aç, mesajlarını bul, işaretle ve sil. Açık kaynaklı ve resmî değil.",
        type: "Masaüstü aracı",
        role: "Tasarım ve geliştirme",
        points: [
          "Silmeden önce önizleme; metin, regex ve tarih filtreleri.",
          "Ayarlanabilir hız; Teams yavaşlayınca kendiliğinden duraklar.",
          "Hiçbir şey makineden çıkmaz: port yerel, sunucu yok.",
        ],
      },
    },
  },
  {
    slug: "apotheke",
    title: "Wegmühle Apotheke",
    url: "https://apotheke.akif.pw",
    displayUrl: "apotheke.akif.pw",
    status: "live",
    frames: ["/projects/apotheke.png"],
    stack: ["html", "css", "javascript"],
    parts: {
      frontend: "HTML, CSS and JavaScript, no framework",
    },
    copy: {
      en: {
        summary:
          "A website for a pharmacy in Ostermundigen, hand-written in HTML, CSS and JavaScript.",
        description:
          "Home, team, services and contact for the Wegmühle pharmacy. No framework and no site builder, every line written by hand.",
        type: "Website",
        role: "Design and development",
        points: ["Home, team, services and contact.", "No build step and no dependencies."],
      },
      de: {
        summary:
          "Eine Website für eine Apotheke in Ostermundigen, von Hand in HTML, CSS und JavaScript geschrieben.",
        description:
          "Home, Team, Angebote und Kontakt für die Wegmühle-Apotheke. Kein Framework und kein Baukasten, jede Zeile von Hand geschrieben.",
        type: "Website",
        role: "Design und Entwicklung",
        points: ["Home, Team, Angebote und Kontakt.", "Kein Build-Schritt und keine Abhängigkeiten."],
      },
      tr: {
        summary:
          "Ostermundigen'deki bir eczane için elle HTML, CSS ve JavaScript ile yazılmış bir web sitesi.",
        description:
          "Wegmühle eczanesi için ana sayfa, ekip, hizmetler ve iletişim. Framework yok, hazır şablon yok; her satır elle yazıldı.",
        type: "Web sitesi",
        role: "Tasarım ve geliştirme",
        points: ["Ana sayfa, ekip, hizmetler ve iletişim.", "Derleme adımı ve bağımlılık yok."],
      },
    },
  },
  {
    slug: "clothinglogos",
    title: "clothinglogos",
    url: "https://instagram.com/clothinglogos",
    displayUrl: "instagram.com/clothinglogos",
    status: "live",
    frames: ["/projects/clothinglogos.png"],
    stack: [],
    parts: {},
    copy: {
      en: {
        summary:
          "A clothing brand I built the identity for and sold through Instagram.",
        description:
          "I designed the wordmark and the look of the brand, then sold the customised designs and products through Instagram.",
        type: "Brand identity",
        role: "Identity and design",
        points: ["Wordmark and visual identity.", "Sold through Instagram."],
      },
      de: {
        summary:
          "Eine Kleidermarke, deren Identität ich gestaltet und die ich über Instagram verkauft habe.",
        description:
          "Ich habe die Wortmarke und den Auftritt der Marke gestaltet und die individuellen Designs und Produkte über Instagram verkauft.",
        type: "Markenidentität",
        role: "Identität und Design",
        points: ["Wortmarke und visuelle Identität.", "Verkauf über Instagram."],
      },
      tr: {
        summary:
          "Kimliğini tasarladığım ve Instagram üzerinden sattığım bir giyim markası.",
        description:
          "Markanın yazı logosunu ve görünümünü tasarladım, özel tasarım ve ürünleri Instagram üzerinden sattım.",
        type: "Marka kimliği",
        role: "Kimlik ve tasarım",
        points: ["Yazı logosu ve görsel kimlik.", "Instagram üzerinden satış."],
      },
    },
  },
];
