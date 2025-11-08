"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { ChevronDown, BookOpen, AlertCircle, Zap } from "lucide-react"
import { useState } from "react"

export default function HelpPage() {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null)

  const faqs = [
    {
      question: "How do I verify a file?",
      answer:
        "Simply click the 'Upload File' button on your dashboard, select the file category, and drag or click to upload your file. Our system will analyze it and provide a verification report within seconds.",
    },
    {
      question: "What file types are supported?",
      answer:
        "AEGIS supports Documents (PDF, DOCX, XLSX), Images (JPG, PNG, GIF), Videos (MP4, MOV, AVI), and Audio files (MP3, WAV, FLAC) for verification.",
    },
    {
      question: "How accurate is the verification?",
      answer:
        "Our Google Gemini powered verification system achieves 94.2% accuracy rate on average. Confidence scores are provided for each verification to indicate the reliability of the result.",
    },
    {
      question: "How long does verification take?",
      answer:
        "Most files are verified within 2-3 seconds. The time may vary depending on file size and complexity. Larger files may take a bit longer.",
    },
    {
      question: "What does 'Authentic' mean?",
      answer:
        "An 'Authentic' status indicates that the file passes our verification checks and appears to be genuine. The confidence score shows how certain we are about this assessment.",
    },
    {
      question: "Can I download my verification reports?",
      answer:
        "Yes! You can download individual reports by clicking 'View Report' on each file, or export all reports from the History page.",
    },
  ]

  const resources = [
    {
      icon: BookOpen,
      title: "Documentation",
      description: "Read our comprehensive guides and tutorials",
      link: "#",
    },
    {
      icon: Zap,
      title: "Quick Start Guide",
      description: "Get started with AEGIS in just 5 minutes",
      link: "#",
    },
    {
      icon: AlertCircle,
      title: "Troubleshooting",
      description: "Common issues and their solutions",
      link: "#",
    },
  ]

  return (
    <DashboardLayout>
      <div className="max-w-4xl space-y-12">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Help & Support</h2>
          <p className="text-muted-foreground">Find answers to common questions and get support</p>
        </div>

        {/* Resources */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resources.map((resource, index) => {
            const Icon = resource.icon
            return (
              <a
                key={index}
                href={resource.link}
                className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{resource.title}</h3>
                    <p className="text-sm text-muted-foreground">{resource.description}</p>
                  </div>
                </div>
              </a>
            )
          })}
        </div>

        {/* FAQ */}
        <div>
          <h3 className="text-2xl font-bold text-foreground mb-6">Frequently Asked Questions</h3>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-card border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 hover:bg-background/50 transition text-left"
                >
                  <span className="font-semibold text-foreground">{faq.question}</span>
                  <ChevronDown
                    size={20}
                    className={`text-primary transition-transform ${expandedFAQ === index ? "rotate-180" : ""}`}
                  />
                </button>

                {expandedFAQ === index && (
                  <div className="px-6 pb-6 border-t border-border">
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
