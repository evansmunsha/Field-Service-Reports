"use client"

import { useState, useEffect } from "react"
import { TimeEntryForm } from "@/components/time-entry-form"
import { MonthlyStats } from "@/components/monthly-stats"
import { EntryList } from "@/components/entry-list"
import { MonthSelector } from "@/components/month-selector"
import { MonthlyReport } from "@/components/monthly-report"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { getMonthlyReport } from "@/app/actions/entries"
import { Loader2 } from "lucide-react"
import { UserButton, useUser } from "@stackframe/stack"

export default function HomeContent() {
  const user = useUser()
  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [report, setReport] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    const loadReport = async () => {
      setLoading(true)
      try {
        const data = await getMonthlyReport(year, month)
        setReport(data)
      } catch (error) {
        console.error("Failed to load report:", error)
      } finally {
        setLoading(false)
      }
    }

    loadReport()
  }, [user, year, month])

  const handleMonthChange = (newYear: number, newMonth: number) => {
    setYear(newYear)
    setMonth(newMonth)
  }

  const refreshReport = async () => {
    if (!user) return
    const data = await getMonthlyReport(year, month)
    setReport(data)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="container max-w-md mx-auto px-4 py-8 text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">Field Service Report</h1>
            <p className="text-muted-foreground">Track your ministry time and activities</p>
          </div>
          <div className="bg-card rounded-lg border p-6 space-y-4">
            <p className="text-sm text-muted-foreground">Sign in to access your personal field service records</p>
            <Button asChild className="w-full" size="lg">
              <a href="/handler/sign-in">Sign In</a>
            </Button>
            <p className="text-xs text-muted-foreground">
              Don&apos;t have an account?{" "}
              <a href="/handler/sign-up" className="text-primary hover:underline">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    )
  }

  const userName = user.displayName || user.primaryEmail || "User"

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-1 py-4 space-y-4">
        {/* Header with user info */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">Field Service Report</h1>
            <p className="flex items-center gap-2 text-muted-foreground">
              <span
                className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/70"
                style={{
                  animation: "note-wiggle 2.5s ease-in-out infinite",
                }}
              >
                For
              </span>

              <span className="h-4 w-px bg-border" />

              <span className="text-sm font-medium text-foreground">
                {userName}
              </span>
            </p>
          </div>
          <UserButton />
        </div>

        {/* Month Selector */}
        <MonthSelector year={year} month={month} onMonthChange={handleMonthChange} />

        {/* Stats */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : report ? (
          <MonthlyStats
            totalHours={report.totalHours}
            studiesCount={report.studiesCount}
            participated={report.participated}
          />
        ) : null}

        {/* Tabs */}
        <Tabs defaultValue="log" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="log">Log Time</TabsTrigger>
            <TabsTrigger value="entries">View Entries</TabsTrigger>
            <TabsTrigger value="report">Report</TabsTrigger>
          </TabsList>

          <TabsContent value="log" className="space-y-4">
            <TimeEntryForm onSuccess={refreshReport} />
          </TabsContent>

          <TabsContent value="entries" className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : report ? (
              <EntryList entries={report.entries} onDelete={refreshReport} />
            ) : null}
          </TabsContent>

          <TabsContent value="report" className="space-y-2">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : report ? (
              <MonthlyReport
                year={year}
                month={month}
                totalHours={report.totalHours}
                studiesCount={report.studiesCount}
                participated={report.participated}
                entries={report.entries}
                userName={userName}
              />
            ) : null}
          </TabsContent>
        </Tabs>
      </div>
            {/* Footer */}
      <footer className="pt-6 pb-4 text-center">
        <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
          <a href="/about" className="hover:underline">
            About
          </a>
          <span className="opacity-40">•</span>
          <a href="/privacy" className="hover:underline">
            Privacy
          </a>
          <span className="opacity-40">•</span>
          <a href="/terms" className="hover:underline">
            Terms
          </a>
        </div>

        <p className="mt-2 text-[11px] text-muted-foreground/70">
          Built by Evans Munsha · Free & open for public use
        </p>
      </footer>

    </div>
  )
}
