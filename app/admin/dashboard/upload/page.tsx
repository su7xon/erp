"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import * as XLSX from "xlsx"
import type { StudentUploadRow } from "@/lib/types"

const REQUIRED_COLUMNS = [
  "roll_number",
  "name",
]

const OPTIONAL_COLUMNS = [
  "phone",
  "father_name",
  "mother_name",
  "address",
  "exam_center_name",
  "exam_center_address",
]

const COLUMN_ALIASES: Record<string, string> = {
  application_number: "roll_number",
  application_no: "roll_number",
  applicationnumber: "roll_number",
  roll_number: "roll_number",
  roll_no: "roll_number",
  rollnumber: "roll_number",
  name: "name",
  student_name: "name",
  studentname: "name",
  phone: "phone",
  phone_number: "phone",
  phone_no: "phone",
  mobile: "phone",
  mobile_number: "phone",
  mobile_no: "phone",
  mobile_nu: "phone",
  date_of_birth: "date_of_birth",
  dob: "date_of_birth",
  father_name: "father_name",
  fathers_name: "father_name",
  mother_name: "mother_name",
  mothers_name: "mother_name",
  address: "address",
  exam_center_name: "exam_center_name",
  exam_center: "exam_center_name",
  center: "exam_center_name",
  centre: "exam_center_name",
  exam_center_address: "exam_center_address",
}

export default function UploadPage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<StudentUploadRow[]>([])
  const [error, setError] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<{ success: number; failed: number } | null>(null)

  const normalizeColumnName = (name: string): string => {
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_]/g, "")
  }

  const parseExcel = useCallback((file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: "array" })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as unknown[][]

        if (jsonData.length < 2) {
          setError("File must have at least a header row and one data row")
          return
        }

        const headers = (jsonData[0] as string[]).map((h) => COLUMN_ALIASES[normalizeColumnName(h)] || normalizeColumnName(h))
        
        // Check for required columns
        const missingColumns = REQUIRED_COLUMNS.filter(col => !headers.includes(col))
        if (missingColumns.length > 0) {
          setError(`Missing required columns: ${missingColumns.join(", ")}`)
          return
        }

        const rows: StudentUploadRow[] = []
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i] as unknown[]
          if (row.length === 0 || row.every(cell => !cell)) continue

          const student: StudentUploadRow = {
            roll_number: "",
            name: "",
            date_of_birth: "2000-01-01",
          }

          headers.forEach((header, index) => {
            const value = row[index]
            if (value !== undefined && value !== null) {
              if (header === "date_of_birth") {
                // Handle Excel date serial numbers
                if (typeof value === "number") {
                  const date = XLSX.SSF.parse_date_code(value)
                  student.date_of_birth = `${date.y}-${String(date.m).padStart(2, "0")}-${String(date.d).padStart(2, "0")}`
                } else {
                  student.date_of_birth = String(value).trim()
                }
              } else if (header === "phone") {
                const digits = String(value).replace(/\D/g, "")
                if (digits) {
                  student.phone = digits
                }
              } else if (header === "roll_number") {
                student.roll_number = String(value).trim().replace(/\s+/g, "").toUpperCase()
              } else if (header === "name") {
                student.name = String(value).trim()
              } else if ([...REQUIRED_COLUMNS, ...OPTIONAL_COLUMNS].includes(header)) {
                ;(student as Record<string, string>)[header] = String(value).trim()
              }
            }
          })

          if (student.roll_number && student.name) {
            rows.push(student)
          }
        }

        if (rows.length === 0) {
          setError("No valid student data found in the file")
          return
        }

        setPreview(rows)
        setError("")
      } catch {
        setError("Failed to parse Excel file. Please ensure it is a valid .xlsx or .xls file.")
      }
    }
    reader.readAsArrayBuffer(file)
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setUploadResult(null)
      parseExcel(selectedFile)
    }
  }

  const handleUpload = async () => {
    if (preview.length === 0) return

    setIsUploading(true)
    setError("")

    try {
      const response = await fetch("/api/admin/students/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ students: preview }),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || "Failed to upload students")
        return
      }

      setUploadResult({ success: result.inserted, failed: result.failed })
      setPreview([])
      setFile(null)

      // Redirect after success
      setTimeout(() => {
        router.push("/admin/dashboard/students")
      }, 2000)
    } catch {
      setError("Failed to upload students. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">Upload Student Data</h1>
        <p className="text-sm text-slate-600 sm:text-base">Import students from an Excel file</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Excel File Upload</CardTitle>
          <CardDescription>
            Upload an Excel file (.xlsx, .xls). Required columns: Application Number or Roll Number, and Name.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {uploadResult && (
            <Alert className="border-emerald-200 bg-emerald-50">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              <AlertDescription className="text-emerald-800">
                Successfully uploaded {uploadResult.success} students. {uploadResult.failed > 0 && `${uploadResult.failed} failed.`}
                Redirecting to students list...
              </AlertDescription>
            </Alert>
          )}

          <div className="rounded-lg border-2 border-dashed border-slate-200 p-5 text-center sm:p-8">
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
              id="excel-upload"
            />
            <label htmlFor="excel-upload" className="cursor-pointer">
              <div className="flex flex-col items-center gap-2">
                {file ? (
                  <>
                    <FileSpreadsheet className="h-12 w-12 text-emerald-500" />
                    <p className="font-medium text-slate-900">{file.name}</p>
                    <p className="text-sm text-slate-500">{preview.length} students ready to upload</p>
                  </>
                ) : (
                  <>
                    <Upload className="h-12 w-12 text-slate-400" />
                    <p className="font-medium text-slate-900">Click to upload Excel file</p>
                    <p className="text-sm text-slate-500">Supports .xlsx and .xls files</p>
                  </>
                )}
              </div>
            </label>
          </div>

          <div className="text-sm text-slate-500">
            <p className="font-medium mb-1">Expected columns:</p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Required:</strong> application_number (or roll_number), name</li>
              <li><strong>Optional:</strong> mobile_number, father&apos;s_name, mother&apos;s_name, address, centre, date_of_birth</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {preview.length > 0 && (
        <Card>
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Preview</CardTitle>
              <CardDescription>Showing first {Math.min(10, preview.length)} of {preview.length} students</CardDescription>
            </div>
            <Button onClick={handleUpload} disabled={isUploading} className="w-full sm:w-auto">
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload {preview.length} Students
                </>
              )}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="hidden overflow-x-auto md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Application / Roll</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Date of Birth</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead>Center</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {preview.slice(0, 10).map((student, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{student.roll_number}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.date_of_birth}</TableCell>
                      <TableCell>{student.phone || "-"}</TableCell>
                      <TableCell>{student.exam_center_name || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="space-y-3 md:hidden">
              {preview.slice(0, 10).map((student, index) => (
                <div key={index} className="rounded-lg border border-slate-200 bg-white p-3 text-sm">
                  <p className="font-semibold text-slate-900">{student.name}</p>
                  <p className="mt-1 text-xs text-slate-600">Roll: {student.roll_number}</p>
                  <div className="mt-2 grid grid-cols-1 gap-1 text-xs text-slate-700">
                    <p>DOB: {student.date_of_birth}</p>
                    <p>Mobile: {student.phone || "-"}</p>
                    <p>Center: {student.exam_center_name || "-"}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
