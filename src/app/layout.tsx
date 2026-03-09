import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://braidsinboras.se"),
  title: {
    default: "BraidsInBorås – Professional Braiding in Borås",
    template: "%s | BraidsInBorås",
  },
  description:
    "Book professional hair braiding in Borås. Box braids, knotless braids, cornrows & more. Easy online booking.",
  keywords: ["braids borås", "box braids borås", "hair braiding borås", "knotless braids borås"],
  openGraph: {
    type: "website",
    locale: "sv_SE",
    url: "https://braidsinboras.se",
    siteName: "BraidsInBorås",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sv">
      <body>{children}</body>
    </html>
  );
}