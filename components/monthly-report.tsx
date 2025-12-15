"use client"

import { format } from "date-fns"
import { Download, FileText, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface Study {
  id: string
  participant: string
}

interface Entry {
  id: string
  date: Date
  timeStarted: Date
  timeEnded: Date
  hoursWorked: number
  studies: Study[]
  comments?: string | null
}

interface MonthlyReportProps {
  year: number
  month: number
  totalHours: number
  studiesCount: number
  participated: boolean
  entries: Entry[]
  userName: string
}

export function MonthlyReport({
  year,
  month,
  totalHours,
  studiesCount,
  participated,
  entries,
  userName,
}: MonthlyReportProps) {
  const monthName = format(new Date(year, month - 1), "MMMM yyyy")

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    const reportContent = generateReportText()
    const blob = new Blob([reportContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `field-service-report-${year}-${month.toString().padStart(2, "0")}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const generateReportText = () => {
    let text = `FIELD SERVICE REPORT\n`
    text += `${"=".repeat(50)}\n\n`
    text += `Name: ${userName}\n`
    text += `Month: ${monthName}\n\n`
    text += `${"=".repeat(50)}\n\n`
    text += `SUMMARY\n`
    text += `${"-".repeat(50)}\n`
    text += `Total Hours: ${totalHours}\n`
    text += `Bible Studies Conducted: ${studiesCount}\n`
    text += `Participated in Ministry: ${participated ? "Yes" : "No"}\n\n`
    text += `${"=".repeat(50)}\n\n`
    text += `DETAILED ENTRIES\n`
    text += `${"-".repeat(50)}\n\n`

    entries.forEach((entry, index) => {
      text += `Entry ${index + 1}\n`
      text += `Date: ${format(new Date(entry.date), "EEEE, MMMM d, yyyy")}\n`
      text += `Time: ${format(new Date(entry.timeStarted), "h:mm a")} - ${format(new Date(entry.timeEnded), "h:mm a")}\n`
      text += `Hours: ${entry.hoursWorked.toFixed(1)}\n`

      if (entry.studies.length > 0) {
        text += `Studies: ${entry.studies.map((s) => s.participant).join(", ")}\n`
      }

      if (entry.comments) {
        text += `Comments: ${entry.comments}\n`
      }

      text += `\n`
    })

    text += `${"=".repeat(50)}\n`
    text += `Generated on ${format(new Date(), "PPP 'at' p")}\n`

    return text
  }

  return (
    <div className="space-y-6">
      <Card className="border-border/40 print:border-0 print:shadow-none">
        <CardHeader className="print:pb-4">
          <div className="flex flex-col gap-3 lg:flex-row items-center lg:justify-center">
            {/* Left block */}
            <div className="text-center">
              <CardTitle className="text-base">
                Field Service Report
              </CardTitle>
              <CardDescription className="text-sm mt-1">
                {monthName}
              </CardDescription>

              {/* Buttons */}
              <div className="flex gap-2 print:hidden mt-4">
                <Button variant="outline" size="sm" onClick={handlePrint}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>

                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>

            
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Report Info */}
          <div className="space-y-0">
            <div className="flex items-center justify-between py-2">
              <span className="font-medium">Name:</span>
              <span className="text-muted-foreground">{userName}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between py-2">
              <span className="font-medium">Month:</span>
              <span className="text-muted-foreground">{monthName}</span>
            </div>
            <Separator />
          </div>


          {/* Summary Section */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Summary
            </h3>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Total Hours</p>
                <p className="text-3xl font-bold">{totalHours}</p>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Bible Studies</p>
                <p className="text-3xl font-bold">{studiesCount}</p>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Participated</p>
                <p className="text-2xl font-bold mt-1">{participated ? "Yes" : "No"}</p>
              </div>
            </div>

            {/* Checkbox Section */}
            <div className="border-2 border-border rounded-lg p-4 mt-6">
              <div className="flex items-start gap-3">
                <div className="h-5 w-5 border-2 border-foreground rounded mt-0.5 flex items-center justify-center">
                  {participated && <div className="h-3 w-3 bg-foreground rounded-sm" />}
                </div>
                <p className="text-sm">I shared in any form of the ministry during the month</p>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Detailed Entries */}
          <div className="space-y-3">
            <h3 className="text-base font-medium text-foreground">
              Detailed Entries
            </h3>

            {entries.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                No entries recorded for this month
              </p>
            ) : (
              <div className="space-y-3">
                {entries.map((entry) => (
                  <div
                    key={entry.id}
                    className="rounded-lg border border-border px-4 py-3"
                  >
                    {/* Top row */}
                    <div className="flex items-start justify-between">
                      <div className="space-y-0.5">
                        <p className="text-sm font-medium">
                          {format(new Date(entry.date), "EEEE, MMM d")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(entry.timeStarted), "h:mm a")} –{" "}
                          {format(new Date(entry.timeEnded), "h:mm a")}
                        </p>
                      </div>

                      <p className="text-sm font-semibold">
                        {entry.hoursWorked.toFixed(1)} hrs
                      </p>
                    </div>

                    {/* Studies */}
                    {entry.studies.length > 0 && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">
                          Bible studies:
                        </span>{" "}
                        {entry.studies.map((s) => s.participant).join(", ")}
                      </p>
                    )}

                    {/* Comments */}
                    {entry.comments && (
                      <p className="mt-1 text-xs text-muted-foreground italic">
                        {entry.comments}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>


          {/* Footer */}
          <div className="mt-8 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              Report generated on {format(new Date(), "PPP 'at' p")}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
