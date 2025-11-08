import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function CTA() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-background border border-border rounded-lg p-12 md:p-16 text-center">
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-balance mb-4 text-foreground">Ready to Verify?</h2>
            <p className="text-lg text-muted-foreground text-balance mb-8 max-w-2xl mx-auto">
              Join thousands of organizations that trust AEGIS for digital file verification
            </p>
            <Link href="/auth/sign-up">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white glow-accent">
                Start Free Trial
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
