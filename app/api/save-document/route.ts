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

        // 4. Đặt quyền xem công khai cho file trên Drive
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
