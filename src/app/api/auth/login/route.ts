import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "../../../lib/db";
import User from "../../../models/User";
import { generateOtp } from "../../../lib/otp";
import { sendEmail } from "../../../lib/sendEmail";

const JWT_SECRET = process.env.JWT_SECRET || "your_default_secret";

function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string };
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("JWT verification error:", err.message);
    }
    return null;
  }
}


export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // 🔐 OTP generate
    const otp = generateOtp();
    user.otp = String(otp);
   user.otpExpires = Date.now() + 1 * 60 * 1000; // 1 minute
    await user.save();

    await sendEmail(user.email, "Your Login OTP", `Your OTP is: ${otp}`);

    // 🎟 Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    console.log("Generated Token:", token,"Role", user.role);

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Token verification failed" }, { status: 401 });
    }

    // ✅ Response with cookie
    const res = NextResponse.json({
      message: "OTP sent to email. Verify to continue.",
      role: decoded.role,
      token, // optional for Redux
        isOtpRequired: true 
    });

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 24 * 60 * 60, // 1 day
    });

    return res;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
