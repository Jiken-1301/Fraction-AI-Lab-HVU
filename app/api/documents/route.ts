import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Document from "@/models/Document";

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
        const documents = await Document.find({ category })
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({ documents });
    } catch (error: any) {
        console.error("Get documents error:", error);
        return NextResponse.json(
            { error: error.message || "Lỗi khi lấy danh sách tài liệu" },
            { status: 500 }
        );
    }
}
