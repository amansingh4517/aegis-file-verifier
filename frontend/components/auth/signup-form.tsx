"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export function SignUpForm() {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulated signup
    setTimeout(() => {
      setIsLoading(false)
      if (step === 1) {
        setStep(2)
      } else {
        window.location.href = "/dashboard"
      }
    }, 1000)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-8 backdrop-blur space-y-6">
      {step === 1 ? (
        <>
          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <Input type="text" placeholder="John Doe" className="bg-input border-border/50" required />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input type="email" placeholder="you@example.com" className="bg-input border-border/50" required />
          </div>
        </>
      ) : (
        <>
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <Input type="password" placeholder="••••••••" className="bg-input border-border/50" required />
            <p className="text-xs text-foreground/50 mt-2">At least 8 characters recommended</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Confirm Password</label>
            <Input type="password" placeholder="••••••••" className="bg-input border-border/50" required />
          </div>
        </>
      )}

      <div className="flex items-center gap-2">
        <div className={`h-1 flex-1 rounded-full transition-all ${step >= 1 ? "bg-accent" : "bg-border"}`} />
        <div className={`h-1 flex-1 rounded-full transition-all ${step >= 2 ? "bg-accent" : "bg-border"}`} />
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold glow-accent"
      >
        {isLoading ? "Processing..." : step === 1 ? "Continue" : "Create Account"}
      </Button>

      <p className="text-xs text-foreground/50 text-center">
        By signing up, you agree to our Terms of Service and Privacy Policy
      </p>
    </form>
  )
}
