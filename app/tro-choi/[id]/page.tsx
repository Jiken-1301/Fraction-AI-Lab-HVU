"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface GameDoc {
    _id: string;
    name: string;
    driveId: string;
    category: string;
    mimeType: string;
    thumbnailLink?: string;
}

export default function TroChoiDetailPage() {
    const params = useParams();
    const id = params.id as string;

    const [game, setGame] = useState<GameDoc | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        async function fetchGame() {
            try {
                const res = await fetch(`/api/documents?category=tro-choi`);
                const data = await res.json();
                if (data.documents) {
                    const found = data.documents.find((d: GameDoc) => d._id === id);
                    if (found) {
                        setGame(found);
                    } else {
                        setError(true);
                    }
                }
            } catch {
                setError(true);
            } finally {
                setLoading(false);
            }
        }
        fetchGame();
    }, [id]);

    const getGameName = (name: string) => {
        return name.replace(/\.(pptx?|PPTX?)$/, "");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !game) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <div className="text-6xl">😔</div>
                <h2 className="text-2xl font-bold text-gray-800">Không tìm thấy trò chơi</h2>
                <p className="text-gray-500">Trò chơi này có thể đã bị xóa hoặc không tồn tại.</p>
                <Link href="/tro-choi">
                    <Button className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 mt-4">
                        ← Quay lại danh sách
                    </Button>
                </Link>
            </div>
        );
    }

    // Google Drive embed URL cho PPT (sử dụng Google Docs viewer)
    const embedUrl = `https://docs.google.com/gview?url=https://drive.google.com/uc?id=${game.driveId}&embedded=true`;
    // Hoặc dùng Google Drive preview trực tiếp
    const drivePreviewUrl = `https://drive.google.com/file/d/${game.driveId}/preview`;

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header bar */}
            <div
                className="py-4 px-6 shadow-md relative z-20"
                style={{
                    background: `linear-gradient(rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.15)), linear-gradient(to right, var(--theme-banner-from), var(--theme-banner-to))`
                }}
            >
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/tro-choi">
                            <Button
                                variant="ghost"
                                className="text-white hover:bg-white/20 rounded-xl gap-2 font-bold"
                            >
                                <span className="text-lg">←</span> Quay lại
                            </Button>
                        </Link>
                        <div className="h-6 w-px bg-white/30"></div>
                        <h1 className="text-white font-bold text-lg md:text-xl truncate max-w-[500px] flex items-center gap-2">
                            <span>🎮</span>
                            {getGameName(game.name)}
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            asChild
                            variant="outline"
                            className="rounded-xl border-white/30 text-white hover:bg-white/20 hover:text-white bg-transparent"
                        >
                            <a
                                href={`https://drive.google.com/uc?export=download&id=${game.driveId}`}
                                download
                            >
                                ⬇️ Tải về
                            </a>
                        </Button>
                        <Button
                            asChild
                            className="rounded-xl bg-white text-emerald-600 hover:bg-emerald-50 font-bold"
                        >
                            <a
                                href={`https://drive.google.com/file/d/${game.driveId}/view`}
                                target="_blank"
                                rel="noreferrer"
                            >
                                🔗 Mở trên Drive
                            </a>
                        </Button>
                    </div>
                </div>
            </div>

            {/* PPT Embed - Full height */}
            <div className="flex-1 bg-gray-100">
                <iframe
                    src={drivePreviewUrl}
                    className="w-full h-[calc(100vh-73px)] border-0"
                    allow="autoplay"
                    allowFullScreen
                />
            </div>
        </div>
    );
}
