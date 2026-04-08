import { NextResponse } from "next/server"
import { db } from "@/lib/firebase"
import { doc, getDoc, updateDoc, collection, addDoc } from "firebase/firestore"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/auth"
import { DEMO_STUDENT_ID } from "@/lib/demo"

const ALLOWED_CENTERS = ["A", "B", "C", "D", "E"]

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("student_token")?.value

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const payload = await verifyToken(token)
    if (!payload || payload.role !== "student") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { preferredCenter, reason } = await request.json()

    if (!preferredCenter) {
      return NextResponse.json(
        { error: "Preferred center is required" },
        { status: 400 }
      )
    }

    if (!ALLOWED_CENTERS.includes(preferredCenter)) {
      return NextResponse.json(
        { error: "Invalid center selected" },
        { status: 400 }
      )
    }

    if (payload.userId === DEMO_STUDENT_ID) {
      return NextResponse.json({ success: true, center: preferredCenter })
    }

    // Fetch student from Firestore
    const studentRef = doc(db, "students", payload.userId)
    const studentSnap = await getDoc(studentRef)

    if (!studentSnap.exists()) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      )
    }

    const student = studentSnap.data()

    if (student.exam_center_name === preferredCenter) {
      return NextResponse.json(
        { error: "Selected center is already assigned" },
        { status: 400 }
      )
    }

    const now = new Date().toISOString()

    // Update student's exam center
    try {
      await updateDoc(studentRef, {
        exam_center_name: preferredCenter,
        updated_at: now,
      })
    } catch (error) {
      console.error("Student center update error:", error)
      return NextResponse.json(
        { error: "Failed to update center" },
        { status: 500 }
      )
    }

    // Keep a history record for auditing in admin dashboard
    try {
      await addDoc(collection(db, "center_change_requests"), {
        student_id: payload.userId,
        preferred_center: preferredCenter,
        reason: reason?.trim() || "Student selected center directly from dashboard",
        status: "approved",
        admin_notes: "Auto-approved self-selection by student",
        created_at: now,
        updated_at: now,
      })
    } catch (error) {
      console.error("History insert error:", error)
      return NextResponse.json(
        { error: "Center updated but history could not be saved" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, center: preferredCenter })
  } catch (error) {
    console.error("Center self-selection error:", error)
    return NextResponse.json(
      { error: "Failed to update center" },
      { status: 500 }
    )
  }
}
