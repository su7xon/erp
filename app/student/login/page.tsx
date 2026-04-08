import Link from "next/link"
import { ArrowLeft, GraduationCap, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface StudentLoginPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

function asSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

export default async function StudentLoginPage({ searchParams }: StudentLoginPageProps) {
  const params = (await searchParams) || {}
  const error = asSingleValue(params.error)
  const applicationNumber = asSingleValue(params.applicationNumber) || ""
  const mobileLast4 = asSingleValue(params.mobileLast4) || ""

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
            <span className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">
              <ShieldCheck className="h-3.5 w-3.5" />
              Student Verification Access
            </span>
            <h1 className="hero-gradient-text text-4xl font-bold leading-tight md:text-5xl">
              Student Dashboard Login
            </h1>
            <p className="max-w-xl text-base text-slate-600 md:text-lg">
              Enter application number and mobile last 4 digits to continue to your admit card dashboard.
            </p>
            <ul className="max-w-xl space-y-2 list-disc list-inside text-base text-slate-600 md:text-lg">
              <li><span className="font-semibold text-slate-900">Admit Card Ready:</span> Download and print directly from your portal.</li>
              <li><span className="font-semibold text-slate-900">Center Selection:</span> Select and update your preferred center instantly.</li>
            </ul>
          </section>

          <Card className="glass-surface fade-slide-up fade-delay-1 w-full border-slate-200/70 shadow-2xl">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-fit rounded-full bg-sky-100 p-3 text-sky-700">
                <GraduationCap className="h-8 w-8" />
              </div>
              <CardTitle className="text-2xl">Student Portal</CardTitle>
              <CardDescription>Secure sign-in for exam details and admit card access</CardDescription>
            </CardHeader>
            <CardContent className="relative z-10 w-full pb-6">
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{decodeURIComponent(error)}</AlertDescription>
                </Alert>
              )}

              <form action="/api/auth/student/form" method="post" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="applicationNumber">Application Number</Label>
                  <Input
                    id="applicationNumber"
                    name="applicationNumber"
                    type="text"
                    defaultValue={applicationNumber}
                    placeholder="Example: APP001"
                    required
                    className="h-11 border-slate-300 bg-white relative z-20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mobileLast4">Mobile Last 4 Digits</Label>
                  <Input
                    id="mobileLast4"
                    name="mobileLast4"
                    type="text"
                    inputMode="numeric"
                    maxLength={4}
                    defaultValue={mobileLast4}
                    placeholder="Example: 6655"
                    pattern="[0-9]{4}"
                    required
                    className="h-11 border-slate-300 bg-white relative z-20"
                  />
                </div>

                <Button type="submit" className="h-11 w-full bg-slate-900 text-white hover:bg-slate-800 relative z-20" size="lg">
                  Enter as Student
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
