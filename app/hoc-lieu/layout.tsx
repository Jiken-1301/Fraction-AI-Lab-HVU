import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarRail, SidebarSeparator, SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";

export const metadata = {
  title: "Kho học liệu",
};

export default function HocLieuLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar className="border-r-0">
        <SidebarHeader>
          <div className="flex items-center gap-3 px-3 py-3">
            <Link href="/" className="cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-50 rounded-full flex items-center justify-center shadow-sm border border-purple-200 hover:shadow-md transition-shadow">
                <span className="text-purple-600 font-bold text-sm">AI</span>
              </div>
            </Link>
            <span className="font-bold text-lg bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">Học liệu</span>
          </div>
        </SidebarHeader>
        <SidebarSeparator />
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground/70">Mục lục</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild className="hover:bg-purple-50 hover:text-purple-700 transition-colors">
                    <Link href="/hoc-lieu/ke-hoach">📋 Kế Hoạch Bài Dạy</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild className="hover:bg-purple-50 hover:text-purple-700 transition-colors">
                    <Link href="/hoc-lieu/ppt">📊 Bài Giảng PPT</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <div className="px-3 py-2">
            <Link href="/" className="text-xs text-muted-foreground hover:text-purple-600 transition-colors flex items-center gap-1">
              ← Về trang chủ
            </Link>
          </div>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <div className="min-h-screen bg-gradient-to-br from-purple-50/50 via-white to-blue-50/50">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
