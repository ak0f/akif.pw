import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import { LanguageProvider } from "@/i18n/LanguageProvider";
import { circularFontFaceCss, getCircularFaces } from "@/lib/circular";
import { CONTACT_EMAIL, SOCIALS } from "@/i18n/dictionaries";
import "./globals.css";

// The stand-in behind Circular: the closest open geometric sans, with the
// same round bowls and low contrast, so the page keeps its shape whether or
// not the licensed files are installed. latin-ext covers the German and
// Turkish diacritics the dictionaries need.
const fallback = DM_Sans({
  subsets: ["latin", "latin-ext"],
  axes: ["opsz"],
  variable: "--ff-fallback",
  display: "swap",
});

const SITE_URL = "https://akif.pw";
const DESCRIPTION =
  "Akif Yaylaci designs and builds websites and software for small businesses in and around Bern. Founder of SLIDE Agentur and easysolve.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Akif Yaylaci, Developer and Designer",
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: "Akif Yaylaci, Developer and Designer",
    description: DESCRIPTION,
    type: "website",
    url: SITE_URL,
    images: [{ url: "/akif.webp", width: 1000, height: 1250 }],
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

/* Holds the hero behind the opening curtain from the very first paint. It has
   to run before the body renders, which is why it is inline and not part of a
   component. It does nothing when motion is not wanted, and it releases the
   page on its own if the Intro component never takes over; Intro cancels that
   timer the moment it does. */
const INTRO_GATE = `(function(){try{var d=document.documentElement;if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;d.dataset.intro="pending";window.__introGate=setTimeout(function(){if(d.dataset.intro==="pending")d.dataset.intro="done"},6000)}catch(e){}})()`;

const PERSON_JSON_LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Akif Yaylaci",
  url: SITE_URL,
  image: `${SITE_URL}/akif.webp`,
  email: CONTACT_EMAIL,
  address: {
    "@type": "PostalAddress",
    postalCode: "3072",
    addressLocality: "Ostermundigen",
    addressCountry: "CH",
  },
  sameAs: SOCIALS.map((social) => social.href),
});

export default function RootLayout({ children }: LayoutProps<"/">) {
  const circular = getCircularFaces();
  // Only the two weights the first screen is set in are worth a preload.
  const preloaded = circular.filter(
    (face) => !face.italic && (face.weight === 400 || face.weight === 500)
  );

  return (
    <html
      lang="en"
      className={`${fallback.variable} h-full`}
      // The gate above writes data-intro before React hydrates.
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: INTRO_GATE }} />
        {circular.length > 0 && (
          <style
            dangerouslySetInnerHTML={{ __html: circularFontFaceCss(circular) }}
          />
        )}
        {preloaded.map((face) => (
          <link
            key={face.url}
            rel="preload"
            href={face.url}
            as="font"
            type={face.type}
            crossOrigin="anonymous"
          />
        ))}
      </head>
      <body className="min-h-full bg-bg text-fg">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: PERSON_JSON_LD }}
        />
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
