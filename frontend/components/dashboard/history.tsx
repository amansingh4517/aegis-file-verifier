"use client"

import { useEffect, useState } from "react"
import { verificationAPI } from "@/lib/api"
import { Loader2 } from "lucide-react"

interface Verification {
  _id: string
  fileName: string
  fileType: string
  status: string
  verificationResult: {
    isAuthentic: boolean
    confidenceScore: number
    riskLevel: string
  }
  createdAt: string
}

export function VerificationHistory() {
  const [history, setHistory] = useState<Verification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      setLoading(true)
      setError("")
      const response = await verificationAPI.getHistory({ page: 1, limit: 5 })
      setHistory(response.data.verifications)
    } catch (err: any) {
      console.error("Error fetching history:", err)
      setError(err.message || "Failed to load history")
    } finally {
      setLoading(false)
    }
  }

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInHours / 24)

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const getFileType = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase()
    if (["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(ext || "")) return "Image"
    if (["mp4", "avi", "mov", "wmv", "flv", "webm"].includes(ext || "")) return "Video"
    if (["mp3", "wav", "ogg", "m4a", "flac"].includes(ext || "")) return "Audio"
    if (["pdf", "doc", "docx", "txt", "xls", "xlsx"].includes(ext || "")) return "Document"
    return "File"
  }

  const getStatus = (verification: Verification) => {
    if (verification.status === "failed") return "Failed"
    if (!verification.verificationResult?.isAuthentic) return "Issues Found"
    if (verification.verificationResult?.riskLevel === "high") return "Issues Found"
    return "Authentic"
  }

  if (loading) {
    return (
      <div className="mt-8">
        <h3 className="text-2xl font-semibold mb-6">Verification History</h3>
        <div className="flex justify-center items-center min-h-[200px]">
          <Loader2 className="animate-spin h-6 w-6 text-primary" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mt-8">
        <h3 className="text-2xl font-semibold mb-6">Verification History</h3>
        <div className="bg-destructive/20 text-destructive border border-destructive/50 rounded-lg p-4">
          <p>{error}</p>
        </div>
      </div>
    )
  }

  if (history.length === 0) {
    return (
      <div className="mt-8">
        <h3 className="text-2xl font-semibold mb-6">Verification History</h3>
        <div className="bg-card border border-border rounded-lg p-8 text-center">
          <p className="text-muted-foreground">No verification history yet. Upload your first file to get started!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-semibold mb-6">Verification History</h3>
      <div className="space-y-3">
        {history.map((item) => {
          const status = getStatus(item)
          return (
            <div
              key={item._id}
              className="bg-card border border-border rounded-lg p-4 flex items-center justify-between hover:border-accent/50 transition-all"
            >
              <div>
                <p className="font-medium">{item.fileName}</p>
                <p className="text-sm text-foreground/60">
                  {getFileType(item.fileName)} • {getRelativeTime(item.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    status === "Authentic" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {status}
                </span>
                <button
                  onClick={() => (window.location.href = `/dashboard/history/${item._id}`)}
                  className="text-accent hover:text-accent/80 text-sm font-semibold"
                >
                  View Report
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
