import { cookies } from "next/headers"
import { verifyToken } from "@/lib/auth"
import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, User, Phone, Home } from "lucide-react"
import { UploadPhotoAction } from "@/components/student/upload-photo-action"
import Link from "next/link"
import { redirect } from "next/navigation"
import { getDemoStudent, DEMO_STUDENT_ID } from "@/lib/demo"

export default async function StudentDashboardPage() {
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

  const pendingRequest = null

  return (
    <div className="space-y-6">
      <div className="glass-surface rounded-2xl border-slate-200/70 p-5 md:p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Student Workspace</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">Welcome, {student.name}</h1>
        <p className="mt-1 text-slate-600">Roll Number: {student.roll_number}</p>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <p className="text-xs text-slate-500">Profile Status</p>
            <p className="text-sm font-semibold text-emerald-700">Active</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <p className="text-xs text-slate-500">Admit Card</p>
            <p className="text-sm font-semibold text-slate-900">Available</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <p className="text-xs text-slate-500">Center Request</p>
            <p className="text-sm font-semibold text-slate-900">{pendingRequest ? "Pending" : "No Open Request"}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="glass-surface border-slate-200/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {student.phone && (
              <div className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-sm text-slate-500">Phone</p>
                  <p className="text-sm font-medium">{student.phone}</p>
                </div>
              </div>
            )}
            {student.father_name && (
              <div className="flex items-start gap-3">
                <User className="h-4 w-4 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-sm text-slate-500">Father&apos;s Name</p>
                  <p className="text-sm font-medium">{student.father_name}</p>
                </div>
              </div>
            )}
            {student.mother_name && (
              <div className="flex items-start gap-3">
                <User className="h-4 w-4 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-sm text-slate-500">Mother&apos;s Name</p>
                  <p className="text-sm font-medium">{student.mother_name}</p>
                </div>
              </div>
            )}
            {student.address && (
              <div className="flex items-start gap-3">
                <Home className="h-4 w-4 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-sm text-slate-500">Address</p>
                  <p className="text-sm font-medium">{student.address}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="glass-surface border-slate-200/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-emerald-600" />
              Exam Center
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {student.exam_center_name ? (
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-slate-500">Center Name</p>
                  <p className="font-medium">{student.exam_center_name}</p>
                </div>
                {student.exam_center_address && (
                  <div>
                    <p className="text-sm text-slate-500">Center Address</p>
                    <p className="text-sm">{student.exam_center_address}</p>
                  </div>
                )}
                {pendingRequest && (
                  <div className="pt-3 border-t">
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                      Center Change Request Pending
                    </Badge>
                  </div>
                )}
              </div>
              ) : (
                <p className="text-slate-500">Exam center not assigned yet</p>
              )}

              <div className="grid gap-3 pt-2 sm:grid-cols-3">
                <Link
                  href="/student/dashboard/admit-card"
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-50"
                >
                  Download Admit Card
                </Link>
                <Link
                  href="/student/dashboard/center-change"
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-50"
                >
                  Request Center Change
                </Link>
                <UploadPhotoAction rollNumber={student.roll_number} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
