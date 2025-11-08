'use client'

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="w-9 h-9"
      >
        <Sun className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="w-9 h-9 transition-all duration-300 hover:bg-accent/10"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-transform duration-500 ease-in-out" />
      ) : (
        <Moon className="h-4 w-4 rotate-0 scale-100 transition-transform duration-500 ease-in-out" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
