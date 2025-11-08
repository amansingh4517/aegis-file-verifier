"use client"

import { Upload, FileCheck, Clock, BarChart3, AlertTriangle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState, useEffect } from "react"
import { FileUploadModal } from "./file-upload-modal"
import { VerificationReportModal } from "./verification-report-modal"
import { verificationAPI } from "@/lib/api"
import { useRouter } from "next/navigation"

interface Stats {
  total: number
  completed: number
  failed: number
  authentic: number
  suspicious: number
  riskLevels: Record<string, number>
}

interface RecentActivity {
  _id: string
  originalName: string
  status: string
  verificationResult?: {
    isAuthentic: boolean
    confidenceScore: number
    riskLevel: string
  }
  createdAt: string
}

export function DashboardOverview() {
  const router = useRouter()
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [currentReport, setCurrentReport] = useState<any>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [recentFiles, setRecentFiles] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch stats and recent activity
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        const [statsResponse, historyResponse] = await Promise.all([
          verificationAPI.getStats(),
          verificationAPI.getHistory({ page: 1, limit: 5 }),
        ])

        setStats(statsResponse.data.stats)
        setRecentFiles(statsResponse.data.recentActivity || [])
      } catch (err: any) {
        console.error('Error fetching dashboard data:', err)
        setError(err.message || 'Failed to load dashboard data')
        
        // If unauthorized, redirect to login
        if (err.message?.includes('authorized') || err.message?.includes('token')) {
          router.push('/login')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  // Refresh data when modal closes (after upload)
  const handleModalClose = async () => {
    setIsUploadModalOpen(false)
    // Refresh data
    try {
      const [statsResponse] = await Promise.all([
        verificationAPI.getStats(),
      ])
      setStats(statsResponse.data.stats)
      setRecentFiles(statsResponse.data.recentActivity || [])
    } catch (err) {
      console.error('Error refreshing data:', err)
    }
  }

  // Calculate stats for display
  const displayStats = [
    {
      icon: FileCheck,
      label: "Files Verified",
      value: stats?.total.toString() || "0",
      change: stats?.completed ? `${stats.completed} completed` : "No verifications yet",
    },
    {
      icon: AlertTriangle,
      label: "High Risk Files",
      value: stats?.riskLevels?.high?.toString() || "0",
      change: stats?.riskLevels?.critical ? `${stats.riskLevels.critical} critical` : "All clear",
    },
    {
      icon: BarChart3,
      label: "Authenticity Rate",
      value: stats?.completed && stats.completed > 0 && typeof stats.authentic === 'number'
        ? `${Math.round((stats.authentic / stats.completed) * 100)}%` 
        : stats?.completed ? "0%" : "N/A",
      change: stats && stats.authentic === stats.completed && stats.completed > 0 
        ? "Perfect record" 
        : `${stats?.suspicious || 0} suspicious`,
    },
    {
      icon: Upload,
      label: "Recent Activity",
      value: recentFiles.length.toString(),
      change: "Last 5 verifications",
    },
  ]

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  // Handle view report
  const handleViewReport = async (fileId: string) => {
    try {
      const response = await verificationAPI.getVerification(fileId)
      setCurrentReport(response.data.verification)
      setShowReportModal(true)
    } catch (err: any) {
      console.error('Error fetching verification:', err)
      // Fallback to navigation if fetch fails
      router.push(`/dashboard/history/${fileId}`)
    }
  }

  const handleCloseReport = () => {
    setShowReportModal(false)
    setCurrentReport(null)
  }

  // Get status based on verification result
  const getFileStatus = (file: RecentActivity) => {
    if (file.status !== 'completed' || !file.verificationResult) {
      return {
        label: file.status === 'processing' ? '⏳ Processing' : file.status === 'pending' ? '⏸ Pending' : '❌ Failed',
        className: 'bg-muted/20 text-muted-foreground'
      }
    }

    const { isAuthentic, riskLevel } = file.verificationResult

    // Check risk level first
    if (riskLevel === 'high' || riskLevel === 'critical') {
      return {
        label: '⚠ Suspicious',
        className: 'bg-destructive/20 text-destructive'
      }
    }

    // Then check authenticity
    if (!isAuthentic) {
      return {
        label: '⚠ Suspicious',
        className: 'bg-destructive/20 text-destructive'
      }
    }

    // If authentic and low/medium risk
    return {
      label: '✓ Authentic',
      className: 'bg-accent/20 text-accent'
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <p className="text-destructive font-semibold mb-2">Error loading dashboard</p>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header with CTA */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Dashboard</h2>
          <p className="text-muted-foreground">Overview of your verification activity</p>
        </div>
        <Button
          onClick={() => setIsUploadModalOpen(true)}
          className="bg-primary hover:bg-primary/90 glow-accent w-full sm:w-auto"
        >
          <Upload size={18} className="mr-2" />
          Upload File
        </Button>
      </div>

      {/* Statistics grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon size={24} className="text-primary" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-foreground mb-2">{stat.value}</p>
              <p className="text-xs text-accent">{stat.change}</p>
            </div>
          )
        })}
      </div>

      {/* Recent activity */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="text-xl font-semibold text-foreground">Recent Verifications</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-background/50">
                <th className="text-left py-3 px-6 font-semibold text-foreground">File Name</th>
                <th className="text-left py-3 px-6 font-semibold text-foreground">Status</th>
                <th className="text-left py-3 px-6 font-semibold text-foreground">Confidence</th>
                <th className="text-left py-3 px-6 font-semibold text-foreground">Date</th>
                <th className="text-left py-3 px-6 font-semibold text-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {recentFiles.length > 0 ? (
                recentFiles.map((file) => {
                  const status = getFileStatus(file)
                  return (
                    <tr key={file._id} className="border-b border-border hover:bg-background/50 transition">
                      <td className="py-4 px-6 text-foreground">{file.originalName}</td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.className}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-foreground font-medium">
                        {file.verificationResult?.confidenceScore
                          ? `${file.verificationResult.confidenceScore}%`
                          : "N/A"}
                      </td>
                      <td className="py-4 px-6 text-muted-foreground">{formatDate(file.createdAt)}</td>
                      <td className="py-4 px-6">
                        {file.status === 'completed' && (
                          <button
                            onClick={() => handleViewReport(file._id)}
                            className="text-primary hover:underline text-sm font-medium cursor-pointer"
                          >
                            View Report
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted-foreground">
                    <Upload className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="font-medium mb-1">No verifications yet</p>
                    <p className="text-sm">Upload your first file to get started</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-6 border-t border-border bg-background/50 text-center">
          <Link href="/dashboard/history" className="text-primary hover:underline font-medium">
            View All Verifications →
          </Link>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/30 rounded-lg p-8">
          <h3 className="text-xl font-semibold text-foreground mb-3">Batch Upload</h3>
          <p className="text-muted-foreground mb-4">Verify multiple files at once for maximum efficiency.</p>
          <Button variant="outline" onClick={() => setIsUploadModalOpen(true)}>
            Start Batch Upload
          </Button>
        </div>
      </div>

      <FileUploadModal isOpen={isUploadModalOpen} onClose={handleModalClose} />
      <VerificationReportModal 
        isOpen={showReportModal} 
        onClose={handleCloseReport} 
        report={currentReport} 
      />
    </div>
  )
}
