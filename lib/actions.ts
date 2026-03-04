"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { uploadToGoogleDrive } from "@/lib/google-drive";
import Document from "@/models/Document";
import User from "@/models/User";

export async function uploadFileAction(formData: FormData) {
    try {
        // 1. Kiểm tra session
        const session: any = await getServerSession(authOptions);
        if (!session?.user) {
            return { error: "Bạn chưa đăng nhập" };
        }

        // 2. Kiểm tra quyền admin
        await connectDB();
        const dbUser = await User.findOne({ email: session.user.email });

        if (!dbUser || dbUser.role !== "admin") {
            return { error: "Bạn không có quyền tải tài liệu lên" };
        }

        // 3. Lấy dữ liệu từ FormData
        const file = formData.get("file") as File | null;
        const category = formData.get("category") as string | null;

        if (!file || !category) {
            return { error: "Thiếu file hoặc category" };
        }

        // 4. Lấy folder ID từ môi trường (replicate FOLDER_MAP logic)
        const FOLDER_ID = process.env[`GOOGLE_DRIVE_FOLDER_ID_${category.toUpperCase().replace(/-/g, "_")}`];

        if (!FOLDER_ID) {
            return { error: `Chưa cấu hình thư mục Google Drive cho ${category}` };
        }

        // 5. Upload lên Google Drive
        const buffer = Buffer.from(await file.arrayBuffer());
        const result = await uploadToGoogleDrive(buffer, file.name, file.type, FOLDER_ID);

        // 6. Lưu metadata vào MongoDB
        const doc = await Document.create({
            name: file.name,
            driveId: result.driveId,
            category,
            mimeType: file.type,
            uploadedBy: session.user.email,
        });

        return {
            success: true,
            document: {
                id: doc._id.toString(),
                name: doc.name,
                driveId: doc.driveId,
                category: doc.category,
            },
        };
    } catch (error: any) {
        console.error("Upload Action error:", error);
        return { error: error.message || "Lỗi khi upload tài liệu" };
    }
}
