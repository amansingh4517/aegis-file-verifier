import Link from "next/link"
import { Mail, Twitter, Linkedin, Github } from "lucide-react"
import { AegisLogo } from "./aegis-logo"

export function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 font-bold text-lg mb-4 text-foreground">
              <AegisLogo className="w-8 h-8" />
              <span>AEGIS</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Verify any digital file with confidence using Google Gemini AI technology.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Product</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-foreground transition">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground transition">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground transition">
                  Security
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-foreground transition">
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground transition">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground transition">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-foreground transition">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground transition">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">© 2025 AEGIS. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Link href="mailto:contact@aegis.com" className="text-muted-foreground hover:text-foreground transition">
                <Mail size={20} />
              </Link>
              <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition">
                <Twitter size={20} />
              </Link>
              <Link href="https://www.linkedin.com/in/aman-singh4545/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition">
                <Linkedin size={20} />
              </Link>
              <Link href="https://github.com/amansingh4517" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition">
                <Github size={20} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
