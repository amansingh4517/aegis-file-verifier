"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Link from "next/link"
import { Mail, Lock, Loader2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AegisLogo } from "./aegis-logo"
import { authAPI } from "@/lib/api"
import { toast } from "sonner"

export function SignInForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [successMessage, setSuccessMessage] = useState("")
  const [apiError, setApiError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    setApiError("")

    try {
      const response = await authAPI.login({
        email: formData.email,
        password: formData.password,
      })

      setSuccessMessage("Sign in successful! Redirecting to dashboard...")
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push("/dashboard")
      }, 1000)
    } catch (error: any) {
      console.error('Login error:', error)
      setApiError(error.message || "Invalid email or password. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    toast.info("Google OAuth coming soon!", {
      description: "For now, please use email/password sign in. Google authentication will be available in the next update."
    })
  }

  const handleGitHubLogin = () => {
    toast.info("GitHub OAuth coming soon!", {
      description: "For now, please use email/password sign in. GitHub authentication will be available in the next update."
    })
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <AegisLogo className="w-16 h-16" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Welcome Back</h1>
        <p className="text-muted-foreground">Sign in to your AEGIS account</p>
      </div>

      {successMessage && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-400 flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {successMessage}
        </div>
      )}

      {apiError && (
        <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive flex items-start gap-3">
          <AlertTriangle className="flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="font-medium">Sign In Failed</p>
            <p className="text-sm mt-1">{apiError}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full pl-10 pr-4 py-2.5 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
          </div>
          {errors.email && <p className="text-destructive text-sm mt-1.5">{errors.email}</p>}
        </div>

        {/* Password field */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="password" className="block text-sm font-medium text-foreground">
              Password
            </label>
            <Link href="/auth/forgot-password" className="text-xs text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-2.5 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
          </div>
          {errors.password && <p className="text-destructive text-sm mt-1.5">{errors.password}</p>}
        </div>

        {/* Remember me checkbox */}
        <div className="flex items-center">
          <input type="checkbox" id="remember" className="w-4 h-4 rounded border-border bg-input accent-primary" />
          <label htmlFor="remember" className="ml-2 text-sm text-muted-foreground">
            Remember me
          </label>
        </div>

        {/* Submit button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary hover:bg-primary/90 glow-accent h-11 font-semibold"
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="mr-2 animate-spin" />
              Signing In...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>

      {/* Sign Up link */}
      <div className="text-center">
        <p className="text-muted-foreground">
          Don't have an account?{" "}
          <Link href="/auth/sign-up" className="text-primary hover:underline font-medium">
            Create one
          </Link>
        </p>
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-background text-muted-foreground">Or continue with</span>
        </div>
      </div>

      {/* OAuth buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button 
          variant="outline" 
          className="h-11 bg-transparent"
          type="button"
          onClick={handleGoogleLogin}
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Google
        </Button>
        <Button 
          variant="outline" 
          className="h-11 bg-transparent"
          type="button"
          onClick={handleGitHubLogin}
        >
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          GitHub
        </Button>
      </div>
    </div>
  )
}
