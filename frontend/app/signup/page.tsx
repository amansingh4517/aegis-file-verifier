import { SignUpForm } from "@/components/auth/signup-form"
import Link from "next/link"

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-block text-2xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent mb-4"
          >
            AEGIS
          </Link>
          <h1 className="text-3xl font-bold mb-2">Create Your Account</h1>
          <p className="text-foreground/60">Join AEGIS and start verifying files instantly</p>
        </div>

        <SignUpForm />

        <p className="text-center text-foreground/60 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-accent hover:text-accent/80 font-semibold transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
