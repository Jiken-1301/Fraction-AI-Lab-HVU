import { google } from "googleapis";

function getAuth() {
    const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const key = process.env.GOOGLE_SERVICE_ACCOUNT_KEY?.replace(/\\n/g, "\n");

    if (!email || !key) {
        throw new Error("Thiếu GOOGLE_SERVICE_ACCOUNT_EMAIL hoặc GOOGLE_SERVICE_ACCOUNT_KEY trong .env");
    }

    return new google.auth.JWT({
        email,
        key,
        scopes: ["https://www.googleapis.com/auth/drive.file"],
    });
}

export async function uploadToGoogleDrive(
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string,
    folderId: string
) {
    const auth = getAuth();
    const drive = google.drive({ version: "v3", auth });

    const { Readable } = await import("stream");
    const stream = new Readable();
    stream.push(fileBuffer);
    stream.push(null);

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
