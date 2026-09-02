import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import { LanguageProvider } from "@/i18n/LanguageProvider";
import "./globals.css";

// Archivo exposes a width axis, which the display type leans on for the
// compressed headline treatment. latin-ext covers the German and Turkish
// diacritics the dictionaries need.
const display = Archivo({
  subsets: ["latin", "latin-ext"],
  axes: ["wdth"],
  variable: "--ff-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://akif.pw"),
  title: "Akif Yaylaci, Developer and Designer",
  description:
    "Akif Yaylaci, a 15-year-old developer based in Ostermundigen, Switzerland. Web development, Linux, cybersecurity, design and print.",
  openGraph: {
    title: "Akif Yaylaci, Developer and Designer",
    description:
      "Web development, Linux, cybersecurity, design and print. Based in Ostermundigen, Switzerland.",
    type: "website",
    images: [{ url: "/akif.webp", width: 1000, height: 1250 }],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} h-full`}>
      <body className="min-h-full bg-bg text-fg">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
