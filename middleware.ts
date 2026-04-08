import { NextResponse, type NextRequest } from "next/server"
import { jwtVerify } from "jose"

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-min-32-characters-long"
)

async function verifyTokenInMiddleware(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as { userId: string; identifier: string; role: "student" | "admin" }
  } catch {
    return null
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public routes that don't need authentication
  const publicRoutes = ["/", "/admin/login", "/student/login"]
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // API routes handle their own auth
  if (pathname.startsWith("/api/")) {
    return NextResponse.next()
  }

  // Check for tokens
  const studentToken = request.cookies.get("student_token")?.value
  const adminToken = request.cookies.get("admin_token")?.value

  // Admin routes (but not login page)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!adminToken) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }

    const payload = await verifyTokenInMiddleware(adminToken)
    if (!payload || payload.role !== "admin") {
      const response = NextResponse.redirect(new URL("/admin/login", request.url))
      response.cookies.delete("admin_token")
      return response
    }

    return NextResponse.next()
  }

  // Student routes (but not login page)
  if (pathname.startsWith("/student") && pathname !== "/student/login") {
    if (!studentToken) {
      return NextResponse.redirect(new URL("/student/login", request.url))
    }

    const payload = await verifyTokenInMiddleware(studentToken)
    if (!payload || payload.role !== "student") {
      const response = NextResponse.redirect(new URL("/student/login", request.url))
      response.cookies.delete("student_token")
      return response
    }

    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
