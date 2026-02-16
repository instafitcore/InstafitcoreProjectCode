import type { Metadata, Viewport } from "next";
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

// 1. Viewport configuration: Tells the phone to draw background behind the status bar
// and sets the theme color to white (which triggers dark icons on Android)
export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover", // Essential for notch/status bar area
};

export const metadata: Metadata = {
  title: "Instafitcore",
  description: "Instafitcore – Home Solutions",
  icons: {
    icon: [{ url: "/logoicon.png", sizes: "20x30", type: "image/png" }],
  },
  // 2. Apple specific tags to ensure dark text on a white header
  appleWebApp: {
    capable: true,
    statusBarStyle: "default", // "default" results in dark text/icons
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
        {/* Extra insurance for older browsers */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}