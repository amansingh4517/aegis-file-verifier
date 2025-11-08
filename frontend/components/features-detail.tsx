"use client"

import { useState } from "react"
import {
  Brain,
  Lock,
  Zap,
  BarChart3,
  FileCheck,
  Clock,
  Globe,
  Users,
  Sliders,
  Smartphone,
  BookOpen,
  Award,
} from "lucide-react"

export function FeaturesDetail() {
  const [selectedCategory, setSelectedCategory] = useState("core")

  const categories = {
    core: {
      title: "Core Features",
      description: "Essential verification capabilities",
      features: [
        {
          icon: Brain,
          title: "Advanced AI Detection",
          description:
            "Multi-model ensemble using deep learning, computer vision, and signal processing to detect manipulation across all media types.",
        },
        {
          icon: FileCheck,
          title: "Multi-Format Support",
          description:
            "Verify images (PNG, JPG, WebP), videos (MP4, MOV), audio (MP3, WAV), and documents (PDF, DOCX) in one platform.",
        },
        {
          icon: Zap,
          title: "Lightning Speed",
          description:
            "Get verification results in seconds with our optimized processing pipeline and distributed computing infrastructure.",
        },
        {
          icon: BarChart3,
          title: "Detailed Analytics",
          description:
            "Comprehensive reports with visual breakdowns, confidence scores, and specific indicators of detected manipulations.",
        },
      ],
    },
    security: {
      title: "Security & Privacy",
      description: "Enterprise-grade protection",
      features: [
        {
          icon: Lock,
          title: "End-to-End Encryption",
          description:
            "All files are encrypted in transit and at rest. Your data is processed in isolated, secure containers.",
        },
        {
          icon: Globe,
          title: "Zero-Knowledge Architecture",
          description:
            "Files are never stored permanently. We process, analyze, and delete with no data retention policies.",
        },
        {
          icon: Award,
          title: "Compliance Certified",
          description:
            "SOC 2 Type II, GDPR, HIPAA, and ISO 27001 compliant. Enterprise security standards across all operations.",
        },
        {
          icon: Users,
          title: "Role-Based Access",
          description: "Fine-grained permissions and audit logs for every verification request and team member action.",
        },
      ],
    },
    enterprise: {
      title: "Enterprise Features",
      description: "Scale and integrate",
      features: [
        {
          icon: Clock,
          title: "Batch Processing",
          description:
            "Upload and verify hundreds of files simultaneously. Dedicated compute resources for high-volume operations.",
        },
        {
          icon: Sliders,
          title: "Custom Thresholds",
          description:
            "Adjust confidence thresholds and risk parameters based on your specific use case and risk tolerance.",
        },
        {
          icon: BookOpen,
          title: "API Integration",
          description: "RESTful API for seamless integration with your existing workflows and applications.",
        },
        {
          icon: Smartphone,
          title: "Webhook Support",
          description: "Real-time notifications for verification results with flexible webhook configurations.",
        },
      ],
    },
  }

  const categoryList = Object.entries(categories)

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-balance mb-4">
            Powerful Features for Every Use Case
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            AEGIS combines Google Gemini AI with enterprise-grade security to deliver the most comprehensive digital
            verification platform.
          </p>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {categoryList.map(([key, category]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`px-6 py-3 rounded-lg font-medium transition ${
                selectedCategory === key
                  ? "bg-primary text-primary-foreground glow-accent"
                  : "bg-card border border-border text-foreground hover:border-primary/50"
              }`}
            >
              {category.title}
            </button>
          ))}
        </div>

        {/* Selected category content */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
              {categories[selectedCategory as keyof typeof categories].title}
            </h2>
            <p className="text-lg text-muted-foreground">
              {categories[selectedCategory as keyof typeof categories].description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {categories[selectedCategory as keyof typeof categories].features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="bg-card border border-border rounded-lg p-8 hover:border-primary/50 hover:bg-card/80 transition"
                >
                  <div
                    className="flex items-center justify-center w-12 h-12 rounded-lg mb-4 glow-accent-sm"
                    style={{ backgroundColor: "#e1e1ea" }}
                  >
                    <Icon size={24} className="text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Use cases */}
        <div className="mb-24">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-foreground mb-12">Industry Use Cases</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Media & News",
                description: "Verify images and videos before publication to prevent misinformation.",
                examples: ["Image verification", "Video authenticity", "Deepfake detection"],
              },
              {
                title: "Legal & Compliance",
                description: "Ensure document authenticity for legal proceedings and compliance requirements.",
                examples: ["Document verification", "Signature validation", "Audit trails"],
              },
              {
                title: "Corporate Security",
                description: "Protect intellectual property and detect corporate espionage threats.",
                examples: ["Insider threat detection", "Data breach analysis", "Forensic investigation"],
              },
              {
                title: "Social Media",
                description: "Combat misinformation and maintain platform integrity at scale.",
                examples: ["Content moderation", "Bulk verification", "Real-time monitoring"],
              },
              {
                title: "Insurance & Claims",
                description: "Verify claims documentation and detect insurance fraud patterns.",
                examples: ["Claim validation", "Photo analysis", "Document integrity"],
              },
              {
                title: "Retail & E-commerce",
                description: "Authenticate product images and combat counterfeit listings.",
                examples: ["Product verification", "Listing authenticity", "Brand protection"],
              },
            ].map((useCase, index) => (
              <div
                key={index}
                className="border border-border rounded-lg p-8 hover:border-primary/50 transition"
                style={{ backgroundColor: "#e1e1ea" }}
              >
                <h3 className="text-xl font-semibold text-foreground mb-3">{useCase.title}</h3>
                <p className="text-muted-foreground mb-4">{useCase.description}</p>
                <ul className="space-y-2">
                  {useCase.examples.map((example, i) => (
                    <li key={i} className="text-sm text-foreground flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                      {example}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison table */}
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-foreground mb-12">
            AEGIS vs. Traditional Methods
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-4 font-semibold text-foreground">Aspect</th>
                  <th className="text-left py-4 px-4 font-semibold text-foreground">AEGIS</th>
                  <th className="text-left py-4 px-4 font-semibold text-foreground">Manual Review</th>
                  <th className="text-left py-4 px-4 font-semibold text-foreground">Other Tools</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { aspect: "Speed", aegis: "Seconds", manual: "Hours/Days", other: "Minutes" },
                  { aspect: "Accuracy", aegis: "97.8%+", manual: "Variable", other: "85-92%" },
                  { aspect: "Cost per File", aegis: "$0.05", manual: "$5-50", other: "$0.50-2" },
                  { aspect: "Scalability", aegis: "Unlimited", manual: "Limited", other: "Limited" },
                  { aspect: "Consistency", aegis: "100%", manual: "Variable", other: "80-90%" },
                ].map((row, index) => (
                  <tr key={index} className="border-b border-border hover:bg-card/30 transition">
                    <td className="py-4 px-4 font-medium text-foreground">{row.aspect}</td>
                    <td className="py-4 px-4 text-primary font-semibold">{row.aegis}</td>
                    <td className="py-4 px-4 text-muted-foreground">{row.manual}</td>
                    <td className="py-4 px-4 text-muted-foreground">{row.other}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
