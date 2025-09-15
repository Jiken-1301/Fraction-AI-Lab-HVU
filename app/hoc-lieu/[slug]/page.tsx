import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Required for static export: list all possible slugs
export function generateStaticParams() {
  return [
    { slug: "ke-hoach" },
    { slug: "phieu" },
    { slug: "ppt" }
  ];
}

const map: Record<string, { title: string; folder: string; examples: { label: string; file: string }[] }>= {
  "ke-hoach": {
    title: "Kế Hoạch Bài Dạy",
    folder: "/materials/ke-hoach",
    examples: [
      { label: "Ke_hoach_bai_day_mau.docx", file: "/materials/ke-hoach/Ke_hoach_bai_day_mau.docx" },
    ],
  },
  "phieu": {
    title: "Phiếu Bài Tập",
    folder: "/materials/phieu",
    examples: [
      { label: "Phieu_bai_tap_mau.docx", file: "/materials/phieu/Phieu_bai_tap_mau.docx" },
    ],
  },
  "ppt": {
    title: "Bài Giảng PPT",
    folder: "/materials/ppt",
    examples: [
      { label: "Bai_giang_mau.pptx", file: "/materials/ppt/Bai_giang_mau.pptx" },
    ],
  },
};

export default function HocLieuDetail({ params }: { params: { slug: string } }) {
  const info = map[params.slug] ?? {
    title: "Không tìm thấy",
    folder: "/materials",
    examples: [],
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">{info.title}</h1>
        <div className="flex gap-2">
          <Button asChild className="bg-purple-600 text-white hover:bg-purple-700">
            <Link href={info.folder}>Mở thư mục</Link>
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <p className="text-muted-foreground mb-4">
          Đặt tập tin của bạn vào thư mục: <code className="bg-muted px-1 py-0.5 rounded">public{info.folder}</code>.
          Các tập tin sẽ được phục vụ trực tiếp mà không cần đăng nhập.
        </p>

        {info.examples.length > 0 ? (
          <div className="space-y-3">
            {info.examples.map((ex) => (
              <div key={ex.file} className="flex items-center justify-between border rounded-md p-3">
                <div className="font-mono text-sm truncate max-w-[60%]" title={ex.label}>{ex.label}</div>
                <div className="flex items-center gap-2">
                  <Button asChild variant="outline">
                    <a href={ex.file} download>
                      Tải xuống mẫu
                    </a>
                  </Button>
                  <Button asChild>
                    <a href={ex.file} target="_blank" rel="noreferrer">Xem</a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">Chưa có tệp mẫu. Hãy thêm vào thư mục tương ứng.</div>
        )}
      </Card>
    </div>
  );
}
