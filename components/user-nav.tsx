"use client"

import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { LogOut } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function UserNav() {
  const { data: session, status } = useSession()

  // 1. TRẠNG THÁI LOADING
  if (status === "loading") {
    return <div className="h-11 w-11 rounded-full bg-white/20 animate-pulse"></div>
  }

  // 2. TRẠNG THÁI CHƯA ĐĂNG NHẬP
  if (!session) {
    return (
      <div className="flex items-center space-x-2">
        <Button variant="ghost" asChild className="text-white hover:bg-white/20 hover:text-white font-medium rounded-full cursor-pointer">
          <Link href="/login">Đăng nhập</Link>
        </Button>
        <Button asChild className="bg-white text-purple-600 hover:bg-purple-50 font-bold rounded-full shadow-md cursor-pointer">
          <Link href="/register">Đăng ký</Link>
        </Button>
      </div>
    )
  }

  // 3. TRẠNG THÁI ĐÃ ĐĂNG NHẬP
  return (
    /* ĐÃ SỬA: Thêm modal={false} để ngăn lỗi chèn vệt trắng ngang màn hình khi click */
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        {/* ĐÃ SỬA: Loại bỏ border-white/60 và focus:ring-purple-500 để xóa viền tím */}
        <button className="relative h-11 w-11 rounded-full transition-all cursor-pointer outline-none shadow-md hover:scale-105 overflow-hidden">
          <Avatar className="h-full w-full">
            <AvatarImage 
              src={session.user?.image || "/default-avatar.jpg"} 
              alt={session.user?.name || "User"}
              className="object-cover" 
            />
            {/* ĐÃ SỬA: Đổi bg-purple-700 sang màu cam nhạt để hòa hợp với nền */}
            <AvatarFallback className="bg-orange-200 text-orange-700 font-bold">
              {session.user?.name?.charAt(0)?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        className="w-64 mt-2 p-2 shadow-2xl rounded-2xl border-none bg-white z-[9999]" 
        align="end"
        sideOffset={8}
      >
        <DropdownMenuLabel className="font-normal p-3">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-black text-purple-900 uppercase tracking-tighter truncate">
              {session.user?.name || "Người dùng"}
            </p>
            <p className="text-xs text-muted-foreground truncate italic">
              {session.user?.email || "Chưa cập nhật email"}
            </p>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator className="my-2 bg-purple-50" />
        
        <DropdownMenuItem 
          className="rounded-xl text-red-600 focus:bg-red-50 focus:text-red-700 cursor-pointer font-bold py-3 px-3 flex items-center transition-colors outline-none"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="mr-3 h-4 w-4" />
          <span>Đăng xuất tài khoản</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}