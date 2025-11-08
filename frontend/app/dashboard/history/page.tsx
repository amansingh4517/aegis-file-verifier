"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Search, Download, Loader2 } from "lucide-react"
import { verificationAPI } from "@/lib/api"
import { useRouter } from "next/navigation"

interface Verification {
  _id: string
  fileName: string
  fileSize: number
  status: string
  verificationResult: {
    isAuthentic: boolean
    confidenceScore: number
    riskLevel: string
  }
  createdAt: string
}

export default function HistoryPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [allVerifications, setAllVerifications] = useState<Verification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 50

  useEffect(() => {
    fetchHistory()
  }, [currentPage])

  const fetchHistory = async () => {
    try {
      setLoading(true)
      setError("")
      const response = await verificationAPI.getHistory({
        page: currentPage,
        limit: itemsPerPage,
      })
      setAllVerifications(response.data.verifications)
      setTotalPages(response.data.pagination.totalPages)
    } catch (err: any) {
      console.error("Error fetching history:", err)
      setError(err.message || "Failed to load verification history")
      if (err.message?.includes("Unauthorized")) {
        router.push("/login")
      }
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
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getStatus = (verification: Verification) => {
    if (verification.status === "failed") return "failed"
    if (!verification.verificationResult?.isAuthentic) return "suspicious"
    if (verification.verificationResult?.riskLevel === "high" || verification.verificationResult?.riskLevel === "critical") return "suspicious"
    return "authentic"
  }

  const filteredVerifications = allVerifications.filter((file) => {
    const matchesSearch = file.fileName.toLowerCase().includes(searchTerm.toLowerCase())
    const status = getStatus(file)
    const matchesFilter = filterStatus === "all" || status === filterStatus
    return matchesSearch && matchesFilter
  })

  const handleExport = () => {
    const csvContent = [
      ["File Name", "Status", "Confidence", "Size", "Date"],
      ...filteredVerifications.map((file) => [
        file.fileName,
        getStatus(file),
        (file.verificationResult?.confidenceScore || 0) + "%",
        formatFileSize(file.fileSize),
        formatDate(file.createdAt),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `verification-report-${new Date().toISOString().split("T")[0]}.csv`
    link.click()
    window.URL.revokeObjectURL(url)
  }

  const handleViewReport = async (id: string) => {
    try {
      await router.push(`/dashboard/history/${id}`)
    } catch (err) {
      console.error("Error navigating to report:", err)
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Verification History</h2>
            <p className="text-muted-foreground">View all your file verifications</p>
          </div>
          <Button
            onClick={handleExport}
            disabled={filteredVerifications.length === 0}
            className="bg-primary hover:bg-primary/90 glow-accent"
          >
            <Download size={18} className="mr-2" />
            Export Report
          </Button>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-destructive/20 text-destructive border border-destructive/50 rounded-lg p-4">
            <p>{error}</p>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="text"
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="all">All Status</option>
              <option value="authentic">Authentic</option>
              <option value="suspicious">Suspicious</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="text-sm text-muted-foreground">
          Showing {filteredVerifications.length} of {allVerifications.length} verifications
        </div>

        {/* Table */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-background/50">
                  <th className="text-left py-3 px-6 font-semibold text-foreground">File Name</th>
                  <th className="text-left py-3 px-6 font-semibold text-foreground">Status</th>
                  <th className="text-left py-3 px-6 font-semibold text-foreground">Confidence</th>
                  <th className="text-left py-3 px-6 font-semibold text-foreground">Size</th>
                  <th className="text-left py-3 px-6 font-semibold text-foreground">Date</th>
                  <th className="text-left py-3 px-6 font-semibold text-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredVerifications.map((file) => {
                  const status = getStatus(file)
                  return (
                    <tr key={file._id} className="border-b border-border hover:bg-background/50 transition">
                      <td className="py-4 px-6 text-foreground font-medium">{file.fileName}</td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 inline-flex ${
                            status === "authentic"
                              ? "bg-accent/20 text-accent"
                              : status === "failed"
                                ? "bg-muted/20 text-muted-foreground"
                                : "bg-destructive/20 text-destructive"
                          }`}
                        >
                          {status === "authentic" ? (
                            <>
                              <span className="text-sm">✓</span>
                              <span>Authentic</span>
                            </>
                          ) : status === "failed" ? (
                            <>
                              <span className="text-sm">✗</span>
                              <span>Failed</span>
                            </>
                          ) : (
                            <>
                              <span className="text-sm">⚠</span>
                              <span>Suspicious</span>
                            </>
                          )}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-foreground font-medium">
                        {file.verificationResult?.confidenceScore
                          ? `${file.verificationResult.confidenceScore}%`
                          : "N/A"}
                      </td>
                      <td className="py-4 px-6 text-muted-foreground text-sm">{formatFileSize(file.fileSize)}</td>
                      <td className="py-4 px-6 text-muted-foreground text-sm">{formatDate(file.createdAt)}</td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleViewReport(file._id)}
                          className="text-primary hover:underline text-sm font-medium"
                        >
                          View Report
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {filteredVerifications.length === 0 && !loading && (
            <div className="p-12 text-center">
              <p className="text-muted-foreground">
                {allVerifications.length === 0
                  ? "No verifications yet. Upload a file to get started!"
                  : "No verifications found matching your filters."}
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2">
            <Button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              variant="outline"
              size="sm"
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              variant="outline"
              size="sm"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
