import { SignJWT, jwtVerify } from "jose"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-min-32-characters-long"
)

export interface TokenPayload {
  userId: string
  identifier: string
  role: "student" | "admin"
}

export async function createStudentToken(
  studentId: string,
  rollNumber: string
): Promise<string> {
  return new SignJWT({
    userId: studentId,
    identifier: rollNumber,
    role: "student",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(JWT_SECRET)
}

export async function createAdminToken(
  adminId: string,
  email: string
): Promise<string> {
  return new SignJWT({
    userId: adminId,
    identifier: email,
    role: "admin",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(JWT_SECRET)
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as unknown as TokenPayload
  } catch {
    return null
  }
}

export function setAuthCookie(
  response: NextResponse,
  token: string,
  type: "student" | "admin"
) {
  const cookieName = type === "student" ? "student_token" : "admin_token"
  response.cookies.set(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  })
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash)
}
