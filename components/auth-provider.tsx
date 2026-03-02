"use client"

import { SessionProvider } from "next-auth/react"
import type React from "react"

// Sử dụng "export function" (Named export)
export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}