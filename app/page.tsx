'use client'

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { UserNav } from "@/components/user-nav"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Home() {
  const { data: session } = useSession()
  const router = useRouter()

  const handleProtectedLink = (href: string) => {
    if (!session) {
      toast.error("Bạn phải đăng nhập mới có thể truy cập")
      return
    }
    router.push(href)
  }
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-transparent">

      {/* Background mathematical symbols */}
      <div className="fixed inset-0 opacity-20 pointer-events-none z-0">
        <div className="absolute top-20 left-10 text-6xl text-white">+</div>
        <div className="absolute top-40 right-20 text-4xl text-white">×</div>
        <div className="absolute top-60 left-1/4 text-5xl text-white">÷</div>
        <div className="absolute bottom-40 right-10 text-6xl text-white">-</div>
        <div className="absolute bottom-20 left-20 text-4xl text-white">=</div>
        <div className="absolute top-32 right-1/3 text-3xl text-white">√</div>
        <div className="absolute bottom-60 left-1/3 text-4xl text-white">%</div>
      </div>

      {/* Header */}
      <header className="relative z-50 w-full py-6 px-6">

        {/* ĐƯA AVATAR VỀ LẠI GÓC PHẢI */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 z-[100]">
          <UserNav />
        </div>

        <nav className="max-w-7xl mx-auto w-full grid grid-cols-3 items-center h-12">

          {/* CỘT 1 (Bên trái): Đã sửa Logo thành "AI - Fraction AI Lab" */}
          <div className="flex justify-start z-20">
            <Link href="/" className="flex items-center space-x-3 cursor-pointer whitespace-nowrap">
              <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-md">
                <span className="text-purple-600 font-bold text-lg">AI</span>
              </div>
              <span className="text-white font-bold text-2xl tracking-wide">Fraction AI Lab</span>
            </Link>
          </div>

          {/* CỘT 2 (Chính giữa): Menu được khóa chặt ở trung tâm */}
          <div className="hidden lg:flex justify-center z-10 w-full">
            <div className="relative">
              <div className="absolute -inset-x-4 -inset-y-4 border-4 border-red-500 rounded-full transform rotate-2 pointer-events-none opacity-80"></div>

              <div className="flex items-center space-x-8 px-4 relative z-10 font-medium text-white">
                <Link href="#" className="hover:text-purple-100 transition-colors cursor-pointer whitespace-nowrap">
                  Giới thiệu
                </Link>

                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger className="text-white hover:text-purple-100 transition-colors outline-none cursor-pointer whitespace-nowrap">
                    Học liệu
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="min-w-[14rem] z-[100] bg-white shadow-xl rounded-xl">
                    <DropdownMenuItem className="cursor-pointer" onClick={() => handleProtectedLink("/hoc-lieu/ke-hoach")}>
                      Kế Hoạch Bài Dạy
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer" onClick={() => handleProtectedLink("/hoc-lieu/ppt")}>
                      Bài Giảng PPT
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Link href="#" className="hover:text-purple-100 transition-colors cursor-pointer whitespace-nowrap">
                  Video
                </Link>
                <Link href="#" className="hover:text-purple-100 transition-colors cursor-pointer whitespace-nowrap">
                  Trò chơi
                </Link>
                <Link href="#" className="hover:text-purple-100 transition-colors cursor-pointer whitespace-nowrap">
                  Liên hệ
                </Link>
              </div>
            </div>
          </div>

          {/* CỘT 3 (Bên phải): Thẻ div rỗng để giữ thăng bằng cho Grid */}
          <div className="flex justify-end z-20"></div>

        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
                Fraction AI Lab –<br />
                Học phân số dễ dàng
                <br />& thú vị
              </h1>

              <p className="text-xl text-purple-100 leading-relaxed">
                Kho học liệu số, video minh họa và trò chơi tương tác
                <br />
                giúp học sinh lớp 4 làm chủ kiến thức phân số
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-white text-purple-600 hover:bg-purple-50 px-8 py-4 text-lg rounded-full cursor-pointer shadow-lg hover:scale-105 transition-transform"
                >
                  Khám phá học liệu
                </Button>
                <Button
                  size="lg"
                  className="bg-orange-400 hover:bg-orange-500 text-white px-8 py-4 text-lg rounded-full cursor-pointer shadow-lg hover:scale-105 transition-transform"
                >
                  Bắt đầu học ngay
                </Button>
              </div>
            </div>

            <div className="relative flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="bg-gray-800 rounded-lg p-4 shadow-2xl relative z-10">
                  <div className="bg-green-300 rounded p-6 space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-gray-800 mb-2">3/4</div>
                      <div className="flex justify-center space-x-2 mb-4">
                        <div className="w-8 h-8 bg-green-500 rounded"></div>
                        <div className="w-8 h-8 bg-green-500 rounded"></div>
                        <div className="w-8 h-8 bg-green-500 rounded"></div>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      <Button size="sm" className="bg-green-400 hover:bg-green-500 cursor-pointer">+</Button>
                      <Button size="sm" className="bg-white text-gray-800 cursor-pointer">2</Button>
                      <Button size="sm" className="bg-white text-gray-800 cursor-pointer">3</Button>
                      <Button size="sm" className="bg-green-400 hover:bg-green-500 cursor-pointer">+</Button>
                    </div>
                  </div>
                </div>

                <div className="absolute right-0 -bottom-4 animate-bounce-slow z-20">
                  <div className="w-32 h-40 relative">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-pink-300 rounded-full"></div>
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-20 h-6 bg-blue-400 rounded-full"></div>
                    <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-20 h-28 bg-pink-400 rounded-t-3xl"></div>
                    <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black rounded-full"></div>
                    <div className="absolute top-8 left-1/2 transform translate-x-2 w-2 h-2 bg-black rounded-full"></div>
                    <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-24 h-16 bg-gray-300 rounded-b-lg"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Learning Materials Section */}
      <section className="relative z-10 px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <Card className="bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-xl border-none">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Kho học liệu</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6 bg-blue-50 border-0 rounded-2xl cursor-pointer hover:shadow-md transition-all hover:-translate-y-1">
                <div className="text-center space-y-4">
                  <div className="bg-blue-100 rounded-lg p-4"><div className="text-2xl font-bold text-blue-800">6/4 → 3/2</div></div>
                  <h3 className="font-semibold text-gray-800">Rút gọn phân số</h3>
                </div>
              </Card>
              <Card className="p-6 bg-red-50 border-0 rounded-2xl cursor-pointer hover:shadow-md transition-all hover:-translate-y-1">
                <div className="text-center space-y-4">
                  <div className="bg-red-100 rounded-lg p-4 flex items-center justify-center space-x-2">
                    <div className="w-14 h-14 border-2 border-red-400 rounded flex items-center justify-center">
                      <span className="text-xl font-bold text-red-600">1/3</span>
                    </div>
                    <span className="text-2xl font-bold text-gray-800">&lt;</span>
                    <div className="w-14 h-14 border-2 border-red-400 rounded-full flex items-center justify-center">
                      <span className="text-xl font-bold text-red-600">1/2</span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-800">So sánh phân số</h3>
                </div>
              </Card>
              <Card className="p-6 bg-yellow-50 border-0 rounded-2xl cursor-pointer hover:shadow-md transition-all hover:-translate-y-1">
                <div className="text-center space-y-4">
                  <div className="bg-yellow-100 rounded-lg p-4">
                    <div className="grid grid-cols-5 gap-1">
                      {Array.from({ length: 25 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-4 h-4 border border-gray-300 ${[0, 1, 2, 5, 6, 7, 10, 11, 12].includes(i)
                            ? "bg-blue-200"
                            : [3, 4, 8, 9, 13, 14].includes(i)
                              ? "bg-yellow-200"
                              : "bg-white"
                            }`}
                        ></div>
                      ))}
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-800">Giải ô chữ Toán</h3>
                </div>
              </Card>
              <Card className="p-6 bg-blue-50 border-0 rounded-2xl cursor-pointer hover:shadow-md transition-all hover:-translate-y-1">
                <div className="text-center space-y-4">
                  <div className="bg-blue-100 rounded-lg p-4">
                    <div className="flex flex-wrap justify-center gap-1">
                      {["F", "R", "A", "C", "T", "I", "O", "N"].map((letter, i) => (
                        <div
                          key={i}
                          className={`w-6 h-6 border border-gray-300 flex items-center justify-center text-xs font-bold ${i === 2 ? "bg-blue-400 text-white" : "bg-white text-gray-800"
                            }`}
                        >
                          {letter}
                        </div>
                      ))}
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-800">Trò chơi học tập</h3>
                </div>
              </Card>
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}