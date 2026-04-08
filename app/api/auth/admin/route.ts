import { NextResponse } from "next/server"
import { db } from "@/lib/firebase"
import { collection, query, where, getDocs, addDoc } from "firebase/firestore"
import { createAdminToken, setAuthCookie, hashPassword } from "@/lib/auth"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const { email, password, isDemo } = await request.json()
    const normalizedEmail = String(email || "").toLowerCase().trim()

    // Demo mode access
    if (isDemo) {
      const demoAdminId = "demo-admin-" + Date.now()
      const token = await createAdminToken(demoAdminId, "demo@admin.local")

      const response = NextResponse.json({
        success: true,
        admin: { id: demoAdminId, email: "demo@admin.local", name: "Demo Admin" },
      })

      setAuthCookie(response, token, "admin")
      return response
    }

    // Fixed credential access requested by user.
    if (normalizedEmail === "rahul@gmail.com" && password === "rahulsir") {
      const adminId = "fixed-admin-rahul"
      const token = await createAdminToken(adminId, normalizedEmail)

      const response = NextResponse.json({
        success: true,
        admin: { id: adminId, email: normalizedEmail, name: "Rahul Sir" },
      })

      setAuthCookie(response, token, "admin")
      return response
    }

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    // Find admin by email in Firestore
    const adminsRef = collection(db, "admins")
    const q = query(adminsRef, where("email", "==", normalizedEmail))
    const adminSnap = await getDocs(q)

    // If admin exists, verify password
    if (!adminSnap.empty) {
      const admin = adminSnap.docs[0].data()
      const adminId = adminSnap.docs[0].id

      const isValidPassword = await bcrypt.compare(password, admin.password_hash)

      if (!isValidPassword) {
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 }
        )
      }

      // Create JWT token
      const token = await createAdminToken(adminId, admin.email)

      const response = NextResponse.json({ 
        success: true,
        admin: { id: adminId, email: admin.email, name: admin.name }
      })

      setAuthCookie(response, token, "admin")
      return response
    }

    // If no admin found, create one for demo/testing purposes
    const passwordHash = await hashPassword(password)
    
    const newAdminDoc = await addDoc(adminsRef, {
      email: normalizedEmail,
      password_hash: passwordHash,
      name: "Admin",
      created_at: new Date().toISOString(),
    })

    // Create token for new admin
    const token = await createAdminToken(newAdminDoc.id, normalizedEmail)
    const response = NextResponse.json({ 
      success: true,
      admin: { id: newAdminDoc.id, email: normalizedEmail, name: "Admin" }
    })
    setAuthCookie(response, token, "admin")
    return response
  } catch (error) {
    console.error("Admin auth error:", error)
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    )
  }
}
