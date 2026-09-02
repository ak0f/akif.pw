export const locales = ["en", "de", "tr"] as const;
export type Locale = (typeof locales)[number];

export const localeLabels: Record<Locale, string> = {
  en: "EN",
  de: "DE",
  tr: "TR",
};

export const CONTACT_EMAIL = "contact@akif.pw";
export const CONTACT_PHONE = "+41 78 326 29 52";
export const CONTACT_PHONE_HREF = "tel:+41783262952";

export const GITHUB_USER = "ak0f";
export const GITHUB_URL = `https://github.com/${GITHUB_USER}`;

export const SOCIALS = [
  { label: "GitHub", handle: "ak0f", href: GITHUB_URL },
  { label: "Instagram", handle: "akif.pw", href: "https://instagram.com/akif.pw" },
  { label: "TikTok", handle: "akif.pw", href: "https://tiktok.com/@akif.pw" },
  { label: "Snapchat", handle: "akif.pw", href: "https://snapchat.com/add/akif.pw" },
] as const;

/* Work that exists on akif.pw but never as a repository. Titles, links and
   imagery are the same in every language; only the copy is translated, which
   lives in each dictionary's `projects.site`, index-matched to this list. */
export const SITE_PROJECTS = [
  {
    title: "Apotheke",
    href: "https://apotheke.akif.pw",
    image: "/projects/apotheke.png",
    meta: "HTML, CSS, JS",
  },
  {
    title: "clothinglogos",
    href: "https://instagram.com/clothinglogos",
    image: "/projects/clothinglogos.png",
    meta: "Branding, Logo, Identity",
  },
] as const;

export const skillCategories = ["it", "design", "print"] as const;
export type SkillCategory = (typeof skillCategories)[number];

export interface SkillItem {
  name: string;
  desc: string;
  /** Self-assessed, 0-100. Carried over from akif.pw verbatim. */
  level: number;
  category: SkillCategory;
}

interface SiteProjectCopy {
  tag: string;
  desc: string;
}

interface Fact {
  label: string;
  value: string;
}

export interface Dictionary {
  nav: {
    brand: string;
    skills: string;
    projects: string;
    about: string;
    contact: string;
    menu: string;
    close: string;
  };
  hero: {
    greeting: string;
  };
  skills: {
    eyebrow: string;
    heading: string;
    count: string;
    sortLabel: string;
    sortByCategory: string;
    sortByLevel: string;
    levelLabel: string;
    note: string;
    categories: Record<SkillCategory, string>;
    items: SkillItem[];
  };
  projects: {
    eyebrow: string;
    heading: string;
    source: string;
    site: [SiteProjectCopy, SiteProjectCopy];
    repoLabel: string;
    liveLabel: string;
    updatedLabel: string;
    noDescription: string;
    empty: string;
    viewAll: string;
  };
  about: {
    eyebrow: string;
    heading: string;
    p1: string;
    p2: string;
    p3: string;
    facts: [Fact, Fact, Fact, Fact];
  };
  contact: {
    heading: [string, string];
    body: string;
    cta: string;
    emailLabel: string;
    phoneLabel: string;
  };
  footer: {
    rights: string;
    back: string;
  };
}

