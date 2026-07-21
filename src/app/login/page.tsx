'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/providers/AuthProvider'

export default function LoginPage() {
  const router = useRouter()
  const { user, loading, login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!loading && user) {
      router.replace('/dashboard')
    }
  }, [loading, user, router])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    const result = await login(email.trim(), password)
    if (result.success) {
      router.push('/dashboard')
      return
    }
    setError(result.message ?? 'Unable to sign in.')
  }

  return (
    <main className="min-h-screen bg-slate-950/90 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-[480px]">
        <div className="pb-8 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-neonPink/70 mb-3">Login</p>
          <h1 className="text-3xl md:text-4xl font-semibold text-white">Continue your cosmic journey</h1>
          <p className="mt-3 text-sm text-white/60">Sign in to access your saved memories and storybook content.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-glass-card border border-white/10 p-8 space-y-5 shadow-[0_32px_120px_rgba(0,0,0,0.45)]">
          <div>
            <label className="text-sm text-white/60 mb-2 inline-block">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="glass-input"
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
                placeholder="Enter password"
                className="glass-input pr-12"
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

          {error ? <p className="text-sm text-rose-400">{error}</p> : null}

          <button type="submit" className="btn-cosmic-primary w-full text-sm font-semibold py-4">
            Sign in and continue
          </button>

          <div className="flex items-center justify-between text-[12px] text-white/60 mt-4">
            <span />
            <a href="/signup" className="text-neonPink hover:text-white transition-colors">
              Need an account? Sign up
            </a>
          </div>
        </form>
      </div>
    </main>
  )
}
