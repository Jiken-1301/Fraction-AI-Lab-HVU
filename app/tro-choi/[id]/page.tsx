"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface GameDoc {
    _id: string;
    name: string;
    driveId: string;
    category: string;
    mimeType: string;
    thumbnailLink?: string;
    googleSlidesId?: string;
}

export default function TroChoiDetailPage() {
    const params = useParams();
    const id = params.id as string;

    const [game, setGame] = useState<GameDoc | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [iframeLoaded, setIframeLoaded] = useState(false);
    const iframeRef = useRef<HTMLIFrameElement>(null);

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

    // Fullscreen handler
    const handleFullscreen = () => {
        const el = iframeRef.current;
        if (!el) return;
        if (el.requestFullscreen) {
            el.requestFullscreen();
        } else if ((el as any).webkitRequestFullscreen) {
            (el as any).webkitRequestFullscreen();
        } else if ((el as any).msRequestFullscreen) {
            (el as any).msRequestFullscreen();
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, var(--theme-banner-from), var(--theme-banner-to))' }}>
                <div className="flex flex-col items-center gap-4">
                    <div className="w-14 h-14 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <p className="text-white/80 font-medium animate-pulse">Đang tải trò chơi...</p>
                </div>
            </div>
        );
    }

    if (error || !game) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4"
                style={{ background: 'linear-gradient(135deg, var(--theme-banner-from), var(--theme-banner-to))' }}>
                <div className="bg-white/10 backdrop-blur-md p-10 rounded-3xl text-center border border-white/20 shadow-2xl">
                    <div className="text-6xl mb-4">😔</div>
                    <h2 className="text-2xl font-bold text-white mb-2">Không tìm thấy trò chơi</h2>
                    <p className="text-white/70 mb-6">Trò chơi này có thể đã bị xóa hoặc không tồn tại.</p>
                    <Link href="/tro-choi">
                        <div className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-semibold px-6 py-3 rounded-full transition-all border border-white/20">
                            <span>←</span> Quay lại danh sách
                        </div>
                    </Link>
                </div>
            </div>
        );
    }

    // Dùng Office Online viewer với direct Drive URL (nhanh, giữ đúng layout)
    const presentationUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(`https://drive.google.com/uc?export=download&id=${game.driveId}`)}&wdAr=1.7777777777777777`;

    return (
        <div className="h-screen flex flex-col overflow-hidden bg-black">

            {/* Header bar - Theme gradient matching website */}
            <div className="relative z-20 px-4 py-3 flex items-center justify-between"
                style={{
                    background: 'linear-gradient(to right, var(--theme-banner-from), var(--theme-banner-to))',
                }}
            >
                {/* Left: Logo + Fullscreen */}
                <div className="flex items-center gap-3">
                    <Link href="/" className="flex items-center group">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                            <span className="font-bold text-sm" style={{ color: 'var(--theme-accent, #7c3aed)' }}>AI</span>
                        </div>
                    </Link>
                    <button
                        onClick={handleFullscreen}
                        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium px-4 py-2 rounded-full transition-all border border-white/10 hover:border-white/20 cursor-pointer"
                        title="Toàn màn hình"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                        </svg>
                        <span className="hidden sm:inline">Toàn màn hình</span>
                    </button>
                </div>

                {/* Center: Game Title */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[50%]">
                    <h1 className="text-white font-bold text-base md:text-lg truncate flex items-center gap-2">
                        <span className="shrink-0">🎮</span>
                        <span className="truncate">{getGameName(game.name)}</span>
                    </h1>
                </div>

                {/* Right: spacer để giữ title ở giữa */}
                <div className="w-10" />
            </div>

            {/* PPT Viewer Container */}
            <div className="flex-1 relative bg-black">
                {/* Loading skeleton - shows while iframe is loading */}
                {!iframeLoaded && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6"
                        style={{ background: 'linear-gradient(135deg, var(--theme-banner-from), var(--theme-banner-to))' }}>
                        {/* Simulated slide skeleton */}
                        <div className="w-[80%] max-w-2xl aspect-video bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10 overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
                            <div className="p-8 space-y-4">
                                <div className="h-6 bg-white/15 rounded-lg w-3/4 mx-auto" />
                                <div className="h-4 bg-white/10 rounded-lg w-1/2 mx-auto" />
                                <div className="mt-8 grid grid-cols-2 gap-4 px-4">
                                    <div className="h-16 bg-white/10 rounded-xl" />
                                    <div className="h-16 bg-white/10 rounded-xl" />
                                    <div className="h-16 bg-white/10 rounded-xl" />
                                    <div className="h-16 bg-white/10 rounded-xl" />
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                            <p className="text-white/70 font-medium text-sm">Đang tải trò chơi...</p>
                        </div>
                    </div>
                )}

                {/* Iframe with custom wrapper to hide PPT branding */}
                <div className="w-full h-full relative"
                    style={{
                        /* Ẩn thanh toolbar phía dưới của Office Viewer */
                        overflow: 'hidden',
                    }}
                >
                    <iframe
                        ref={iframeRef}
                        src={presentationUrl}
                        className="w-full border-0"
                        style={{
                            height: 'calc(100vh - 58px)',
                        }}
                        allow="autoplay; fullscreen"
                        allowFullScreen
                        loading="eager"
                        onLoad={() => setIframeLoaded(true)}
                    />
                </div>
            </div>

            {/* Nút quay lại menu game - fixed bottom */}
            <div className="fixed bottom-6 left-6 z-[9999]">
                <Link
                    href="/tro-choi"
                    className="flex items-center gap-2 bg-white/15 backdrop-blur-md hover:bg-white/25 text-white text-sm font-bold px-5 py-2.5 rounded-full transition-all border border-white/10 hover:border-white/20 shadow-lg group"
                >
                    <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span>
                    Quay lại
                </Link>
            </div>

            {/* Custom shimmer animation */}
            <style jsx>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                .animate-shimmer {
                    animation: shimmer 2s infinite;
                }
            `}</style>
        </div>
    );
}
