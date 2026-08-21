import {
  Space_Grotesk,
  IBM_Plex_Sans,
  IBM_Plex_Mono,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";
import Header from "./Header";

const displayFont = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const bodyFont = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const monoFont = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
});

export const metadata = {
  title: "Fall Collection ’26 — High-Contrast Essentials",
  description:
    "A curated drop of high-contrast, monochrome-by-default essentials.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
