// Database types for Student Admit Card Portal

export interface Student {
  id: string
  roll_number: string
  name: string
  phone: string | null
  date_of_birth: string // ISO date string
  father_name: string | null
  mother_name: string | null
  address: string | null
  exam_center_name: string | null
  exam_center_address: string | null
  photo_url: string | null
  created_at: string
  updated_at: string
}

export interface CenterChangeRequest {
  id: string
  student_id: string
  reason: string
  preferred_center: string
  status: 'pending' | 'approved' | 'rejected'
  admin_notes: string | null
  created_at: string
  updated_at: string
  // Joined data
  student?: Student
}

export interface Admin {
  id: string
  email: string
  password_hash: string
  name: string | null
  created_at: string
}

// Excel upload types
export interface ExcelStudentRow {
  'Student Name': string
  'Roll Number': string
  'Phone Number'?: string
  'Date of Birth': string | Date
  "Father's Name"?: string
  "Mother's Name"?: string
  'Address'?: string
  'Exam Center Name'?: string
  'Exam Center Address'?: string
}

export interface ParsedStudent {
  roll_number: string
  name: string
  phone: string | null
  date_of_birth: string // ISO date string
  father_name: string | null
  mother_name: string | null
  address: string | null
  exam_center_name: string | null
  exam_center_address: string | null
}

export interface StudentUploadRow {
  roll_number: string
  name: string
  phone?: string
  date_of_birth?: string
  father_name?: string
  mother_name?: string
  address?: string
  exam_center_name?: string
  exam_center_address?: string
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}
