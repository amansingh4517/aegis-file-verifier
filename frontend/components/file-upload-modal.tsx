"use client"

import type React from "react"

import { useState } from "react"
import { Upload, X, Check, Loader2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { verificationAPI } from "@/lib/api"
import { useRouter } from "next/navigation"
import { VerificationReportModal } from "@/components/verification-report-modal"

interface FileCategory {
  id: string
  label: string
  description: string
  extensions: string[]
}

const FILE_CATEGORIES: FileCategory[] = [
  {
    id: "document",
    label: "Documents",
    description: "PDF, Word, Excel files",
    extensions: [".pdf", ".doc", ".docx", ".xls", ".xlsx"],
  },
  {
    id: "image",
    label: "Images",
    description: "JPG, PNG, GIF files",
    extensions: [".jpg", ".jpeg", ".png", ".gif", ".bmp"],
  },
  {
    id: "video",
    label: "Videos",
    description: "MP4, AVI, MOV files",
    extensions: [".mp4", ".avi", ".mov", ".mkv", ".wmv"],
  },
  {
    id: "audio",
    label: "Audio",
    description: "MP3, WAV, FLAC files",
    extensions: [".mp3", ".wav", ".flac", ".aac", ".m4a"],
  },
]

interface FileUploadModalProps {
  isOpen: boolean
  onClose: () => void
}

export function FileUploadModal({ isOpen, onClose }: FileUploadModalProps) {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadComplete, setUploadComplete] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadResults, setUploadResults] = useState<any[]>([])
  const [showReportModal, setShowReportModal] = useState(false)
  const [currentReport, setCurrentReport] = useState<any>(null)

  if (!isOpen && !showReportModal) return null

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setUploadedFiles([])
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      handleFiles(files)
    }
  }

  const handleFiles = (files: File[]) => {
    if (!selectedCategory) return

    const category = FILE_CATEGORIES.find((c) => c.id === selectedCategory)
    if (!category) return

    const validFiles = files.filter((file) => {
      const ext = "." + file.name.split(".").pop()?.toLowerCase()
      return category.extensions.includes(ext)
    })

    setUploadedFiles((prev) => [...prev, ...validFiles])
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (uploadedFiles.length === 0) return

    setIsUploading(true)
    setUploadError(null)
    const results: any[] = []

    try {
      // Upload files one by one
      for (const file of uploadedFiles) {
        try {
          const response = await verificationAPI.upload(file, false)
          results.push({
            file: file.name,
            success: true,
            data: response.data,
          })
        } catch (error: any) {
          results.push({
            file: file.name,
            success: false,
            error: error.message,
          })
        }
      }

      setUploadResults(results)
      
      // Check if all uploads were successful
      const allSuccess = results.every((r) => r.success)
      
      if (allSuccess) {
        // Show report modal immediately for the first (or only) file
        if (results.length > 0 && results[0].data.verification) {
          console.log('Opening report modal with data:', results[0].data.verification)
          setCurrentReport(results[0].data.verification)
          setShowReportModal(true)
          // Reset upload state but keep modal open until report is closed
          setUploadedFiles([])
          setSelectedCategory(null)
          setUploadResults([])
        } else {
          // Show success message briefly if no verification data
          console.log('No verification data received')
          setUploadComplete(true)
          setTimeout(() => {
            setUploadComplete(false)
            setUploadedFiles([])
            setSelectedCategory(null)
            setUploadResults([])
            onClose()
          }, 2000)
        }
      } else {
        // Don't set a generic error message - the individual file errors will be shown in the results
        // setUploadError('Some files failed to upload. Please try again.')
      }
    } catch (error: any) {
      console.error('Upload error:', error)
      setUploadError(error.message || 'Upload failed. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleCloseReport = () => {
    setShowReportModal(false)
    setCurrentReport(null)
    // Close the upload modal after report is closed
    onClose()
  }

  const selectedCategoryData = FILE_CATEGORIES.find((c) => c.id === selectedCategory)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-background">
          <h2 className="text-2xl font-bold text-foreground">Verify Your Files</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded-md transition-colors"
            aria-label="Close modal"
          >
            <X size={24} className="text-foreground" />
          </button>
        </div>

        <div className="p-6">
          {!selectedCategory ? (
            // Category Selection
            <div className="space-y-4">
              <p className="text-muted-foreground mb-6">Select a file category to get started</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {FILE_CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category.id)}
                    className="p-4 rounded-lg border-2 border-border hover:border-primary hover:bg-muted transition-all text-left"
                  >
                    <h3 className="font-semibold text-foreground mb-1">{category.label}</h3>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : uploadComplete ? (
            // Upload Complete State
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Check size={32} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Upload Successful!</h3>
              <p className="text-muted-foreground text-center mb-6">
                Your files are being verified. Check your dashboard for results.
              </p>
            </div>
          ) : (
            // File Upload
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">{selectedCategoryData?.label} Files</h3>
                <button onClick={() => handleCategorySelect("")} className="text-sm text-primary hover:underline">
                  Change category
                </button>
              </div>

              {/* Drag and Drop Area */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragging ? "border-primary bg-muted" : "border-border hover:border-primary hover:bg-muted/50"
                }`}
              >
                <Upload size={32} className="mx-auto mb-4 text-primary" />
                <p className="text-foreground font-medium mb-2">Drag and drop your files here</p>
                <p className="text-muted-foreground text-sm mb-4">or</p>
                <label className="inline-block">
                  <span className="bg-primary text-white px-4 py-2 rounded-md cursor-pointer hover:bg-primary/90 transition-colors">
                    Choose Files
                  </span>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileInput}
                    accept={selectedCategoryData?.extensions.join(",")}
                    className="hidden"
                  />
                </label>
                <p className="text-muted-foreground text-xs mt-4">
                  Supported: {selectedCategoryData?.extensions.join(", ")}
                </p>
              </div>

              {/* Uploaded Files List */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium text-foreground">
                    {uploadedFiles.length} file{uploadedFiles.length !== 1 ? "s" : ""} selected
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-md">
                        <span className="text-sm text-foreground truncate">{file.name}</span>
                        <button
                          onClick={() => removeFile(index)}
                          className="p-1 hover:bg-border rounded transition-colors"
                          aria-label="Remove file"
                        >
                          <X size={16} className="text-muted-foreground" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Error Message */}
              {uploadError && (
                <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 flex items-start gap-3">
                  <AlertTriangle className="text-destructive mt-0.5 flex-shrink-0" size={20} />
                  <div>
                    <p className="text-destructive font-medium">Upload Error</p>
                    <p className="text-destructive/80 text-sm mt-1">{uploadError}</p>
                  </div>
                </div>
              )}

              {/* Upload Results */}
              {uploadResults.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">Upload Results:</h4>
                  {uploadResults.map((result, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-md flex items-center gap-2 ${
                        result.success ? 'bg-accent/10 border border-accent/30' : 'bg-destructive/10 border border-destructive/30'
                      }`}
                    >
                      {result.success ? (
                        <Check size={16} className="text-accent flex-shrink-0" />
                      ) : (
                        <AlertTriangle size={16} className="text-destructive flex-shrink-0" />
                      )}
                      <span className="text-sm truncate">{result.file}</span>
                      {!result.success && (
                        <span className="text-xs text-destructive ml-auto">{result.error}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="flex-1 border-border text-foreground hover:bg-muted bg-transparent"
                  disabled={isUploading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={uploadedFiles.length === 0 || isUploading}
                  className="flex-1 bg-primary hover:bg-primary/90 text-white"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify Files"
                  )}
                </Button>
              </div>
            </div>
          )}
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
