import { NextRequest } from "next/server";

// ⚡ Dùng Edge Runtime để stream video không giới hạn kích thước
export const runtime = "edge";

// Cache token trên RAM của Edge server proxy, giúp tránh gọi API rate-limit Google OAuth
let cachedAccessToken = "";
let tokenExpirationTime = 0;

// Cache metadata để không tải dư thừa (Edge survival time: a few minutes usually)
const metaCache = new Map<string, { mimeType: string; size: number }>();

// Lấy access token mới từ refresh token (không dùng googleapis vì Edge không hỗ trợ)
async function getAccessToken(): Promise<string> {
    const now = Date.now();
    // Dùng lại token nếu token còn sống hơn 5 phút
    if (cachedAccessToken && now < tokenExpirationTime - 5 * 60 * 1000) {
        return cachedAccessToken;
    }

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

    cachedAccessToken = data.access_token;
    // expires_in tính theo giây (ví dụ: 3599)
    tokenExpirationTime = now + (data.expires_in || 3600) * 1000;

    return cachedAccessToken;
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

        // 1. Phục hồi và Caching Metadata: Rất quan trọng để trả đúng Content-Type và Content-Length
        let mimeType = "video/mp4";
        let fileSize = 0;

        if (metaCache.has(fileId)) {
            const cached = metaCache.get(fileId)!;
            mimeType = cached.mimeType;
            fileSize = cached.size;
        } else {
            const metaRes = await fetch(
                `https://www.googleapis.com/drive/v3/files/${fileId}?fields=mimeType,size,name`,
                {
                    headers: { Authorization: `Bearer ${accessToken}` },
                }
            );

            if (!metaRes.ok) {
                const driveError = await metaRes.text();
                return new Response(JSON.stringify({ error: "File metadata fetch failed", details: driveError }), {
                    status: metaRes.status,
                    headers: { "Content-Type": "application/json" },
                });
            }

            const meta = await metaRes.json();
            mimeType = meta.mimeType || "video/mp4";
            fileSize = parseInt(meta.size || "0", 10);

            metaCache.set(fileId, { mimeType, size: fileSize });
        }

        // 2. Pass-through Range request chuẩn sang Google Drive để API tự handle byte ranges
        const rangeHeader = req.headers.get("range");
        const fetchHeaders: Record<string, string> = {
            Authorization: `Bearer ${accessToken}`,
        };

        if (rangeHeader) {
            fetchHeaders["Range"] = rangeHeader;
        }

        // Stream nội dung file từ Google Drive
        const contentRes = await fetch(
            `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
            {
                headers: fetchHeaders,
            }
        );

        if (!contentRes.ok && contentRes.status !== 206 && contentRes.status !== 200) {
            console.error("Google Drive API Error:", await contentRes.text());
            return new Response(JSON.stringify({ error: "Không thể tải video từ lưu trữ" }), {
                status: contentRes.status,
                headers: { "Content-Type": "application/json" },
            });
        }

        // 3. Tái thiết lập Response Headers để đảm bảo trình duyệt video hoạt động mượt
        const responseHeaders = new Headers();

        // Bắt buộc khai báo Accept-Ranges và File Type chuẩn
        responseHeaders.set("Content-Type", mimeType);
        responseHeaders.set("Accept-Ranges", "bytes");

        // Trích xuất lại Content-Length và Content-Range chuẩn từ payload trả về
        const driveContentLength = contentRes.headers.get("Content-Length");
        const driveContentRange = contentRes.headers.get("Content-Range");

        if (driveContentLength) responseHeaders.set("Content-Length", driveContentLength);
        else if (!rangeHeader && fileSize > 0) responseHeaders.set("Content-Length", String(fileSize));

        if (driveContentRange) responseHeaders.set("Content-Range", driveContentRange);

        // Bỏ cache browser khi gọi proxy này
        responseHeaders.set("Cache-Control", "no-store, no-cache, must-revalidate");

        return new Response(contentRes.body, {
            status: contentRes.status, // Giữ nguyên Code (200 OK hoặc 206 Partial Content)
            headers: responseHeaders,
        });
    } catch (error: any) {
        console.error("Video stream error:", error.message || error);
        return new Response(JSON.stringify({ error: "Lỗi kết nối stream video" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}

