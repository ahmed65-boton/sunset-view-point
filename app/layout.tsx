import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AOSProvider } from "@/components/aos-provider"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Sunset View Point Restaurant",
  description: "Experience fine dining with breathtaking sunset views. Book your table today.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
          <AOSProvider>
            {children}
            <Footer />
          </AOSProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
