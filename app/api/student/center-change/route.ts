import { NextResponse } from "next/server"
import { db } from "@/lib/firebase"
import { doc, getDoc, updateDoc, setDoc, collection, addDoc, query, where, getDocs } from "firebase/firestore"
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

    // Remove the early success return so even demo user gets a record!
    // if (payload.userId === DEMO_STUDENT_ID) {
    //   return NextResponse.json({ success: true, center: preferredCenter })
    // }

    // Fetch student from Firestore
    const studentRef = doc(db, "students", payload.userId)
    const studentSnap = await getDoc(studentRef)

    // Even if it's the demo student and doesn't exist, we can spoof properties or just let it pass
    let student = studentSnap.exists() ? studentSnap.data() : null

    if (!student && payload.userId !== DEMO_STUDENT_ID) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      )
    }

    if (student && student.exam_center_name === preferredCenter) {
      return NextResponse.json(
        { error: "Selected center is already assigned" },
        { status: 400 }
      )
    }

    const now = new Date().toISOString()

    // Add a pending request to the center_change_requests collection
    try {
      // Check if student already has a pending request
      const pendingQuery = query(
        collection(db, "center_change_requests"),
        where("student_id", "==", payload.userId),
        where("status", "==", "pending")
      )
      const existingReqs = await getDocs(pendingQuery)
      
      if (!existingReqs.empty) {
        return NextResponse.json(
          { error: "You already have a pending center change request" },
          { status: 400 }
        )
      }

      await addDoc(collection(db, "center_change_requests"), {
        student_id: payload.userId,
        preferred_center: preferredCenter,
        reason: reason?.trim() || "Requested from student dashboard",
        status: "pending",
        admin_notes: "",
        created_at: now,
        updated_at: now,
      })

      // Make sure the demo student actually exists in the db for the admin dashboard to populate the name 
      if (payload.userId === DEMO_STUDENT_ID && !student) {
        await setDoc(doc(db, "students", DEMO_STUDENT_ID), {
            id: DEMO_STUDENT_ID,
            name: "Test Student",
            roll_number: "APP001",
            phone: "9876546655",
            exam_center_name: ""
        }, { merge: true })
      }
    } catch (error) {
      console.error("History insert error:", error)
      return NextResponse.json(
        { error: "Failed to submit request" },
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
