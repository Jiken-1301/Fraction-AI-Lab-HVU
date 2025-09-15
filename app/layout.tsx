import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import ThemeSwitcher from "@/components/theme-switcher" // 👈 import
import "./globals.css"

export const metadata: Metadata = {
  title: "Fraction AI Lab - Học phân số dễ dàng & thú vị",
  description:
    "Kho học liệu số, video minh họa và trò chơi tương tác giúp học sinh lớp 4 làm chủ kiến thức phân số",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>
          <ThemeSwitcher>{children}</ThemeSwitcher>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}