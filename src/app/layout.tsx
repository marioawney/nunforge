import type { Metadata, Viewport } from "next";
import { Cairo, Amiri } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import { LanguageProvider } from "@/lib/i18n";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-cairo",
  display: "swap",
});

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-amiri",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nunforge — From the primordial waters, we forge your digital product",
  description:
    "Nunforge is a software studio in Egypt. We take your idea while it is still formless and forge it into a complete digital product — React Native apps and web platforms.",
  metadataBase: new URL("https://nunforge.com"),
  openGraph: {
    title: "Nunforge",
    description: "Out of the darkness, everything rose. A digital product studio.",
    locale: "en_US",
    alternateLocale: ["ar_EG"],
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#08090b",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // English is the served default; the toggle rewrites lang/dir on the fly.
    <html lang="en" dir="ltr" className={`${cairo.variable} ${amiri.variable}`}>
      <body>
        <LanguageProvider>
          <SmoothScroll />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
