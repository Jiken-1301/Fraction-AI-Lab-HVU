import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

// ĐÃ XÓA: import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    await connectDB();

    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json({ message: "Email này đã được sử dụng" }, { status: 400 });
    }

    // THAY ĐỔI TẠI ĐÂY: Lưu trực tiếp 'password' thô thay vì dùng 'hashedPassword'
    await User.create({ 
      name, 
      email, 
      password: password // Lưu văn bản thuần túy (Plain Text)
    });

    return NextResponse.json({ message: "Đăng ký thành công" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Lỗi hệ thống" }, { status: 500 });
  }
}