import type { Metadata, Viewport } from "next";
import { Lora, JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aury — Founder & Lead Dev of DeadSense",
  description:
    "Founder & Lead Developer of DeadSense (deadsense.cc) — a software platform and utility suite for Deadlock, featuring native desktop client architecture and full-stack web infrastructure.",
  keywords: [
    "Aury",
    "DeadSense",
    "Founder",
    "Lead Developer",
    "Deadlock",
    "Software Platform",
    "Utility Suite",
    "C++",
    "Next.js",
    "React",
    "TypeScript",
    "Vercel",
    "Cloudflare",
    "Supabase",
    "Tailwind CSS",
    "Discord API",
    "Systems Programming",
    "Edge Infrastructure",
  ],
  authors: [{ name: "Aury" }],
  creator: "Aury",
  metadataBase: new URL("https://willube.github.io"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://willube.github.io",
    title: "Aury — Founder & Lead Dev of DeadSense",
    description:
      "Founder & Lead Developer of DeadSense (deadsense.cc) — a software platform and utility suite for Deadlock.",
    siteName: "Aury Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aury — Founder & Lead Dev of DeadSense",
    description:
      "Founder & Lead Developer of DeadSense (deadsense.cc) — a software platform and utility suite for Deadlock.",
    creator: "@Aury",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#191919",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark scroll-smooth ${lora.variable} ${jetbrainsMono.variable} ${inter.variable}`}
    >
      <body className="min-h-screen bg-[#191919] text-[#FBF9F6] selection:bg-[#E05A47]/30 selection:text-[#FBF9F6] antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
