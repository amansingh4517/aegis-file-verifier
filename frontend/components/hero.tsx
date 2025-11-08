"use client"

import { useState } from "react"
import { ArrowRight, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FileUploadModal } from "./file-upload-modal"

export function Hero() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <section className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-background overflow-hidden relative">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: 'url(/fake-certificate-bg.jpg)',
            opacity: 0.15
          }}
        />
        
        {/* Gradient Overlay for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/70 to-background/80" />
        
        {/* Animated blurred circles */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-20 right-10 w-72 h-72 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-72 h-72 bg-secondary rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex justify-center mb-8">
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-muted text-sm"
            >
              <Shield size={16} className="text-primary" />
              <span className="text-foreground">Google Gemini Powered Verification</span>
            </div>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-center text-balance mb-8 leading-tight">
            <span className="text-muted-foreground dark:text-foreground">Verify Any Digital File in</span> <span className="text-primary">Seconds</span>
          </h1>

          <p className="text-xl sm:text-2xl text-muted-foreground text-center text-balance mb-12 max-w-3xl mx-auto">
            AEGIS uses Google Gemini AI to detect deepfakes, validate documents, and ensure authenticity. Trust your digital
            files with confidence.
          </p>

          <div className="flex justify-center">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 glow-accent-sm text-white transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer animate-gentle-bounce"
              onClick={() => setIsModalOpen(true)}
            >
              Start Verifying
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </div>
        </div>
      </section>

      <FileUploadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
