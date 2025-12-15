"use client"

import { Suspense } from "react"
import HomeContent from "./home-content"

export default function HomePage() {
  return (
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading user...</div>}>
        <HomeContent />
      </Suspense>
  )
}
