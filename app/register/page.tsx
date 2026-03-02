"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { ArrowLeft, Eye, EyeOff } from "lucide-react" // Thêm Eye và EyeOff

const registerSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập họ tên"),
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải ít nhất 6 ký tự"),
  confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
})

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false) // Trạng thái ẩn/hiện mật khẩu chính
  const [showConfirmPassword, setShowConfirmPassword] = useState(false) // Trạng thái cho ô xác nhận
  const router = useRouter()

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    }
  })

  useEffect(() => {
    reset()
  }, [reset])

  const onSubmit = async (data: any) => {
    setIsLoading(true)
    try {
      const { name, email, password } = data
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })

      if (res.ok) {
        toast.success("Đăng ký thành công!")
        router.push("/login")
      } else {
        const errorData = await res.json()
        toast.error(errorData.message || "Đăng ký thất bại")
      }
    } catch (error) {
      toast.error("Lỗi kết nối server")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/50 p-4">
      <Link 
        href="/" 
        className="mb-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors self-center max-w-md w-full"
      >
        <ArrowLeft className="h-4 w-4" /> Quay về trang chủ
      </Link>

      <Card className="w-full max-w-md shadow-lg border-t-4 border-t-purple-500">
        <CardHeader>
          <CardTitle className="text-2xl">Đăng ký tài khoản</CardTitle>
          <CardDescription>Nhập thông tin của bạn để bắt đầu học tập tại HVU</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Họ và tên</Label>
              <Input id="name" {...register("name")} placeholder="VD: Hà Minh Hải" />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message as string}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} placeholder="VD: m.hai13012005@gmail.com" />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message as string}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  {...register("password")} 
                  placeholder="••••••••" 
                  autoComplete="new-password"
                  className="pr-10" // Thêm padding phải để chữ không đè lên icon
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500">{errors.password.message as string}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
              <div className="relative">
                <Input 
                  id="confirmPassword" 
                  type={showConfirmPassword ? "text" : "password"} 
                  {...register("confirmPassword")} 
                  placeholder="••••••••" 
                  autoComplete="new-password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message as string}</p>}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 cursor-pointer" disabled={isLoading}>
              {isLoading ? "Đang xử lý..." : "Đăng ký ngay"}
            </Button>
            
            <p className="text-sm text-center text-muted-foreground">
              Đã có tài khoản?{" "}
              <Link href="/login" className="text-purple-600 font-semibold hover:underline cursor-pointer">
                Đăng nhập
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}