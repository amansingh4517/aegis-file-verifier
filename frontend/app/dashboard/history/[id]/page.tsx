"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { verificationAPI } from "@/lib/api"
import { Loader2, ArrowLeft, Download, Shield, CheckCircle, AlertTriangle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function VerificationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const reportRef = useRef<HTMLDivElement>(null)
  const [verification, setVerification] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (params.id) {
      fetchVerification()
    }
  }, [params.id])

  const fetchVerification = async () => {
    try {
      setLoading(true)
      setError("")
      const response = await verificationAPI.getVerification(params.id as string)
      setVerification(response.data.verification)
    } catch (err: any) {
      console.error("Error fetching verification:", err)
      setError(err.message || "Failed to load verification details")
    } finally {
      setLoading(false)
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

  const handleDownloadReport = async () => {
    if (!verification || !reportRef.current) {
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
            <title>Verification Report - ${verification.originalName}</title>
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
                .print-hide { display: none !important; }
                .page-break-before { page-break-before: always; }
              }
              @page {
                margin: 20mm;
              }
            </style>
          </head>
          <body>
            <div style="max-width: 900px; margin: 0 auto;">
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
      alert('Failed to generate report. Please try again.')
    }
  }

  const getRiskColor = (level: string) => {
    switch (level?.toLowerCase()) {
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
    if (!verification?.verificationResult) return null
    const { isAuthentic, riskLevel } = verification.verificationResult

    if (isAuthentic && riskLevel === "low") {
      return <CheckCircle className="text-green-400" size={48} />
    } else if (riskLevel === "high" || riskLevel === "critical") {
      return <XCircle className="text-red-400" size={48} />
    } else {
      return <AlertTriangle className="text-yellow-400" size={48} />
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="animate-spin h-8 w-8 text-primary" />
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Button onClick={() => router.push("/dashboard/history")} variant="outline" className="mb-4">
            <ArrowLeft size={18} className="mr-2" />
            Back to History
          </Button>
          <div className="bg-destructive/20 text-destructive border border-destructive/50 rounded-lg p-4">
            <p>{error}</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!verification) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Button onClick={() => router.push("/dashboard/history")} variant="outline" className="mb-4">
            <ArrowLeft size={18} className="mr-2" />
            Back to History
          </Button>
          <div className="text-center text-muted-foreground p-8">Verification not found</div>
        </div>
      </DashboardLayout>
    )
  }

  const { verificationResult } = verification
  const isAuthentic = verificationResult?.isAuthentic
  const confidenceScore = verificationResult?.confidenceScore || 0
  const riskLevel = verificationResult?.riskLevel || "unknown"

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between print-hide">
          <Button onClick={() => router.push("/dashboard/history")} variant="outline">
            <ArrowLeft size={18} className="mr-2" />
            Back to History
          </Button>
          <Button onClick={handleDownloadReport} className="bg-primary hover:bg-primary/90">
            <Download size={18} className="mr-2" />
            Download Report
          </Button>
        </div>

        <div ref={reportRef}>
          {/* Page Title */}
          <div className="flex items-center gap-3">
            <Shield className="text-primary" size={32} />
            <h2 className="text-3xl font-bold text-foreground">Verification Report</h2>
          </div>

          {/* Status Overview */}
          <div className="flex flex-col items-center text-center py-8 bg-card border border-border rounded-lg">
            <div className="mb-4">{getStatusIcon()}</div>
            <h3 className="text-2xl font-bold text-foreground mb-2">
            {isAuthentic ? "File Appears Authentic" : "Issues Detected"}
          </h3>
          <p className="text-muted-foreground max-w-md">
            {isAuthentic
              ? "This file has passed our authenticity verification checks."
              : "We've detected potential issues with this file that require attention."}
          </p>
        </div>

        {/* File Information */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2 text-lg">
            <Shield size={20} />
            File Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-muted-foreground text-sm">File Name:</span>
              <p className="text-foreground font-medium">{verification.fileName}</p>
            </div>
            <div>
              <span className="text-muted-foreground text-sm">Original Name:</span>
              <p className="text-foreground font-medium">{verification.originalName}</p>
            </div>
            <div>
              <span className="text-muted-foreground text-sm">File Size:</span>
              <p className="text-foreground font-medium">{formatFileSize(verification.fileSize)}</p>
            </div>
            <div>
              <span className="text-muted-foreground text-sm">File Type:</span>
              <p className="text-foreground font-medium">{verification.fileType || verification.mimeType}</p>
            </div>
            <div>
              <span className="text-muted-foreground text-sm">Verified:</span>
              <p className="text-foreground font-medium">{formatDate(verification.createdAt)}</p>
            </div>
            {verification.processingTime && (
              <div>
                <span className="text-muted-foreground text-sm">Processing Time:</span>
                <p className="text-foreground font-medium">{(verification.processingTime / 1000).toFixed(2)}s</p>
              </div>
            )}
          </div>
        </div>

        {/* Verification Results */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h4 className="font-semibold text-foreground mb-4 text-lg">Verification Results</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-muted/50 rounded-lg border border-border">
              <p className="text-muted-foreground text-sm mb-2">Confidence Score</p>
              <p className="text-4xl font-bold text-foreground mb-3">{confidenceScore}%</p>
              <div className="w-full bg-muted rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${
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

            <div className="text-center p-6 bg-muted/50 rounded-lg border border-border">
              <p className="text-muted-foreground text-sm mb-2">Risk Level</p>
              <span className={`inline-block px-6 py-3 rounded-full text-base font-bold ${getRiskColor(riskLevel)}`}>
                {riskLevel.toUpperCase()}
              </span>
            </div>

            <div className="text-center p-6 bg-muted/50 rounded-lg border border-border">
              <p className="text-muted-foreground text-sm mb-2">Status</p>
              <span
                className={`inline-block px-6 py-3 rounded-full text-base font-bold ${
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
          <div className="bg-card border border-border rounded-lg p-6 page-break-before">
            <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2 text-lg">
              <AlertTriangle size={20} />
              Detected Issues ({verificationResult.detectedIssues.length})
            </h4>
            <div className="space-y-4">
              {verificationResult.detectedIssues.map((issue: any, index: number) => (
                <div key={index} className="bg-muted/50 rounded-lg p-4 border border-border">
                  <div className="flex items-start justify-between mb-2">
                    <span className="font-medium text-foreground text-base">{issue.type}</span>
                    <span
                      className={`px-3 py-1 rounded text-xs font-bold ${
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
                    <p className="text-xs text-muted-foreground mt-2">
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
          <div className="bg-card border border-border rounded-lg p-6">
            <h4 className="font-semibold text-foreground mb-4 text-lg">Detailed Analysis</h4>
            <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">{verificationResult.analysis}</p>
          </div>
        )}

        {/* Recommendations */}
        {verificationResult?.recommendations && verificationResult.recommendations.length > 0 && (
          <div className="bg-card border border-border rounded-lg p-6">
            <h4 className="font-semibold text-foreground mb-4 text-lg">Recommendations</h4>
            <ul className="space-y-3">
              {verificationResult.recommendations.map((rec: string, index: number) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-primary mt-1 text-lg">•</span>
                  <span className="text-muted-foreground">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Metadata */}
        {verificationResult?.metadata && (
          <div className="bg-card border border-border rounded-lg p-6">
            <h4 className="font-semibold text-foreground mb-4 text-lg">Technical Details</h4>
            <div className="space-y-3">
              {verificationResult.metadata.estimatedCreationMethod && (
                <div>
                  <span className="text-muted-foreground text-sm">Creation Method:</span>
                  <p className="text-foreground font-medium">{verificationResult.metadata.estimatedCreationMethod}</p>
                </div>
              )}
              {verificationResult.metadata.possibleManipulations &&
                verificationResult.metadata.possibleManipulations.length > 0 && (
                  <div>
                    <span className="text-muted-foreground text-sm">Possible Manipulations:</span>
                    <ul className="list-disc list-inside text-foreground mt-2 space-y-1">
                      {verificationResult.metadata.possibleManipulations.map((manip: string, index: number) => (
                        <li key={index}>{manip}</li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          </div>
        )}
        </div>
      </div>
    </DashboardLayout>
  )
}
