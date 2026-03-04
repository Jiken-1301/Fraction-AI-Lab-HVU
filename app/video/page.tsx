"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadDialog } from "@/components/upload-dialog";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface UploadedDoc {
    _id: string;
    name: string;
    driveId: string;
    category: string;
    mimeType: string;
    createdAt: string;
}

export default function VideoPage() {
    const { data: session } = useSession() as { data: any };
    const isAdmin = session?.user?.role === "admin";

    const [uploadedDocs, setUploadedDocs] = useState<UploadedDoc[]>([]);

    const fetchDocs = useCallback(async () => {
        try {
            const res = await fetch(`/api/documents?category=video`);
            const data = await res.json();
            if (data.documents) {
                setUploadedDocs(data.documents);
            }
        } catch {
            // silent
        }
    }, []);

    useEffect(() => {
        fetchDocs();
    }, [fetchDocs]);

    const handleUploadClick = () => {
        if (!session?.user) {
            toast.error("Bạn cần đăng nhập để sử dụng tính năng này");
            return;
        }
        if (!isAdmin) {
            toast.error("Bạn không có quyền tải tài liệu lên");
        }
    };

    const allFiles = uploadedDocs.map((doc) => ({
        key: doc._id,
        label: doc.name,
        driveId: doc.driveId,
        file: `https://drive.google.com/file/d/${doc.driveId}/preview`,
    }));

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

                <div className="max-w-5xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-white space-y-4 pt-10 md:pt-0">
                        <h1 className="text-4xl md:text-5xl font-bold flex items-center gap-4">
                            <span className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">🎥</span>
                            Video Bài Giảng
                        </h1>
                        <p className="text-white/90 text-lg max-w-xl font-medium">
                            Kho video minh họa sinh động, trực quan giúp học sinh hứng thú học tập và dễ dàng nắm bắt kiến thức hơn.
                        </p>
                    </div>

                    {/* Upload Button */}
                    {isAdmin ? (
                        <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/20">
                            <UploadDialog
                                category="video"
                                acceptLabel="Video (MP4, MKV, WEBM)"
                                acceptTypes=".mp4,.webm,.mkv,.mov"
                                onUploadSuccess={fetchDocs}
                            />
                        </div>
                    ) : (
                        <Button
                            onClick={handleUploadClick}
                            className="bg-white text-rose-600 hover:bg-rose-50 shadow-xl border-0 rounded-xl px-6 py-6"
                        >
                            <span className="mr-2">📤</span> Upload Video
                        </Button>
                    )}
                </div>

                {/* Decorative elements */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-orange-500/20 rounded-full blur-2xl"></div>
            </div>

            {/* Main Content */}
            <div className="max-w-5xl mx-auto px-6 mt-8">
                {/* TIP: Hướng dẫn xử lý khi video quay lâu */}
                <div className="mb-8 p-4 bg-orange-50 border border-orange-200 rounded-2xl flex items-start gap-3 shadow-sm">
                    <span className="text-xl">💡</span>
                    <div>
                        <p className="text-orange-800 font-bold text-sm">Mẹo nhỏ cho bạn:</p>
                        <p className="text-orange-700 text-sm">
                            Video mới tải lên có thể cần vài phút để Google xử lý. Nếu thấy biểu tượng <span className="font-bold underline italic">"quay tròn"</span> lâu, hãy bấm nút <b>"🎬 Xem toàn màn hình"</b> để xem ngay nhé!
                        </p>
                    </div>
                </div>

                {allFiles.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6">
                        {allFiles.map((ex) => (
                            <Card
                                key={ex.key}
                                className="overflow-hidden rounded-2xl border-0 shadow-md hover:shadow-xl transition-all p-1 bg-white"
                            >
                                <div className="flex flex-col md:flex-row items-stretch gap-4 p-4">
                                    {/* Video Player */}
                                    <div className="md:w-[400px] flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden border border-gray-200 relative group aspect-video">
                                        <iframe
                                            src={ex.file}
                                            className="w-full h-full"
                                            allow="autoplay; fullscreen"
                                            title={ex.label}
                                        />
                                        <div className="absolute inset-0 bg-black/5 pointer-events-none group-hover:bg-transparent transition-colors"></div>
                                        <div className="bg-gray-50 border-t border-gray-200 py-1.5 px-3 text-[10px] text-gray-500 italic text-center">
                                            Nếu video quay lâu, vui lòng bấm nút "Xem toàn màn hình" bên cạnh
                                        </div>
                                    </div>

                                    {/* Video Info */}
                                    <div className="flex flex-col flex-1 justify-between py-2">
                                        <div>
                                            <div className="flex justify-between items-start gap-4">
                                                <h3 className="text-xl font-bold text-gray-800 line-clamp-2 leading-tight flex-1" title={ex.label}>
                                                    {ex.label}
                                                </h3>
                                            </div>
                                            <div className="mt-3 flex items-center gap-2">
                                                <span className="bg-rose-100 text-rose-700 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                                                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                                                    Video
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 mt-6">
                                            <Button
                                                asChild
                                                className="rounded-xl flex-1 md:flex-none uppercase font-bold tracking-wide bg-gradient-to-r from-orange-400 to-rose-500 hover:from-orange-500 hover:to-rose-600 text-white shadow-md transition-transform hover:-translate-y-0.5"
                                            >
                                                <a href={ex.file.replace("/preview", "/view")} target="_blank" rel="noreferrer">
                                                    🎬 Xem toàn màn hình
                                                </a>
                                            </Button>
                                            <Button
                                                asChild
                                                variant="outline"
                                                className="rounded-xl border-rose-200 text-rose-600 hover:bg-rose-50 flex-1 md:flex-none uppercase font-bold tracking-wide transition-colors"
                                            >
                                                <a href={`https://drive.google.com/uc?export=download&id=${ex.driveId}`} download>
                                                    ⬇️ Tải file
                                                </a>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card className="p-12 text-center rounded-3xl border-dashed border-2 border-rose-200 bg-white/50 backdrop-blur-sm shadow-sm mt-8">
                        <div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                            <span className="text-5xl">🎬</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Chưa có video nào</h3>
                        <p className="text-rose-600/80 mb-6 max-w-md mx-auto">
                            {isAdmin
                                ? "Thư mục video hiện đang trống. Bấm nút Upload bên trên để chia sẻ video đầu tiên với học sinh!"
                                : "Thầy cô đang chuẩn bị những video thú vị. Hãy quay lại sau nhé!"}
                        </p>
                    </Card>
                )
                }
            </div >

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
        </div >
    );
}
