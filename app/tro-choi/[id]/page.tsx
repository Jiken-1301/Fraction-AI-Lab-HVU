"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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
                <Link href="/" className="mt-4">
                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg border border-gray-200 hover:shadow-xl transition-shadow cursor-pointer">
                        <span className="font-bold text-xl text-rose-600">AI</span>
                    </div>
                </Link>
            </div>
        );
    }

    // Dùng Microsoft Office Viewer kết hợp với API Stream của Vercel Production
    // Để bypass lỗi Google Drive file > 25MB bị chặn virus quét, Microsoft sẽ gọi tới Vercel API để tải HTTPS RAW file.
    const directUrl = encodeURIComponent(`https://www.fractionailab.website/api/video-stream/${game.driveId}?filename=game.pptx`);
    const presentationUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${directUrl}`;

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header bar */}
            <div
                className="py-4 px-6 shadow-md relative z-20"
                style={{
                    background: `linear-gradient(rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.15)), linear-gradient(to right, var(--theme-banner-from), var(--theme-banner-to))`
                }}
            >
                {/* Logo (Top Left Corner) */}
                <div className="absolute top-1/2 -translate-y-1/2 left-6 z-[9999]">
                    <Link href="/" className="cursor-pointer opacity-90 hover:opacity-100 transition-opacity">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md border border-white/20">
                            <span className="font-bold text-sm text-rose-600">AI</span>
                        </div>
                    </Link>
                </div>

                <div className="max-w-7xl mx-auto flex items-center justify-center h-10">
                    <h1 className="text-white font-bold text-lg md:text-xl truncate max-w-[500px] flex items-center gap-2">
                        <span>🎮</span>
                        {getGameName(game.name)}
                    </h1>
                </div>
            </div>

            {/* PPT Embed - Full height */}
            <div className="flex-1 bg-black">
                <iframe
                    src={presentationUrl}
                    className="w-full h-[calc(100vh-73px)] border-0"
                    allow="autoplay; fullscreen"
                    allowFullScreen
                />
            </div>
        </div>
    );
}
