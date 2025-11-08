"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Bell, Lock, Eye, Save, User, EyeOff } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    email: "",
    fullName: "",
    notifications: {
      verificationComplete: true,
      suspiciousDetected: true,
      monthlyReport: false,
    },
    privacy: {
      shareStats: false,
    },
  })

  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState("")
  const [saving, setSaving] = useState(false)
  
  // Password change modal state
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)

  useEffect(() => {
    // Load user data from localStorage
    const userData = localStorage.getItem("user")
    if (userData) {
      try {
        const user = JSON.parse(userData)
        setSettings(prev => ({
          ...prev,
          email: user.email || "",
          fullName: user.name || "",
        }))
        setEditedName(user.name || "")
      } catch (error) {
        console.error("Error loading user data:", error)
      }
    }

    // Load saved preferences from localStorage
    const savedPrefs = localStorage.getItem("userPreferences")
    if (savedPrefs) {
      try {
        const prefs = JSON.parse(savedPrefs)
        setSettings(prev => ({
          ...prev,
          notifications: prefs.notifications || prev.notifications,
          privacy: prefs.privacy || prev.privacy,
        }))
      } catch (error) {
        console.error("Error loading preferences:", error)
      }
    }
  }, [])

  const handleNotificationChange = (key: string) => {
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: !settings.notifications[key as keyof typeof settings.notifications],
      },
    })
  }

  const handlePrivacyChange = (key: string) => {
    setSettings({
      ...settings,
      privacy: {
        ...settings.privacy,
        [key]: !settings.privacy[key as keyof typeof settings.privacy],
      },
    })
  }

  const handleSave = async () => {
    setSaving(true)

    try {
      // Save name update if editing
      if (isEditing && editedName !== settings.fullName) {
        const userData = localStorage.getItem("user")
        if (userData) {
          const user = JSON.parse(userData)
          user.name = editedName
          localStorage.setItem("user", JSON.stringify(user))
          setSettings(prev => ({ ...prev, fullName: editedName }))
        }
      }

      // Save preferences to localStorage
      const preferences = {
        notifications: settings.notifications,
        privacy: settings.privacy,
      }
      localStorage.setItem("userPreferences", JSON.stringify(preferences))

      setIsEditing(false)
      toast.success("Settings saved successfully!")
    } catch (error) {
      console.error("Error saving settings:", error)
      toast.error("Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    // Validation
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error("Please fill in all password fields")
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters")
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match")
      return
    }

    setChangingPassword(true)

    try {
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:5000/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("Password changed successfully!")
        setShowPasswordModal(false)
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
      } else {
        toast.error(data.message || "Failed to change password")
      }
    } catch (error) {
      console.error("Error changing password:", error)
      toast.error("Failed to change password. Please try again.")
    } finally {
      setChangingPassword(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Settings</h2>
          <p className="text-muted-foreground">Manage your account preferences and security</p>
        </div>

        {/* Account Information */}
        <div className="bg-card border border-border rounded-lg p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <User size={20} className="text-primary" />
              Account Information
            </h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Cancel" : "Edit"}
            </Button>
          </div>

          <div>
            <Label htmlFor="fullName" className="text-foreground">Full Name</Label>
            <Input
              id="fullName"
              type="text"
              value={isEditing ? editedName : settings.fullName}
              onChange={(e) => setEditedName(e.target.value)}
              readOnly={!isEditing}
              className={`mt-2 ${!isEditing ? 'bg-muted' : ''}`}
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-foreground">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={settings.email}
              readOnly
              className="mt-2 bg-muted"
            />
            <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
          </div>

          <Button 
            variant="outline" 
            onClick={() => {
              setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
              })
              setShowCurrentPassword(false)
              setShowNewPassword(false)
              setShowConfirmPassword(false)
              setShowPasswordModal(true)
            }}
          >
            <Lock size={16} className="mr-2" />
            Change Password
          </Button>
        </div>

        {/* Notification Preferences */}
        <div className="bg-card border border-border rounded-lg p-6 space-y-6">
          <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Bell size={20} className="text-primary" />
            Notification Preferences
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3">
              <div className="space-y-0.5">
                <Label className="text-base font-medium">Verification Complete</Label>
                <p className="text-sm text-muted-foreground">Notify when file verification completes</p>
              </div>
              <Switch
                checked={settings.notifications.verificationComplete}
                onCheckedChange={() => handleNotificationChange("verificationComplete")}
              />
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="space-y-0.5">
                <Label className="text-base font-medium">Suspicious Activity Detected</Label>
                <p className="text-sm text-muted-foreground">Alert when suspicious files are detected</p>
              </div>
              <Switch
                checked={settings.notifications.suspiciousDetected}
                onCheckedChange={() => handleNotificationChange("suspiciousDetected")}
              />
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="space-y-0.5">
                <Label className="text-base font-medium">Monthly Report</Label>
                <p className="text-sm text-muted-foreground">Receive monthly verification summaries</p>
              </div>
              <Switch
                checked={settings.notifications.monthlyReport}
                onCheckedChange={() => handleNotificationChange("monthlyReport")}
              />
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-card border border-border rounded-lg p-6 space-y-6">
          <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Eye size={20} className="text-primary" />
            Privacy Settings
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3">
              <div className="space-y-0.5">
                <Label className="text-base font-medium">Share Statistics</Label>
                <p className="text-sm text-muted-foreground">Allow AEGIS to use your stats for analytics</p>
              </div>
              <Switch
                checked={settings.privacy.shareStats}
                onCheckedChange={() => handlePrivacyChange("shareStats")}
              />
            </div>
          </div>
        </div>

        {/* Save Changes */}
        <div className="flex justify-end">
          <Button 
            onClick={handleSave} 
            className="bg-primary hover:bg-primary/90 glow-accent-sm"
            disabled={saving}
          >
            <Save size={18} className="mr-2" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Change Password Modal */}
      <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your current password and choose a new one.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  placeholder="Enter current password"
                  autoComplete="off"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  placeholder="Enter new password (min 6 characters)"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowPasswordModal(false)
                setPasswordData({
                  currentPassword: "",
                  newPassword: "",
                  confirmPassword: "",
                })
              }}
              disabled={changingPassword}
            >
              Cancel
            </Button>
            <Button
              onClick={handleChangePassword}
              disabled={changingPassword}
              className="bg-primary hover:bg-primary/90"
            >
              {changingPassword ? "Changing..." : "Change Password"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
