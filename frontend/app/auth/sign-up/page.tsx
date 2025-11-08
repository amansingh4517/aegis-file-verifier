import { SignUpForm } from "@/components/sign-up-form"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function SignUpPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <SignUpForm />
        </div>
      </div>
      <Footer />
    </main>
  )
}
