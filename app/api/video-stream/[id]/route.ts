import { NextRequest } from "next/server";

// ⚡ Dùng Edge Runtime để stream video không giới hạn kích thước
export const runtime = "edge";

// Cache token trên RAM của Edge server proxy, giúp tránh gọi API rate-limit Google OAuth
let cachedAccessToken = "";
let tokenExpirationTime = 0;

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

        // Pass-through Range request chuẩn sang Google Drive để API tự handle byte ranges
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

        // Lấy ra các HTTP headers quan trọng của video Google Drive trả về và truyền ngược lại client
        const responseHeaders = new Headers();

        const copyHeaders = ["Content-Type", "Content-Length", "Content-Range", "Accept-Ranges"];
        copyHeaders.forEach(h => {
            const val = contentRes.headers.get(h);
            if (val) responseHeaders.set(h, val);
        });

        // Bỏ cache file ở trình duyệt Next.js proxy
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

