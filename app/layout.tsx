import type React from "react"
import type { Metadata } from "next"
import { Be_Vietnam_Pro } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import ThemeSwitcher from "@/components/theme-switcher"
import "./globals.css"

// 👇 Import font Be Vietnam Pro
const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin-ext"], // hỗ trợ tiếng Việt
  weight: ["400", "500", "600", "700"], // các trọng số phổ biến
  variable: "--font-be-vietnam-pro",
  display: "swap",
})

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
    <html lang="vi">
      <body className={`${beVietnamPro.variable} font-sans`}>
        <Suspense fallback={null}>
          <ThemeSwitcher>{children}</ThemeSwitcher>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
