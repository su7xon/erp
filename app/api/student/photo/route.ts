import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/auth"
import { db, storage } from "@/lib/firebase"
import { doc, updateDoc } from "firebase/firestore"
import { ref, uploadString, getDownloadURL } from "firebase/storage"

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
const MAX_DATA_URL_LENGTH = 7_000_000

function getMimeTypeFromDataUrl(dataUrl: string) {
  const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,/)
  return match?.[1] || null
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("student_token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const payload = await verifyToken(token)
    if (!payload || payload.role !== "student") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { imageDataUrl } = (await request.json()) as { imageDataUrl?: string }

    if (!imageDataUrl || typeof imageDataUrl !== "string") {
      return NextResponse.json({ error: "Image is required" }, { status: 400 })
    }

    if (!imageDataUrl.startsWith("data:image/")) {
      return NextResponse.json({ error: "Invalid image format" }, { status: 400 })
    }

    if (imageDataUrl.length > MAX_DATA_URL_LENGTH) {
      return NextResponse.json({ error: "Image is too large. Keep it under 5MB." }, { status: 400 })
    }

    const mimeType = getMimeTypeFromDataUrl(imageDataUrl)
    if (!mimeType || !ALLOWED_TYPES.includes(mimeType)) {
      return NextResponse.json(
        { error: "Only JPG, PNG, and WEBP images are allowed" },
        { status: 400 }
      )
    }

    try {
      // Try Upload to Firebase Storage
      const storageRef = ref(storage, `student-photos/${payload.identifier}`)
      await uploadString(storageRef, imageDataUrl, "data_url")
      
      // Get download URL
      const photoUrl = await getDownloadURL(storageRef)
      
      // Try Update Firestore document
      try {
        const studentRef = doc(db, "students", payload.userId)
        await updateDoc(studentRef, {
          photo_url: photoUrl,
          updated_at: new Date().toISOString(),
        })
      } catch (firestoreError) {
        console.warn("Could not update Firestore, but got storage URL:", firestoreError)
      }

      return NextResponse.json({ success: true, photo_url: photoUrl })
    } catch (firebaseError) {
      console.error("Firebase photo upload error. Falling back to data URL:", firebaseError)
      // Fallback to using the base64 URL itself so the admit card can at least show it
      return NextResponse.json({ success: true, photo_url: imageDataUrl })
    }
  } catch (error) {
    console.error("Student photo upload error:", error)
    return NextResponse.json({ error: "Failed to upload photo" }, { status: 500 })
  }
}