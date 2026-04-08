import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, GraduationCap, ShieldCheck } from "lucide-react"

export default function HomePage() {
  return (
    <main className="portal-shell min-h-screen flex flex-col">
      <header className="sticky top-0 z-20 border-b border-white/50 bg-white/70 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="rounded-xl bg-sky-100 p-2 text-sky-700">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-slate-900">Admit Card Management</h1>
            </div>
          </div>
          <p className="hidden rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs text-slate-600 md:block">
            Secure Access For Students And Admin Teams
          </p>
        </div>
      </header>

      <div className="container mx-auto flex flex-1 items-center px-4 py-8 md:py-14">
        <div className="w-full space-y-10">
          <section className="fade-slide-up grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-center">
            <div className="space-y-6">
              <h2 className="hero-gradient-text text-4xl font-bold leading-tight text-balance md:text-6xl">
                Run Admit Card Operations With Confidence
              </h2>
              <p className="max-w-2xl text-lg text-slate-600 text-pretty">
                A single portal for students and administrators to access admit cards, exam centers, and request workflows
                with a clean enterprise experience.
              </p>
              <div className="grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="glass-surface rounded-xl p-3">
                  <p className="text-2xl font-semibold text-slate-900">24x7</p>
                  <p className="text-xs text-slate-500">Student Self Access</p>
                </div>
                <div className="glass-surface rounded-xl p-3">
                  <p className="text-2xl font-semibold text-slate-900">Fast</p>
                  <p className="text-xs text-slate-500">Review Workflows</p>
                </div>
                <div className="glass-surface rounded-xl p-3">
                  <p className="text-2xl font-semibold text-slate-900">Secure</p>
                  <p className="text-xs text-slate-500">Role Based Access</p>
                </div>
              </div>
            </div>

            <Card className="glass-surface panel-hover fade-slide-up fade-delay-1 border-slate-200/80">
              <CardHeader>
                <CardTitle className="text-xl text-slate-900">Portal Highlights</CardTitle>
                <CardDescription>Built for exam operations teams and students.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600">
                <p className="rounded-lg border border-slate-200 bg-white px-3 py-2">Centralized admit card publishing and access.</p>
                <p className="rounded-lg border border-slate-200 bg-white px-3 py-2">Track and process center-change requests efficiently.</p>
                <p className="rounded-lg border border-slate-200 bg-white px-3 py-2">Structured dashboards for admin and student roles.</p>
              </CardContent>
            </Card>
          </section>

          <section className="grid gap-6 md:grid-cols-2">
            <Link href="/student/login" className="block group">
              <Card className="glass-surface panel-hover fade-slide-up fade-delay-2 h-full border-sky-200/70">
                <CardHeader className="pb-2">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="rounded-2xl bg-sky-100 p-3 text-sky-700">
                      <GraduationCap className="h-7 w-7" />
                    </div>
                    <ArrowRight className="h-5 w-5 text-slate-400 transition-transform group-hover:translate-x-1" />
                  </div>
                  <CardTitle className="text-2xl">Student Access</CardTitle>
                  <CardDescription>Admit card, center details and request tracking.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-sky-500" />Instant dashboard entry</li>
                    <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-sky-500" />One-click admit card view</li>
                    <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-sky-500" />Transparent status updates</li>
                  </ul>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/login" className="block group">
              <Card className="glass-surface panel-hover fade-slide-up fade-delay-3 h-full border-emerald-200/70">
                <CardHeader className="pb-2">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
                      <ShieldCheck className="h-7 w-7" />
                    </div>
                    <ArrowRight className="h-5 w-5 text-slate-400 transition-transform group-hover:translate-x-1" />
                  </div>
                  <CardTitle className="text-2xl">Admin Control</CardTitle>
                  <CardDescription>Student records, uploads and request approvals.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Upload and manage student data</li>
                    <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Review center-change pipeline</li>
                    <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Actionable operational dashboards</li>
                  </ul>
                </CardContent>
              </Card>
            </Link>
          </section>
        </div>
      </div>

      <footer className="border-t border-white/60 bg-white/70 py-6 backdrop-blur-xl">
        <div className="container mx-auto px-4 text-center text-sm text-slate-600">
          <p>Entrance Admit Card Portal | Built for reliable, high-volume exam operations</p>
        </div>
      </footer>
    </main>
  )
}
