import type { Student } from "@/lib/types"
import fs from "node:fs"
import path from "node:path"

export const DEMO_STUDENT_ID = "dummy-student-id-1234"
const DEMO_PHOTO_STORE_PATH = path.join(process.cwd(), ".demo-photo-store.json")

export function isDemoMode() {
  // Demo mode only if Firebase is not properly configured
  const hasRequiredFirebaseKeys = 
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET &&
    !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID.includes("your-project")
  
  return !hasRequiredFirebaseKeys
}

function normalizeDemoKey(identifier?: string) {
  return (identifier || "APP001").trim().replace(/\s+/g, "").toUpperCase()
}

function readDemoPhotoStore(): Record<string, string> {
  try {
    if (!fs.existsSync(DEMO_PHOTO_STORE_PATH)) {
      return {}
    }

    const content = fs.readFileSync(DEMO_PHOTO_STORE_PATH, "utf8")
    if (!content.trim()) {
      return {}
    }

    return JSON.parse(content) as Record<string, string>
  } catch {
    return {}
  }
}

function writeDemoPhotoStore(store: Record<string, string>) {
  try {
    fs.writeFileSync(DEMO_PHOTO_STORE_PATH, JSON.stringify(store), "utf8")
  } catch {
    // Ignore write errors in demo mode.
  }
}

export function setDemoStudentPhoto(identifier: string, photoUrl: string) {
  const key = normalizeDemoKey(identifier)
  const store = readDemoPhotoStore()
  store[key] = photoUrl
  writeDemoPhotoStore(store)
}

export function getDemoStudent(identifier?: string): Student {
  const key = normalizeDemoKey(identifier)
  const store = readDemoPhotoStore()
  return {
    id: DEMO_STUDENT_ID,
    roll_number: key,
    name: "Test Student",
    phone: "9876546655",
    date_of_birth: "2000-01-01",
    father_name: "Father Name",
    mother_name: "Mother Name",
    address: "123 Test Street, City - 123456",
    exam_center_name: "Center A",
    exam_center_address: "Main Campus, City - 123456",
    photo_url: store[key] || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
}
