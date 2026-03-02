"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"

const themes: Record<string, { className: string; icon: string }> = {
  Sunset: { className: "bg-gradient-to-br from-pink-300 via-orange-300 to-yellow-200", icon: "🌅" },
  Ocean: { className: "bg-gradient-to-br from-cyan-200 via-sky-300 to-blue-400", icon: "🌊" },
  Nature: { className: "bg-gradient-to-br from-green-200 via-emerald-300 to-teal-400", icon: "🌿" },
  Candy: { className: "bg-gradient-to-br from-pink-200 via-purple-300 to-indigo-400", icon: "🍭" },
}

export default function ThemeSwitcher({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<keyof typeof themes>("Sunset")
  const pathname = usePathname()
  const isHocLieu = pathname?.startsWith("/hoc-lieu")

  return (
    <>
      {/* 1. KHÓA CHẶT 4 ICON: Đưa ra ngoài thẻ div chứa nền, dùng z-[9999] để luôn nổi lên trên cùng */}
      {!isHocLieu && (
        <div className="fixed right-6 top-1/2 -translate-y-1/2 z-[9999] flex flex-col gap-3">
          {Object.entries(themes).map(([name, { icon }]) => (
            <Button
              key={name}
              size="icon"
              variant={theme === name ? "default" : "outline"}
              className={`rounded-full text-xl shadow-xl transition-all hover:scale-110 ${
                theme === name ? "ring-4 ring-white/50 scale-110" : "bg-white/90 hover:bg-white"
              }`}
              onClick={() => setTheme(name as keyof typeof themes)}
            >
              {icon}
            </Button>
          ))}
        </div>
      )}

      {/* 2. CHỐNG TRÀN NỀN: Thêm w-full và overflow-x-hidden để cắt đứt mọi vệt trắng */}
      <div className={`relative min-h-screen w-full overflow-x-hidden transition-colors duration-700 ${themes[theme].className}`}>
        {children}
      </div>
    </>
  )
}