"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadDialog } from "@/components/upload-dialog";
import { toast } from "sonner";
import Link from "next/link";

interface GameDoc {
    _id: string;
    name: string;
    driveId: string;
    category: string;
    mimeType: string;
    thumbnailLink?: string;
    createdAt: string;
}

export default function TroChoiPage() {
    const { data: session } = useSession() as { data: any };
    const isAdmin = session?.user?.role === "admin";

    const [games, setGames] = useState<GameDoc[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchGames = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/documents?category=tro-choi`);
            const data = await res.json();
            if (data.documents) {
                setGames(data.documents);
            }
        } catch {
            // silent
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchGames();
    }, [fetchGames]);

    const handleUploadClick = () => {
        if (!session?.user) {
            toast.error("Bạn cần đăng nhập để sử dụng tính năng này");
            return;
        }
        if (!isAdmin) {
            toast.error("Bạn không có quyền tải tài liệu lên");
        }
    };

    // Lấy tên trò chơi (bỏ đuôi file)
    const getGameName = (name: string) => {
        return name.replace(/\.(pptx?|PPTX?)$/, "");
    };

    return (
        <div className="min-h-screen pb-12 transition-colors duration-700">
            {/* Banner */}
            <div
                className="py-16 px-6 relative overflow-hidden transition-all duration-700 shadow-lg"
                style={{
                    background: `linear-gradient(rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.15)), linear-gradient(to right, var(--theme-banner-from), var(--theme-banner-to))`
                }}
            >
                {/* Logo (Top Left) */}
                <div className="absolute top-6 left-6 z-[9999]">
                    <Link href="/" className="cursor-pointer opacity-90 hover:opacity-100 transition-opacity">
                        <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-md border border-white/20">
                            <span
                                className="font-bold text-sm transition-colors duration-700"
                                style={{ color: 'var(--theme-accent)' }}
                            >
                                AI
                            </span>
                        </div>
                    </Link>
                </div>

                <div className="max-w-6xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-white space-y-4 pt-10 md:pt-0">
                        <h1 className="text-4xl md:text-5xl font-bold flex items-center gap-4">
                            <span className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">🎮</span>
                            Trò Chơi Học Tập
                        </h1>
                        <p className="text-white/90 text-lg max-w-xl font-medium">
                            Bộ sưu tập trò chơi PowerPoint tương tác, giúp học sinh vừa học vừa chơi một cách thú vị và hiệu quả.
                        </p>
                    </div>

                    {/* Upload Button */}
                    {isAdmin ? (
                        <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/20">
                            <UploadDialog
                                category="tro-choi"
                                acceptLabel="PPT / PPTX"
                                acceptTypes=".ppt,.pptx"
                                onUploadSuccess={fetchGames}
                            />
                        </div>
                    ) : (
                        <Button
                            onClick={handleUploadClick}
                            className="bg-white text-emerald-600 hover:bg-emerald-50 shadow-xl border-0 rounded-xl px-6 py-6"
                        >
                            <span className="mr-2">📤</span> Upload Trò Chơi
                        </Button>
                    )}
                </div>

                {/* Decorative elements */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-yellow-500/20 rounded-full blur-2xl"></div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-6 mt-8">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                    </div>
                ) : games.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {games.map((game) => (
                            <Link href={`/tro-choi/${game._id}`} key={game._id}>
                                <Card className="group overflow-hidden rounded-2xl border-0 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer bg-white">
                                    {/* Thumbnail */}
                                    <div className="aspect-video bg-gradient-to-br from-emerald-100 to-teal-50 relative overflow-hidden">
                                        {game.thumbnailLink ? (
                                            <img
                                                src={game.thumbnailLink}
                                                alt={getGameName(game.name)}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                onError={(e) => {
                                                    // Fallback nếu thumbnail lỗi
                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                    (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                                }}
                                            />
                                        ) : null}
                                        <div className={`absolute inset-0 flex flex-col items-center justify-center ${game.thumbnailLink ? 'hidden' : ''}`}>
                                            <div className="w-20 h-20 bg-white/80 rounded-2xl flex items-center justify-center shadow-lg mb-3">
                                                <span className="text-4xl">🎮</span>
                                            </div>
                                            <span className="text-sm font-medium text-emerald-600/70">Trò chơi PPT</span>
                                        </div>
                                        {/* Hover overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                                            <span className="bg-white/90 text-emerald-700 font-bold text-sm px-5 py-2 rounded-full shadow-lg backdrop-blur-sm flex items-center gap-2">
                                                ▶ Chơi ngay
                                            </span>
                                        </div>
                                    </div>

                                    {/* Game Info */}
                                    <div className="p-4">
                                        <h3
                                            className="font-bold text-gray-800 text-lg line-clamp-2 group-hover:text-emerald-600 transition-colors"
                                            title={getGameName(game.name)}
                                        >
                                            {getGameName(game.name)}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                                PowerPoint
                                            </span>
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <Card className="p-12 text-center rounded-3xl border-dashed border-2 border-emerald-200 bg-white/50 backdrop-blur-sm shadow-sm mt-8">
                        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                            <span className="text-5xl">🎮</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Chưa có trò chơi nào</h3>
                        <p className="text-emerald-600/80 mb-6 max-w-md mx-auto">
                            {isAdmin
                                ? "Thư mục trò chơi hiện đang trống. Bấm nút Upload bên trên để thêm trò chơi PPT đầu tiên!"
                                : "Thầy cô đang chuẩn bị những trò chơi thú vị. Hãy quay lại sau nhé!"}
                        </p>
                    </Card>
                )}
            </div>

            {/* Back to Home Link (Bottom Left) */}
            <div className="fixed bottom-6 left-6 z-[9999]">
                <Link
                    href="/"
                    className="bg-white/20 backdrop-blur-md px-5 py-2.5 rounded-full text-white hover:bg-white/30 transition-all flex items-center gap-2 group font-bold text-sm shadow-inner border border-white/5"
                >
                    <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span>
                    Về trang chủ
                </Link>
            </div>
        </div>
    );
}
