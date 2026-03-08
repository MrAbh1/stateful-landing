import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Stateful — Shared AI memory for engineering teams",
  description: "Stateful is a memory layer for AI coding agents. Your team never solves the same problem twice.",
  openGraph: {
    title: "Stateful — Shared AI memory for engineering teams",
    description: "Your AI agents never solve the same problem twice.",
    url: "https://stateful.dev",
    siteName: "Stateful",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stateful — Shared AI memory for engineering teams",
    description: "Your AI agents never solve the same problem twice.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
