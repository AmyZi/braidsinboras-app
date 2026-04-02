import type { Metadata } from "next";
import Nav from "@/components/Nav";
import "@/styles/globals.css";
import { GoogleAnalytics } from '@next/third-parties/google'

export const metadata: Metadata = {
  metadataBase: new URL("https://braidsboras.se"),
  title: {
    default: "Braids in Borås | Book Afro Hair Stylist Online",
    template: "%s | BraidsInBorås",
  },
  description:
    "Book professional braids in Borås with clear prices, secure deposit, and fast online booking. Box braids, knotless braids, cornrows, and crotchet.",
  keywords: ["braids borås", "box braids borås", "hair braiding borås", "knotless braids borås", "crotchet install"],
    alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "sv_SE",
    url: "https://braidsboras.se",
    siteName: "BraidsInBorås",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sv">
      <body>
        {/* Google tag (gtag.js) */}
        <GoogleAnalytics gaId="G-K1EK1RRV4T" />
        <Nav />
        {children}
      </body>
    </html>
  );
}