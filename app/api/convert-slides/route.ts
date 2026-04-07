import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Document from "@/models/Document";
import User from "@/models/User";
import { google } from "googleapis";

export const dynamic = 'force-dynamic';

// Endpoint admin chạy 1 lần để convert tất cả game cũ sang Google Slides
export async function POST(req: NextRequest) {
    try {
        // 1. Kiểm tra session + quyền admin
        const session: any = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Bạn chưa đăng nhập" }, { status: 401 });
        }

        await connectDB();
        const dbUser = await User.findOne({ email: session.user.email });
        if (!dbUser || dbUser.role !== "admin") {
            return NextResponse.json({ error: "Bạn không có quyền" }, { status: 403 });
        }

        // 2. Setup Google Drive API
        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            "https://developers.google.com/oauthplayground"
        );
        oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
        const drive = google.drive({ version: "v3", auth: oauth2Client });

        // 3. Tìm tất cả game chưa có googleSlidesId
        const games = await Document.find({
            category: "tro-choi",
            $or: [
                { googleSlidesId: null },
                { googleSlidesId: { $exists: false } },
            ],
        });

        const results: { name: string; status: string; googleSlidesId?: string }[] = [];

        for (const game of games) {
            try {
                // Convert PPTX → Google Slides
                const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID_TRO_CHOI;
                const copied = await drive.files.copy({
                    fileId: game.driveId,
                    requestBody: {
                        name: game.name.replace(/\.pptx?$/i, '') + ' (Slides)',
                        mimeType: 'application/vnd.google-apps.presentation',
                        ...(folderId && { parents: [folderId] }),
                    },
                });

                const googleSlidesId = copied.data.id;

                if (googleSlidesId) {
                    // Set public
                    await drive.permissions.create({
                        fileId: googleSlidesId,
                        requestBody: {
                            role: "reader",
                            type: "anyone",
                        },
                    });

                    // Cập nhật DB
                    await Document.findByIdAndUpdate(game._id, { googleSlidesId });

                    results.push({ name: game.name, status: "converted", googleSlidesId });
                }
            } catch (err: any) {
                results.push({ name: game.name, status: `error: ${err.message}` });
            }
        }

        return NextResponse.json({
            message: `Đã xử lý ${results.length} game`,
            results,
        });
    } catch (error: any) {
        console.error("Convert slides error:", error);
        return NextResponse.json({ error: error.message || "Lỗi server" }, { status: 500 });
    }
}
