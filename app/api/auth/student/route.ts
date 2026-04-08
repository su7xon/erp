import { NextResponse } from "next/server"
import { createStudentToken, setAuthCookie } from "@/lib/auth"
import { db } from "@/lib/firebase"
import { collection, query, where, getDocs } from "firebase/firestore"
import { DEMO_STUDENT_ID } from "@/lib/demo"

function onlyDigits(value: string | null | undefined) {
  return (value || "").replace(/\D/g, "")
}

function normalizeIdentifier(value: string) {
  return value.trim().replace(/\s+/g, "").toUpperCase()
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const rollNumber = normalizeIdentifier(String(body.applicationNumber || body.rollNumber || ""))
    const mobileLast4 = String(body.mobileLast4 || "").trim()

    if (!rollNumber) {
      return NextResponse.json(
        { error: "Application number is required" },
        { status: 400 }
      )
    }

    if (!mobileLast4) {
      return NextResponse.json(
        { error: "Enter mobile last 4 digits" },
        { status: 400 }
      )
    }

    // DEMO BYPASS: Always allow demo user
    if (rollNumber === "APP001" && mobileLast4 === "6655") {
      const token = await createStudentToken(DEMO_STUDENT_ID, rollNumber)
      const response = NextResponse.json({
        success: true,
        student: {
          id: DEMO_STUDENT_ID,
          name: "Test Student",
          rollNumber: rollNumber,
        },
      })
      setAuthCookie(response, token, "student")
      return response
    }

// DEMO FUNCTIONALITY REMOVED

    try {
      // Query Firestore for student
      const studentsRef = collection(db, "students")
      const q = query(studentsRef, where("roll_number", "==", rollNumber))
      const querySnapshot = await getDocs(q)

      if (querySnapshot.empty) {
        return NextResponse.json(
          { error: "Application number not found. Please check upload data." },
          { status: 401 }
        )
      }

      const student = querySnapshot.docs[0].data()
      const studentId = querySnapshot.docs[0].id

      const mobileDigits = onlyDigits(student.phone)
      const requestedLast4 = onlyDigits(mobileLast4)
      const isValidCredential = requestedLast4.length === 4 && mobileDigits.endsWith(requestedLast4)

      if (!isValidCredential) {
        const hasPhone = Boolean(onlyDigits(student.phone))
        return NextResponse.json(
          {
            error: hasPhone
              ? "Credentials mismatch. Use mobile last 4 digits from uploaded data."
              : "Mobile number missing for this student in uploaded data.",
          },
          { status: 401 }
        )
      }

      const token = await createStudentToken(studentId, student.roll_number)

      // Set cookie and return response
      const response = NextResponse.json({
        success: true,
        student: {
          id: studentId,
          name: student.name,
          rollNumber: student.roll_number,
        },
      })

      setAuthCookie(response, token, "student")
      return response
    } catch (firebaseError) {
      console.error("Firebase query error:", firebaseError)
      return NextResponse.json(
        { error: "Database error. Please try again." },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("Auth error:", error)
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    )
  }
}
