import { NextResponse } from "next/server"
import { db } from "@/lib/firebase"
import { doc, updateDoc, deleteDoc } from "firebase/firestore"

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params
    const updates = await request.json()

    const studentRef = doc(db, "students", id)

    try {
      await updateDoc(studentRef, {
        ...updates,
        updated_at: new Date().toISOString(),
      })
    } catch (error) {
      console.error("Update error:", error)
      return NextResponse.json(
        { error: "Failed to update student" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Update error:", error)
    return NextResponse.json(
      { error: "Failed to update student" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params

    const studentRef = doc(db, "students", id)

    try {
      await deleteDoc(studentRef)
    } catch (error) {
      console.error("Delete error:", error)
      return NextResponse.json(
        { error: "Failed to delete student" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json(
      { error: "Failed to delete student" },
      { status: 500 }
    )
  }
}
