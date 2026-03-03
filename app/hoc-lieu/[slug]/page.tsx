import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const map: Record<
  string,
  {
    title: string;
    folder: string;
    description?: string;
    icon: string;
    color: string;
    examples: { label: string; file: string; driveId?: string }[]
  }
> = {
  "ke-hoach": {
    title: "Kế Hoạch Bài Dạy",
    folder: "/materials/ke-hoach",
    description: "Tài liệu soạn giảng dành cho giáo viên tiểu học, có thể tải về hoặc xem trực tiếp.",
    icon: "📋",
    color: "purple",
    examples: [
      {
        label: "Kế hoạch bài dạy.pdf",
        file: "https://drive.google.com/file/d/1SdaPUvGk6MdxrfU-Oc97fx17Oy9jiQFy/preview",
        driveId: "1SdaPUvGk6MdxrfU-Oc97fx17Oy9jiQFy"
      },
    ],
  },
  "ppt": {
    title: "Bài Giảng PPT",
    folder: "/materials/ppt",
    description: "Bài giảng PowerPoint sinh động, hỗ trợ giảng dạy trực quan trên lớp.",
    icon: "📊",
    color: "blue",
    examples: [
      { label: "Bai_giang_mau.pptx", file: "/materials/ppt/Bai_giang_mau.pptx" },
    ],
  },
};

export default function HocLieuDetail({ params }: { params: { slug: string } }) {
  const info = map[params.slug] ?? {
    title: "Không tìm thấy",
    folder: "/materials",
    description: "",
    icon: "❓",
    color: "gray",
    examples: [],
  };

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
        <Button asChild className="bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
          <Link href={info.folder}>📂 Mở thư mục</Link>
        </Button>
      </div>

      {/* Description Card */}
      {info.description && (
        <Card className="p-5 mb-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-100 rounded-2xl">
          <p className="text-gray-600 leading-relaxed">{info.description}</p>
        </Card>
      )}



      {/* Files list */}
      {info.examples.length > 0 ? (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-700">Tài liệu mẫu</h2>
          {info.examples.map((ex) => (
            <Card
              key={ex.file}
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
                  <Button asChild variant="outline" className="rounded-xl border-purple-200 text-purple-600 hover:bg-purple-50">
                    <a href={ex.driveId ? `https://drive.google.com/uc?export=download&id=${ex.driveId}` : ex.file} download>
                      ⬇️ Tải xuống
                    </a>
                  </Button>
                  <Button asChild className="rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800">
                    <a href={ex.driveId ? `https://drive.google.com/file/d/${ex.driveId}/view` : ex.file} target="_blank" rel="noreferrer">
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
          <p className="text-muted-foreground">Chưa có tệp mẫu. Hãy thêm vào thư mục tương ứng.</p>
        </Card>
      )}
    </div>
  );
}
