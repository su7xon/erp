import { db } from "@/lib/firebase"
import { collection, getDocs, query, where } from "firebase/firestore"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileCheck, Clock, XCircle } from "lucide-react"
import Link from "next/link"

export default async function AdminDashboardPage() {
  let hasDataAccessError = false
  let totalStudents = 0
  let pendingRequests = 0
  let approvedRequests = 0
  let rejectedRequests = 0

  try {
    const studentsRef = collection(db, "students")
    const studentsSnap = await getDocs(studentsRef)
    totalStudents = studentsSnap.size

    const requestsRef = collection(db, "center_change_requests")
    const pendingQ = query(requestsRef, where("status", "==", "pending"))
    const pendingSnap = await getDocs(pendingQ)
    pendingRequests = pendingSnap.size

    const approvedQ = query(requestsRef, where("status", "==", "approved"))
    const approvedSnap = await getDocs(approvedQ)
    approvedRequests = approvedSnap.size

    const rejectedQ = query(requestsRef, where("status", "==", "rejected"))
    const rejectedSnap = await getDocs(rejectedQ)
    rejectedRequests = rejectedSnap.size
  } catch (error) {
    hasDataAccessError = true
    console.error("Dashboard error:", error)
  }

  const stats = [
    {
      title: "Total Students",
      value: totalStudents,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      href: "/admin/dashboard/students",
    },
    {
      title: "Pending Requests",
      value: pendingRequests,
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      href: "/admin/dashboard/requests",
    },
    {
      title: "Approved Requests",
      value: approvedRequests,
      icon: FileCheck,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      href: "/admin/dashboard/requests?status=approved",
    },
    {
      title: "Rejected Requests",
      value: rejectedRequests,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      href: "/admin/dashboard/requests?status=rejected",
    },
  ]

  return (
    <div className="space-y-4 sm:space-y-6">
        <div className="glass-surface rounded-2xl border-slate-200/70 p-4 sm:p-5 md:p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Operations Cockpit</p>
          <h1 className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl md:text-3xl">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-slate-600 sm:text-base">Live overview of students, request queues and resolution pipeline.</p>
        </div>

        {hasDataAccessError && (
          <Card className="glass-surface border-amber-200 bg-amber-50/70">
            <CardContent className="p-4 text-sm text-amber-900">
              Unable to read Firebase data yet. Update Firestore rules/collections to enable live stats.
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {stats.map((stat) => (
            <Link key={stat.title} href={stat.href}>
              <Card className="panel-hover glass-surface cursor-pointer border-slate-200/70">
                <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
                  <CardTitle className="text-xs font-medium text-slate-600 sm:text-sm">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-md ${stat.bgColor}`}>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-xl font-bold text-slate-900 sm:text-2xl">{stat.value}</div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="glass-surface border-slate-200/70">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link
                href="/admin/dashboard/upload"
                className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 transition-colors hover:bg-slate-50"
              >
                <div className="p-2 rounded-md bg-emerald-50">
                  <Users className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Upload Student Data</p>
                  <p className="text-sm text-slate-500">Import students from Excel file</p>
                </div>
              </Link>
              <Link
                href="/admin/dashboard/requests"
                className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 transition-colors hover:bg-slate-50"
              >
                <div className="p-2 rounded-md bg-amber-50">
                  <Clock className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Review Requests</p>
                  <p className="text-sm text-slate-500">Process pending center change requests</p>
                </div>
              </Link>
            </CardContent>
          </Card>

          <Card className="glass-surface border-slate-200/70">
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
              <CardDescription>Steps to set up the portal</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3 text-sm">
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-medium">1</span>
                  <span className="text-slate-600">Upload student data using Excel columns like: Application Number, Name, Father&apos;s Name, Mother&apos;s Name, Mobile Number, Centre</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-medium">2</span>
                  <span className="text-slate-600">Students can login using Application Number and Mobile Last 4 digits</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-medium">3</span>
                  <span className="text-slate-600">Track center changes from the requests register and export records when needed</span>
                </li>
              </ol>
            </CardContent>
          </Card>
        </div>
    </div>
  )
}
