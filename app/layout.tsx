import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LanguageProvider } from "../contexts/LanguageContext";
import { Analytics } from "@vercel/analytics/react";
import { TOTAL_QUESTIONS } from "@/constants/game";

export const metadata: Metadata = {
  title: "Trivia Wars: The Oracle's Challenge",
  description: `Face the Oracle of Ignorance in an epic battle of knowledge. Answer ${TOTAL_QUESTIONS} questions correctly to claim the Flame of Knowledge and save humanity from eternal ignorance.`,
  keywords:
    "trivia game, knowledge quiz, educational game, AI trivia, oracle challenge",
  authors: [{ name: "Luis Ignacio Cabezas" }],
  openGraph: {
    title: "Trivia Wars: The Oracle's Challenge",
    description: "Face the Oracle of Ignorance in an epic battle of knowledge",
    url: "https://trivia.luisignacio.cc/",
    siteName: "Trivia Wars",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Trivia Wars: The Oracle's Challenge",
    description: "Face the Oracle of Ignorance in an epic battle of knowledge",
    creator: "@luisignaciocc",
  },
};

export const viewport: Viewport = {
  themeColor: "#1e1b4b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>{children}</LanguageProvider>
        <Analytics />
      </body>
    </html>
  );
}
