import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Enzo turns 22",
  description: "Invitation immersive pour l'anniversaire d'Enzo, 12 novembre.",
  openGraph: {
    title: "Enzo turns 22",
    description: "Level 22 unlocked. 12 novembre.",
    images: ["/gallery/poster-y2k.svg"]
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#ff69b4"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
