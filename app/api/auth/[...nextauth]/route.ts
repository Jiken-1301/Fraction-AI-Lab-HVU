import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials: any) {
        const { email, password } = credentials;
        try {
          await connectDB();
          const user = await User.findOne({ email });
          
          if (!user) return null;

          // THAY ĐỔI TẠI ĐÂY: So sánh trực tiếp chuỗi văn bản thay vì dùng bcrypt.compare
          const passwordsMatch = password === user.password;
          
          if (!passwordsMatch) return null;

          return user;
        } catch (error) {
          console.log("Error: ", error);
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/login" },
});

export { handler as GET, handler as POST };