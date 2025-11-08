"use client"

import { useState } from "react"

export function QuickUpload() {
  const [isDragging, setIsDragging] = useState(false)

  return (
    <div
      onDragOver={() => setIsDragging(true)}
      onDragLeave={() => setIsDragging(false)}
      className={`bg-card border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer ${
        isDragging ? "border-accent bg-accent/5" : "border-border/50"
      }`}
    >
      <div className="text-4xl mb-4">📤</div>
      <h3 className="text-2xl font-semibold mb-2">Upload File to Verify</h3>
      <p className="text-foreground/60 mb-6">Drag and drop your file here, or click to browse</p>
      <p className="text-sm text-foreground/50 mb-6">Supported: Images, Videos, Audio, Documents (up to 100MB)</p>
      <button className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-3 rounded-lg font-semibold transition-colors">
        Choose File
      </button>
    </div>
  )
}
