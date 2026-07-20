'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'Home', href: '#' },
  { label: 'Features', href: '#features' },
  { label: 'AI Features', href: '#ai-features' },
  { label: 'Roadmap', href: '#roadmap' },
  { label: 'About', href: '#about' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        scrolled
          ? 'py-3 bg-[rgba(9,3,18,0.75)] backdrop-blur-[28px] border-b border-white/[0.05] shadow-[0_4px_40px_rgba(0,0,0,0.35)]'
          : 'py-4 bg-transparent'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-8 md:px-14 lg:px-20 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-neonPink via-[#e44daa] to-neonPurple flex items-center justify-center shadow-[0_0_20px_rgba(255,77,184,0.35)] transition-shadow duration-300 group-hover:shadow-[0_0_30px_rgba(255,77,184,0.55)]">
            <Heart className="w-[18px] h-[18px] text-white fill-white" />
          </div>
          <span className="text-[17px] font-bold tracking-tight bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">
            Forever Remembered
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10 text-[12px] font-semibold uppercase tracking-[0.12em] text-white/40">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="relative py-2 text-white/40 hover:text-white transition-colors duration-300 group"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 right-0 h-[1.5px] rounded-full bg-gradient-to-r from-neonPink via-neonPurple to-neonPink origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)]" />
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 group-hover:w-full h-[6px] rounded-full bg-neonPink/[0.06] blur-[6px] transition-all duration-500" />
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:block">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              window.dispatchEvent(new CustomEvent('open-auth'))
            }}
            className="relative px-6 py-2.5 bg-gradient-to-r from-neonPink to-neonPurple text-white text-[12px] font-bold rounded-full shadow-[0_0_20px_rgba(255,77,184,0.3)] hover:shadow-[0_0_35px_rgba(255,77,184,0.55)] hover:scale-[1.04] active:scale-[0.97] transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10">Start Your Journey</span>
            <span className="absolute inset-0 bg-gradient-to-r from-neonPink via-[#d946ef] to-neonPurple opacity-0 hover:opacity-100 transition-opacity duration-500" />
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/60 hover:text-white/90 transition-colors"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden overflow-hidden bg-[rgba(9,3,18,0.96)] backdrop-blur-[30px] border-b border-white/[0.05]"
          >
            <div className="px-8 py-5 flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-white/50 hover:text-white hover:bg-white/[0.04] rounded-xl transition-all"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  setMobileOpen(false)
                  window.dispatchEvent(new CustomEvent('open-auth'))
                }}
                className="mt-3 text-center px-4 py-2.5 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-neonPink to-neonPurple"
              >
                Start Your Journey
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
