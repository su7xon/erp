"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MoreHorizontal, Eye, Pencil, Trash2, Loader2 } from "lucide-react"
import type { Student } from "@/lib/types"

interface StudentActionsProps {
  student: Student
}

export function StudentActions({ student }: StudentActionsProps) {
  const router = useRouter()
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showViewDialog, setShowViewDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: student.name,
    phone: student.phone || "",
    address: student.address || "",
    exam_center_name: student.exam_center_name || "",
    exam_center_address: student.exam_center_address || "",
  })

  const handleEdit = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/students/${student.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setShowEditDialog(false)
        router.refresh()
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/students/${student.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setShowDeleteDialog(false)
        router.refresh()
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setShowViewDialog(true)}>
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setShowDeleteDialog(true)}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* View Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Student Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <span className="text-slate-500">Roll Number:</span>
              <span className="font-medium">{student.roll_number}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-slate-500">Name:</span>
              <span className="font-medium">{student.name}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-slate-500">Date of Birth:</span>
              <span className="font-medium">{new Date(student.date_of_birth).toLocaleDateString()}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-slate-500">Phone:</span>
              <span className="font-medium">{student.phone || "-"}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-slate-500">Father&apos;s Name:</span>
              <span className="font-medium">{student.father_name || "-"}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-slate-500">Mother&apos;s Name:</span>
              <span className="font-medium">{student.mother_name || "-"}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-slate-500">Address:</span>
              <span className="font-medium">{student.address || "-"}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-slate-500">Exam Center:</span>
              <span className="font-medium">{student.exam_center_name || "-"}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-slate-500">Center Address:</span>
              <span className="font-medium">{student.exam_center_address || "-"}</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
            <DialogDescription>Update student information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exam_center_name">Exam Center Name</Label>
              <Input
                id="exam_center_name"
                value={formData.exam_center_name}
                onChange={(e) => setFormData({ ...formData, exam_center_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exam_center_address">Exam Center Address</Label>
              <Input
                id="exam_center_address"
                value={formData.exam_center_address}
                onChange={(e) => setFormData({ ...formData, exam_center_address: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
            <Button onClick={handleEdit} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Student</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {student.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
