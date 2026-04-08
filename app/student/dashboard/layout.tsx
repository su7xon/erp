import { StudentNav } from "@/components/student/student-nav"

export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="portal-shell min-h-screen">
      <StudentNav />
      <main className="container mx-auto px-4 py-7 md:py-8">{children}</main>
    </div>
  )
}
