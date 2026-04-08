import { NextResponse } from "next/server"
import { db } from "@/lib/firebase"
import { collection, getDocs, orderBy, query } from "firebase/firestore"

export async function GET() {
  try {
    const studentsRef = collection(db, "students")
    const q = query(studentsRef, orderBy("roll_number"))
    const studentsSnap = await getDocs(q)

    if (studentsSnap.empty) {
      return NextResponse.json(
        { error: "No students found" },
        { status: 404 }
      )
    }

    const students = studentsSnap.docs.map(doc => doc.data())

    // Create CSV content
    const headers = [
      "Roll Number",
      "Name",
      "Phone",
      "Date of Birth",
      "Father Name",
      "Mother Name",
      "Address",
      "Exam Center Name",
      "Exam Center Address",
    ]

    const csvRows = [headers.join(",")]

    students.forEach((student: any) => {
      const row = [
        student.roll_number,
        `"${student.name?.replace(/"/g, '""') || ""}"`,
        student.phone || "",
        student.date_of_birth,
        `"${student.father_name?.replace(/"/g, '""') || ""}"`,
        `"${student.mother_name?.replace(/"/g, '""') || ""}"`,
        `"${student.address?.replace(/"/g, '""') || ""}"`,
        `"${student.exam_center_name?.replace(/"/g, '""') || ""}"`,
        `"${student.exam_center_address?.replace(/"/g, '""') || ""}"`,
      ]
      csvRows.push(row.join(","))
    })

    const csvContent = csvRows.join("\n")

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="students-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    })
  } catch (error) {
    console.error("Export error:", error)
    return NextResponse.json(
      { error: "Failed to export students" },
      { status: 500 }
    )
  }
}
