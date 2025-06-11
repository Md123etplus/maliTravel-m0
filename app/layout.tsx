import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { AuthProvider } from "@/components/auth-provider"
import { PWARegister } from "@/components/pwa-register"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Mali Voyages - Voyagez à travers le Mali en toute sécurité",
  description:
    "Mali Voyages est le leader du transport de passagers au Mali. Réservez vos billets de bus en ligne pour voyager à travers le Mali en toute simplicité.",
  keywords:
    "voyage Mali, bus Mali, réservation billet, transport Mali, Bamako, Ségou, Mopti, Tombouctou, Gao, Sikasso, Kayes",
  authors: [{ name: "Mali Voyages" }],
  creator: "Mali Voyages",
  publisher: "Mali Voyages",
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  metadataBase: new URL("https://malivoyages.ml"),
  alternates: {
    canonical: "/",
    languages: {
      "fr-ML": "/",
      "en-US": "/en",
    },
  },
  openGraph: {
    type: "website",
    locale: "fr_ML",
    url: "https://malivoyages.ml",
    title: "Mali Voyages - Voyagez à travers le Mali en toute sécurité",
    description: "Réservez vos billets de bus en ligne pour voyager à travers le Mali en toute simplicité.",
    siteName: "Mali Voyages",
    images: [
      {
        url: "https://malivoyages.ml/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Mali Voyages",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mali Voyages - Voyagez à travers le Mali en toute sécurité",
    description: "Réservez vos billets de bus en ligne pour voyager à travers le Mali en toute simplicité.",
    images: ["https://malivoyages.ml/images/twitter-image.jpg"],
    creator: "@malivoyages",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icons/icon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/icon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-icon-57x57.png", sizes: "57x57", type: "image/png" },
      { url: "/icons/apple-icon-72x72.png", sizes: "72x72", type: "image/png" },
      { url: "/icons/apple-icon-114x114.png", sizes: "114x114", type: "image/png" },
      { url: "/icons/apple-icon-144x144.png", sizes: "144x144", type: "image/png" },
      { url: "/icons/apple-icon-180x180.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
  verification: {
    google: "google-site-verification=votre-code-de-verification",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#f59e0b" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Mali Voyages" />
        <link rel="apple-touch-icon" href="/icons/apple-icon-180x180.png" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </AuthProvider>
        </ThemeProvider>
        <PWARegister />
      </body>
    </html>
  )
}
