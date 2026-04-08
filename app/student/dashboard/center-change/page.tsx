import { cookies } from "next/headers"
import { verifyToken } from "@/lib/auth"
import { db } from "@/lib/firebase"
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore"
import { redirect } from "next/navigation"
import { CenterChangeForm } from "@/components/student/center-change-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"
import { getDemoStudent, DEMO_STUDENT_ID } from "@/lib/demo"

export default async function CenterChangePage() {
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

  const requests = payload.userId === DEMO_STUDENT_ID
    ? []
    : await (async () => {
        try {
          const requestsRef = collection(db, "center_change_requests")
          const q = query(requestsRef, where("student_id", "==", payload.userId))
          const querySnapshot = await getDocs(q)
          return querySnapshot.docs.map(doc => doc.data()).sort((a, b) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )
        } catch (error) {
          console.error("Error fetching requests:", error)
          return []
        }
      })()

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Pending</Badge>
      case "approved":
        return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Approved</Badge>
      case "rejected":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Select Exam Center</h1>
        <p className="text-slate-600">Choose your exam center directly from available options</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Center</CardTitle>
              <CardDescription>Your assigned examination center</CardDescription>
            </CardHeader>
            <CardContent>
              {student.exam_center_name ? (
                <div>
                  <p className="font-medium text-lg">{student.exam_center_name}</p>
                  {student.exam_center_address && (
                    <p className="text-slate-600 mt-1">{student.exam_center_address}</p>
                  )}
                </div>
              ) : (
                <p className="text-slate-500">No center assigned yet</p>
              )}
            </CardContent>
          </Card>

          <CenterChangeForm currentCenter={student.exam_center_name} />

          <Card className="border-amber-200 bg-amber-50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-600" />
                <CardTitle className="text-amber-900">Important</CardTitle>
              </div>
              <CardDescription className="text-amber-700">
                Center updates are applied instantly. Please select carefully.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Request History</CardTitle>
              <CardDescription>Previous center change requests</CardDescription>
            </CardHeader>
            <CardContent>
              {requests.length > 0 ? (
                <div className="space-y-4">
                  {requests.map((request) => (
                    <div
                      key={request.id}
                      className="border rounded-lg p-4 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{request.preferred_center}</span>
                        {getStatusBadge(request.status)}
                      </div>
                      <p className="text-sm text-slate-600">{request.reason}</p>
                      {request.admin_notes && (
                        <p className="text-sm text-slate-500 italic">
                          Admin: {request.admin_notes}
                        </p>
                      )}
                      <p className="text-xs text-slate-400">
                        {new Date(request.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-center py-8">No previous requests</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
