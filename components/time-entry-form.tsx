// componets/time-entry-form.tsx
"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon, Clock, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { createTimeEntry } from "@/app/actions/entries"

const formSchema = z.object({
  date: z.date(),
  timeStarted: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  timeEnded: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  participated: z.boolean(),
  comments: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

export function TimeEntryForm({ onSuccess }: { onSuccess?: () => void }) {
  const [studies, setStudies] = useState<string[]>([])
  const [newStudy, setNewStudy] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      participated: false,
    },
  })

  const selectedDate = watch("date")

  const addStudy = () => {
    if (newStudy.trim()) {
      setStudies([...studies, newStudy.trim()])
      setNewStudy("")
    }
  }

  const removeStudy = (index: number) => {
    setStudies(studies.filter((_, i) => i !== index))
  }

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    setMessage(null)
    try {
      const [startHour, startMinute] = data.timeStarted.split(":").map(Number)
      const [endHour, endMinute] = data.timeEnded.split(":").map(Number)

      const timeStarted = new Date(data.date)
      timeStarted.setHours(startHour, startMinute, 0, 0)

      const timeEnded = new Date(data.date)
      timeEnded.setHours(endHour, endMinute, 0, 0)

      if (timeEnded <= timeStarted) {
        setMessage({ type: "error", text: "End time must be after start time" })
        setIsSubmitting(false)
        return
      }

      await createTimeEntry({
        date: data.date,
        timeStarted,
        timeEnded,
        studies,
        participated: data.participated,
        comments: data.comments,
      })

      setMessage({ type: "success", text: "Time entry added successfully!" })
      reset()
      setStudies([])
      onSuccess?.()
    } catch (error) {
      setMessage({ type: "error", text: "Failed to add time entry" })
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="border-border/40">
      <CardHeader>
        <div className="text-center">
          <CardTitle className="text-2xl">Log Field Service</CardTitle>
        <CardDescription>Record your ministry time and activities</CardDescription>
        </div>
        
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          {message && (
            <div
              className={cn(
                "p-3 rounded-md text-sm",
                message.type === "success"
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-destructive/10 text-destructive",
              )}
            >
              {message.text}
            </div>
          )}

          {/* Date Picker */}
          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !selectedDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setValue("date", date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.date && <p className="text-sm text-destructive">{errors.date.message}</p>}
          </div>

          {/* Time Inputs */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label htmlFor="timeStarted">Time Started</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="timeStarted" type="time" className="pl-9 text-sm" {...register("timeStarted")} />
              </div>
              {errors.timeStarted && <p className="text-sm text-destructive">{errors.timeStarted.message}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="timeEnded">Time Ended</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="timeEnded" type="time" className="pl-9 text-sm" {...register("timeEnded")} />
              </div>
              {errors.timeEnded && <p className="text-sm text-destructive">{errors.timeEnded.message}</p>}
            </div>
          </div>

          {/* Bible Studies */}
          <div className="space-y-2">
            <Label>Bible Studies Conducted</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Enter participant name"
                value={newStudy}
                onChange={(e) => setNewStudy(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addStudy()
                  }
                }}
              />
              <Button type="button" onClick={addStudy} size="icon" variant="secondary">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {studies.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {studies.map((study, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-secondary text-secondary-foreground px-3 py-1.5 rounded-full text-sm"
                  >
                    {study}
                    <button type="button" onClick={() => removeStudy(index)} className="hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Participated Checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox id="participated" onCheckedChange={(checked) => setValue("participated", checked as boolean)} />
            <Label htmlFor="participated" className="text-sm font-normal cursor-pointer">
              I shared in any form of ministry this month
            </Label>
          </div>

          {/* Comments */}
          <div className="space-y-2">
            <Label htmlFor="comments">Comments (Optional)</Label>
            <Textarea
              id="comments"
              placeholder="Add any notes about your service..."
              {...register("comments")}
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Add Entry"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
