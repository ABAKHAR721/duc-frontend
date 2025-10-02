"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { FiMenu, FiX, FiChevronDown, FiChevronRight, FiPhone } from "react-icons/fi"
import { SiUbereats } from "react-icons/si"
import Logo from "./Logo"

interface HeaderProps {
  variant?: 'transparent' | 'solid';
}

const Header = ({ variant = 'transparent' }: HeaderProps) => {
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

  const isTransparent = variant === 'transparent';
  const isSolid = variant === 'solid';

  return (
    <header className={`${isTransparent ? 'absolute' : 'relative'} top-0 left-0 right-0 z-40 ${isSolid ? 'bg-white shadow-sm border-b border-gray-100' : ''}`}>
      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            {/* Logo - Left */}
            <Logo variant={variant} />

            {/* Navigation Items - Right */}
            <nav className="flex items-center gap-10">
              <Link
                href="/"
                className={`${isTransparent ? 'text-white/90 hover:text-white' : 'text-gray-700 hover:text-gray-900'} transition-colors duration-200 text-sm font-medium tracking-wide`}
              >
                Accueil
              </Link>
              <Link
                href="/notre-carte"
                className={`${isTransparent ? 'text-white/90 hover:text-white' : 'text-gray-700 hover:text-gray-900'} transition-colors duration-200 text-sm font-medium tracking-wide`}
              >
                Notre Carte
              </Link>
              <Link
                href="/about"
                className={`${isTransparent ? 'text-white/90 hover:text-white' : 'text-gray-700 hover:text-gray-900'} transition-colors duration-200 text-sm font-medium tracking-wide`}
              >
                Notre Histoire
              </Link>
              <Link
                href="/location"
                className={`${isTransparent ? 'text-white/90 hover:text-white' : 'text-gray-700 hover:text-gray-900'} transition-colors duration-200 text-sm font-medium tracking-wide`}
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
                    className="flex items-center gap-3 px-4 py-2.5 text-white/90 hover:text-white hover:bg-white/10 transition-colors duration-150 border-b border-white/20 text-xs"
                  >
                    <FiPhone className="w-4 h-4" />
                    Par Téléphone
                  </a>
                  <a
                    href="https://www.ubereats.com/fr/store/pizza-le-duc/ShfPBgd5WYG-0lAKLxIazQ"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-2.5 text-white bg-green-500 hover:bg-green-600 transition-colors duration-150 border-b border-white/20 text-xs"
                  >
                    <SiUbereats className="w-8 h-8" />
                    Par UberEat
                  </a>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`md:hidden ${isTransparent ? 'bg-black/30 backdrop-blur-md' : 'bg-white border-b border-gray-100'}`}>
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <Logo variant={variant} />

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`${isTransparent ? 'text-white' : 'text-gray-700'} p-2`}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className={`${isTransparent ? 'bg-black/95 backdrop-blur-md border-t border-white/10' : 'bg-white border-t border-gray-100 shadow-lg'}`}>
            <nav className="px-4 py-6 flex flex-col gap-4">
              <Link
                href="/"
                className={`${isTransparent ? 'text-white/90 hover:text-white' : 'text-gray-700 hover:text-gray-900'} transition-colors py-2 text-base`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Accueil
              </Link>
              <Link
                href="/notre-carte"
                className={`${isTransparent ? 'text-white/90 hover:text-white' : 'text-gray-700 hover:text-gray-900'} transition-colors py-2 text-base`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Notre Carte
              </Link>
              <Link
                href="/about"
                className={`${isTransparent ? 'text-white/90 hover:text-white' : 'text-gray-700 hover:text-gray-900'} transition-colors py-2 text-base`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Notre Histoire
              </Link>
              <Link
                href="/location"
                className={`${isTransparent ? 'text-white/90 hover:text-white' : 'text-gray-700 hover:text-gray-900'} transition-colors py-2 text-base`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Nous Trouver
              </Link>
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setIsOrderOpen(!isOrderOpen)}
                  className="bg-primary hover:bg-primary/90 text-white px-3 py-2.5 rounded-lg text-xs font-medium tracking-wide transition-all duration-200 flex items-center gap-2 w-32"
                >
                  Commander
                  <FiChevronDown
                    className={`w-3 h-3 transition-transform duration-300 ${isOrderOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Animated Dropdown */}
                <div className={`absolute top-full left-0 w-32 mt-1 bg-primary rounded-lg shadow-lg overflow-hidden transition-all duration-300 origin-top ${isOrderOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'}`}>
                  <a
                    href="tel:+33123456789"
                    className="flex items-center gap-2 px-2 py-2.5 text-white/90 hover:text-white hover:bg-white/10 transition-colors duration-150 border-b border-white/20 text-xs"
                  >
                    <FiPhone className="w-3 h-3" />
                    Par Téléphone
                  </a>
                  <a
                    href="https://www.ubereats.com/fr/store/pizza-le-duc/ShfPBgd5WYG-0lAKLxIazQ"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-2 py-2.5 text-white bg-green-500 hover:bg-green-600 transition-colors duration-150 text-xs"
                  >
                    <SiUbereats className="w-4 h-4" />
                    Par UberEat
                  </a>
                </div>
              </div>
                
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
