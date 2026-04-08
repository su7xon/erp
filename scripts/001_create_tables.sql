-- Student Admit Card Portal Database Schema

-- 1. Students table (stores all student data from Excel upload)
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roll_number TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  date_of_birth DATE NOT NULL,
  father_name TEXT,
  mother_name TEXT,
  address TEXT,
  exam_center_name TEXT,
  exam_center_address TEXT,
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Center change requests table
CREATE TABLE IF NOT EXISTS center_change_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  preferred_center TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Admins table (for admin authentication)
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_students_roll_number ON students(roll_number);
CREATE INDEX IF NOT EXISTS idx_students_name ON students(name);
CREATE INDEX IF NOT EXISTS idx_center_change_requests_student_id ON center_change_requests(student_id);
CREATE INDEX IF NOT EXISTS idx_center_change_requests_status ON center_change_requests(status);

-- Enable Row Level Security on all tables
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE center_change_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- RLS Policies for students table
-- Allow service role (admin backend) full access
CREATE POLICY "Service role has full access to students" ON students
  FOR ALL USING (true) WITH CHECK (true);

-- RLS Policies for center_change_requests table
CREATE POLICY "Service role has full access to center_change_requests" ON center_change_requests
  FOR ALL USING (true) WITH CHECK (true);

-- RLS Policies for admins table
CREATE POLICY "Service role has full access to admins" ON admins
  FOR ALL USING (true) WITH CHECK (true);
