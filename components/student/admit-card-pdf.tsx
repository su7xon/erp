"use client"

import { useState } from "react"
import { Document, Page, Text, View, StyleSheet, Image, pdf } from "@react-pdf/renderer"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Download, Loader2 } from "lucide-react"
import type { Student } from "@/lib/types"

const styles = StyleSheet.create({
  page: {
    padding: 12,
    fontSize: 10.2,
    fontFamily: "Helvetica",
    backgroundColor: "#efe9df",
  },
  frame: {
    backgroundColor: "#ffffff",
    borderWidth: 1.2,
    borderColor: "#cdbca2",
    padding: 16,
  },
  topRule: {
    borderTopWidth: 1,
    borderTopColor: "#cdbca2",
    marginBottom: 2,
  },
  topRuleThin: {
    borderTopWidth: 0.8,
    borderTopColor: "#d9c9b0",
    marginBottom: 14,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 10,
  },
  titleLeft: {
    width: "52%",
  },
  universityName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2f271d",
    lineHeight: 1,
  },
  appBlock: {
    width: "38%",
    alignItems: "flex-end",
  },
  appLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#4b3825",
  },
  appValue: {
    marginTop: 3,
    fontSize: 15,
    fontWeight: "bold",
    color: "#3f2f21",
  },
  headline: {
    borderTopWidth: 1,
    borderTopColor: "#d6c7af",
    borderBottomWidth: 1,
    borderBottomColor: "#d6c7af",
    paddingTop: 8,
    paddingBottom: 7,
    marginBottom: 12,
  },
  examHeading: {
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
    textDecoration: "underline",
    color: "#4a3522",
  },
  admitTitle: {
    marginTop: 3,
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    color: "#3d2b1d",
  },
  addressAndPhotoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  toBlock: {
    width: "73%",
  },
  toLabel: {
    fontSize: 11,
    color: "#44311f",
    marginBottom: 7,
  },
  candidateName: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#2f2419",
    marginBottom: 4,
  },
  addressLine: {
    fontSize: 11,
    color: "#3a2b1c",
    marginBottom: 3,
  },
  photoBox: {
    width: 125,
    height: 145,
    borderWidth: 1,
    borderColor: "#9a8a73",
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  photo: {
    width: "100%",
    height: "100%",
  },
  photoPlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
    backgroundColor: "#f8f8f8",
  },
  photoPlaceholderText: {
    textAlign: "center",
    fontSize: 8.8,
    fontWeight: "bold",
    color: "#5d4c3a",
  },
  infoBox: {
    borderWidth: 1,
    borderColor: "#d6c6ae",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 14,
  },
  infoGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoCol: {
    width: "48%",
  },
  infoLine: {
    flexDirection: "row",
    marginBottom: 5,
  },
  infoLabel: {
    width: "52%",
    fontSize: 10.8,
    color: "#4a3826",
  },
  infoValue: {
    width: "48%",
    fontSize: 10.8,
    fontWeight: "bold",
    color: "#2f2419",
  },
  candidateText: {
    fontSize: 11,
    color: "#3f2f1f",
    lineHeight: 1.45,
    marginBottom: 12,
  },
  detailsPanel: {
    borderWidth: 1,
    borderColor: "#d7c8b1",
    borderRadius: 8,
    marginBottom: 12,
  },
  detailsTopRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#d7c8b1",
  },
  detailsCol: {
    width: "50%",
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  detailsColRight: {
    borderLeftWidth: 1,
    borderLeftColor: "#d7c8b1",
  },
  detailLine: {
    flexDirection: "row",
    marginBottom: 4,
  },
  detailLabel: {
    width: "56%",
    fontSize: 10.5,
    fontWeight: "bold",
    color: "#45321f",
  },
  detailValue: {
    width: "44%",
    fontSize: 10.5,
    color: "#352718",
  },
  logo: {
    width: 180,
    height: 50,
    objectFit: "contain",
  },
  instructionsHeader: {
    marginBottom: 6,
    fontSize: 11,
    color: "#3f2d1d",
    fontWeight: "bold",
  },
  instructionLine: {
    fontSize: 10,
    color: "#3a2c1d",
    marginBottom: 3,
    lineHeight: 1.4,
  },
  note: {
    marginTop: 9,
    fontSize: 10,
    fontWeight: "bold",
    color: "#3e2c1b",
  },
  footer: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  qrCode: {
    width: 56,
    height: 56,
  },
  signBlock: {
    width: 190,
    alignItems: "center",
  },
  signLine: {
    width: 160,
    borderTopWidth: 1,
    borderTopColor: "#6b5a47",
    marginBottom: 4,
  },
  signText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#3c2e20",
  },
  signSubText: {
    fontSize: 10.2,
    color: "#3c2e20",
  },
  contactRow: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#d7c8b1",
    paddingTop: 7,
  },
  contactText: {
    fontSize: 10,
    color: "#3b2d1d",
  },
})

