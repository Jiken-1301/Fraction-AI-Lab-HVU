import { NextRequest } from "next/server";

// ⚡ Dùng Edge Runtime để stream video không giới hạn kích thước
export const runtime = "edge";

// Lấy access token mới từ refresh token (không dùng googleapis vì Edge không hỗ trợ)
async function getAccessToken(): Promise<string> {
    const clientId = process.env.GOOGLE_CLIENT_ID!;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;
    const refreshToken = process.env.GOOGLE_REFRESH_TOKEN!;

    const res = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            refresh_token: refreshToken,
            grant_type: "refresh_token",
        }),
    });

    const data = await res.json();
    if (!data.access_token) {
        throw new Error("Không thể lấy access token");
    }
    return data.access_token;
}

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const fileId = params.id;
        if (!fileId) {
            return new Response(JSON.stringify({ error: "Thiếu file ID" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const accessToken = await getAccessToken();

        // Lấy metadata (mimeType, size)
        const metaRes = await fetch(
            `https://www.googleapis.com/drive/v3/files/${fileId}?fields=mimeType,size,name`,
            {
                headers: { Authorization: `Bearer ${accessToken}` },
            }
        );

        if (!metaRes.ok) {
            return new Response(JSON.stringify({ error: "File không tồn tại" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        const meta = await metaRes.json();
        const mimeType = meta.mimeType || "video/mp4";
        const fileSize = parseInt(meta.size || "0", 10);

        // Xử lý Range header (cho tua video)
        const rangeHeader = req.headers.get("range");
        const fetchHeaders: Record<string, string> = {
            Authorization: `Bearer ${accessToken}`,
        };

        let start = 0;
        let end = fileSize - 1;

        if (rangeHeader) {
            const parts = rangeHeader.replace(/bytes=/, "").split("-");
            start = parseInt(parts[0], 10);
            end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
            fetchHeaders["Range"] = `bytes=${start}-${end}`;
        }

        // Stream nội dung file từ Google Drive
        const contentRes = await fetch(
            `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
            {
                headers: fetchHeaders,
            }
        );

        if (!contentRes.ok && contentRes.status !== 206) {
            return new Response(JSON.stringify({ error: "Không thể tải video" }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Trả stream trực tiếp cho trình duyệt (không buffer toàn bộ)
        const responseHeaders: Record<string, string> = {
            "Content-Type": mimeType,
            "Accept-Ranges": "bytes",
            "Cache-Control": "public, max-age=3600",
        };

        if (rangeHeader) {
            responseHeaders["Content-Range"] = `bytes ${start}-${end}/${fileSize}`;
            responseHeaders["Content-Length"] = String(end - start + 1);
            return new Response(contentRes.body, {
                status: 206,
                headers: responseHeaders,
            });
        }

        responseHeaders["Content-Length"] = String(fileSize);
        return new Response(contentRes.body, {
            status: 200,
            headers: responseHeaders,
        });
    } catch (error: any) {
        console.error("Video stream error:", error.message);
        return new Response(JSON.stringify({ error: "Không thể phát video" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
