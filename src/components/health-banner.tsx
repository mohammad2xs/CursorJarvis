"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

type Health = {
  ok: boolean
  version: string
  db: boolean
  envs: Record<string, boolean>
}

export function HealthBanner() {
  const [health, setHealth] = useState<Health | null>(null)

  useEffect(() => {
    let mounted = true
    fetch("/api/health")
      .then((r) => r.json())
      .then((j) => mounted && setHealth(j))
      .catch(() => mounted && setHealth({ ok: false, version: "", db: false, envs: {} as Record<string, boolean> }))
    return () => {
      mounted = false
    }
  }, [])

  if (!health) return null
  if (health.ok && health.db) return null

  const missing = Object.entries(health.envs || {})
    .filter(([, v]) => !v)
    .map(([k]) => k)

  return (
    <div className={cn("w-full text-sm", health.db ? "bg-amber-50 text-amber-900" : "bg-red-50 text-red-900")}
      style={{ borderBottom: "1px solid", borderColor: health.db ? "#fbbf24" : "#f87171" }}
    >
      <div className="mx-auto max-w-screen-2xl p-2 flex items-center justify-between">
        <div>
          <strong>Degraded mode</strong>: {health.db ? "DB reachable, but some envs missing." : "DB not reachable."}
          {missing.length > 0 && (
            <span className="ml-2">Missing envs: {missing.join(", ")}</span>
          )}
        </div>
        {health.version && <span>v{health.version}</span>}
      </div>
    </div>
  )
}
