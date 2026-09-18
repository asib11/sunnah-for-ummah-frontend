"use client"

import { Suspense } from "react"
import { usePageTracker } from "@/hooks/usePageTracker"

function TrackerInner() {
  usePageTracker()
  return null
}

export function PageTracker() {
  // useSearchParams requires Suspense boundary
  return (
    <Suspense fallback={null}>
      <TrackerInner />
    </Suspense>
  )
}
