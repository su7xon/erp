"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2, Send } from "lucide-react"

interface CenterChangeFormProps {
  currentCenter?: string | null
}

const CENTER_OPTIONS = ["A", "B", "C", "D", "E"]

export function CenterChangeForm({ currentCenter }: CenterChangeFormProps) {
  const router = useRouter()
  const [preferredCenter, setPreferredCenter] = useState("")
  const [reason, setReason] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/student/center-change", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          preferredCenter,
          reason: reason.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to submit request")
        return
      }

      setSuccess(true)
      setTimeout(() => {
        router.refresh()
      }, 1500)
    } catch {
      setError("Failed to submit request. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="border-emerald-200 bg-emerald-50">
        <CardContent className="py-6 text-center">
          <p className="text-emerald-800 font-medium">Center updated successfully!</p>
          <p className="text-emerald-600 text-sm mt-1">Your admit card center has been updated.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Exam Center</CardTitle>
        <CardDescription>
          Choose your preferred center from the available options
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="preferredCenter">Center</Label>
            <Select
              value={preferredCenter}
              onValueChange={setPreferredCenter}
              disabled={isLoading}
            >
              <SelectTrigger id="preferredCenter" className="w-full">
                <SelectValue placeholder="Select center" />
              </SelectTrigger>
              <SelectContent>
                {CENTER_OPTIONS.map((center) => (
                  <SelectItem
                    key={center}
                    value={center}
                    disabled={Boolean(currentCenter && center === currentCenter)}
                  >
                    Center {center}{currentCenter === center ? " (Current)" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason (optional)</Label>
            <Textarea
              id="reason"
              placeholder="Optional note for your center selection"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={isLoading}
              rows={4}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading || !preferredCenter}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Update Center
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
