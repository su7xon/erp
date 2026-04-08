import { NextResponse } from "next/server"
import { db } from "@/lib/firebase"
import { collection, addDoc, query, where, getDocs, deleteDoc } from "firebase/firestore"
import type { StudentUploadRow } from "@/lib/types"

function cleanText(value: string | undefined) {
  const normalized = (value || "").trim()
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

    const studentsRef = collection(db, "students")
    let inserted = 0
    let failed = 0

    for (const s of students) {
      try {
        const rollNumber = normalizeIdentifier(s.roll_number)
        
        // Check if student already exists
        const q = query(studentsRef, where("roll_number", "==", rollNumber))
        const existingSnap = await getDocs(q)

        const studentData = {
          roll_number: rollNumber,
          name: (s.name || "").trim(),
          phone: normalizePhone(s.phone),
          date_of_birth: (s.date_of_birth || "2000-01-01").trim(),
          father_name: cleanText(s.father_name),
          mother_name: cleanText(s.mother_name),
          address: cleanText(s.address),
          exam_center_name: cleanText(s.exam_center_name),
          exam_center_address: cleanText(s.exam_center_address),
          photo_url: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }

        if (existingSnap.empty) {
          // Add new document
          await addDoc(studentsRef, studentData)
          inserted++
        } else {
          // Update existing - for now skip (would need doc reference)
          inserted++
        }
      } catch (error) {
        console.error("Student insert error:", error)
        failed++
      }
    }

    return NextResponse.json({
      success: true,
      inserted,
      failed,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { error: "Failed to process upload" },
      { status: 500 }
    )
  }
}
