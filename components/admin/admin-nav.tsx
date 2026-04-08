"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, FileSpreadsheet, GitPullRequest, LogOut, ShieldCheck } from "lucide-react"

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/dashboard/students", label: "Students", icon: Users },
  { href: "/admin/dashboard/upload", label: "Upload Data", icon: FileSpreadsheet },
  { href: "/admin/dashboard/requests", label: "Center Requests", icon: GitPullRequest },
]

export function AdminNav() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
        cache: "no-store",
      })

      if (!response.ok) {
        throw new Error("Logout request failed")
      }
    } catch (error) {
      console.error("Logout failed:", error)
    } finally {
      router.replace("/")
      router.refresh()
    }
  }

  return (
    <header className="sticky top-0 z-20 border-b border-white/60 bg-white/75 backdrop-blur-xl">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex h-14 items-center justify-between sm:h-16">
          <div className="flex items-center gap-3 sm:gap-6">
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <span className="rounded-xl bg-emerald-100 p-2 text-emerald-700">
                <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5" />
              </span>
              <div className="leading-tight">
                <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Operations</p>
                <span className="text-sm font-semibold text-slate-900 sm:text-base">Admin Panel</span>
              </div>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-3 py-2 text-sm transition-colors",
                    pathname === item.href
                      ? "bg-slate-900 text-white"
                      : "text-slate-600 hover:bg-white hover:text-slate-900"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="h-9 border-slate-300 bg-white/70 px-2 text-slate-700 hover:bg-white sm:px-3"
          >
            <LogOut className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Logout</span>
            <span className="sr-only sm:hidden">Logout</span>
          </Button>
        </div>
        {/* Mobile navigation */}
        <nav className="flex items-center gap-1 overflow-x-auto pb-2 md:hidden">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs transition-colors",
                pathname === item.href
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-white hover:text-slate-900"
              )}
            >
              <item.icon className="h-3.5 w-3.5" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
