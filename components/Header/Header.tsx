"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { FiMenu, FiX, FiChevronDown, FiChevronRight } from "react-icons/fi"
import Logo from "./Logo"

const Header = () => {
  const [isOrderOpen, setIsOrderOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOrderOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <header className="absolute top-0 left-0 right-0 z-40">
      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            {/* Logo - Left */}
            <Logo />

            {/* Navigation Items - Right */}
            <nav className="flex items-center gap-10">
              <Link
                href="/"
                className="text-white/90 hover:text-white transition-colors duration-200 text-sm font-medium tracking-wide"
              >
                Accueil
              </Link>
              <Link
                href="/menu"
                className="text-white/90 hover:text-white transition-colors duration-200 text-sm font-medium tracking-wide"
              >
                Notre Carte
              </Link>
              <Link
                href="/about"
                className="text-white/90 hover:text-white transition-colors duration-200 text-sm font-medium tracking-wide"
              >
                Notre Histoire
              </Link>
              <Link
                href="/location"
                className="text-white/90 hover:text-white transition-colors duration-200 text-sm font-medium tracking-wide"
              >
                Nous Trouver
              </Link>

              {/* Order Button with Animated Height */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setIsOrderOpen(!isOrderOpen)}
                  className="bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-lg text-xs font-medium tracking-wide transition-all duration-200 flex items-center gap-2"
                >
                  Commander
                  <FiChevronDown
                    className={`w-3 h-3 transition-transform duration-300 ${isOrderOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Animated Dropdown */}
                <div className={`absolute top-full left-0 right-0 mt-1 bg-primary rounded-lg shadow-lg overflow-hidden transition-all duration-300 origin-top ${isOrderOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'}`}>
                  <a
                    href="tel:+33123456789"
                    className="block px-4 py-2.5 text-white/90 hover:text-white hover:bg-white/10 transition-colors duration-150 border-b border-white/20 text-xs"
                  >
                    Par Téléphone
                  </a>

                  {/* Uber Eats with sub-options */}
                  <div className="border-b border-white/20">
                    <div className="flex items-center gap-2 px-4 py-2.5 text-white/90 text-xs">
                      <FiChevronRight className="w-3 h-3" />
                      <span>Par Uber Eats</span>
                    </div>
                    <div className="bg-primary/80">
                      <a
                        href="#"
                        className="block px-4 py-2 pl-9 text-xs text-white/80 hover:text-white hover:bg-white/5 transition-colors duration-150"
                      >
                        Langon
                      </a>
                      <a
                        href="#"
                        className="block px-4 py-2 pl-9 text-xs text-white/80 hover:text-white hover:bg-white/5 transition-colors duration-150"
                      >
                        Podensac
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-black/30 backdrop-blur-md">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <Logo />

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white p-2"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="bg-black/95 backdrop-blur-md border-t border-white/10">
            <nav className="px-4 py-6 flex flex-col gap-4">
              <Link
                href="/"
                className="text-white/90 hover:text-white transition-colors py-2 text-base"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Accueil
              </Link>
              <Link
                href="/menu"
                className="text-white/90 hover:text-white transition-colors py-2 text-base"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Notre Carte
              </Link>
              <Link
                href="/about"
                className="text-white/90 hover:text-white transition-colors py-2 text-base"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Notre Histoire
              </Link>
              <Link
                href="/location"
                className="text-white/90 hover:text-white transition-colors py-2 text-base"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Nous Trouver
              </Link>
              <a
                href="tel:+33123456789"
                className="bg-primary text-white px-6 py-3 rounded-lg text-center font-semibold mt-2"
              >
                Commander
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
