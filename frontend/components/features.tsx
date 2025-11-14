import { Brain, Zap, Lock, BarChart3, Clock, FileCheck } from "lucide-react"

export function Features() {
  const features = [
    {
      icon: Brain,
      title: "Advanced AI Detection",
      description: "Powered by Google Gemini AI to detect authentic and manipulated content with 95%+ accuracy.",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Get verification results in seconds, not hours.",
    },
    {
      icon: Lock,
      title: "Enterprise Security",
      description: "Your files are encrypted and processed securely with zero storage.",
    },
    {
      icon: BarChart3,
      title: "Detailed Analytics",
      description: "Get detailed reasoning and explanations for every verification result, so you know exactly why content is authentic or suspicious.",
    },
    {
      icon: Clock,
      title: "Real-time Monitoring",
      description: "Batch process multiple files simultaneously for efficiency.",
    },
    {
      icon: FileCheck,
      title: "Multiple Formats",
      description: "Support for images, videos, documents, and audio files.",
    },
  ]

  return (
    <section id="features" className="py-24 bg-card/30 border-t border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-balance mb-4">Powerful Features</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need for comprehensive digital verification
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="bg-background border border-border rounded-lg p-8 hover:border-primary/50 transition"
              >
                {/* Updated icon box background to use #e1e1ea color */}
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-light-accent mb-4 glow-accent-sm">
                  <Icon size={24} className="text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
