export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Tăng timeout cho upload file lớn (60 giây)
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { uploadToGoogleDrive } from "@/lib/google-drive";
import Document from "@/models/Document";

const FOLDER_MAP: Record<string, string | undefined> = {
    "ke-hoach": process.env.GOOGLE_DRIVE_FOLDER_ID_KE_HOACH,
    "ppt": process.env.GOOGLE_DRIVE_FOLDER_ID_PPT,
    "truyen-tranh": process.env.GOOGLE_DRIVE_FOLDER_ID_TRUYEN_TRANH,
    "video": process.env.GOOGLE_DRIVE_FOLDER_ID_VIDEO,
};

const ALLOWED_TYPES: Record<string, string[]> = {
    "ke-hoach": ["application/pdf"],
    "ppt": [
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ],
    "truyen-tranh": ["application/pdf"],
    "video": ["video/mp4", "video/webm", "video/x-matroska", "video/quicktime"],
};

export async function POST(req: NextRequest) {
    try {
        // 1. Kiểm tra quyền admin
        const session: any = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json(
                { error: "Bạn chưa đăng nhập" },
                { status: 401 }
            );
        }

        // Lấy role từ session — cần kiểm tra lại từ DB để chắc chắn
        await connectDB();
        const UserModel = (await import("@/models/User")).default;
        const dbUser = await UserModel.findOne({ email: session.user.email });

        if (!dbUser || dbUser.role !== "admin") {
            return NextResponse.json(
                { error: "Bạn không có quyền tải tài liệu lên" },
                { status: 403 }
            );
        }

        // 2. Parse form data
        const formData = await req.formData();
        const file = formData.get("file") as File | null;
        const category = formData.get("category") as string | null;

        if (!file || !category) {
            return NextResponse.json(
                { error: "Thiếu file hoặc category" },
                { status: 400 }
            );
        }

        // 3. Kiểm tra loại file
        const allowedTypes = ALLOWED_TYPES[category];
        if (!allowedTypes) {
            return NextResponse.json(
                { error: "Category không hợp lệ" },
                { status: 400 }
            );
        }

        if (!allowedTypes.includes(file.type)) {
            const typeLabels: Record<string, string> = { "ke-hoach": "PDF", "ppt": "PPT/PPTX", "truyen-tranh": "PDF", "video": "MP4/WEBM/MKV/MOV" };
            const typeLabel = typeLabels[category] || "hợp lệ";
            return NextResponse.json(
                { error: `Chỉ chấp nhận file ${typeLabel}` },
                { status: 400 }
            );
        }

        // 4. Lấy folder ID
        const folderId = FOLDER_MAP[category];
        if (!folderId) {
            return NextResponse.json(
                { error: "Chưa cấu hình thư mục Google Drive cho category này" },
                { status: 500 }
            );
        }

        // 5. Upload lên Google Drive
        const buffer = Buffer.from(await file.arrayBuffer());
        const result = await uploadToGoogleDrive(buffer, file.name, file.type, folderId);

        // 6. Lưu metadata vào MongoDB
        const doc = await Document.create({
            name: file.name,
            driveId: result.driveId,
            category,
            mimeType: file.type,
            uploadedBy: session.user.email,
        });

        return NextResponse.json({
            success: true,
            document: {
                id: doc._id,
                name: doc.name,
                driveId: doc.driveId,
                category: doc.category,
            },
        });
    } catch (error: any) {
        console.error("Upload error:", error);
        return NextResponse.json(
            { error: error.message || "Lỗi khi upload tài liệu" },
            { status: 500 }
        );
    }
}
