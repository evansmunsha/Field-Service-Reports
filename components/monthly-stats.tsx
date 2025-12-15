import { Clock, BookOpen, CheckCircle2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface MonthlyStatsProps {
  totalHours: number
  studiesCount: number
  participated: boolean
}

export function MonthlyStats({ totalHours, studiesCount, participated }: MonthlyStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card className="border-border/40">
        <CardContent className="pt-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Hours</p>
              <p className="text-3xl font-bold mt-2">{totalHours}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Clock className="h-6 w-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/40">
        <CardContent className="pt-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Bible Studies</p>
              <p className="text-3xl font-bold mt-2">{studiesCount}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-accent-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/40">
        <CardContent className="pt-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Participated</p>
              <p className="text-lg font-semibold mt-2">{participated ? "Yes" : "No"}</p>
            </div>
            <div
              className={`h-12 w-12 rounded-full flex items-center justify-center ${
                participated ? "bg-green-500/10" : "bg-muted"
              }`}
            >
              <CheckCircle2
                className={`h-6 w-6 ${participated ? "text-green-600 dark:text-green-500" : "text-muted-foreground"}`}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
