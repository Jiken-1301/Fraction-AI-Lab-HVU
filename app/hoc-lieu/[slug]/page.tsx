"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadDialog } from "@/components/upload-dialog";
import { toast } from "sonner";

const map: Record<
  string,
  {
    title: string;
    description?: string;
    icon: string;
    color: string;
    acceptLabel: string;
    acceptTypes: string;
    examples: { label: string; file: string; driveId?: string }[];
  }
> = {
  "ke-hoach": {
    title: "Kế Hoạch Bài Dạy",
    description:
      "Tài liệu soạn giảng dành cho giáo viên tiểu học, có thể tải về hoặc xem trực tiếp.",
    icon: "📋",
    color: "purple",
    acceptLabel: "PDF",
    acceptTypes: ".pdf",
    examples: [
      {
        label: "Kế hoạch bài dạy.pdf",
        file: "https://drive.google.com/file/d/1SdaPUvGk6MdxrfU-Oc97fx17Oy9jiQFy/preview",
        driveId: "1SdaPUvGk6MdxrfU-Oc97fx17Oy9jiQFy",
      },
    ],
  },
  ppt: {
    title: "Bài Giảng PPT",
    description:
      "Bài giảng PowerPoint sinh động, hỗ trợ giảng dạy trực quan trên lớp.",
    icon: "📊",
    color: "blue",
    acceptLabel: "PPT / PPTX",
    acceptTypes: ".ppt,.pptx",
    examples: [],
  },
  "truyen-tranh": {
    title: "Truyện Tranh",
    description:
      "Truyện tranh minh họa sinh động, giúp học sinh tiếp cận kiến thức một cách thú vị và dễ hiểu.",
    icon: "📚",
    color: "pink",
    acceptLabel: "PDF",
    acceptTypes: ".pdf",
    examples: [],
  },
};

interface UploadedDoc {
  _id: string;
  name: string;
  driveId: string;
  category: string;
  mimeType: string;
  createdAt: string;
}

export default function HocLieuDetail({
  params,
}: {
  params: { slug: string };
}) {
  const { data: session } = useSession() as { data: any };
  const isAdmin = session?.user?.role === "admin";

  const info = map[params.slug] ?? {
    title: "Không tìm thấy",
    description: "",
    icon: "❓",
    color: "gray",
    acceptLabel: "",
    acceptTypes: "",
    examples: [],
  };

  const [uploadedDocs, setUploadedDocs] = useState<UploadedDoc[]>([]);

  const fetchDocs = useCallback(async () => {
    try {
      const res = await fetch(`/api/documents?category=${params.slug}`);
      const data = await res.json();
      if (data.documents) {
        setUploadedDocs(data.documents);
      }
    } catch {
      // silent
    }
  }, [params.slug]);

  useEffect(() => {
    fetchDocs();
  }, [fetchDocs]);

  const handleUploadClick = () => {
    if (!session?.user) {
      toast.error("Bạn cần đăng nhập để sử dụng tính năng này");
      return;
    }
    if (!isAdmin) {
      toast.error("Bạn không có quyền tải tài liệu lên");
    }
    // nếu là admin, UploadDialog sẽ mở tự động
  };

  // Kết hợp danh sách hardcoded + uploaded
  const allFiles = [
    ...info.examples.map((ex) => ({
      key: ex.file,
      label: ex.label,
      driveId: ex.driveId,
      file: ex.file,
    })),
    ...uploadedDocs.map((doc) => ({
      key: doc._id,
      label: doc.name,
      driveId: doc.driveId,
      file: `https://drive.google.com/file/d/${doc.driveId}/preview`,
    })),
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{info.icon}</span>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-700 to-purple-500 bg-clip-text text-transparent">
            {info.title}
          </h1>
        </div>

        {/* Upload button — admin thấy dialog, user thường thấy toast lỗi */}
        {isAdmin ? (
          <UploadDialog
            category={params.slug}
            acceptLabel={info.acceptLabel}
            acceptTypes={info.acceptTypes}
            onUploadSuccess={fetchDocs}
          />
        ) : (
          <Button
            onClick={handleUploadClick}
            className="bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
          >
            📤 Upload tài liệu
          </Button>
        )}
      </div>

      {/* Description Card */}
      {info.description && (
        <Card className="p-5 mb-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-100 rounded-2xl">
          <p className="text-gray-600 leading-relaxed">{info.description}</p>
        </Card>
      )}

      {/* Files list */}
      {allFiles.length > 0 ? (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-700">Tài liệu</h2>
          {allFiles.map((ex) => (
            <Card
              key={ex.key}
              className="overflow-hidden rounded-2xl border-0 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between p-5 bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <span className="text-lg">📄</span>
                  </div>
                  <div
                    className="font-medium text-gray-800 truncate max-w-[400px]"
                    title={ex.label}
                  >
                    {ex.label}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    asChild
                    variant="outline"
                    className="rounded-xl border-purple-200 text-purple-600 hover:bg-purple-50"
                  >
                    <a
                      href={
                        ex.driveId
                          ? `https://drive.google.com/uc?export=download&id=${ex.driveId}`
                          : ex.file
                      }
                      download
                    >
                      ⬇️ Tải xuống
                    </a>
                  </Button>
                  <Button
                    asChild
                    className="rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800"
                  >
                    <a
                      href={
                        ex.driveId
                          ? `https://drive.google.com/file/d/${ex.driveId}/view`
                          : ex.file
                      }
                      target="_blank"
                      rel="noreferrer"
                    >
                      👁️ Xem
                    </a>
                  </Button>
                </div>
              </div>

              {/* Document viewer */}
              {ex.driveId && (
                <div className="border-t p-4 bg-gray-50/50">
                  <iframe
                    src={`https://drive.google.com/file/d/${ex.driveId}/preview`}
                    className="w-full h-[500px] border rounded-xl bg-white"
                    allow="autoplay"
                  />
                </div>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center rounded-2xl border-dashed border-2 border-gray-200">
          <div className="text-4xl mb-3">📭</div>
          <p className="text-muted-foreground">
            Chưa có tài liệu nào. {isAdmin ? "Hãy upload tài liệu đầu tiên!" : ""}
          </p>
        </Card>
      )}
    </div>
  );
}
