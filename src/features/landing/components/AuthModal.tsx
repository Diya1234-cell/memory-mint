'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mail, Lock, User, Eye, EyeOff, ChevronDown,
  Sparkles, Globe, Smartphone, X
} from 'lucide-react'

type AuthMode = 'login' | 'signup'

function getPasswordStrength(password: string) {
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  if (score <= 1) return { score: 1, label: 'Weak', color: '#ef4444' }
  if (score === 2) return { score: 2, label: 'Fair', color: '#f59e0b' }
  if (score === 3) return { score: 3, label: 'Strong', color: '#22c55e' }
  return { score: 4, label: 'Excellent', color: '#a855f7' }
}

const memoryThemes = ['Family', 'Friends', 'Travel', 'Relationship', 'Personal', 'Other']
const countries = ['United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'Japan', 'India', 'Brazil', 'Other']

export default function AuthModal() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<AuthMode>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [agreed, setAgreed] = useState(false)

  const handleNavigateToCreate = () => {
    setOpen(false)
    router.push('/create-space')
  }

  useEffect(() => {
    const handler = () => setOpen(true)
    window.addEventListener('open-auth', handler)
    return () => window.removeEventListener('open-auth', handler)
  }, [])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => setOpen(false)}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-[420px] max-h-[90vh] overflow-y-auto"
          >
            <div className="auth-glass-card rounded-[32px] p-7 relative overflow-hidden">
              {/* Close */}
              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-white/80 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Shimmer */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.1] to-transparent" />

              {/* Segmented Control */}
              <div className="segmented-control mb-7 relative">
                <motion.div
                  className="segmented-pill"
                  animate={{
                    left: mode === 'login' ? '4px' : 'calc(50% + 0px)',
                    width: 'calc(50% - 4px)',
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
                {(['login', 'signup'] as AuthMode[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setMode(tab)}
                    className={`relative z-10 flex-1 py-2.5 text-[13px] font-semibold rounded-[11px] transition-colors duration-300 ${
                      mode === tab ? 'text-white' : 'text-white/40 hover:text-white/60'
                    }`}
                  >
                    {tab === 'login' ? 'Login' : 'Sign Up'}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {mode === 'login' ? (
                  <motion.div key="login" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }}>
                    <div className="mb-6">
                      <h2 className="text-xl font-bold text-white flex items-center gap-2 font-sans-grotesk">
                        <Sparkles className="w-5 h-5 text-neonPink" />
                        Welcome Back
                      </h2>
                      <p className="text-[13px] text-white/40 mt-1.5">Continue your journey through the stars.</p>
                    </div>

                    <div className="relative mb-4">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" />
                      <input type="email" placeholder="Email address" className="glass-input" />
                    </div>

                    <div className="relative mb-4">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" />
                      <input type={showPassword ? 'text' : 'password'} placeholder="Password" className="glass-input pr-12" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    <div className="flex items-center justify-between mb-6">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input type="checkbox" className="glass-checkbox" />
                        <span className="text-[12px] text-white/40 group-hover:text-white/60 transition-colors">Remember Me</span>
                      </label>
                      <a href="#" className="text-[12px] text-neonPink/70 hover:text-neonPink transition-colors font-medium">Forgot Password?</a>
                    </div>

                    <button onClick={handleNavigateToCreate} className="btn-cosmic-primary w-full text-[14px] mb-4">Continue Journey</button>

                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex-1 h-[1px] bg-white/[0.06]" />
                      <span className="text-[10px] font-bold tracking-widest text-white/25 uppercase">OR</span>
                      <div className="flex-1 h-[1px] bg-white/[0.06]" />
                    </div>

                    <button onClick={handleNavigateToCreate} className="btn-glass w-full flex items-center justify-center gap-3 text-[13px] mb-3">
                      <Globe className="w-4 h-4" /> Continue with Google
                    </button>
                    <button onClick={handleNavigateToCreate} className="btn-glass w-full flex items-center justify-center gap-3 text-[13px]">
                      <Smartphone className="w-4 h-4" /> Continue with Apple
                    </button>
                  </motion.div>
                ) : (
                  <motion.div key="signup" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }}>
                    <div className="mb-5">
                      <h2 className="text-xl font-bold text-white flex items-center gap-2 font-sans-grotesk">
                        <Sparkles className="w-5 h-5 text-neonPink" />
                        Create Your Universe
                      </h2>
                      <p className="text-[13px] text-white/40 mt-1.5">Your memories deserve their own galaxy.</p>
                    </div>

                    <div className="relative mb-3">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" />
                      <input type="text" placeholder="Full Name" className="glass-input" />
                    </div>
                    <div className="relative mb-3">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" />
                      <input type="email" placeholder="Email address" className="glass-input" />
                    </div>
                    <div className="relative mb-2">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" />
                      <input type={showPassword ? 'text' : 'password'} placeholder="Password" className="glass-input pr-12" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="relative mb-3">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" />
                      <input type={showConfirm ? 'text' : 'password'} placeholder="Confirm Password" className="glass-input pr-12" />
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors">
                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="relative">
                        <select className="glass-select" defaultValue="">
                          <option value="" disabled>Country</option>
                          {countries.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25 pointer-events-none" />
                      </div>
                      <div className="relative">
                        <select className="glass-select" defaultValue="">
                          <option value="" disabled>Memory Theme</option>
                          {memoryThemes.map((t) => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25 pointer-events-none" />
                      </div>
                    </div>

                    <label className="flex items-start gap-2.5 cursor-pointer mb-5 group">
                      <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="glass-checkbox mt-0.5" />
                      <span className="text-[11.5px] text-white/35 group-hover:text-white/50 transition-colors leading-relaxed">
                        I agree to the <a href="#" className="text-neonPink/70 hover:text-neonPink font-medium">Terms</a> & <a href="#" className="text-neonPink/70 hover:text-neonPink font-medium">Privacy Policy</a>
                      </span>
                    </label>

                    <button onClick={handleNavigateToCreate} className="btn-cosmic-primary w-full text-[14px] mb-4 flex items-center justify-center gap-2">
                      <Sparkles className="w-4 h-4" /> Create My Universe
                    </button>

                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex-1 h-[1px] bg-white/[0.06]" />
                      <span className="text-[10px] font-bold tracking-widest text-white/25 uppercase">OR</span>
                      <div className="flex-1 h-[1px] bg-white/[0.06]" />
                    </div>

                    <button onClick={handleNavigateToCreate} className="btn-glass w-full flex items-center justify-center gap-3 text-[13px] mb-3">
                      <Globe className="w-4 h-4" /> Continue with Google
                    </button>
                    <button onClick={handleNavigateToCreate} className="btn-glass w-full flex items-center justify-center gap-3 text-[13px]">
                      <Smartphone className="w-4 h-4" /> Continue with Apple
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
