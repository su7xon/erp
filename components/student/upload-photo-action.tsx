"use client"

import { useState, type ChangeEvent } from "react"
import { useRouter } from "next/navigation"
import { Upload, Loader2 } from "lucide-react"

interface UploadPhotoActionProps {
  rollNumber: string
}

export function UploadPhotoAction({ rollNumber }: UploadPhotoActionProps) {
  const router = useRouter()
  const [isUploading, setIsUploading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handlePhotoUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setError("")
    setMessage("")

    if (!["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type)) {
      setError("Only JPG, PNG and WEBP images are allowed")
      event.target.value = ""
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB")
      event.target.value = ""
      return
    }

    setIsUploading(true)

    try {
      const imageDataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(String(reader.result || ""))
        reader.onerror = () => reject(new Error("Failed to read image"))
        reader.readAsDataURL(file)
      })

      const response = await fetch("/api/student/photo", {
        method: "POST",
        credentials: "include",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageDataUrl }),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || "Failed to upload photo")
        return
      }

      if (typeof window !== "undefined" && result.photo_url) {
        const key = `student_photo_${rollNumber}`
        window.localStorage.setItem(key, result.photo_url)
      }

      setMessage("Photo uploaded successfully. It will appear on your admit card.")
      router.refresh()
      router.push(`/student/dashboard/admit-card?updated=${Date.now()}`)
    } catch (uploadError) {
      console.error("Dashboard photo upload error:", uploadError)
      setError("Failed to upload photo. Please try again.")
    } finally {
      setIsUploading(false)
      event.target.value = ""
    }
  }

  return (
    <div className="space-y-2">
      <div className="relative">
        <input
          id="dashboard-photo-upload"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handlePhotoUpload}
          disabled={isUploading}
          className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
        />
        <div className="inline-flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-50">
          {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {isUploading ? "Uploading..." : "Upload Photo"}
        </div>
      </div>
      {message && <p className="text-xs text-emerald-700">{message}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
