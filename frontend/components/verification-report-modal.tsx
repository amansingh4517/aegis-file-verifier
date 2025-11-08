"use client"

import { X, CheckCircle, AlertTriangle, XCircle, Download, Shield, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRef, useState, useEffect } from "react"

interface VerificationReport {
  fileName: string
  fileSize: number
  fileType: string
  verificationResult: {
    isAuthentic: boolean
    confidenceScore: number
    riskLevel: string
    detectedIssues: Array<{
      type: string
      severity: string
      description: string
      location?: string
    }>
    analysis: string
    recommendations?: string[]
    metadata?: {
      fileType?: string
      estimatedCreationMethod?: string
      possibleManipulations?: string[]
      technicalDetails?: any
    }
  }
  createdAt: string
  processingTime?: number
}

interface VerificationReportModalProps {
  isOpen: boolean
  onClose: () => void
  report: VerificationReport | null
}

export function VerificationReportModal({ isOpen, onClose, report }: VerificationReportModalProps) {
  // All hooks must be called before any conditional returns
  const reportRef = useRef<HTMLDivElement>(null)
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null)
  
  useEffect(() => {
    console.log('Modal state changed:', { isOpen, hasReport: !!report })
  }, [isOpen, report])
  
  // Now safe to return early
  if (!isOpen || !report) return null

  const { verificationResult } = report
  const isAuthentic = verificationResult?.isAuthentic
  const confidenceScore = verificationResult?.confidenceScore || 0
  const riskLevel = verificationResult?.riskLevel || "unknown"

  const Tooltip = ({ id, text }: { id: string; text: string }) => (
    <span className="relative inline-block ml-1">
      <button
        type="button"
        onMouseEnter={() => setActiveTooltip(id)}
        onMouseLeave={() => setActiveTooltip(null)}
        className="text-muted-foreground hover:text-primary transition-colors"
        aria-label="Help"
      >
        <HelpCircle size={14} />
      </button>
      {activeTooltip === id && (
        <span className="fixed z-[100] w-64 p-3 bg-popover border border-border rounded-lg shadow-xl text-xs text-popover-foreground whitespace-normal" style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          maxWidth: '90vw'
        }}>
          {text}
        </span>
      )}
    </span>
  )

  const handleDownloadReport = async () => {
    if (!reportRef.current) {
      alert('Report content not found. Please try again.')
      return
    }

    try {
      // Create a new window with the report content
      const printWindow = window.open('', '_blank')
      if (!printWindow) {
        alert('Please allow pop-ups to download the report.')
        return
      }

      const reportHTML = reportRef.current.innerHTML
      const styles = Array.from(document.styleSheets)
        .map(styleSheet => {
          try {
            return Array.from(styleSheet.cssRules)
              .map(rule => rule.cssText)
              .join('\n')
          } catch {
            return ''
          }
        })
        .join('\n')

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Verification Report - ${report.fileName}</title>
            <style>
              ${styles}
              body {
                margin: 20px;
                background: #0a0a0a;
                color: #ffffff;
                font-family: system-ui, -apple-system, sans-serif;
              }
              @media print {
                body { margin: 0; }
              }
            </style>
          </head>
          <body>
            <div style="max-width: 800px; margin: 0 auto;">
              ${reportHTML}
            </div>
            <script>
              window.onload = function() {
                setTimeout(function() {
                  window.print()
                  setTimeout(function() {
                    window.close()
                  }, 100)
                }, 500)
              }
            </script>
          </body>
        </html>
      `)
      printWindow.document.close()
    } catch (error) {
      console.error('Error generating report:', error)
      alert('Failed to generate PDF. Please try again.')
    }
  }

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "low":
        return "text-green-400 bg-green-500/20"
      case "medium":
        return "text-yellow-400 bg-yellow-500/20"
      case "high":
        return "text-orange-400 bg-orange-500/20"
      case "critical":
        return "text-red-400 bg-red-500/20"
      default:
        return "text-gray-400 bg-gray-500/20"
    }
  }

  const getStatusIcon = () => {
    if (isAuthentic && riskLevel === "low") {
      return <CheckCircle className="text-green-400" size={48} />
    } else if (riskLevel === "high" || riskLevel === "critical") {
      return <XCircle className="text-red-400" size={48} />
    } else {
      return <AlertTriangle className="text-yellow-400" size={48} />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-background border border-border rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-background border-b border-border p-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <Shield className="text-primary" size={28} />
            <h2 className="text-2xl font-bold text-foreground">Verification Report</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-md transition-colors"
            aria-label="Close modal"
          >
            <X size={24} className="text-foreground" />
          </button>
        </div>

        <div ref={reportRef} className="p-6 space-y-6">
          {/* Status Overview */}
          <div className="flex flex-col items-center text-center py-6 bg-muted/50 rounded-lg border border-border">
            <div className="mb-4">{getStatusIcon()}</div>
            <h3 className="text-2xl font-bold text-foreground mb-2">
              {isAuthentic ? "File Appears Authentic" : "Issues Detected"}
            </h3>
            <p className="text-muted-foreground max-w-md">
              {isAuthentic
                ? "This file has passed our authenticity verification checks."
                : "We've detected potential issues with this file that require attention."}
            </p>
            {!isAuthentic && verificationResult?.detectedIssues && verificationResult.detectedIssues.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                {Array.from(new Set(verificationResult.detectedIssues.map(issue => issue.type))).slice(0, 3).map((type, index) => {
                  const getCategoryIcon = (category: string) => {
                    const lower = category.toLowerCase()
                    if (lower.includes('ai-generated') || lower.includes('ai generated')) return '🤖 AI-Generated'
                    if (lower.includes('deepfake')) return '🎭 Deepfake'
                    if (lower.includes('voice') || lower.includes('audio')) return '🎤 Voice/Audio Issue'
                    if (lower.includes('metadata')) return '📋 Metadata Manipulation'
                    if (lower.includes('pixel') || lower.includes('image')) return '🖼️ Visual Manipulation'
                    if (lower.includes('compression')) return '📦 Compression Artifact'
                    if (lower.includes('forgery') || lower.includes('manipulation')) return '✂️ Forgery Detected'
                    if (lower.includes('text')) return '📝 Text Manipulation'
                    return '⚠️ ' + type.replace(/-/g, ' ')
                  }
                  
                  return (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full bg-destructive/20 text-destructive text-sm font-medium border border-destructive/30"
                    >
                      {getCategoryIcon(type)}
                    </span>
                  )
                })}
              </div>
            )}
          </div>

          {/* File Information */}
          <div className="bg-card border border-border rounded-lg p-4">
            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Shield size={18} />
              File Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">File Name:</span>
                <p className="text-foreground font-medium">{report.fileName}</p>
              </div>
              <div>
                <span className="text-muted-foreground">File Size:</span>
                <p className="text-foreground font-medium">{formatFileSize(report.fileSize)}</p>
              </div>
              <div>
                <span className="text-muted-foreground">File Type:</span>
                <p className="text-foreground font-medium">{report.fileType || "Unknown"}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Verified:</span>
                <p className="text-foreground font-medium">{formatDate(report.createdAt)}</p>
              </div>
              {report.processingTime && (
                <div>
                  <span className="text-muted-foreground">Processing Time:</span>
                  <p className="text-foreground font-medium">{(report.processingTime / 1000).toFixed(2)}s</p>
                </div>
              )}
            </div>
          </div>

          {/* Verification Results */}
          <div className="bg-card border border-border rounded-lg p-4">
            <h4 className="font-semibold text-foreground mb-3">Verification Results</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg border border-border">
                <p className="text-muted-foreground text-sm mb-1 flex items-center justify-center">
                  Confidence Score
                  <Tooltip 
                    id="confidence" 
                    text="How certain the system is about its verdict. High confidence (80-100%) means very sure. Medium (50-79%) means somewhat certain. Low (0-49%) means uncertain and requires manual review." 
                  />
                </p>
                <p className="text-3xl font-bold text-foreground">{confidenceScore}%</p>
                <div className="w-full bg-muted rounded-full h-2 mt-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      confidenceScore >= 80
                        ? "bg-green-500"
                        : confidenceScore >= 60
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    }`}
                    style={{ width: `${confidenceScore}%` }}
                  />
                </div>
              </div>

              <div className="text-center p-4 bg-muted/50 rounded-lg border border-border">
                <p className="text-muted-foreground text-sm mb-1 flex items-center justify-center">
                  Risk Level
                  <Tooltip 
                    id="risk" 
                    text="The severity of potential issues found. LOW = Safe to use. MEDIUM = Minor concerns, review recommended. HIGH = Serious issues detected. CRITICAL = Severe problems, do not trust this file." 
                  />
                </p>
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${getRiskColor(riskLevel)}`}>
                  {riskLevel.toUpperCase()}
                </span>
              </div>

              <div className="text-center p-4 bg-muted/50 rounded-lg border border-border">
                <p className="text-muted-foreground text-sm mb-1 flex items-center justify-center">
                  Status
                  <Tooltip 
                    id="status" 
                    text="The final verdict. AUTHENTIC = File passed verification checks and appears genuine. SUSPICIOUS = Issues detected, file may be manipulated, AI-generated, or forged." 
                  />
                </p>
                <span
                  className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
                    isAuthentic ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {isAuthentic ? "AUTHENTIC" : "SUSPICIOUS"}
                </span>
              </div>
            </div>
          </div>

          {/* Detected Issues */}
          {verificationResult?.detectedIssues && verificationResult.detectedIssues.length > 0 && (
            <div className="bg-card border border-border rounded-lg p-4">
              {/* Heading */}
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <AlertTriangle size={18} />
                Detected Issues ({verificationResult.detectedIssues.length})
              </h4>
              
              {/* Category Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {Array.from(new Set(verificationResult.detectedIssues.map(issue => issue.type))).map((type, index) => {
                  const issueCount = verificationResult.detectedIssues.filter(i => i.type === type).length
                  const highestSeverity = verificationResult.detectedIssues
                    .filter(i => i.type === type)
                    .reduce((max, issue) => {
                      const severityOrder = { low: 1, medium: 2, high: 3, critical: 4 }
                      return severityOrder[issue.severity as keyof typeof severityOrder] > severityOrder[max as keyof typeof severityOrder] ? issue.severity : max
                    }, 'low')
                  
                  const getCategoryIcon = (category: string) => {
                    const lower = category.toLowerCase()
                    if (lower.includes('ai-generated') || lower.includes('ai generated')) return '🤖'
                    if (lower.includes('deepfake')) return '🎭'
                    if (lower.includes('voice') || lower.includes('audio')) return '🎤'
                    if (lower.includes('metadata')) return '📋'
                    if (lower.includes('pixel') || lower.includes('image')) return '🖼️'
                    if (lower.includes('compression')) return '📦'
                    if (lower.includes('forgery') || lower.includes('manipulation')) return '✂️'
                    if (lower.includes('text')) return '📝'
                    return '⚠️'
                  }

                  const getCategoryColor = (severity: string) => {
                    switch (severity) {
                      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30'
                      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                    }
                  }

                  return (
                    <div
                      key={index}
                      className={`px-3 py-2 rounded-lg border text-sm font-medium flex items-center gap-2 ${getCategoryColor(highestSeverity)}`}
                    >
                      <span className="text-lg">{getCategoryIcon(type)}</span>
                      <span className="capitalize">{type.replace(/-/g, ' ')}</span>
                      {issueCount > 1 && (
                        <span className="ml-1 px-1.5 py-0.5 rounded-full bg-background/30 text-xs">
                          {issueCount}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Issue Details */}
              <div className="space-y-3">
                {verificationResult.detectedIssues.map((issue, index) => (
                  <div key={index} className="bg-muted/50 rounded-lg p-3 border border-border">
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-medium text-foreground">{issue.type}</span>
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold ${
                          issue.severity === "critical"
                            ? "bg-red-500/20 text-red-400"
                            : issue.severity === "high"
                              ? "bg-orange-500/20 text-orange-400"
                              : issue.severity === "medium"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-blue-500/20 text-blue-400"
                        }`}
                      >
                        {issue.severity.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{issue.description}</p>
                    {issue.location && (
                      <p className="text-xs text-muted-foreground mt-1">
                        <strong>Location:</strong> {issue.location}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Analysis */}
          {verificationResult?.analysis && (
            <div className="bg-card border border-border rounded-lg p-4">
              <h4 className="font-semibold text-foreground mb-3">Detailed Analysis</h4>
              <div className="text-sm space-y-3">
                {verificationResult.analysis.split('\n').map((paragraph, index) => {
                  if (!paragraph.trim()) return null;
                  
                  // Check if it's a numbered point (e.g., "1. **Title:**")
                  const numberedMatch = paragraph.match(/^(\d+)\.\s+\*\*(.+?):\*\*(.+)$/);
                  if (numberedMatch) {
                    return (
                      <div key={index} className="border-l-2 border-primary/30 pl-4 py-2 bg-muted/20">
                        <div className="flex items-start gap-2">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                            {numberedMatch[1]}
                          </span>
                          <div className="flex-1">
                            <span className="font-semibold text-foreground">{numberedMatch[2]}:</span>
                            <span className="text-muted-foreground ml-1">{numberedMatch[3]}</span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  
                  // Highlight **bold** text
                  const parts = paragraph.split(/(\*\*.+?\*\*)/g);
                  return (
                    <p key={index} className="text-muted-foreground leading-relaxed">
                      {parts.map((part, i) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                          return (
                            <span key={i} className="font-semibold text-foreground">
                              {part.slice(2, -2)}
                            </span>
                          );
                        }
                        return <span key={i}>{part}</span>;
                      })}
                    </p>
                  );
                })}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {verificationResult?.recommendations && verificationResult.recommendations.length > 0 && (
            <div className="bg-card border border-border rounded-lg p-4">
              <h4 className="font-semibold text-foreground mb-3">Recommendations</h4>
              <ul className="space-y-2">
                {verificationResult.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-primary mt-1">•</span>
                    <span className="text-muted-foreground">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Metadata */}
          {verificationResult?.metadata && (
            <div className="bg-card border border-border rounded-lg p-4">
              <h4 className="font-semibold text-foreground mb-3">Technical Details</h4>
              <div className="space-y-2 text-sm">
                {verificationResult.metadata.estimatedCreationMethod && (
                  <div>
                    <span className="text-muted-foreground">Creation Method:</span>
                    <p className="text-foreground">{verificationResult.metadata.estimatedCreationMethod}</p>
                  </div>
                )}
                {verificationResult.metadata.possibleManipulations &&
                  verificationResult.metadata.possibleManipulations.length > 0 && (
                    <div>
                      <span className="text-muted-foreground">Possible Manipulations:</span>
                      <ul className="list-disc list-inside text-foreground">
                        {verificationResult.metadata.possibleManipulations.map((manip, index) => (
                          <li key={index}>{manip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
            <Button onClick={handleDownloadReport} className="bg-primary hover:bg-primary/90">
              <Download size={18} className="mr-2" />
              Download Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