export const dictionaries: Record<Locale, Dictionary> = {
  en: {
    nav: {
      brand: "Akif Yaylaci",
      skills: "Capabilities",
      projects: "Projects",
      about: "About",
      contact: "Contact",
      menu: "Menu",
      close: "Close",
    },
    hero: {
      greeting: "Hello, I am Akif",
    },
    skills: {
      eyebrow: "Capabilities",
      heading: "Ten things I can do, and how far along I actually am.",
      count: "10 skills / 3 categories",
      sortLabel: "Sort",
      sortByCategory: "By category",
      sortByLevel: "By level",
      levelLabel: "Proficiency",
      note: "Levels are my own honest estimate, not a certificate.",
      categories: {
        it: "Information Technology",
        design: "Creative Design",
        print: "Print & Production",
      },
      items: [
        {
          name: "Hardware repair",
          desc: "Diagnosing, fixing and maintaining computer hardware components.",
          level: 70,
          category: "it",
        },
        {
          name: "Python",
          desc: "Comfortable with the basics; wrote a few automation scripts, a game bot and a drone controller.",
          level: 35,
          category: "it",
        },
        {
          name: "Cybersecurity",
          desc: "Basic understanding of security concepts and vulnerabilities; early learning stage.",
          level: 30,
          category: "it",
        },
        {
          name: "JavaScript",
          desc: "Basic syntax, variables and functions; limited experience with the DOM and event handling.",
          level: 25,
          category: "it",
        },
        {
          name: "Linux",
          desc: "Basic command-line usage and a working understanding of the system, not system administration.",
          level: 25,
          category: "it",
        },
        {
          name: "Silhouette Studio",
          desc: "Vector design and cutting-machine operation for creative projects.",
          level: 55,
          category: "design",
        },
        {
          name: "Logo design",
          desc: "Building memorable brand identities and visual logos for small businesses.",
          level: 50,
          category: "design",
        },
        {
          name: "Photo editing",
          desc: "Image editing, retouching and digital enhancement.",
          level: 45,
          category: "design",
        },
        {
          name: "Textile printing",
          desc: "Custom fabric printing techniques and textile design applications.",
          level: 45,
          category: "print",
        },
        {
          name: "Packaging printing",
          desc: "Packaging design and printing for product branding.",
          level: 40,
          category: "print",
        },
      ],
    },
    projects: {
      eyebrow: "Projects",
      heading: "Things I have built.",
      source: "akif.pw + github.com/ak0f",
      site: [
        {
          tag: "Web development",
          desc: "A website built for a pharmacy, hand-written in HTML, CSS and JavaScript.",
        },
        {
          tag: "Design",
          desc: "A clothing brand I built the identity for, then sold the customised designs and products through Instagram.",
        },
      ],
      repoLabel: "Repository",
      liveLabel: "Live site",
      updatedLabel: "Updated",
      noDescription: "No description yet.",
      empty: "GitHub could not be reached. The repositories are at github.com/ak0f.",
      viewAll: "All repositories",
    },
    about: {
      eyebrow: "About",
      heading: "About me",
      p1: "I have been into computers, operating systems and web development for a long time. In my free time I code with HTML, CSS and JavaScript, work with Linux, dig into cybersecurity and repair phones and computers.",
      p2: "I am in 9th grade (Spez. Sek) in Dennigkofen, and I start my apprenticeship as Informatiker EFZ in platform development at the Bundesamt für Informatik. Maths is my favourite subject, because I like thinking logically and solving problems.",
      p3: "Alongside school I help out on YouTube projects with livestreams and video editing, and I have worked small jobs delivering medication, labelling and recording stock in a warehouse, and ironing. They taught me to work reliably, carefully and with attention.",
      facts: [
        { label: "Based", value: "3072 Ostermundigen, Switzerland" },
        { label: "School", value: "9th grade, Spez. Sek Dennigkofen" },
        {
          label: "Apprenticeship",
          value: "Informatiker EFZ, Bundesamt für Informatik",
        },
        { label: "Languages", value: "German, English, Turkish" },
      ],
    },
    contact: {
      heading: ["Get in", "touch."],
      body: "Email works best, and I get back to you as soon as I can. Open to design and print work, small web jobs and anything interesting in between.",
      cta: "Send me an email",
      emailLabel: "Email",
      phoneLabel: "Mobile",
    },
    footer: {
      rights: "All rights reserved.",
      back: "Back to top",
    },
  },

  de: {
    nav: {
      brand: "Akif Yaylaci",
      skills: "Fähigkeiten",
      projects: "Projekte",
      about: "Über mich",
      contact: "Kontakt",
      menu: "Menü",
      close: "Schliessen",
    },
    hero: {
      greeting: "Hallo, ich bin Akif",
    },
    skills: {
      eyebrow: "Fähigkeiten",
      heading: "Zehn Dinge, die ich kann, und wie weit ich wirklich bin.",
      count: "10 Fähigkeiten / 3 Kategorien",
      sortLabel: "Sortierung",
      sortByCategory: "Nach Kategorie",
      sortByLevel: "Nach Niveau",
      levelLabel: "Niveau",
      note: "Die Werte sind meine ehrliche Selbsteinschätzung, kein Zertifikat.",
      categories: {
        it: "Informationstechnologie",
        design: "Kreatives Design",
        print: "Druck & Produktion",
      },
      items: [
        {
          name: "Hardware-Reparatur",
          desc: "Diagnose, Reparatur und Wartung von Computer-Hardware-Komponenten.",
          level: 70,
          category: "it",
        },
        {
          name: "Python",
          desc: "Vertraut mit den Grundlagen; ein paar Automatisierungsskripte, ein Game-Bot und eine Drohnensteuerung.",
          level: 35,
          category: "it",
        },
        {
          name: "Cybersecurity",
          desc: "Grundlegendes Verständnis von Sicherheitskonzepten und Schwachstellen; frühes Lernstadium.",
          level: 30,
          category: "it",
        },
        {
          name: "JavaScript",
          desc: "Grundlegende Syntax, Variablen und Funktionen; begrenzte Erfahrung mit DOM und Ereignisbehandlung.",
          level: 25,
          category: "it",
        },
        {
          name: "Linux",
          desc: "Grundlegende Kommandozeilen-Nutzung und Systemverständnis, keine Systemadministration.",
          level: 25,
          category: "it",
        },
        {
          name: "Silhouette Studio",
          desc: "Vektordesign und Schneidemaschinen-Bedienung für kreative Projekte.",
          level: 55,
          category: "design",
        },
        {
          name: "Logo-Design",
          desc: "Einprägsame Markenidentitäten und visuelle Logos für kleine Unternehmen.",
          level: 50,
          category: "design",
        },
        {
          name: "Fotobearbeitung",
          desc: "Bildbearbeitung, Retusche und digitale Verbesserung.",
          level: 45,
          category: "design",
        },
        {
          name: "Textildruck",
          desc: "Individuelle Stoffdrucktechniken und Textildesign-Anwendungen.",
          level: 45,
          category: "print",
        },
        {
          name: "Verpackungsdruck",
          desc: "Verpackungsdesign und -druck für Produktbranding.",
          level: 40,
          category: "print",
        },
      ],
    },
    projects: {
      eyebrow: "Projekte",
      heading: "Dinge, die ich gebaut habe.",
      source: "akif.pw + github.com/ak0f",
      site: [
        {
          tag: "Webentwicklung",
          desc: "Eine Website für eine Apotheke, von Hand in HTML, CSS und JavaScript gebaut.",
        },
        {
          tag: "Design",
          desc: "Eine Kleidermarke, für die ich die Identität gestaltet und die Produkte über Instagram verkauft habe.",
        },
      ],
      repoLabel: "Repository",
      liveLabel: "Live-Seite",
      updatedLabel: "Aktualisiert",
      noDescription: "Noch keine Beschreibung.",
      empty: "GitHub ist nicht erreichbar. Die Repositories liegen auf github.com/ak0f.",
      viewAll: "Alle Repositories",
    },
    about: {
      eyebrow: "Über mich",
      heading: "Über mich",
      p1: "Ich beschäftige mich schon lange mit Computern, Betriebssystemen und Webentwicklung. In meiner Freizeit programmiere ich mit HTML, CSS und JavaScript, arbeite mit Linux, interessiere mich für Cybersecurity und repariere Handys und Computer.",
      p2: "Ich besuche derzeit die 9. Klasse (Spez. Sek) in Dennigkofen und beginne meine Lehre als Informatiker EFZ Plattformentwicklung beim Bundesamt für Informatik. Mein Lieblingsfach ist Mathematik, weil ich gerne logisch denke und Probleme löse.",
      p3: "Neben der Schule helfe ich bei YouTube-Projekten mit Livestreams und Videoschnitt mit. Durch mehrere kleine Jobs, beim Ausliefern von Medikamenten, im Lager beim Etikettieren und Erfassen von Artikeln oder beim Bügeln, habe ich gelernt, zuverlässig, konzentriert und genau zu arbeiten.",
      facts: [
        { label: "Standort", value: "3072 Ostermundigen, Schweiz" },
        { label: "Schule", value: "9. Klasse, Spez. Sek Dennigkofen" },
        {
          label: "Lehrstelle",
          value: "Informatiker EFZ, Bundesamt für Informatik",
        },
        { label: "Sprachen", value: "Deutsch, Englisch, Türkisch" },
      ],
    },
    contact: {
      heading: ["Kontakt", "aufnehmen."],
      body: "Am besten per E-Mail, ich melde mich so schnell wie möglich zurück. Offen für Design- und Druckarbeiten, kleine Webprojekte und alles Spannende dazwischen.",
      cta: "E-Mail schreiben",
      emailLabel: "E-Mail",
      phoneLabel: "Mobil",
    },
    footer: {
      rights: "Alle Rechte vorbehalten.",
      back: "Nach oben",
    },
  },

  tr: {
    nav: {
      brand: "Akif Yaylaci",
      skills: "Yetenekler",
      projects: "Projeler",
      about: "Hakkımda",
      contact: "İletişim",
      menu: "Menü",
      close: "Kapat",
    },
    hero: {
      greeting: "Merhaba, ben Akif",
    },
    skills: {
      eyebrow: "Yetenekler",
      heading: "Yapabildiğim on şey ve gerçekte ne kadar ilerlediğim.",
      count: "10 yetenek / 3 kategori",
      sortLabel: "Sırala",
      sortByCategory: "Kategoriye göre",
      sortByLevel: "Seviyeye göre",
      levelLabel: "Seviye",
      note: "Değerler kendi dürüst değerlendirmem, bir sertifika değil.",
      categories: {
        it: "Bilgi Teknolojisi",
        design: "Yaratıcı Tasarım",
        print: "Baskı & Üretim",
      },
      items: [
        {
          name: "Donanım onarımı",
          desc: "Bilgisayar donanım bileşenlerini teşhis etme, onarma ve bakımını yapma.",
          level: 70,
          category: "it",
        },
        {
          name: "Python",
          desc: "Temellerde rahatım; birkaç otomasyon betiği, bir oyun botu ve bir drone kontrolü yazdım.",
          level: 35,
          category: "it",
        },
        {
          name: "Siber güvenlik",
          desc: "Güvenlik kavramları ve açıkları hakkında temel anlayış; erken öğrenme aşaması.",
          level: 30,
          category: "it",
        },
        {
          name: "JavaScript",
          desc: "Temel sözdizimi, değişkenler ve fonksiyonlar; DOM ve olay işlemede sınırlı deneyim.",
          level: 25,
          category: "it",
        },
        {
          name: "Linux",
          desc: "Temel komut satırı kullanımı ve sistem anlayışı, sistem yönetimi değil.",
          level: 25,
          category: "it",
        },
        {
          name: "Silhouette Studio",
          desc: "Yaratıcı projeler için vektör tasarımı ve kesim makinesi kullanımı.",
          level: 55,
          category: "design",
        },
        {
          name: "Logo tasarımı",
          desc: "Küçük işletmeler için akılda kalıcı marka kimlikleri ve görsel logolar.",
          level: 50,
          category: "design",
        },
        {
          name: "Fotoğraf düzenleme",
          desc: "Görüntü düzenleme, rötuş ve dijital iyileştirme.",
          level: 45,
          category: "design",
        },
        {
          name: "Tekstil baskısı",
          desc: "Özel kumaş baskı teknikleri ve tekstil tasarım uygulamaları.",
          level: 45,
          category: "print",
        },
        {
          name: "Ambalaj baskısı",
          desc: "Ürün markalaması için ambalaj tasarımı ve baskısı.",
          level: 40,
          category: "print",
        },
      ],
    },
    projects: {
      eyebrow: "Projeler",
      heading: "Yaptığım işler.",
      source: "akif.pw + github.com/ak0f",
      site: [
        {
          tag: "Web geliştirme",
          desc: "Bir eczane için elle HTML, CSS ve JavaScript ile yazılmış bir web sitesi.",
        },
        {
          tag: "Tasarım",
          desc: "Kimliğini tasarladığım ve özel ürünlerini Instagram üzerinden sattığım bir giyim markası.",
        },
      ],
      repoLabel: "Depo",
      liveLabel: "Canlı site",
      updatedLabel: "Güncellendi",
      noDescription: "Henüz açıklama yok.",
      empty: "GitHub'a ulaşılamadı. Depolar github.com/ak0f adresinde.",
      viewAll: "Tüm depolar",
    },
    about: {
      eyebrow: "Hakkımda",
      heading: "Hakkımda",
      p1: "Uzun zamandır bilgisayarlar, işletim sistemleri ve web geliştirmeyle ilgileniyorum. Boş zamanımda HTML, CSS ve JavaScript ile kod yazıyorum, Linux kullanıyorum, siber güvenliğe kafa yoruyorum ve telefon ile bilgisayar tamir ediyorum.",
      p2: "Şu anda Dennigkofen'de 9. sınıftayım (Spez. Sek) ve Bundesamt für Informatik'te Informatiker EFZ platform geliştirme çıraklığıma başlıyorum. En sevdiğim ders matematik, çünkü mantıkla düşünmeyi ve problem çözmeyi seviyorum.",
      p3: "Okulun yanında YouTube projelerinde canlı yayın ve video kurguya yardım ediyorum. İlaç dağıtımı, depoda etiketleme ve ürün kaydı, ütü gibi küçük işlerde çalıştım. Bunlar bana güvenilir, dikkatli ve özenli çalışmayı öğretti.",
      facts: [
        { label: "Konum", value: "3072 Ostermundigen, İsviçre" },
        { label: "Okul", value: "9. sınıf, Spez. Sek Dennigkofen" },
        {
          label: "Çıraklık",
          value: "Informatiker EFZ, Bundesamt für Informatik",
        },
        { label: "Diller", value: "Almanca, İngilizce, Türkçe" },
      ],
    },
    contact: {
      heading: ["İletişime", "geç."],
      body: "En iyisi e-posta, en kısa sürede geri dönüyorum. Tasarım ve baskı işlerine, küçük web projelerine ve aradaki her ilginç şeye açığım.",
      cta: "E-posta gönder",
      emailLabel: "E-posta",
      phoneLabel: "Telefon",
    },
    footer: {
      rights: "Tüm hakları saklıdır.",
      back: "Yukarı çık",
    },
  },
};
