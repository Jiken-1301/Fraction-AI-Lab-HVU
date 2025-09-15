"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"

const themes: Record<string, { className: string; icon: string }> = {
  Sunset: {
    className: "bg-gradient-to-br from-pink-300 via-orange-300 to-yellow-200",
    icon: "🌅",
  },
  Ocean: {
    className: "bg-gradient-to-br from-cyan-200 via-sky-300 to-blue-400",
    icon: "🌊",
  },
  Nature: {
    className: "bg-gradient-to-br from-green-200 via-emerald-300 to-teal-400",
    icon: "🌿",
  },
  Candy: {
    className: "bg-gradient-to-br from-pink-200 via-purple-300 to-indigo-400",
    icon: "🍭",
  },
}

export default function ThemeSwitcher({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<keyof typeof themes>("Sunset")
  const pathname = usePathname()
  const isHocLieu = pathname?.startsWith("/hoc-lieu")

  return (
    <div
      className={`min-h-screen transition-colors duration-700 ${themes[theme].className}`}
    >
      {/* Chỉ hiển thị nút nếu KHÔNG ở /hoc-lieu */}
      {!isHocLieu && (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
          {Object.entries(themes).map(([name, { icon }]) => (
            <Button
              key={name}
              size="sm"
              variant={theme === name ? "default" : "outline"}
              className="rounded-full text-lg px-3"
              onClick={() => setTheme(name as keyof typeof themes)}
            >
              {icon}
            </Button>
          ))}
        </div>
      )}

      {/* Nội dung app */}
      {children}
    </div>
  )
}
