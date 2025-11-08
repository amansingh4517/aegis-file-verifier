import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { HowItWorksDetail } from "@/components/how-it-works-detail"

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HowItWorksDetail />
      <Footer />
    </main>
  )
}
