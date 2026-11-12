import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import "./polish.css";
import "./expansion.css";
const manrope = Manrope({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
export const metadata: Metadata = {
  title: "Aury — Systems & full stack developer",
  description: "The personal portfolio of Aury. Founder and lead developer of DeadSense. Native C++, considered interfaces and connected platforms.",
  metadataBase: new URL("https://willube.github.io"),
  alternates: { canonical: "/" },
  openGraph: { title: "Aury — From system to screen.", description: "Systems & full stack developer. Founder of DeadSense.", type: "website", images: ["/social-card.svg"] },
  twitter: { card: "summary_large_image", title: "Aury — From system to screen.", images: ["/social-card.svg"] },
  icons: { icon: "/icon.svg" },
};
export const viewport: Viewport = { themeColor: "#000000", width: "device-width", initialScale: 1 };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={manrope.variable}><body>{children}</body></html>;
}
