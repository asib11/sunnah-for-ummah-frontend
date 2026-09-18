"use client"

import { useEffect, useRef } from "react"
import { usePathname, useSearchParams } from "next/navigation"

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL?.replace(/\/$/, "") ?? ""
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ?? ""

function getOrCreateSessionId(): string {
  try {
    let id = sessionStorage.getItem("sfu_session_id")
    if (!id) {
      id = crypto.randomUUID()
      sessionStorage.setItem("sfu_session_id", id)
    }
    return id
  } catch {
    return "unknown"
  }
}

export function usePageTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  // Track last sent path to avoid duplicate fires on re-renders
  const lastSent = useRef<string>("")

  useEffect(() => {
    const fullPath = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "")

    if (lastSent.current === fullPath) return
    lastSent.current = fullPath

    const sessionId = getOrCreateSessionId()

    fetch(`${BACKEND_URL}/store/analytics/track`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-publishable-api-key": PUBLISHABLE_KEY,
      },
      body: JSON.stringify({
        event_type: "page_view",
        path: fullPath,
        session_id: sessionId,
        referrer: document.referrer || null,
      }),
      // fire-and-forget — don't block navigation
    }).catch(() => {/* silently ignore network errors */})
  }, [pathname, searchParams])
}
