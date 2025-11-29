import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "PicoPrize - Microlearning with Instant Rewards",
  description: "Learn bite-sized lessons, stake cUSD, and earn crypto rewards on Celo",
  icons: {
    icon: [
      {
        url: "/pico-logo-icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/pico-logo-icon.svg",
  },
  manifest: "/manifest.json",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0B1020",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased overflow-x-hidden`}>
        <div id="app" className="min-h-screen">
              {children}
        </div>
      </body>
    </html>
  )
}
