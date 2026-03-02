"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { ChevronLeft } from "lucide-react" // Import icon mũi tên quay về

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Sử dụng NextAuth để đăng nhập
    const res = await signIn("credentials", { 
      email, 
      password, 
      redirect: false 
    })

    if (res?.error) {
      toast.error("Email hoặc mật khẩu không chính xác")
    } else {
      toast.success("Đăng nhập thành công!")
      router.push("/") // Quay về trang chủ sau khi đăng nhập thành công
      router.refresh()
    }
    setIsLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4 relative">
      {/* Nút Quay về trang chủ ở góc trên bên trái */}
      <div className="absolute top-8 left-8">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" />
          Quay về trang chủ
        </Link>
      </div>

      <Card className="w-full max-w-md shadow-xl border-t-4 border-blue-500">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Đăng nhập</CardTitle>
          <CardDescription>Chào mừng bạn quay trở lại với Fraction AI Lab</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@example.com"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input 
                id="password" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Chưa có tài khoản?{" "}
              <Link href="/register" className="text-primary hover:underline font-semibold cursor-pointer">
                Đăng ký ngay
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}