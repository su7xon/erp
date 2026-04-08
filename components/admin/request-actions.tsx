"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

interface RequestActionsProps {
  requestId: string
  studentId?: string
  preferredCenter: string
}

export function RequestActions({ requestId, studentId, preferredCenter }: RequestActionsProps) {
  const router = useRouter()
  const [showApproveDialog, setShowApproveDialog] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [notes, setNotes] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleAction = async (action: "approve" | "reject") => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/requests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          notes,
          studentId,
          preferredCenter,
        }),
      })

      if (response.ok) {
        setShowApproveDialog(false)
        setShowRejectDialog(false)
        router.refresh()
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          className="h-8 rounded-none border-slate-300 text-slate-800 hover:bg-slate-100"
          onClick={() => setShowApproveDialog(true)}
        >
          <CheckCircle className="mr-1 h-4 w-4" />
          Approve
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="h-8 rounded-none border-slate-300 text-slate-800 hover:bg-slate-100"
          onClick={() => setShowRejectDialog(true)}
        >
          <XCircle className="mr-1 h-4 w-4" />
          Reject
        </Button>
      </div>

      {/* Approve Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent className="rounded-none border-slate-300">
          <DialogHeader>
            <DialogTitle>Approve Request</DialogTitle>
            <DialogDescription>
              This will update the student&apos;s exam center to: {preferredCenter}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="approve-notes">Admin Notes (optional)</Label>
              <Textarea
                id="approve-notes"
                placeholder="Add any notes about this approval..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="rounded-none border-slate-300" onClick={() => setShowApproveDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => handleAction("approve")} 
              disabled={isLoading}
              className="rounded-none bg-slate-900 text-white hover:bg-slate-800"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Approve Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="rounded-none border-slate-300">
          <DialogHeader>
            <DialogTitle>Reject Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this request.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reject-notes">Reason for Rejection</Label>
              <Textarea
                id="reject-notes"
                placeholder="Explain why this request is being rejected..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="rounded-none border-slate-300" onClick={() => setShowRejectDialog(false)}>
              Cancel
            </Button>
            <Button 
              className="rounded-none bg-slate-900 text-white hover:bg-slate-800"
              onClick={() => handleAction("reject")} 
              disabled={isLoading || !notes.trim()}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Reject Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
