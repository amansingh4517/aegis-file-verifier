import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { FeaturesDetail } from "@/components/features-detail"

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <FeaturesDetail />
      <Footer />
    </main>
  )
}
