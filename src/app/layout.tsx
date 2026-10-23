import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// 1. Import the new handler
import BackButtonHandler from "../components/BackButtonHandler";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://instafitcore.com"),
  title: {
    default: "Furniture Installation & Home Services in Bengaluru | InstaFitCore",
    template: "%s | InstaFitCore",
  },
  description:
    "Book professional furniture installation, dismantling, repair, modular kitchen setup, and relocation services in Bengaluru with InstaFitCore.",
  applicationName: "InstaFitCore",
  openGraph: {
    type: "website",
    url: "https://instafitcore.com/site/",
    siteName: "InstaFitCore",
    title: "Furniture Installation & Home Services in Bengaluru | InstaFitCore",
    description:
      "Professional furniture installation, dismantling, repair, modular kitchen setup, and relocation services in Bengaluru.",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Furniture Installation & Home Services in Bengaluru | InstaFitCore",
    description:
      "Professional furniture installation, dismantling, repair, modular kitchen setup, and relocation services in Bengaluru.",
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [{ url: "/logoicon.png", sizes: "20x30", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* 2. Place it here inside the body */}
        <BackButtonHandler /> 
        {children}
      </body>
    </html>
  );
}
