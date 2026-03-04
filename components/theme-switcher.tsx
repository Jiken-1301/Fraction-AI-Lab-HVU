"use client"

import { usePathname } from "next/navigation"

const theme = {
  bannerFrom: "#f43f5e", // rose-500
  bannerTo: "#fb923c",   // orange-400
  accent: "#e11d48",     // rose-600
}

export default function ThemeSwitcher({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isVibrantPage = pathname === "/" || pathname?.startsWith("/hoc-lieu")

  // Background gradient: Vibrant for home and learning materials, lighter for others
  const bgClass = isVibrantPage
    ? "from-pink-300 via-orange-300 to-yellow-200"
    : "from-pink-200 via-orange-200 to-yellow-100"

  return (
    <div
      className={`relative min-h-screen w-full overflow-x-hidden bg-gradient-to-br ${bgClass}`}
      style={{
        //@ts-ignore
        "--theme-banner-from": theme.bannerFrom,
        "--theme-banner-to": theme.bannerTo,
        "--theme-accent": theme.accent,
      }}
    >
      {children}
    </div>
  )
}