interface AdmitCardDocumentProps {
  student: Student
  qrCodeUrl: string
}

function AdmitCardDocument({ student, qrCodeUrl }: AdmitCardDocumentProps) {
  const applicationNumber = student.roll_number
  const candidateAddress = (student.address || "-").replace(/\n/g, " ")
  const examDate = "5 April 2026"
  const reportingTime = "9:00 AM"
  const examTime = "10 AM - 1 PM"
  const centerCode = (student.roll_number || "").replace(/\D/g, "").slice(-2) || "--"

  const getAbsoluteUrl = (url: string) => {
    if (!url) return url;
    if (url.startsWith('data:')) return url;
    if (url.startsWith('http')) return url;
    if (typeof window !== 'undefined') {
      return `${window.location.origin}${url.startsWith('/') ? '' : '/'}${url}`;
    }
    return url;
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.frame}>
          <View style={styles.topRule} />
          <View style={styles.topRuleThin} />

          <View style={styles.headerRow}>
            <View style={styles.titleLeft}>
              <Image style={styles.logo} src={getAbsoluteUrl("/IMG_20260408_170755.jpg-removebg-preview.png")} />
            </View>
            <View style={styles.appBlock}>
              <Text style={styles.appLabel}>Application Number:</Text>
              <Text style={styles.appValue}>{applicationNumber}</Text>
            </View>
          </View>

          <View style={styles.headline}>
            <Text style={styles.examHeading}>AMRAPALI UNIVERSITY SCHOLARSHIP ELIGIBILITY TEST 2026</Text>
            <Text style={styles.admitTitle}>ADMIT CARD</Text>
          </View>

          <View style={styles.addressAndPhotoRow}>
            <View style={styles.toBlock}>
              <Text style={styles.toLabel}>To,</Text>
              <Text style={styles.candidateName}>{(student.name || "-").toUpperCase()}</Text>
              <Text style={styles.addressLine}>{candidateAddress}</Text>
            </View>

            <View style={styles.photoBox}>
              {student.photo_url ? (
                <Image style={styles.photo} src={getAbsoluteUrl(student.photo_url)} />
              ) : (
                <View style={styles.photoPlaceholder}>
                  <Text style={styles.photoPlaceholderText}>Affix Passport Size Photograph</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.infoBox}>
            <View style={styles.infoGrid}>
              <View style={styles.infoCol}>
                <View style={styles.infoLine}>
                  <Text style={styles.infoLabel}>Roll Number:</Text>
                  <Text style={styles.infoValue}>{student.roll_number || "-"}</Text>
                </View>
                <View style={styles.infoLine}>
                  <Text style={styles.infoLabel}>Phone:</Text>
                  <Text style={styles.infoValue}>{student.phone || "-"}</Text>
                </View>
                <View style={styles.infoLine}>
                  <Text style={styles.infoLabel}>Father&apos;s Name:</Text>
                  <Text style={styles.infoValue}>{student.father_name || "-"}</Text>
                </View>
              </View>

              <View style={styles.infoCol}>
                <View style={styles.infoLine}>
                  <Text style={styles.infoLabel}>Profile Status:</Text>
                  <Text style={styles.infoValue}>Active</Text>
                </View>
                <View style={styles.infoLine}>
                  <Text style={styles.infoLabel}>Phone:</Text>
                  <Text style={styles.infoValue}>{student.phone || "-"}</Text>
                </View>
                <View style={styles.infoLine}>
                  <Text style={styles.infoLabel}>Mother&apos;s Name:</Text>
                  <Text style={styles.infoValue}>{student.mother_name || "-"}</Text>
                </View>
              </View>
            </View>
          </View>

          <Text style={styles.candidateText}>
            Dear Candidate, with respect to your application for the Entrance Examination 2026, you are hereby informed that you are
            provisionally permitted to appear in the examination as per the details mentioned below.
          </Text>

          <View style={styles.detailsPanel}>
            <View style={styles.detailsTopRow}>
            <View style={styles.detailsCol}>
              <View style={styles.detailLine}>
                <Text style={styles.detailLabel}>Eligibility Level:</Text>
                <Text style={styles.detailValue}>Undergraduate</Text>
              </View>
              <View style={styles.detailLine}>
                <Text style={styles.detailLabel}>Reporting Time:</Text>
                <Text style={styles.detailValue}>{reportingTime}</Text>
              </View>
              <View style={styles.detailLine}>
                <Text style={styles.detailLabel}>Exam Centre Name:</Text>
                <Text style={styles.detailValue}>{student.exam_center_name || "Not assigned"}</Text>
              </View>
            </View>

            <View style={[styles.detailsCol, styles.detailsColRight]}>
              <View style={styles.detailLine}>
                <Text style={styles.detailLabel}>Date of Examination:</Text>
                <Text style={styles.detailValue}>{examDate}</Text>
              </View>
              <View style={styles.detailLine}>
                <Text style={styles.detailLabel}>Exam Timings:</Text>
                <Text style={styles.detailValue}>{examTime}</Text>
              </View>
              <View style={styles.detailLine}>
                <Text style={styles.detailLabel}>Centre Code:</Text>
                <Text style={styles.detailValue}>{centerCode}</Text>
              </View>
            </View>
            </View>
          </View>

          <Text style={styles.instructionsHeader}>IMPORTANT INSTRUCTIONS</Text>
          <Text style={styles.instructionLine}>• Candidates must bring this Admit Card to the examination hall.</Text>
          <Text style={styles.instructionLine}>• Carry one valid photo ID proof and two recent passport photographs.</Text>
          <Text style={styles.instructionLine}>• Reach the exam centre at least 30 minutes before reporting time.</Text>
          <Text style={styles.instructionLine}>• Electronic devices are strictly prohibited inside the exam hall.</Text>
          <Text style={styles.instructionLine}>• Follow all invigilator instructions and exam discipline.</Text>
          <Text style={styles.instructionLine}>• Admit card and identity mismatch may lead to disqualification.</Text>

          <Text style={styles.note}>Note: Bring two passport-size photographs (compulsory).</Text>

          <View style={styles.footer}>
            {qrCodeUrl ? <Image style={styles.qrCode} src={qrCodeUrl} /> : <View />}
            <View style={styles.signBlock}>
              <View style={styles.signLine} />
              <Text style={styles.signText}>Director Admissions</Text>
              <Text style={styles.signSubText}>Evaluation Committee</Text>
            </View>
          </View>

          <View style={styles.contactRow}>
            <Text style={styles.contactText}>Helpline: 9876570200 / 9876507300   •   Email: admissions@amrapali.edu.in</Text>
          </View>
        </View>
      </Page>
    </Document>
  )
}

interface AdmitCardPDFProps {
  student: Student
  qrCodeUrl: string
  onClose: () => void
}

export function AdmitCardPDF({ student, qrCodeUrl, onClose }: AdmitCardPDFProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [downloadError, setDownloadError] = useState("")

  const handleDownload = async () => {
    try {
      setDownloadError("")
      setIsGenerating(true)

      const blob = await pdf(
        <AdmitCardDocument student={student} qrCodeUrl={qrCodeUrl} />
      ).toBlob()

      const url = URL.createObjectURL(blob)
      const anchor = document.createElement("a")
      anchor.href = url
      anchor.download = `admit-card-${student.roll_number}.pdf`
      document.body.appendChild(anchor)
      anchor.click()
      document.body.removeChild(anchor)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Admit card download failed:", error)
      setDownloadError("Failed to generate PDF. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Download Admit Card</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          <p className="text-sm text-slate-600 text-center">
            Your admit card is ready for download. Click the button below to save it as a PDF file.
          </p>
          <Button size="lg" disabled={isGenerating} onClick={handleDownload}>
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating PDF...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Download Admit Card
              </>
            )}
          </Button>

          {downloadError && (
            <p className="text-sm text-red-600">{downloadError}</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
