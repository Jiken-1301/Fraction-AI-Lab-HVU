import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarRail, SidebarSeparator, SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";

export const metadata = {
  title: "Kho học liệu",
};

export default function HocLieuLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar
        className="border-r-0 bg-transparent [&_[data-sidebar=sidebar]]:bg-transparent"
        style={{
          background: `linear-gradient(rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.15)), linear-gradient(to bottom, var(--theme-banner-from), var(--theme-banner-to))`,
        }}
      >
        <SidebarHeader className="bg-black/10 border-b border-white/10">
          <div className="flex items-center gap-3 px-3 py-4">
            <Link href="/" className="cursor-pointer group">
              <div
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md border border-white group-hover:scale-105 transition-all"
              >
                <span
                  className="font-bold text-sm text-rose-600"
                >
                  AI
                </span>
              </div>
            </Link>
            <span
              className="font-bold text-lg text-white"
            >
              Học liệu
            </span>
          </div>
        </SidebarHeader>
        <SidebarSeparator className="bg-white/10" />
        <SidebarContent className="bg-transparent">
          <SidebarGroup>
            <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/90 px-4 py-2">Mục lục</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="px-2 space-y-1">
                <SidebarMenuItem>
                  <SidebarMenuButton asChild className="hover:bg-white/20 text-white hover:text-white transition-all rounded-xl py-6 border border-transparent hover:border-white/20">
                    <Link href="/hoc-lieu/ke-hoach" className="flex items-center gap-3 font-semibold">📋 Kế Hoạch Bài Dạy</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild className="hover:bg-white/20 text-white hover:text-white transition-all rounded-xl py-6 border border-transparent hover:border-white/20">
                    <Link href="/hoc-lieu/truyen-tranh" className="flex items-center gap-3 font-semibold">📚 Truyện Tranh</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="bg-black/10 border-t border-white/10">
          <div className="px-4 py-3">
            <Link href="/" className="text-xs font-bold text-white/90 hover:text-white transition-colors flex items-center gap-2 group">
              <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span> Về trang chủ
            </Link>
          </div>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset className="bg-white/50 backdrop-blur-md">
        <div className="min-h-screen">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
