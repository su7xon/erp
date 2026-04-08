import { NextResponse } from "next/server"
import { db } from "@/lib/firebase"
import { doc, updateDoc, getDoc } from "firebase/firestore"

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params
    const { action, notes, studentId, preferredCenter } = await request.json()

    if (!action || !["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action" },
        { status: 400 }
      )
    }

    // Update request status in Firestore
    const requestRef = doc(db, "center_change_requests", id)
    
    try {
      await updateDoc(requestRef, {
        status: action === "approve" ? "approved" : "rejected",
        admin_notes: notes || null,
        updated_at: new Date().toISOString(),
      })
    } catch (error) {
      console.error("Request update error:", error)
      return NextResponse.json(
        { error: "Failed to update request" },
        { status: 500 }
      )
    }

    // If approved, update student's exam center
    if (action === "approve" && studentId && preferredCenter) {
      const studentRef = doc(db, "students", studentId)
      
      try {
        await updateDoc(studentRef, {
          exam_center_name: preferredCenter,
          updated_at: new Date().toISOString(),
        })
      } catch (error) {
        console.error("Student update error:", error)
        // Don't fail the request, just log the error
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Request action error:", error)
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    )
  }
}
