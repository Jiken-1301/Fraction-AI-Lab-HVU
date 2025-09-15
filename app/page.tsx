'use client'

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Home() {
  return (
    <>
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
      <header className="relative z-10 px-6 py-4">
        <nav className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-purple-600 font-bold text-sm">AI</span>
            </div>
            <span className="text-white font-semibold text-xl">Fraction AI Lab</span>
          </div>

          {/* Navigation with red oval highlight */}
          <div className="relative">
            <div className="absolute -inset-4 border-4 border-red-500 rounded-full transform rotate-12"></div>
            <div className="flex items-center space-x-8 px-8 py-2 relative z-10">
              <a href="#" className="text-white hover:text-purple-100 transition-colors">
                Giới thiệu
              </a>
              <DropdownMenu>
                <DropdownMenuTrigger className="text-white hover:text-purple-100 transition-colors outline-none">
                  Học liệu
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="min-w-[14rem]">
                  <DropdownMenuItem asChild>
                    <Link href="/hoc-lieu/ke-hoach">Kế Hoạch Bài Dạy</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/hoc-lieu/phieu">Phiếu Bài Tập</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/hoc-lieu/ppt">Bài Giảng PPT</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <a href="#" className="text-white hover:text-purple-100 transition-colors">
                Video
              </a>
              <a href="#" className="text-white hover:text-purple-100 transition-colors">
                Trò chơi
              </a>
              <a href="#" className="text-white hover:text-purple-100 transition-colors">
                Liên hệ
              </a>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="text-white hover:bg-white/20">
              Đăng nhập
            </Button>
            <Button className="bg-white text-purple-600 hover:bg-purple-50">Đăng ký</Button>
          </div>
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
                  className="bg-white text-purple-600 hover:bg-purple-50 px-8 py-4 text-lg rounded-full"
                >
                  Khám phá học liệu
                </Button>
                <Button
                  size="lg"
                  className="bg-orange-400 hover:bg-orange-500 text-white px-8 py-4 text-lg rounded-full"
                >
                  Bắt đầu học ngay
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="relative w-full max-w-md mx-auto">
                {/* Computer illustration */}
                <div className="bg-gray-800 rounded-lg p-4 shadow-2xl">
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
                      <Button size="sm" className="bg-green-400 hover:bg-green-500">
                        +
                      </Button>
                      <Button size="sm" className="bg-white text-gray-800">
                        2
                      </Button>
                      <Button size="sm" className="bg-white text-gray-800">
                        3
                      </Button>
                      <Button size="sm" className="bg-green-400 hover:bg-green-500">
                        +
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Person illustration */}
                <div className="absolute -right-8 -bottom-4">
                  <div className="relative">
                    {/* Person with headphones */}
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
        </div>
      </main>

      {/* Learning Materials Section */}
      <section className="relative z-10 px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <Card className="bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-xl">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Kho học liệu</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Converting Fractions */}
              <Card className="p-6 bg-blue-50 border-0 rounded-2xl">
                <div className="text-center space-y-4">
                  <div className="bg-blue-100 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-800">3/4 → 2/4</div>
                  </div>
                  <h3 className="font-semibold text-gray-800">Quy đổi phân số</h3>
                </div>
              </Card>

              {/* Comparing Fractions */}
              <Card className="p-6 bg-red-50 border-0 rounded-2xl">
                <div className="text-center space-y-4">
                  <div className="bg-red-100 rounded-lg p-4 flex items-center justify-center space-x-2">
                    <div className="w-12 h-12 border-2 border-red-400 rounded flex items-center justify-center">
                      <span className="text-xl font-bold text-red-600">2</span>
                    </div>
                    <span className="text-2xl font-bold text-gray-800">&lt;</span>
                    <div className="w-12 h-12 border-2 border-red-400 rounded-full flex items-center justify-center">
                      <span className="text-xl font-bold text-red-600">4</span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-800">So sánh phân số</h3>
                </div>
              </Card>

              {/* Math Crossword */}
              <Card className="p-6 bg-yellow-50 border-0 rounded-2xl">
                <div className="text-center space-y-4">
                  <div className="bg-yellow-100 rounded-lg p-4">
                    <div className="grid grid-cols-5 gap-1">
                      {Array.from({ length: 25 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-4 h-4 border border-gray-300 ${
                            [0, 1, 2, 5, 6, 7, 10, 11, 12].includes(i)
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

              {/* Fraction Spelling */}
              <Card className="p-6 bg-purple-50 border-0 rounded-2xl">
                <div className="text-center space-y-4">
                  <div className="bg-purple-100 rounded-lg p-4">
                    <div className="flex flex-wrap justify-center gap-1">
                      {["F", "R", "A", "C", "T", "I", "O", "N"].map((letter, i) => (
                        <div
                          key={i}
                          className={`w-6 h-6 border border-gray-300 flex items-center justify-center text-xs font-bold ${
                            i === 2 ? "bg-blue-400 text-white" : "bg-white text-gray-800"
                          }`}
                        >
                          {letter}
                        </div>
                      ))}
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-800">Ấp phình phân số</h3>
                </div>
              </Card>
            </div>
          </Card>
        </div>
      </section>
    </>
  )
}
