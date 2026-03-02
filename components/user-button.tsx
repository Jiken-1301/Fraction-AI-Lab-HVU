"use client"

import { signOut, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { LogOut, User } from "lucide-react"

export function UserButton() {
  const { data: session } = useSession()

  if (!session) return null // Nếu chưa đăng nhập thì không hiện

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm font-medium">Chào, {session.user?.name}</span>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => signOut({ callbackUrl: "/" })}
        className="flex gap-2"
      >
        <LogOut className="h-4 w-4" />
        Đăng xuất
      </Button>
    </div>
  )
}