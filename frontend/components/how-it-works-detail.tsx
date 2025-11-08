import { Brain, Microscope, BarChart3, CheckCircle2, AlertCircle, Zap } from "lucide-react"

export function HowItWorksDetail() {
  const steps = [
    {
      number: "01",
      icon: Zap,
      title: "File Upload & Processing",
      description:
        "Upload your digital file to AEGIS. Our system immediately begins preprocessing the file, extracting key data points and metadata. All uploads are encrypted and processed in isolated environments.",
      details: [
        "Supports images, videos, audio, and documents",
        "Files are processed in secure, isolated containers",
        "Automatic format detection and normalization",
      ],
    },
    {
      number: "02",
      icon: Brain,
      title: "AI Model Analysis",
      description:
        "Our advanced deep learning models analyze the file across multiple dimensions. These models are trained on millions of authentic and manipulated samples to detect subtle signs of tampering.",
      details: [
        "Multi-model ensemble for accuracy",
        "Pixel-level analysis for image manipulation",
        "Audio fingerprinting and spectrum analysis",
        "Video frame consistency checking",
      ],
    },
    {
      number: "03",
      icon: Microscope,
      title: "Forensic Deep Dive",
      description:
        "AEGIS performs forensic-level analysis including metadata examination, compression artifacts detection, and consistency checks across all file components.",
      details: [
        "EXIF and metadata analysis",
        "Compression artifact detection",
        "Temporal consistency verification",
        "Machine learning artifact identification",
      ],
    },
    {
      number: "04",
      icon: BarChart3,
      title: "Score Calculation",
      description:
        "All analysis results are synthesized into a comprehensive confidence score. Our proprietary algorithm weighs different indicators based on their reliability and correlation.",
      details: [
        "Confidence score 0-100",
        "Category-specific indicators",
        "Risk factor breakdown",
        "Historical comparison data",
      ],
    },
    {
      number: "05",
      icon: CheckCircle2,
      title: "Report Generation",
      description:
        "A detailed report is generated with findings, visualizations, and recommendations. Export to PDF or integrate directly with your systems via API.",
      details: [
        "Interactive findings dashboard",
        "PDF export with legal formatting",
        "API integration ready",
        "Custom branding options",
      ],
    },
  ]

  const accuracy = [
    { name: "Image Detection", accuracy: "97.8%" },
    { name: "Video Detection", accuracy: "96.2%" },
    { name: "Audio Detection", accuracy: "94.5%" },
    { name: "Document Detection", accuracy: "98.1%" },
  ]

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-balance mb-4">Our Verification Process</h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover how AEGIS uses Google Gemini AI and forensic analysis to verify digital files with industry-leading
            accuracy
          </p>
        </div>

        {/* Step-by-step process */}
        <div className="space-y-12 mb-24">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={index} className="relative">
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="absolute left-6 top-24 w-0.5 h-32 bg-gradient-to-b from-primary/50 to-primary/0 md:block hidden"></div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                  {/* Number and icon */}
                  <div className="md:col-span-2 flex flex-col items-center">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border-2 border-primary glow-accent-sm mb-4 relative z-10">
                      <Icon size={32} className="text-primary" />
                    </div>
                    <span className="text-4xl font-bold text-primary/30">{step.number}</span>
                  </div>

                  {/* Content */}
                  <div className="md:col-span-10 bg-card border border-border rounded-lg p-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">{step.title}</h2>
                    <p className="text-muted-foreground mb-6 text-lg">{step.description}</p>
                    <ul className="space-y-2">
                      {step.details.map((detail, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle2 size={20} className="text-accent flex-shrink-0 mt-0.5" />
                          <span className="text-foreground">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Accuracy metrics */}
        <div className="mb-24">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-12 text-center">
            Proven Accuracy Across All File Types
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {accuracy.map((item, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-lg p-8 text-center hover:border-primary/50 transition"
              >
                <div className="text-4xl font-bold text-primary mb-2">{item.accuracy}</div>
                <p className="text-muted-foreground">{item.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How our AI learns */}
        <div className="bg-card/50 border border-border rounded-lg p-12 mb-24">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-8">Continuously Learning AI</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Training Data</h3>
              <p className="text-muted-foreground">
                Our models are trained on millions of authentic and manipulated files across all media types, ensuring
                comprehensive detection capabilities.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Active Learning</h3>
              <p className="text-muted-foreground">
                The system continuously learns from new verification requests and user feedback to stay ahead of
                emerging manipulation techniques.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Regular Updates</h3>
              <p className="text-muted-foreground">
                Models are updated weekly with new patterns and techniques to maintain industry-leading detection
                accuracy.
              </p>
            </div>
          </div>
        </div>

        {/* Key features */}
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-12 text-center">Why AEGIS is Different</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border border-border rounded-lg p-8 hover:border-primary/50 transition">
              <AlertCircle size={32} className="text-accent mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-3">No False Positives</h3>
              <p className="text-muted-foreground">
                Our ensemble approach minimizes false positives through cross-validation and confidence thresholds.
              </p>
            </div>
            <div className="border border-border rounded-lg p-8 hover:border-primary/50 transition">
              <Brain size={32} className="text-accent mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-3">Explainable AI</h3>
              <p className="text-muted-foreground">
                Every detection includes detailed explanations of what was found and why it's considered suspicious.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
