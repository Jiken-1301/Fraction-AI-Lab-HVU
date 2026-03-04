"use client";

import { useState, useRef, useCallback } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { uploadFileAction } from "@/lib/actions";

interface UploadDialogProps {
    category: string;
    acceptLabel: string;
    acceptTypes: string;
    onUploadSuccess?: () => void;
}

export function UploadDialog({
    category,
    acceptLabel,
    acceptTypes,
    onUploadSuccess,
}: UploadDialogProps) {
    const [open, setOpen] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [dragOver, setDragOver] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFile = useCallback(
        (f: File) => {
            // Validate loại file
            const allowed = acceptTypes.split(",").map((t) => t.trim());
            const ext = "." + f.name.split(".").pop()?.toLowerCase();
            if (!allowed.includes(ext)) {
                toast.error(`Chỉ chấp nhận file ${acceptLabel}`);
                return;
            }
            setFile(f);
        },
        [acceptTypes, acceptLabel]
    );

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setDragOver(false);
            const f = e.dataTransfer.files[0];
            if (f) handleFile(f);
        },
        [handleFile]
    );

    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);
        setProgress(10);

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("category", category);

            setProgress(40);

            // Sử dụng Server Action thay vì fetch để vượt giới hạn 4MB
            const result = await uploadFileAction(formData);

            setProgress(90);

            if (!result) {
                throw new Error("Không nhận được phản hồi từ máy chủ. Vui lòng thử lại.");
            }

            if (result.error) {
                throw new Error(result.error);
            }

            setProgress(100);
            toast.success(`Đã upload "${file.name}" thành công!`);
            setFile(null);
            setOpen(false);
            onUploadSuccess?.();
        } catch (err: any) {
            toast.error(err.message || "Lỗi khi upload tài liệu");
        } finally {
            setUploading(false);
            setProgress(0);
        }
    };

    const reset = () => {
        setFile(null);
        setProgress(0);
        setUploading(false);
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(v) => {
                setOpen(v);
                if (!v) reset();
            }}
        >
            <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
                    📤 Upload tài liệu
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl bg-gradient-to-r from-purple-700 to-purple-500 bg-clip-text text-transparent">
                        Upload tài liệu
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 pt-2">
                    {/* Info */}
                    <div className="text-sm text-muted-foreground bg-purple-50 rounded-xl p-3 border border-purple-100">
                        📌 Chấp nhận file: <strong>{acceptLabel}</strong>
                    </div>

                    {/* Drop zone */}
                    <div
                        onDragOver={(e) => {
                            e.preventDefault();
                            setDragOver(true);
                        }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={handleDrop}
                        onClick={() => inputRef.current?.click()}
                        className={`
              flex flex-col items-center justify-center gap-3 p-8 
              border-2 border-dashed rounded-2xl cursor-pointer
              transition-all duration-200
              ${dragOver
                                ? "border-purple-500 bg-purple-50 scale-[1.02]"
                                : file
                                    ? "border-green-400 bg-green-50/50"
                                    : "border-gray-200 bg-gray-50/50 hover:border-purple-300 hover:bg-purple-50/30"
                            }
            `}
                    >
                        {file ? (
                            <>
                                <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center">
                                    <span className="text-2xl">✅</span>
                                </div>
                                <div className="text-center">
                                    <p className="font-medium text-gray-800 truncate max-w-[300px]">
                                        {file.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setFile(null);
                                    }}
                                >
                                    ✕ Xóa file
                                </Button>
                            </>
                        ) : (
                            <>
                                <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center">
                                    <span className="text-2xl">📁</span>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-medium text-gray-600">
                                        Kéo thả file vào đây
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        hoặc click để chọn file
                                    </p>
                                </div>
                            </>
                        )}

                        <input
                            ref={inputRef}
                            type="file"
                            accept={acceptTypes}
                            className="hidden"
                            onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) handleFile(f);
                                e.target.value = "";
                            }}
                        />
                    </div>

                    {/* Progress */}
                    {uploading && (
                        <div className="space-y-2">
                            <Progress value={progress} className="h-2" />
                            <p className="text-xs text-center text-muted-foreground">
                                Đang upload... {progress}%
                            </p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end gap-2 pt-2">
                        <Button
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={uploading}
                            className="rounded-xl"
                        >
                            Hủy
                        </Button>
                        <Button
                            onClick={handleUpload}
                            disabled={!file || uploading}
                            className="rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800"
                        >
                            {uploading ? "Đang upload..." : "📤 Upload"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
