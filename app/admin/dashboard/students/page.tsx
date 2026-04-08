import { db } from "@/lib/firebase"
import { collection, getDocs, query, where, orderBy, limit, startAfter } from "firebase/firestore"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Download, Search, Plus } from "lucide-react"
import Link from "next/link"
import { StudentActions } from "@/components/admin/student-actions"
import { ExportButton } from "@/components/admin/export-button"

interface PageProps {
  searchParams: Promise<{ search?: string; page?: string }>
}

export default async function StudentsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const search = params.search || ""
  const pageNum = parseInt(params.page || "1")
  const pageSize = 20

  const studentsRef = collection(db, "students")
  let q = query(studentsRef, orderBy("created_at", "desc"))

  const allSnap = await getDocs(q)
  let students = allSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))

  // Filter by search
  if (search) {
    const searchLower = search.toLowerCase()
    students = students.filter(s => 
      (s.roll_number as string).toLowerCase().includes(searchLower) ||
      (s.name as string).toLowerCase().includes(searchLower)
    )
  }

  const count = students.length
  const paginatedStudents = students.slice((pageNum - 1) * pageSize, pageNum * pageSize)

  const totalPages = Math.ceil((count || 0) / pageSize)

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">Students</h1>
          <p className="text-sm text-slate-600 sm:text-base">{count} students registered</p>
        </div>
        <div className="grid w-full grid-cols-1 gap-2 sm:flex sm:w-auto sm:items-center">
          <ExportButton />
          <Link href="/admin/dashboard/upload" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Add Students
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student List</CardTitle>
          <CardDescription>View and manage all registered students</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form className="flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                name="search"
                placeholder="Search by roll number or name..."
                defaultValue={search}
                className="pl-10"
              />
            </div>
            <Button type="submit" className="w-full sm:w-auto">Search</Button>
          </form>

          {paginatedStudents && paginatedStudents.length > 0 ? (
            <>
              <div className="hidden overflow-x-auto md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Roll Number</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead className="hidden md:table-cell">Phone</TableHead>
                      <TableHead className="hidden lg:table-cell">Father Name</TableHead>
                      <TableHead className="hidden lg:table-cell">Mother Name</TableHead>
                      <TableHead className="hidden lg:table-cell">Exam Center</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedStudents.map((student: any) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.roll_number}</TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell className="hidden md:table-cell">{student.phone || "-"}</TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {student.father_name || "-"}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {student.mother_name || "-"}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {student.exam_center_name || "-"}
                        </TableCell>
                        <TableCell>
                          <StudentActions student={student} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="space-y-3 md:hidden">
                {paginatedStudents.map((student: any) => (
                  <div key={student.id} className="rounded-lg border border-slate-200 bg-white p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{student.name}</p>
                        <p className="text-xs text-slate-600">Roll: {student.roll_number}</p>
                      </div>
                      <StudentActions student={student} />
                    </div>
                    <div className="mt-3 grid grid-cols-1 gap-1 text-xs text-slate-600">
                      <p>Phone: {student.phone || "-"}</p>
                      <p>Father: {student.father_name || "-"}</p>
                      <p>Mother: {student.mother_name || "-"}</p>
                      <p>Center: {student.exam_center_name || "-"}</p>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {pageNum > 1 && (
                    <Link href={`/admin/dashboard/students?page=${pageNum - 1}${search ? `&search=${search}` : ""}`}>
                      <Button variant="outline" size="sm">Previous</Button>
                    </Link>
                  )}
                  <span className="text-xs text-slate-600 sm:text-sm">
                    Page {pageNum} of {totalPages}
                  </span>
                  {pageNum < totalPages && (
                    <Link href={`/admin/dashboard/students?page=${pageNum + 1}${search ? `&search=${search}` : ""}`}>
                      <Button variant="outline" size="sm">Next</Button>
                    </Link>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-500">No students found</p>
              <Link href="/admin/dashboard/upload" className="text-sm text-blue-600 hover:underline">
                Upload student data to get started
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
