'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mail, Lock, User, Eye, EyeOff, ChevronDown,
  Sparkles, Globe, Smartphone
} from 'lucide-react'

type AuthMode = 'login' | 'signup'

interface PasswordStrength {
  score: number
  label: string
  color: string
}

function getPasswordStrength(password: string): PasswordStrength {
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

export default function AuthPanel() {
  const [mode, setMode] = useState<AuthMode>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreed, setAgreed] = useState(false)

  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  const [signupName, setSignupName] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [signupConfirm, setSignupConfirm] = useState('')
  const [signupCountry, setSignupCountry] = useState('')
  const [signupTheme, setSignupTheme] = useState('')

  const strength = getPasswordStrength(signupPassword)

  const handlePillPosition = mode === 'login' ? 'left' : 'right'

  return (
    <motion.div
      initial={{ opacity: 0, x: 40, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full max-w-[420px]"
    >
      {/* Ambient glow behind panel */}
      <div className="absolute -inset-8 rounded-[40px] bg-gradient-to-br from-neonPink/[0.06] via-transparent to-neonPurple/[0.04] blur-3xl pointer-events-none" />

      <div className="auth-glass-card rounded-[32px] p-7 relative overflow-hidden">
        {/* Subtle inner shimmer */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.1] to-transparent" />

        {/* Segmented Control */}
        <div className="segmented-control mb-7 relative">
          <motion.div
            className="segmented-pill"
            animate={{
              left: handlePillPosition === 'left' ? '4px' : 'calc(50% + 0px)',
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
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Login Header */}
              <div className="mb-6">
                <h2 className="font-serif-hero text-2xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-neonPink" />
                  Welcome Back
                </h2>
                <p className="text-[13px] text-white/40 mt-1.5">Continue your journey through the stars.</p>
              </div>

              {/* Email */}
              <div className="relative mb-4">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" />
                <input
                  type="email"
                  placeholder="Email address"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="glass-input"
                />
              </div>

              {/* Password */}
              <div className="relative mb-4">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="glass-input pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Remember Me / Forgot */}
              <div className="flex items-center justify-between mb-6">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="glass-checkbox" />
                  <span className="text-[12px] text-white/40 group-hover:text-white/60 transition-colors">Remember Me</span>
                </label>
                <a href="#" className="text-[12px] text-neonPink/70 hover:text-neonPink transition-colors font-medium">
                  Forgot Password?
                </a>
              </div>

              {/* Submit */}
              <button className="btn-cosmic-primary w-full text-[14px] mb-4">
                Continue Journey
              </button>

              {/* Divider */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1 h-[1px] bg-white/[0.06]" />
                <span className="text-[10px] font-bold tracking-widest text-white/25 uppercase">OR</span>
                <div className="flex-1 h-[1px] bg-white/[0.06]" />
              </div>

              {/* Social */}
              <button className="btn-glass w-full flex items-center justify-center gap-3 text-[13px] mb-3">
                <Globe className="w-4 h-4" />
                Continue with Google
              </button>
              <button className="btn-glass w-full flex items-center justify-center gap-3 text-[13px]">
                <Smartphone className="w-4 h-4" />
                Continue with Apple
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="signup"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Signup Header */}
              <div className="mb-5">
                <h2 className="font-serif-hero text-2xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-neonPink" />
                  Create Your Universe
                </h2>
                <p className="text-[13px] text-white/40 mt-1.5">Your memories deserve their own galaxy.</p>
              </div>

              {/* Full Name */}
              <div className="relative mb-3">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  className="glass-input"
                />
              </div>

              {/* Email */}
              <div className="relative mb-3">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" />
                <input
                  type="email"
                  placeholder="Email address"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  className="glass-input"
                />
              </div>

              {/* Password */}
              <div className="relative mb-2">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  className="glass-input pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength */}
              {signupPassword.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mb-3 px-1"
                >
                  <div className="flex gap-1.5 mb-1.5">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className="strength-bar flex-1"
                        style={{
                          background: level <= strength.score ? strength.color : 'rgba(255,255,255,0.06)',
                          opacity: level <= strength.score ? 1 : 0.5,
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-semibold" style={{ color: strength.color }}>
                    {strength.label}
                  </span>
                </motion.div>
              )}

              {/* Confirm Password */}
              <div className="relative mb-3">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm Password"
                  value={signupConfirm}
                  onChange={(e) => setSignupConfirm(e.target.value)}
                  className="glass-input pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Country + Theme Row */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="relative">
                  <select
                    value={signupCountry}
                    onChange={(e) => setSignupCountry(e.target.value)}
                    className="glass-select"
                  >
                    <option value="" disabled>Country</option>
                    {countries.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25 pointer-events-none" />
                </div>
                <div className="relative">
                  <select
                    value={signupTheme}
                    onChange={(e) => setSignupTheme(e.target.value)}
                    className="glass-select"
                  >
                    <option value="" disabled>Memory Theme</option>
                    {memoryThemes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25 pointer-events-none" />
                </div>
              </div>

              {/* Terms */}
              <label className="flex items-start gap-2.5 cursor-pointer mb-5 group">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="glass-checkbox mt-0.5"
                />
                <span className="text-[11.5px] text-white/35 group-hover:text-white/50 transition-colors leading-relaxed">
                  I agree to the{' '}
                  <a href="#" className="text-neonPink/70 hover:text-neonPink transition-colors font-medium">Terms</a>
                  {' '}&{' '}
                  <a href="#" className="text-neonPink/70 hover:text-neonPink transition-colors font-medium">Privacy Policy</a>
                </span>
              </label>

              {/* Submit */}
              <button className="btn-cosmic-primary w-full text-[14px] mb-4 flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" />
                Create My Universe
              </button>

              {/* Divider */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1 h-[1px] bg-white/[0.06]" />
                <span className="text-[10px] font-bold tracking-widest text-white/25 uppercase">OR</span>
                <div className="flex-1 h-[1px] bg-white/[0.06]" />
              </div>

              {/* Social */}
              <button className="btn-glass w-full flex items-center justify-center gap-3 text-[13px] mb-3">
                <Globe className="w-4 h-4" />
                Continue with Google
              </button>
              <button className="btn-glass w-full flex items-center justify-center gap-3 text-[13px]">
                <Smartphone className="w-4 h-4" />
                Continue with Apple
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
