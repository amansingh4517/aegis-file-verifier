import { SignInForm } from "@/components/sign-in-form"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <SignInForm />
        </div>
      </div>
      <Footer />
    </main>
  )
}
