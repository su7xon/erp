"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LayoutDashboard, LogOut, GraduationCap } from "lucide-react"

const navItems = [
  { href: "/student/dashboard", label: "Dashboard", icon: LayoutDashboard },
]

export function StudentNav() {
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
      window.location.href = "/"
    }
  }

  return (
    <header className="sticky top-0 z-20 border-b border-white/60 bg-white/75 backdrop-blur-xl">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex h-15 items-center justify-between sm:h-16">
          <div className="flex min-w-0 items-center gap-2 sm:gap-6">
            <Link href="/student/dashboard" className="flex items-center gap-2">
              <span className="rounded-xl bg-sky-100 p-2 text-sky-700">
                <GraduationCap className="h-5 w-5" />
              </span>
              <div className="hidden leading-tight sm:block">
                <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Entrance Candidate</p>
                <span className="font-semibold text-slate-900">Student Portal</span>
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
          <Button type="button" variant="outline" size="sm" onClick={handleLogout} className="shrink-0 border-slate-300 bg-white/70 px-2.5 text-slate-700 hover:bg-white sm:px-3">
            <LogOut className="mr-1.5 h-4 w-4 sm:mr-2" />
            Logout
          </Button>
        </div>
        {/* Mobile navigation */}
        <nav className="flex items-center gap-1 overflow-x-auto pb-3 md:hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-2 text-[13px] transition-colors",
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
