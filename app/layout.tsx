import type React from "react"
import type { Metadata } from "next"
import { Be_Vietnam_Pro } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import ThemeSwitcher from "@/components/theme-switcher"
import { AuthProvider } from "@/components/auth-provider" // Đảm bảo bạn đã tạo file này trong components/
import { Toaster } from "@/components/ui/sonner" // Sử dụng component sonner bạn đã có
import { UserNav } from "@/components/user-nav"
import "./globals.css"

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-be-vietnam-pro",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Fraction AI Lab - Học phân số dễ dàng & thú vị",
  description: "Kho học liệu số, video minh họa và trò chơi tương tác giúp học sinh lớp 4 làm chủ kiến thức phân số",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      {/* THAY ĐỔI TẠI ĐÂY: Thêm overflow-x-hidden, max-w-full và relative vào body */}
      <body className={`${beVietnamPro.variable} font-sans overflow-x-hidden max-w-full relative`}>
        <AuthProvider>
          <Suspense fallback={null}>
            <ThemeSwitcher>
              <div className="fixed top-6 right-6 z-[9999]">
                <UserNav />
              </div>
              {children}
              <Toaster position="top-center" richColors />
            </ThemeSwitcher>
          </Suspense>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}