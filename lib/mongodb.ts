import mongoose from "mongoose";

let cached = (global as any).mongoose || { conn: null, promise: null };

export async function connectDB() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error("Vui lòng kiểm tra file .env và thêm MONGODB_URI");
  }

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      // Dòng này sẽ hiện trong Terminal của VS Code khi kết nối thành công
      console.log("✅ ĐÃ KẾT NỐI MONGODB ATLAS THÀNH CÔNG!");
      return mongoose;
    }).catch((error) => {
      console.error("❌ LỖI KẾT NỐI MONGODB:", error.message);
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}