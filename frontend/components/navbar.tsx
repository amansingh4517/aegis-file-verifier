"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu, X, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AegisLogo } from "./aegis-logo"
import { ThemeToggle } from "./theme-toggle"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    setIsLoggedIn(false)
    router.push("/")
  }

  useEffect(() => {
    setMounted(true)
    const user = localStorage.getItem("user")
    setIsLoggedIn(!!user)
  }, [])

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "user") {
        setIsLoggedIn(!!e.newValue)
      }
    }
    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  if (!mounted) return null

  const navLinks = [
    { label: "How It Works", href: "/how-it-works" },
    { label: "Features", href: "/features" },
  ]

  const handleLogoClick = (e: React.MouseEvent) => {
    if (isLoggedIn) {
      e.preventDefault()
      window.location.href = "/dashboard"
      return
    }
  }

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-1">
            <Link
              href={isLoggedIn ? "/dashboard" : "/"}
              className="flex items-center gap-2 font-bold text-xl text-foreground w-fit"
              onClick={handleLogoClick}
            >
              <AegisLogo className="w-8 h-8" />
              <span>AEGIS</span>
            </Link>
          </div>

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex items-center gap-8 flex-1 justify-center">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-muted-foreground hover:text-foreground transition">
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3 flex-1 justify-end">
            <ThemeToggle />
            {!isLoggedIn ? (
              <>
                <Link href="/auth/sign-in">
                  <Button variant="outline" className="border-border text-foreground hover:bg-foreground/10 hover:border-foreground/50 bg-transparent hover:text-foreground">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/sign-up">
                  <Button className="bg-primary hover:bg-primary/90 text-white glow-accent-sm">Get Started</Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/dashboard">
                  <Button className="bg-primary hover:bg-primary/90 text-white glow-accent-sm">Dashboard</Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="border-border text-foreground hover:bg-foreground/10 hover:border-foreground/50 bg-transparent hover:text-foreground"
                  onClick={handleSignOut}
                >
                  <LogOut size={16} className="mr-2" />
                  Sign Out
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-foreground" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-muted-foreground hover:text-foreground transition py-2"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {isLoggedIn && (
              <Link
                href="/dashboard"
                className="block text-muted-foreground hover:text-foreground transition py-2"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
            )}
            <div className="flex items-center gap-3 pt-2">
              <ThemeToggle />
              <div className="flex gap-3 flex-1">
                {!isLoggedIn ? (
                  <>
                    <Link href="/auth/sign-in" className="flex-1">
                      <Button variant="outline" className="w-full bg-transparent border-border text-foreground hover:bg-foreground/10 hover:border-foreground/50 hover:text-foreground">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/auth/sign-up" className="flex-1">
                      <Button className="w-full bg-primary hover:bg-primary/90 text-white">Get Started</Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/dashboard" className="flex-1">
                      <Button className="w-full bg-primary hover:bg-primary/90 text-white">Dashboard</Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      className="flex-1 bg-transparent border-border text-foreground hover:bg-foreground/10 hover:border-foreground/50 hover:text-foreground"
                      onClick={() => {
                        handleSignOut()
                        setIsOpen(false)
                      }}
                    >
                      <LogOut size={16} className="mr-2" />
                      Sign Out
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
