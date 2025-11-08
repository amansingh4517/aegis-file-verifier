"use client"

import type React from "react"

import { useState } from "react"
import { Upload, File, X, Loader2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { verificationAPI } from "@/lib/api"
import { VerificationReportModal } from "@/components/verification-report-modal"

export function UploadInterface() {
  const [files, setFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [showReportModal, setShowReportModal] = useState(false)
  const [currentReport, setCurrentReport] = useState<any>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(e.type === "dragenter" || e.type === "dragover")
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFiles = Array.from(e.dataTransfer.files)
    setFiles((prev) => [...prev, ...droppedFiles])
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)])
    }
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const handleVerify = async () => {
    if (files.length === 0) return

    setIsUploading(true)
    setUploadError(null)

    try {
      // Upload the first file (you can modify to handle multiple files)
      const response = await verificationAPI.upload(files[0], false)
      
      console.log('Verification response:', response)
      
      // Show the report modal with verification results
      if (response.data.verification) {
        console.log('Setting report:', response.data.verification)
        setCurrentReport(response.data.verification)
        setShowReportModal(true)
        setFiles([]) // Clear files after successful upload
      } else {
        console.error('No verification data in response')
      }
    } catch (error: any) {
      console.error('Upload error:', error)
      setUploadError(error.message || 'Verification failed. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleCloseReport = () => {
    setShowReportModal(false)
    setCurrentReport(null)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Upload File</h2>
        <p className="text-muted-foreground">Drag and drop your files or click to browse</p>
      </div>

      {/* Upload area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-12 text-center transition ${
          isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
        }`}
      >
        <Upload size={48} className="mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-xl font-semibold text-foreground mb-2">Drag files here or click to select</h3>
        <p className="text-muted-foreground mb-6">Supports images, videos, audio, and documents up to 500MB</p>
        <label>
          <input
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*,video/*,audio/*,.pdf,.docx"
          />
          <Button variant="outline" asChild>
            <span>Browse Files</span>
          </Button>
        </label>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Selected Files ({files.length})</h3>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-card border border-border rounded-lg p-4"
              >
                <div className="flex items-center gap-3">
                  <File size={20} className="text-primary" />
                  <div>
                    <p className="font-medium text-foreground">{file.name}</p>
                    <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <button onClick={() => removeFile(index)} className="p-2 hover:bg-destructive/10 rounded-lg transition">
                  <X size={20} className="text-muted-foreground hover:text-destructive" />
                </button>
              </div>
            ))}
          </div>

          {/* Error message */}
          {uploadError && (
            <div className="bg-destructive/20 text-destructive border border-destructive/50 rounded-lg p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Upload Error</p>
                <p className="text-sm mt-1">{uploadError}</p>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              className="flex-1 bg-primary hover:bg-primary/90 glow-accent h-11" 
              disabled={files.length === 0 || isUploading}
              onClick={handleVerify}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify File"
              )}
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 h-11 bg-transparent" 
              onClick={() => setFiles([])}
              disabled={isUploading}
            >
              Clear All
            </Button>
          </div>
        </div>
      )}

      {/* File type info */}
      <div className="bg-card/50 border border-border rounded-lg p-6">
        <h3 className="font-semibold text-foreground mb-4">Supported File Types</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-foreground mb-2">Images</p>
            <p className="text-sm text-muted-foreground">PNG, JPG, WebP, GIF, BMP</p>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground mb-2">Videos</p>
            <p className="text-sm text-muted-foreground">MP4, MOV, WebM, AVI, FLV</p>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground mb-2">Audio</p>
            <p className="text-sm text-muted-foreground">MP3, WAV, FLAC, AAC, OGG</p>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground mb-2">Documents</p>
            <p className="text-sm text-muted-foreground">PDF, DOCX, XLSX, PPTX</p>
          </div>
        </div>
      </div>

      {/* Verification Report Modal */}
      <VerificationReportModal 
        isOpen={showReportModal} 
        onClose={handleCloseReport} 
        report={currentReport} 
      />
    </div>
  )
}
