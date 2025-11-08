"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { LogOut, Menu, X, LayoutDashboard, Upload, History, Settings, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AegisLogo } from "./aegis-logo"
import { Toaster } from "@/components/ui/sonner"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [initials, setInitials] = useState("JD")
  const [userName, setUserName] = useState("")

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (user) {
      const userData = JSON.parse(user)
      const firstName = userData.name?.split(" ")[0] || ""
      const lastName = userData.name?.split(" ")[1] || ""
      const userInitials = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase()
      setInitials(userInitials)
      setUserName(userData.name || "")
    }
  }, [])

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Upload, label: "Upload File", href: "/dashboard/upload" },
    { icon: History, label: "History", href: "/dashboard/history" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
    { icon: HelpCircle, label: "Help", href: "/dashboard/help" },
  ]

  const handleLogout = () => {
    localStorage.removeItem("user")
    window.location.href = "/auth/sign-in"
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex flex-col h-full p-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl mb-8">
            <AegisLogo className="w-8 h-8" />
            <span className="text-foreground">AEGIS</span>
          </Link>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary transition"
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Logout */}
          <div className="pt-4 border-t border-border">
            <Button onClick={handleLogout} variant="outline" className="w-full justify-start gap-2 bg-transparent">
              <LogOut size={20} />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="md:ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            {/* Mobile menu button */}
            <button className="md:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Title */}
            <h1 className="text-lg font-semibold text-foreground hidden sm:block">Welcome back, {userName}!</h1>

            {/* User menu placeholder */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center">
                <span className="text-sm font-bold text-primary">{initials}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>

      {/* Toast notifications */}
      <Toaster />
    </div>
  )
}
