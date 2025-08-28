import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AOSProvider } from "@/components/aos-provider";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Sunset View Point Restaurant",
  description:
    "Experience fine dining with breathtaking sunset views. Book your table today.",
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "any", // works for .ico
        type: "image/x-icon",
      },
      {
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    shortcut: ["/favicon.ico"], // optional
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <AOSProvider>
            {children}
            <Footer />
          </AOSProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
