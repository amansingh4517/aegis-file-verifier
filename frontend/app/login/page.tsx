import { LoginForm } from "@/components/auth/login-form"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-block text-2xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent mb-4"
          >
            AEGIS
          </Link>
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-foreground/60">Sign in to access your verification dashboard</p>
        </div>

        <LoginForm />

        <p className="text-center text-foreground/60 mt-6">
          Don't have an account?{" "}
          <Link href="/signup" className="text-accent hover:text-accent/80 font-semibold transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
