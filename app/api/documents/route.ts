import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { checkFileExists } from "@/lib/google-drive";
import Document from "@/models/Document";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get("category");

        if (!category) {
            return NextResponse.json(
                { error: "Thiếu tham số category" },
                { status: 400 }
            );
        }

        await connectDB();
        const rawDocuments = await Document.find({ category })
            .sort({ createdAt: -1 })
            .lean();

        // Kiểm tra tồn tại trên Google Drive cho từng file (chạy song song cho nhanh)
        const verifiedDocuments = await Promise.all(
            rawDocuments.map(async (doc: any) => {
                const exists = await checkFileExists(doc.driveId);
                if (!exists) {
                    // Nếu không tồn tại trên Drive, xóa khỏi DB
                    console.log(`Auto-deleting missing file from DB: ${doc.name} (${doc.driveId})`);
                    await Document.findByIdAndDelete(doc._id);
                    return null;
                }
                return doc;
            })
        );

        // Lọc bỏ các file null (file đã bị xóa)
        const documents = verifiedDocuments.filter(doc => doc !== null);

        return NextResponse.json({ documents });
    } catch (error: any) {
        console.error("Get documents error:", error);
        return NextResponse.json(
            { error: error.message || "Lỗi khi lấy danh sách tài liệu" },
            { status: 500 }
        );
    }
}
