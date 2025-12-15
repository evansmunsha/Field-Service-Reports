// app/actions/entries.ts
"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/db"
import type { CurrentServerUser } from "@stackframe/stack"
import { stackServerApp } from "@/stack/server"

/* ---------------- AUTH ---------------- */

async function getCurrentUser(): Promise<CurrentServerUser> {
  const user = await stackServerApp.getUser()
  if (!user) {
    throw new Error("Not authenticated")
  }
  return user
}

/* ---------------- USER DB ---------------- */

async function ensureUserInDb(stackUser: CurrentServerUser) {
  return prisma.user.upsert({
    where: {
      stackAuthId: stackUser.id,
    },
    update: {
      email: stackUser.primaryEmail ?? undefined,
      name: stackUser.displayName ?? undefined,
    },
    create: {
      stackAuthId: stackUser.id,
      email: stackUser.primaryEmail,
      name: stackUser.displayName ?? null,
    },
  })
}

/* ---------------- CREATE ENTRY ---------------- */

export async function createTimeEntry(data: {
  date: Date
  timeStarted: Date
  timeEnded: Date
  studies: string[]
  participated: boolean
  comments?: string
}) {
  const stackUser = await getCurrentUser()
  const user = await ensureUserInDb(stackUser)

  const hoursWorked =
    (data.timeEnded.getTime() - data.timeStarted.getTime()) /
    (1000 * 60 * 60)

  const entry = await prisma.timeEntry.create({
    data: {
      userId: user.id,
      date: data.date,
      timeStarted: data.timeStarted,
      timeEnded: data.timeEnded,
      hoursWorked,
      participated: data.participated,
      comments: data.comments,
      studies: {
        create: data.studies.map((participant) => ({
          participant,
        })),
      },
    },
    include: {
      studies: true,
    },
  })

  revalidatePath("/")
  return entry
}

/* ---------------- READ ---------------- */

export async function getMonthlyEntries(year: number, month: number) {
  const stackUser = await getCurrentUser()
  const user = await ensureUserInDb(stackUser)

  const startDate = new Date(year, month - 1, 1)
  const endDate = new Date(year, month, 0, 23, 59, 59)

  return prisma.timeEntry.findMany({
    where: {
      userId: user.id,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      studies: true,
    },
    orderBy: {
      date: "asc",
    },
  })
}

/* ---------------- REPORT ---------------- */

export async function getMonthlyReport(year: number, month: number) {
  const entries = await getMonthlyEntries(year, month)

  const totalHours = entries.reduce(
    (sum, entry) => sum + entry.hoursWorked,
    0
  )

  const uniqueStudies = new Set(
    entries.flatMap((entry) =>
      entry.studies.map((s) => s.participant)
    )
  )

  return {
    totalHours: Math.round(totalHours * 10) / 10,
    studiesCount: uniqueStudies.size,
    participated: entries.some((entry) => entry.participated),
    entries,
  }
}

/* ---------------- DELETE ---------------- */

export async function deleteTimeEntry(entryId: string) {
  const stackUser = await getCurrentUser()
  const user = await ensureUserInDb(stackUser)

  const entry = await prisma.timeEntry.findUnique({
    where: { id: entryId },
  })

  if (!entry || entry.userId !== user.id) {
    throw new Error("Entry not found or not authorized")
  }

  await prisma.timeEntry.delete({
    where: { id: entryId },
  })

  revalidatePath("/")
}

/* ---------------- CURRENT USER ---------------- */

export async function getCurrentUserInfo() {
  const stackUser = await getCurrentUser()
  const user = await ensureUserInDb(stackUser)

  return {
    id: user.id,
    displayName:
      stackUser.displayName ??
      stackUser.primaryEmail ??
      "User",
  }
}
