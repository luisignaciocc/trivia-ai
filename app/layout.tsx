import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "../contexts/LanguageContext";
import { Analytics } from "@vercel/analytics/react";
import { TOTAL_QUESTIONS } from "@/constants/game";

export const metadata: Metadata = {
  title: "Trivia Wars: The Oracle's Challenge",
  description: `Face the Oracle of Ignorance in an epic battle of knowledge. Answer ${TOTAL_QUESTIONS} questions correctly to claim the Flame of Knowledge and save humanity from eternal ignorance.`,
  keywords:
    "trivia game, knowledge quiz, educational game, AI trivia, oracle challenge",
  authors: [{ name: "Your Name" }],
  openGraph: {
    title: "Trivia Wars: The Oracle's Challenge",
    description: "Face the Oracle of Ignorance in an epic battle of knowledge",
    url: "https://your-domain.com",
    siteName: "Trivia Wars",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Trivia Wars: The Oracle's Challenge",
    description: "Face the Oracle of Ignorance in an epic battle of knowledge",
    creator: "@yourusername",
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#1e1b4b",
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
