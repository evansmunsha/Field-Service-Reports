"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"

interface MonthSelectorProps {
  year: number
  month: number
  onMonthChange: (year: number, month: number) => void
}

export function MonthSelector({ year, month, onMonthChange }: MonthSelectorProps) {
  const handlePrevious = () => {
    if (month === 1) {
      onMonthChange(year - 1, 12)
    } else {
      onMonthChange(year, month - 1)
    }
  }

  const handleNext = () => {
    if (month === 12) {
      onMonthChange(year + 1, 1)
    } else {
      onMonthChange(year, month + 1)
    }
  }

  const handleToday = () => {
    const now = new Date()
    onMonthChange(now.getFullYear(), now.getMonth() + 1)
  }

  const currentDate = new Date(year, month - 1)
  const isCurrentMonth = year === new Date().getFullYear() && month === new Date().getMonth() + 1

  return (
    <div className="flex items-center justify-between">
      <Button variant="outline" size="icon" onClick={handlePrevious}>
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="flex items-center gap-3">
        <h2 className="text-base font-bold">{format(currentDate, "MMMM yyyy")}</h2>
        {!isCurrentMonth && (
          <Button variant="outline" size="sm" onClick={handleToday}>
            Today
          </Button>
        )}
      </div>

      <Button variant="outline" size="icon" onClick={handleNext}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
