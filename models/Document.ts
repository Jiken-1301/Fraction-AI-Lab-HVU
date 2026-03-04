import mongoose, { Schema, models } from "mongoose";

const documentSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        driveId: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
            enum: ["ke-hoach", "ppt", "truyen-tranh", "video"],
        },
        mimeType: {
            type: String,
            required: true,
        },
        uploadedBy: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const Document = models.Document || mongoose.model("Document", documentSchema);
export default Document;
