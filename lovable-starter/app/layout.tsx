import type { Metadata } from "next";
import { Manrope, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

// Manrope stands in for Satoshi (the brand face) — swap in Satoshi via a
// local @font-face if/when licensed. IBM Plex Mono is the mono/numeric face.
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lupa People",
  description: "Internal people-ops tool for Lupa — org chart, PTO, reviews, and Level Up.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${manrope.variable} ${ibmPlexMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
