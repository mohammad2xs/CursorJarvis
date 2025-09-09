"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"

function setDarkClass(enabled: boolean) {
  const root = document.documentElement
  root.classList.toggle("dark", enabled)
}

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // hydrate from storage or media query
    try {
      const stored = localStorage.getItem("theme")
      const preferDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      const dark = stored ? stored === "dark" : preferDark
      setIsDark(dark)
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    try {
      setDarkClass(isDark)
      localStorage.setItem("theme", isDark ? "dark" : "light")
    } catch {
      // ignore
    }
  }, [isDark])

  return (
    <Button
      variant="outline"
      size="icon"
      className="fixed right-4 top-4 z-50"
      aria-label="Toggle dark mode"
      onClick={() => setIsDark((v) => !v)}
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  )
}

