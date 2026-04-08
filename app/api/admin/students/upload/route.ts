import { NextResponse } from "next/server"
import { db } from "@/lib/firebase"
import { collection, doc, setDoc } from "firebase/firestore"
import type { StudentUploadRow } from "@/lib/types"

function cleanText(value: string | undefined) {
  const normalized = (value || "").trim()
  if (["na", "n/a", "null", "none", "-", "--"].includes(normalized.toLowerCase())) {
    return null
  }
  return normalized.length ? normalized : null
}

function normalizeIdentifier(value: string | undefined) {
  return (value || "").trim().replace(/\s+/g, "").toUpperCase()
}

function normalizePhone(value: string | undefined) {
  const digits = (value || "").replace(/\D/g, "")
  return digits.length ? digits : null
}

export async function POST(request: Request) {
  try {
    const { students } = await request.json() as { students: StudentUploadRow[] }

    if (!students || !Array.isArray(students) || students.length === 0) {
      return NextResponse.json(
        { error: "No students data provided" },
        { status: 400 }
      )
    }

    if (!db) {
      return NextResponse.json(
        {
          error:
            "Firebase is not configured on the server. Add NEXT_PUBLIC_FIREBASE_* env vars in Netlify and redeploy.",
        },
        { status: 500 }
      )
    }

    const studentsRef = collection(db, "students")
    let inserted = 0
    let failed = 0
    let firstError: string | null = null

    for (const s of students) {
      try {
        const rollNumber = normalizeIdentifier(s.roll_number)

        if (!rollNumber || !(s.name || "").trim()) {
          failed++
          if (!firstError) firstError = "Missing required roll number or name in one or more rows"
          continue
        }

        const studentData = {
          roll_number: rollNumber,
          name: (s.name || "").trim(),
          phone: normalizePhone(s.phone),
          date_of_birth: (s.date_of_birth && s.date_of_birth.trim().length) ? s.date_of_birth.trim() : "2000-01-01",
          father_name: cleanText(s.father_name),
          mother_name: cleanText(s.mother_name),
          address: cleanText(s.address),
          exam_center_name: cleanText(s.exam_center_name),
          exam_center_address: cleanText(s.exam_center_address),
          photo_url: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }

        // Upsert by roll number so uploads work even when read permissions are restricted.
        const studentDocRef = doc(studentsRef, rollNumber)
        await setDoc(studentDocRef, studentData, { merge: true })
        inserted++
      } catch (error) {
        console.error("Student insert error for", s.roll_number, ":", error)
        if (!firstError) {
          const message = error instanceof Error ? error.message : "Unknown upload error"
          if (message.toUpperCase().includes("PERMISSION_DENIED")) {
            firstError = "Firestore rules are blocking writes to students collection. Update rules to allow admin upload API writes."
          } else {
            firstError = message
          }
        }
        failed++
      }
    }

    return NextResponse.json({
      success: true,
      inserted,
      failed,
      error: firstError,
    })
  } catch (error) {
    console.error("Upload error:", error)
    const message = error instanceof Error ? error.message : "Unknown upload error"
    const normalized = message.toUpperCase()

    if (normalized.includes("PERMISSION_DENIED")) {
      return NextResponse.json(
        { error: "Firestore denied access. Update Firestore rules for students writes." },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: `Failed to process upload: ${message}` },
      { status: 500 }
    )
  }
}
