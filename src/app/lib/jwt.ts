import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_default_secret";

function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { role: string };
  } catch {
    return null;
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  // Protect Admin Panel
  if (pathname.startsWith("/component/AdminPanel")) {
    if (!token) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // Protect Cart
  if (pathname.startsWith("/component/Cart")) {
    if (!token) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/component/AdminPanel",
    "/component/AdminPanel/:path*",
    "/component/Cart",
    "/component/Cart/:path*",
  ],
};
