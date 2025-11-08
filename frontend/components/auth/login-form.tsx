"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulated login
    setTimeout(() => {
      setIsLoading(false)
      // Redirect to dashboard
      window.location.href = "/dashboard"
    }, 1000)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-8 backdrop-blur space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Email</label>
        <Input type="email" placeholder="you@example.com" className="bg-input border-border/50" required />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Password</label>
        <Input type="password" placeholder="••••••••" className="bg-input border-border/50" required />
      </div>

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" className="rounded" />
          <span className="text-foreground/70">Remember me</span>
        </label>
        <a href="#" className="text-accent hover:text-accent/80">
          Forgot password?
        </a>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold glow-accent"
      >
        {isLoading ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  )
}
