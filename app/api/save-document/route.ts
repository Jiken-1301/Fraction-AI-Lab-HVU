import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Document from "@/models/Document";
import User from "@/models/User";
import { google } from "googleapis";

export const dynamic = 'force-dynamic';

// Bước 2: Sau khi client upload xong lên Drive, lưu metadata vào MongoDB
// + Đặt quyền xem công khai cho file
export async function POST(req: NextRequest) {
    try {
        // 1. Kiểm tra session
        const session: any = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Bạn chưa đăng nhập" }, { status: 401 });
        }

        // 2. Kiểm tra quyền admin
        await connectDB();
        const dbUser = await User.findOne({ email: session.user.email });
        if (!dbUser || dbUser.role !== "admin") {
            return NextResponse.json({ error: "Bạn không có quyền" }, { status: 403 });
        }

        // 3. Lấy thông tin từ body
        const { driveId, fileName, mimeType, category } = await req.json();

        if (!driveId || !fileName || !category) {
            return NextResponse.json({ error: "Thiếu thông tin" }, { status: 400 });
        }

        // 4. Đặt quyền xem công khai cho file trên Drive + lấy thumbnail + convert Google Slides
        let thumbnailLink = null;
        let googleSlidesId: string | null = null;
        try {
            const clientId = process.env.GOOGLE_CLIENT_ID;
            const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
            const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

            const oauth2Client = new google.auth.OAuth2(
                clientId,
                clientSecret,
                "https://developers.google.com/oauthplayground"
            );
            oauth2Client.setCredentials({ refresh_token: refreshToken });

            const drive = google.drive({ version: "v3", auth: oauth2Client });
            await drive.permissions.create({
                fileId: driveId,
                requestBody: {
                    role: "reader",
                    type: "anyone",
                },
            });

            // Tạo thumbnail link công khai cho trò chơi PPT
            if (category === "tro-choi") {
                thumbnailLink = `https://drive.google.com/thumbnail?id=${driveId}&sz=w800`;

                // Convert PPTX → Google Slides để giữ animation khi embed
                try {
                    const folderId = process.env[`GOOGLE_DRIVE_FOLDER_ID_${category.toUpperCase().replace(/-/g, "_")}`];
                    const copied = await drive.files.copy({
                        fileId: driveId,
                        requestBody: {
                            name: fileName.replace(/\.pptx?$/i, '') + ' (Slides)',
                            mimeType: 'application/vnd.google-apps.presentation',
                            ...(folderId && { parents: [folderId] }),
                        },
                    });
                    googleSlidesId = copied.data.id || null;

                    // Set public cho bản Google Slides
                    if (googleSlidesId) {
                        await drive.permissions.create({
                            fileId: googleSlidesId,
                            requestBody: {
                                role: "reader",
                                type: "anyone",
                            },
                        });
                    }
                } catch (convertError: any) {
                    console.error("Google Slides conversion error:", convertError.message);
                    // Không throw — vẫn lưu document dù convert lỗi
                }
            }
        } catch (permError: any) {
            console.error("Permission error:", permError.message);
            // Không throw, vẫn lưu metadata dù set permission lỗi
        }

        // 5. Lưu metadata vào MongoDB
        const doc = await Document.create({
            name: fileName,
            driveId,
            category,
            mimeType: mimeType || "application/octet-stream",
            uploadedBy: session.user.email,
            ...(thumbnailLink && { thumbnailLink }),
            ...(googleSlidesId && { googleSlidesId }),
        });

        return NextResponse.json({
            success: true,
            document: {
                id: doc._id.toString(),
                name: doc.name,
                driveId: doc.driveId,
                category: doc.category,
            },
        });
    } catch (error: any) {
        console.error("Save document error:", error);
        return NextResponse.json({ error: error.message || "Lỗi server" }, { status: 500 });
    }
}
