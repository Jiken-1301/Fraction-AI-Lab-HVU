import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { google } from "googleapis";

export const dynamic = 'force-dynamic';

function getAuth() {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

    if (!clientId || !clientSecret || !refreshToken) {
        throw new Error("Thiếu biến môi trường OAuth2");
    }

    const oauth2Client = new google.auth.OAuth2(
        clientId,
        clientSecret,
        "https://developers.google.com/oauthplayground"
    );

    oauth2Client.setCredentials({
        refresh_token: refreshToken,
    });

    return oauth2Client;
}

// Bước 1: Tạo resumable upload URL + access token
// Client sẽ dùng URL này để upload file trực tiếp lên Google Drive
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

        // 3. Lấy thông tin từ body (chỉ metadata nhỏ, không chứa file)
        const { fileName, mimeType, category } = await req.json();

        if (!fileName || !mimeType || !category) {
            return NextResponse.json({ error: "Thiếu thông tin file" }, { status: 400 });
        }

        // 4. Lấy folder ID
        const folderId = process.env[`GOOGLE_DRIVE_FOLDER_ID_${category.toUpperCase().replace(/-/g, "_")}`];
        if (!folderId) {
            return NextResponse.json({ error: `Chưa cấu hình thư mục cho ${category}` }, { status: 400 });
        }

        // 5. Lấy access token mới
        const auth = getAuth();
        const { token } = await auth.getAccessToken();

        if (!token) {
            return NextResponse.json({ error: "Không thể lấy access token" }, { status: 500 });
        }

        // 6. Tạo resumable upload session trên Google Drive
        const initResponse = await fetch(
            "https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json; charset=UTF-8",
                },
                body: JSON.stringify({
                    name: fileName,
                    parents: [folderId],
                }),
            }
        );

        if (!initResponse.ok) {
            const errText = await initResponse.text();
            console.error("Google Drive init error:", errText);
            return NextResponse.json({ error: "Không thể khởi tạo upload" }, { status: 500 });
        }

        // 7. Lấy resumable upload URL từ header
        const uploadUrl = initResponse.headers.get("Location");

        if (!uploadUrl) {
            return NextResponse.json({ error: "Không nhận được upload URL" }, { status: 500 });
        }

        return NextResponse.json({
            uploadUrl,
            accessToken: token,
            folderId,
        });
    } catch (error: any) {
        console.error("Upload URL error:", error);
        return NextResponse.json({ error: error.message || "Lỗi server" }, { status: 500 });
    }
}
