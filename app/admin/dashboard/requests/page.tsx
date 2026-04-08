import { db } from "@/lib/firebase"
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RequestActions } from "@/components/admin/request-actions"
import Link from "next/link"

interface PageProps {
  searchParams: Promise<{ status?: string }>
}

export default async function RequestsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const statusFilter = params.status || "pending"

  const requestsRef = collection(db, "center_change_requests")
  const studentsRef = collection(db, "students")

  // Get requests for selected status
  const q = query(requestsRef, where("status", "==", statusFilter))
  const requestsSnap = await getDocs(q)
  let requests = requestsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  
  // Enrich requests with student data
  const enrichedRequests = await Promise.all(
    requests.map(async (req: any) => {
      try {
        const studentRef = doc(db, "students", req.student_id)
        const studentSnap = await getDoc(studentRef)
        const studentData = studentSnap.exists() ? { id: studentSnap.id, ...studentSnap.data() } : null
        return {
          ...req,
          students: studentData || {}
        }
      } catch (err) {
        return { ...req, students: {} }
      }
    })
  )

  // Get counts for all statuses
  const pendingQ = query(requestsRef, where("status", "==", "pending"))
  const pendingSnap = await getDocs(pendingQ)
  const pendingCount = pendingSnap.size

  const approvedQ = query(requestsRef, where("status", "==", "approved"))
  const approvedSnap = await getDocs(approvedQ)
  const approvedCount = approvedSnap.size

  const rejectedQ = query(requestsRef, where("status", "==", "rejected"))
  const rejectedSnap = await getDocs(rejectedQ)
  const rejectedCount = rejectedSnap.size

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-white text-slate-800 border-slate-300">Pending</Badge>
      case "approved":
        return <Badge variant="outline" className="bg-white text-slate-800 border-slate-300">Approved</Badge>
      case "rejected":
        return <Badge variant="outline" className="bg-white text-slate-800 border-slate-300">Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">Center Change Requests</h1>
        <p className="text-sm text-slate-600">Admin panel for exam center change requests</p>
      </div>

      <div className="flex h-auto w-full justify-start gap-2 overflow-x-auto bg-transparent p-0">
        <Link 
          href="/admin/dashboard/requests?status=pending" 
          className={`shrink-0 rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium transition-colors ${
            statusFilter === "pending" ? "bg-slate-900 text-white" : "bg-white text-slate-600 hover:bg-slate-100"
          }`}
        >
          Pending ({pendingCount})
        </Link>
        <Link 
          href="/admin/dashboard/requests?status=approved" 
          className={`shrink-0 rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium transition-colors ${
            statusFilter === "approved" ? "bg-slate-900 text-white" : "bg-white text-slate-600 hover:bg-slate-100"
          }`}
        >
          Approved ({approvedCount})
        </Link>
        <Link 
          href="/admin/dashboard/requests?status=rejected" 
          className={`shrink-0 rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium transition-colors ${
            statusFilter === "rejected" ? "bg-slate-900 text-white" : "bg-white text-slate-600 hover:bg-slate-100"
          }`}
        >
          Rejected ({rejectedCount})
        </Link>
      </div>

      <div className="mt-6">
        {enrichedRequests && enrichedRequests.length > 0 ? (
          <Card className="rounded-none border-slate-300 shadow-none">
              <CardHeader className="border-b border-slate-200 pb-4">
                <CardTitle className="text-base font-semibold tracking-wide">Request Register</CardTitle>
                <CardDescription className="text-xs uppercase tracking-wider text-slate-500">
                  Total {statusFilter} requests: {enrichedRequests.length}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-slate-300 bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-600">
                        <th className="px-4 py-3 font-medium">Candidate</th>
                        <th className="px-4 py-3 font-medium">Roll No.</th>
                        <th className="px-4 py-3 font-medium">Current Centre</th>
                        <th className="px-4 py-3 font-medium">Requested Centre</th>
                        <th className="px-4 py-3 font-medium">Reason</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                        <th className="px-4 py-3 font-medium">Submitted</th>
                        <th className="px-4 py-3 font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {enrichedRequests.map((request: any) => (
                        <tr key={request.id} className="border-b border-slate-200 align-top">
                          <td className="px-4 py-3 text-slate-900">{request.students?.name || "-"}</td>
                          <td className="px-4 py-3 text-slate-700">{request.students?.roll_number || "-"}</td>
                          <td className="px-4 py-3 text-slate-700">
                            <p>{request.students?.exam_center_name || "Not assigned"}</p>
                            <p className="mt-1 text-xs text-slate-500">{request.students?.exam_center_address || "-"}</p>
                          </td>
                          <td className="px-4 py-3 text-slate-900">{request.preferred_center}</td>
                          <td className="px-4 py-3 text-slate-700">
                            <p className="max-w-xs whitespace-normal">{request.reason}</p>
                            {request.admin_notes && (
                              <p className="mt-1 text-xs text-slate-500">Admin note: {request.admin_notes}</p>
                            )}
                          </td>
                          <td className="px-4 py-3">{getStatusBadge(request.status)}</td>
                          <td className="px-4 py-3 text-slate-600">
                            {new Date(request.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3">
                            {request.status === "pending" ? (
                              <RequestActions
                                requestId={request.id}
                                studentId={request.students?.id}
                                preferredCenter={request.preferred_center}
                              />
                            ) : (
                              <span className="text-xs text-slate-500">No action</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="space-y-3 p-3 md:hidden">
                  {enrichedRequests.map((request: any) => (
                    <div key={request.id} className="rounded-lg border border-slate-200 bg-white p-3 text-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-900">{request.students?.name || "-"}</p>
                          <p className="text-xs text-slate-600">Roll: {request.students?.roll_number || "-"}</p>
                        </div>
                        {getStatusBadge(request.status)}
                      </div>

                      <div className="mt-3 space-y-1 text-xs text-slate-700">
                        <p><span className="font-medium">Current:</span> {request.students?.exam_center_name || "Not assigned"}</p>
                        <p><span className="font-medium">Requested:</span> {request.preferred_center}</p>
                        <p><span className="font-medium">Reason:</span> {request.reason}</p>
                        <p><span className="font-medium">Submitted:</span> {new Date(request.created_at).toLocaleDateString()}</p>
                        {request.admin_notes && <p><span className="font-medium">Admin note:</span> {request.admin_notes}</p>}
                      </div>

                      <div className="mt-3">
                        {request.status === "pending" ? (
                          <RequestActions
                            requestId={request.id}
                            studentId={request.students?.id}
                            preferredCenter={request.preferred_center}
                          />
                        ) : (
                          <span className="text-xs text-slate-500">No action</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="rounded-none border-slate-300 shadow-none">
              <CardContent className="py-12 text-center">
                <p className="text-slate-500">No {statusFilter} requests found</p>
              </CardContent>
            </Card>
          )}
      </div>
    </div>
  )
}
