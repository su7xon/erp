"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Loader2, ShieldCheck, Sparkles } from "lucide-react"

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Login failed")
        return
      }

      router.push("/admin/dashboard")
    } catch {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="portal-shell min-h-screen flex flex-col">
      <header className="sticky top-0 z-20 border-b border-white/50 bg-white/70 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-600 transition-colors hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </header>

      <div className="container mx-auto flex flex-1 items-center px-4 py-8 md:py-14">
        <div className="grid w-full gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <section className="fade-slide-up space-y-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
              <Sparkles className="h-3.5 w-3.5" />
              Admin Operations Suite
            </span>
            <h1 className="hero-gradient-text text-4xl font-bold leading-tight md:text-5xl">
              Manage Entrance Operations
            </h1>
            <p className="max-w-xl text-base text-slate-600 md:text-lg">
              Supervise student records, upload batches, and process center-change requests from one unified dashboard.
            </p>
            <div className="grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="glass-surface rounded-xl p-3 text-sm text-slate-600">
                <p className="font-semibold text-slate-900">Bulk Import</p>
                <p>Fast Excel uploads for student records.</p>
              </div>
              <div className="glass-surface rounded-xl p-3 text-sm text-slate-600">
                <p className="font-semibold text-slate-900">Request Control</p>
                <p>Approve or reject with clear audit context.</p>
              </div>
            </div>
          </section>

          <Card className="glass-surface fade-slide-up fade-delay-1 w-full border-slate-200/70 shadow-2xl">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-fit rounded-full bg-emerald-100 p-3 text-emerald-700">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <CardTitle className="text-2xl">Admin Panel</CardTitle>
              <CardDescription>Secure entry for authorized administrators</CardDescription>
            </CardHeader>
            <CardContent className="relative z-10 w-full pb-6 space-y-4">
            {error && (
              <Alert variant="destructive" className="relative z-20">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleLogin} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1 relative z-20">Email</label>
                <input
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 relative z-20 bg-white"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1 relative z-20">Password</label>
                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 relative z-20 bg-white"
                  required
                  disabled={isLoading}
                />
              </div>

              <Button type="submit" className="h-11 w-full bg-slate-900 text-white hover:bg-slate-800 relative z-20" size="lg" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Enter as Admin"
                )}
              </Button>
            </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
