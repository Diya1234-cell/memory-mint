'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/providers/AuthProvider'
import { hasUserSpace } from '@/services/firestoreService'

export default function SignupPage() {
  const router = useRouter()
  const { user, loading, signup } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!loading && user) {
      hasUserSpace(user.uid).then((exists) => {
        router.replace(exists ? '/dashboard' : '/create-space')
      })
    }
  }, [loading, user, router])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    const result = await signup(email.trim(), password, confirmPassword, name.trim())
    if (!result.success) {
      setError(result.message ?? 'Unable to create account.')
    }
  }

  return (
    <main className="min-h-screen bg-slate-950/90 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-[520px]">
        <div className="pb-8 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-neonPink/70 mb-3">Sign Up</p>
          <h1 className="text-3xl md:text-4xl font-semibold text-white">Build your memory universe</h1>
          <p className="mt-3 text-sm text-white/60">Create an account and keep your most precious moments secure.</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-full rounded-[32px] border border-white/10 bg-slate-950/85 p-8 shadow-[0_32px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
        >
          <div>
            <label className="text-sm text-white/60 mb-2 inline-block">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-14 py-4 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-500/20"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-white/60 mb-2 inline-block">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-14 py-4 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-500/20"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-white/60 mb-2 inline-block">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Create a password"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-14 py-4 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-500/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/35 hover:text-white/70 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm text-white/60 mb-2 inline-block">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Confirm your password"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-14 py-4 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-500/20"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((current) => !current)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/35 hover:text-white/70 transition-colors"
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error ? <p className="text-sm text-rose-400">{error}</p> : null}

          <button
            type="submit"
            className="w-full rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition hover:-translate-y-0.5"
          >
            Create account
          </button>

          <div className="flex items-center justify-between text-[12px] text-white/60 mt-4">
            <span />
            <a href="/login" className="text-pink-300 hover:text-white transition-colors">
              Already have an account? Log in
            </a>
          </div>
        </form>
      </div>
    </main>
  )
}
