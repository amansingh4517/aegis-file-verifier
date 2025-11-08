"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function DashboardHeader() {
  return (
    <header className="border-b border-border bg-background/50 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent"
        >
          AEGIS
        </Link>
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex gap-6">
            <Link href="#" className="text-foreground/70 hover:text-accent transition-colors">
              Dashboard
            </Link>
            <Link href="#" className="text-foreground/70 hover:text-accent transition-colors">
              History
            </Link>
            <Link href="#" className="text-foreground/70 hover:text-accent transition-colors">
              Settings
            </Link>
          </nav>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              window.location.href = "/"
            }}
          >
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}
