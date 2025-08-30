// src/app/lib/admin.ts
import jwt, { JwtPayload } from "jsonwebtoken";

interface DecodedToken extends JwtPayload {
  id?: string;
  role?: string;
  email?: string;
}

export function isAdminOrSubAdmin(token: string | null): DecodedToken | null {
  if (!token) return null;

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "SECRET_KEY"
    ) as DecodedToken;

    if (decoded.role === "admin" || decoded.role === "sub-admin") {
      return decoded;
    }
    return null; // not admin
  } catch {
    return null; // invalid token
  }
}
