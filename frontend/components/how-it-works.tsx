import { Upload, Zap, Shield } from "lucide-react"

export function HowItWorks() {
  const steps = [
    {
      icon: Upload,
      title: "Upload File",
      description: "Upload any digital file - images, videos, documents, or audio.",
    },
    {
      icon: Zap,
      title: "AI Analysis",
      description: "Our advanced AI algorithms analyze the file for authenticity signals.",
    },
    {
      icon: Shield,
      title: "Get Results",
      description: "Receive detailed verification results with confidence scores.",
    },
  ]

  return (
    <section id="how-it-works" className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-balance mb-4">How It Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to verify any digital file
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={index} className="relative">
                <div className="bg-card border border-border rounded-lg p-8">
                  {/* Updated icon box background to use #e1e1ea color */}
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-light-accent mb-4 glow-accent-sm">
                    <Icon size={24} className="text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>

                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <div className="text-primary text-2xl">→</div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
