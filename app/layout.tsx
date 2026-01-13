// app/layout.tsx
import { SessionProvider } from "next-auth/react";
import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Head from "next/head";
import "./globals.css";
import Script from "next/script";
import InstallPrompt from "@/components/install-button";


const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Field Service Report | Track Ministry Time",
  description:
    "Track your field service hours, Bible studies, and generate monthly ministry reports",
  generator: "Munsha",
  metadataBase: new URL("https://field-service-reports.vercel.app"),
  applicationName: "Field Service Report",
  keywords: [
    "field service",
    "ministry",
    "time tracking",
    "bible studies",
    "JW",
    "reports",
  ],
  authors: [{ name: "Evans Munsha" }],
  creator: "Evans Munsha",
  publisher: "Field Service Report",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: "/manifest.json",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  colorScheme: "dark light",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: "cover",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Field Service Report",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Field Service Report",
    "application-name": "Field Service Report",
    "msapplication-TileColor": "#0f172a",
    "msapplication-config": "/browserconfig.xml",
  },
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icon-152.png" />
        <link rel="apple-touch-icon" href="/icon-152.png" />
        <meta name="theme-color" content="#0f172a" />
      </Head>
      <body className="font-sans antialiased">
        <SessionProvider>
          {children}
          <InstallPrompt />
          <Script
          id="register-sw"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js');
                });
              }

            `,
          }}
        ></Script>
          <Analytics />
        </SessionProvider>
        
      </body>
    </html>
  );
}

