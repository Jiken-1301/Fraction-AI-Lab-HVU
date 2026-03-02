import mongoose, { Schema, models } from "mongoose";

const userSchema = new Schema(
  {
    name: { 
      type: String, 
      required: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true 
    },
    /* PASSWORD BÂY GIỜ LÀ VĂN BẢN THUẦN TÚY */
    password: { 
      type: String, 
      required: true 
    },
    /* THÊM TRƯỜNG ROLE: Mặc định mọi người đăng ký sẽ là "user" */
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"] // Chỉ cho phép 2 giá trị này
    }
  },
  { timestamps: true }
);

const User = models.User || mongoose.model("User", userSchema);
export default User;