import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "../../models/User";
import { connectDB } from "../../lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "your_default_secret";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { otp } = await req.json();

    console.log("🔎 Verify Request:", { otp });

    // ✅ Find user directly by OTP
    const user = await User.findOne({
      otp: String(otp),
      otpExpires: { $gt: Date.now() }, // not expired
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
    }

    console.log("🔎 DB User:", user.email);

    // ✅ OTP verified → reset fields
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    // 🔑 Create JWT
    const token = jwt.sign(
      { id: user._id.toString(), email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    return NextResponse.json({
      message: "OTP verified. Login successful.",
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
