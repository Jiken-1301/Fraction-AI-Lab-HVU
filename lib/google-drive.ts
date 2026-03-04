import { google } from "googleapis";
import { Readable } from "stream";

function getAuth() {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

    if (!clientId || !clientSecret || !refreshToken) {
        throw new Error("Thiếu biến môi trường OAuth2 (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN) trong .env");
    }

    const oauth2Client = new google.auth.OAuth2(
        clientId,
        clientSecret,
        "https://developers.google.com/oauthplayground"
    );

    oauth2Client.setCredentials({
        refresh_token: refreshToken
    });

    return oauth2Client;
}

export async function uploadToGoogleDrive(
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string,
    folderId: string
) {
    const auth = getAuth();
    const drive = google.drive({ version: "v3", auth });

    const stream = Readable.from(fileBuffer);

    const response = await drive.files.create({
        requestBody: {
            name: fileName,
            parents: [folderId],
        },
        media: {
            mimeType,
            body: stream,
        },
        fields: "id, name, webViewLink",
    });

    // Đặt quyền xem công khai (anyone with link can view)
    await drive.permissions.create({
        fileId: response.data.id!,
        requestBody: {
            role: "reader",
            type: "anyone",
        },
    });

    return {
        driveId: response.data.id!,
        name: response.data.name!,
        webViewLink: response.data.webViewLink!,
    };
}

export async function checkFileExists(driveId: string): Promise<boolean> {
    try {
        const auth = getAuth();
        const drive = google.drive({ version: "v3", auth });

        await drive.files.get({
            fileId: driveId,
            fields: "id",
        });

        return true;
    } catch (error: any) {
        // Nếu lỗi 404 là file không tồn tại
        if (error.code === 404) return false;

        // Các lỗi khác (quyền truy cập, v.v.) tạm thời coi là không tồn tại để dọn dẹp DB
        console.error(`Error checking file ${driveId}:`, error.message);
        return false;
    }
}
