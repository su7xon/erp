import { cookies } from "next/headers"
import { verifyToken } from "@/lib/auth"
import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import { redirect } from "next/navigation"
import { AdmitCardView } from "@/components/student/admit-card-view"
import { getDemoStudent, DEMO_STUDENT_ID } from "@/lib/demo"

export default async function AdmitCardPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("student_token")?.value

  if (!token) {
    redirect("/student/login")
  }

  const payload = await verifyToken(token)
  if (!payload || payload.role !== "student") {
    redirect("/student/login")
  }

  const student = payload.userId === DEMO_STUDENT_ID
    ? getDemoStudent(payload.identifier)
    : await (async () => {
        try {
          const userRef = doc(db, "students", payload.userId)
          const userSnap = await getDoc(userRef)
          return userSnap.exists() ? userSnap.data() : null
        } catch (error) {
          console.error("Error fetching student:", error)
          return null
        }
      })()

  if (!student) {
    redirect("/student/login")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Admit Card</h1>
        <p className="text-slate-600">View and download your exam admit card</p>
      </div>

      <AdmitCardView student={student} />
    </div>
  )
}
