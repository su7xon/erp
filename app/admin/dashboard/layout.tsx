import { AdminNav } from "@/components/admin/admin-nav"

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="portal-shell min-h-screen">
      <AdminNav />
      <main className="container mx-auto px-3 py-4 sm:px-4 sm:py-6 md:py-8">{children}</main>
    </div>
  )
}
