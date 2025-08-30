import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "./../../../lib/db";
import User from "../../../models/User";

export async function POST(req: Request) {
  await connectDB();
  const { name, email, password , role } = await req.json();

  const userExists = await User.findOne({ email });
  if (userExists) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashedPassword,role });
  await user.save();

  return NextResponse.json({ message: "User registered successfully" });
}
