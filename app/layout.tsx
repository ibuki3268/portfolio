import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getPortfolioData } from "@/lib/portfolio";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  try {
    const data = await getPortfolioData();

    if (!data?.name || !data?.title) {
      return {
        title: "ポートフォリオ",
        description: "ポートフォリオサイト",
      };
    }

    return {
      title: `ポートフォリオ | ${data.name}`,
      description: `${data.title} のポートフォリオサイト`,
    };
  } catch (error) {
    console.error("Failed to load portfolio metadata", error);
    return {
      title: "ポートフォリオ",
      description: "ポートフォリオサイト",
    };
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
