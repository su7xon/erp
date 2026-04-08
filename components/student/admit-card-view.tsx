"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, QrCode } from "lucide-react"
import type { Student } from "@/lib/types"
import QRCode from "qrcode"
import dynamic from "next/dynamic"

const AdmitCardPDF = dynamic(
  () => import("./admit-card-pdf").then((mod) => mod.AdmitCardPDF),
  { ssr: false }
)

interface AdmitCardViewProps {
  student: Student
}

export function AdmitCardView({ student }: AdmitCardViewProps) {
  const [currentStudent, setCurrentStudent] = useState<Student>(student)
  const [previewPhotoUrl, setPreviewPhotoUrl] = useState<string | null>(student.photo_url)
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("")
  const [showPDF, setShowPDF] = useState(false)

  useEffect(() => {
    setCurrentStudent(student)
    setPreviewPhotoUrl(student.photo_url)
  }, [student])

  useEffect(() => {
    if (typeof window === "undefined") return

    const key = `student_photo_${student.roll_number}`
    const cachedPhoto = window.localStorage.getItem(key)
    if (!cachedPhoto) return

    setPreviewPhotoUrl(cachedPhoto)
    setCurrentStudent((prev) => ({
      ...prev,
      photo_url: cachedPhoto,
    }))
  }, [student.roll_number])

  useEffect(() => {
    const generateQR = async () => {
      try {
        const qrData = JSON.stringify({
          rollNumber: currentStudent.roll_number,
          name: currentStudent.name,
          examCenter: currentStudent.exam_center_name,
        })
        const url = await QRCode.toDataURL(qrData, { width: 120, margin: 1 })
        setQrCodeUrl(url)
      } catch (error) {
        console.error("QR generation error:", error)
      }
    }
    generateQR()
  }, [currentStudent])

  const examDate = "5 April 2026"
  const reportingTime = "9:00 AM"
  const examTime = "10 AM - 1 PM"
  const photoToDisplay = previewPhotoUrl || currentStudent.photo_url

  return (
    <div className="space-y-4 md:space-y-6">
      <Card className="mx-auto w-full max-w-3xl border-[#cfbca0] bg-[#f6f0e6] shadow-xl">
        <CardHeader className="border-b border-[#d8c8af] bg-[#f9f4eb] px-3 pb-3 pt-4 sm:px-6 sm:pb-4">
          <CardTitle className="text-lg font-semibold text-[#3b2a1b] sm:text-xl">Examination Admit Card</CardTitle>
        </CardHeader>
        <CardContent className="overflow-hidden p-2.5 sm:p-4 md:p-5">
          <div className="w-full rounded-md border border-[#ccb89b] bg-white p-2.5 sm:p-3 md:p-4">
            <div className="border-t border-[#d8c8af]" />
            <div className="mt-1 border-t border-[#e3d4bf]" />

            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex h-16 items-center sm:h-20 md:h-24">
                <img
                  src="/IMG_20260408_170755.jpg-removebg-preview.png"
                  alt="Amrapali University"
                  className="h-full w-auto max-w-[230px] object-contain"
                />
              </div>
              <div className="text-left sm:text-right">
                <p className="text-xs font-semibold text-[#4c3a28] md:text-sm">Application Number:</p>
                <p className="text-lg font-bold text-[#352819] sm:text-xl md:text-2xl">{currentStudent.roll_number}</p>
              </div>
            </div>

            <div className="mt-3 border-y border-[#d7c6ac] py-2 text-center text-[#422f1f]">
              <p className="text-[13px] font-bold underline sm:text-sm md:text-base">AMRAPALI UNIVERSITY SCHOLARSHIP ELIGIBILITY TEST 2026</p>
              <p className="text-2xl font-bold tracking-wide sm:text-3xl md:text-4xl">ADMIT CARD</p>
            </div>

            <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="space-y-1 text-[#3b2b1d] md:max-w-[70%]">
                <p className="text-sm sm:text-base">To,</p>
                <p className="text-lg font-bold uppercase sm:text-xl md:text-2xl">{currentStudent.name}</p>
                <p className="text-sm sm:text-base md:text-lg">{currentStudent.address || "-"}</p>
              </div>

              <div className="h-32 w-24 shrink-0 border border-[#9d8a71] bg-[#f9f4eb] p-1 text-left md:h-40 md:w-32">
                {photoToDisplay ? (
                  <img
                    src={photoToDisplay}
                    alt="Student Photo"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-center text-sm font-semibold text-[#5b4a38] md:text-base">
                    Affix Passport-Size Photograph
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-[#d8c8af] p-3 text-sm md:p-4 md:text-base">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-2 text-[#3c2c1d]">
                  <p><span className="text-[#5a4733]">Roll Number:</span> <span className="font-bold">{currentStudent.roll_number}</span></p>
                  <p><span className="text-[#5a4733]">Phone:</span> <span className="font-bold">{currentStudent.phone || "-"}</span></p>
                  <p><span className="text-[#5a4733]">Father&apos;s Name:</span> <span className="font-bold">{currentStudent.father_name || "-"}</span></p>
                </div>
                <div className="space-y-2 text-[#3c2c1d]">
                  <p><span className="text-[#5a4733]">Profile Status:</span> <span className="font-bold">Active</span></p>
                  <p><span className="text-[#5a4733]">Phone:</span> <span className="font-bold">{currentStudent.phone || "-"}</span></p>
                  <p><span className="text-[#5a4733]">Mother&apos;s Name:</span> <span className="font-bold">{currentStudent.mother_name || "-"}</span></p>
                </div>
              </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-[#3f3021] sm:text-base md:text-lg md:leading-7">
              Dear Candidate, with respect to your application for University Entrance Examination 2026, you are hereby informed that you are
              provisionally permitted to appear in the examination as per the details mentioned.
            </p>

            <div className="mt-4 rounded-xl border border-[#d8c8af] bg-[#fcf8f1] text-sm md:text-base">
              <div className="grid md:grid-cols-2">
                <div className="space-y-2 p-4 text-[#3c2c1d]">
                  <p><span className="font-semibold">Eligibility Level:</span> Undergraduate</p>
                  <p><span className="font-semibold">Reporting Time:</span> {reportingTime}</p>
                  <p><span className="font-semibold">Exam Centre Name:</span> {currentStudent.exam_center_name || "Not assigned"}</p>
                </div>
                <div className="space-y-2 border-t border-[#d8c8af] p-4 text-[#3c2c1d] md:border-l md:border-t-0">
                  <p><span className="font-semibold">Date of Examination:</span> {examDate}</p>
                  <p><span className="font-semibold">Exam Timings:</span> {examTime}</p>
                  <p><span className="font-semibold">Exam Centre:</span> {currentStudent.exam_center_address || "-"}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 border border-[#d8c8af] p-3 text-sm text-[#3c2c1d] md:p-4">
              <p className="mb-2 text-base font-bold md:text-lg">IMPORTANT INSTRUCTIONS</p>
              <ul className="space-y-1 leading-5">
                <li>• Candidates must bring this Admit Card to the examination hall.</li>
                <li>• Carry one valid photo ID proof and two recent passport-size photographs.</li>
                <li>• Reach the exam centre at least 30 minutes before reporting time.</li>
                <li>• Electronic devices are strictly prohibited inside the exam hall.</li>
                <li>• Follow all exam instructions carefully, otherwise candidature may be cancelled.</li>
              </ul>
              <p className="mt-3 text-base font-semibold">Note: Bring two passport-size photographs (compulsory).</p>
            </div>

            <div className="mt-4 flex items-end justify-between gap-3">
              {qrCodeUrl ? (
                <img src={qrCodeUrl} alt="QR Code" className="h-14 w-14" />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center bg-slate-100">
                  <QrCode className="h-6 w-6 text-slate-400" />
                </div>
              )}

              <div className="w-32 text-center text-[#3c2c1d] sm:w-44 md:w-52">
                <div className="mb-1 border-t border-[#6a5846]" />
                <p className="text-sm font-bold sm:text-base md:text-lg">Director Admissions</p>
                <p className="text-xs font-medium sm:text-sm md:text-base">Examination Committee</p>
              </div>
            </div>

            <p className="mt-4 border-t border-[#d8c8af] pt-2 text-sm text-[#3c2c1d]">
              Helpline: 9876570200 / 9876507300 • Email: admissions@amrapali.edu.in
            </p>

            <p className="mt-4 text-sm text-[#5b4a38]">Photo upload is available from the Dashboard page.</p>
          </div>
        </CardContent>
      </Card>

      {/* Download Button */}
      <div className="flex justify-center">
        <Button size="lg" onClick={() => setShowPDF(true)} className="w-full sm:w-auto">
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
      </div>

      {/* PDF Component */}
      {showPDF && (
        <AdmitCardPDF 
          student={currentStudent} 
          qrCodeUrl={qrCodeUrl} 
          onClose={() => setShowPDF(false)} 
        />
      )}
    </div>
  )
}
