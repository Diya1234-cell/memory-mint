'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CalendarDays, Eye, EyeOff, Lock, Send, Clock3, ChevronDown } from 'lucide-react'
import { Settings, PRIVACY_OPTIONS } from './types'

function Toggle({ on, setOn, label }: { on: boolean; setOn: (v: boolean) => void; label?: string }) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      onClick={() => setOn(!on)}
      className={`relative h-5 w-10 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-pink-300 ${on ? 'bg-fuchsia-400 shadow-[0_0_16px_rgba(244,114,255,.85)]' : 'bg-white/15'}`}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow"
        animate={{ left: on ? 20 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </motion.button>
  )
}

function Countdown({ releaseDate }: { releaseDate: string }) {
  const [now, setNow] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setNow(Date.now())
    setMounted(true)
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const delta = Math.max(0, new Date(`${releaseDate}T00:00:00`).getTime() - now)
  const days = String(Math.floor(delta / 86400000)).padStart(3, '0')
  const hrs = String(Math.floor(delta / 3600000) % 24).padStart(2, '0')
  const min = String(Math.floor(delta / 60000) % 60).padStart(2, '0')
  const sec = String(Math.floor(delta / 1000) % 60).padStart(2, '0')

  if (!mounted) {
    return (
      <div className="rounded-xl border border-pink-300/20 bg-gradient-to-r from-fuchsia-600/25 to-violet-600/20 p-3">
        <p className="text-xs text-white/65">
          Countdown <span className="float-right text-xl">⌛</span>
        </p>
        <p className="mt-2 font-serif text-2xl tracking-[.15em] text-pink-200">
          --- -- -- --
        </p>
        <p className="text-[8px] tracking-[.38em] text-white/45">DAYS HRS MIN SEC</p>
      </div>
    )
  }

  return (
    <motion.div
      className="rounded-xl border border-pink-300/20 bg-gradient-to-r from-fuchsia-600/25 to-violet-600/20 p-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <p className="text-xs text-white/65">
        Countdown <span className="float-right text-xl">⌛</span>
      </p>
      <motion.p
        initial={{ opacity: 0.7 }}
        animate={{ opacity: 1 }}
        className="mt-2 font-serif text-2xl tracking-[.15em] text-pink-200"
      >
        {days} {hrs} {min} {sec}
      </motion.p>
      <p className="text-[8px] tracking-[.38em] text-white/45">DAYS HRS MIN SEC</p>
    </motion.div>
  )
}

interface Props {
  settings: Settings
  onUpdate: (s: Settings) => void
}

export default function TimeCapsulePanel({ settings, onUpdate }: Props) {
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [password, setPassword] = useState('')
  const [privacyOpen, setPrivacyOpen] = useState(false)

  const strength = password.length < 4 ? 'Weak' : password.length < 8 ? 'Fair' : 'Strong'
  const strengthColor = strength === 'Strong' ? 'text-emerald-300' : strength === 'Fair' ? 'text-amber-300' : 'text-pink-300'

  const glass = {
    background: 'linear-gradient(135deg, rgba(255,255,255,.09), rgba(32,12,68,.62) 44%, rgba(14,5,35,.72))',
    border: '1px solid rgba(237,184,255,.17)',
    boxShadow: '0 18px 48px rgba(0,0,0,.32), inset 0 1px rgba(255,255,255,.13), 0 0 32px rgba(210,87,255,.11)',
    backdropFilter: 'blur(26px) saturate(145%)',
  }

  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      className="rounded-[24px] p-4 space-y-4"
      style={glass}
    >
      <h2 className="font-serif text-lg">🗓️ Time Capsule Controls</h2>

      {/* Release Date */}
      <label className="block text-xs text-white/65">
        Release Date
        <div className="mt-1.5 flex items-center justify-between rounded-xl border border-white/10 bg-black/15 p-3 text-white">
          <input
            type="date"
            value={settings.releaseDate}
            onChange={e => onUpdate({ ...settings, releaseDate: e.target.value })}
            className="w-full bg-transparent text-xs outline-none [color-scheme:dark]"
          />
          <CalendarDays className="w-4 ml-2 shrink-0" />
        </div>
      </label>

      {/* Lock Capsule */}
      <div>
        <div className="flex justify-between text-xs">
          <span><Lock className="inline w-3.5 mr-1 text-pink-200" />Lock Capsule</span>
          <Toggle on={settings.locked} setOn={v => onUpdate({ ...settings, locked: v })} />
        </div>
        <AnimatePresence>
          {settings.locked && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="mt-2 flex justify-between rounded-xl border border-white/10 bg-black/15 p-3 text-xs text-white/65">
                <input
                  type={passwordVisible ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Password protection"
                  className="w-full bg-transparent outline-none"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setPasswordVisible(!passwordVisible)}
                >
                  {passwordVisible ? <EyeOff className="w-4" /> : <Eye className="w-4" />}
                </motion.button>
              </div>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`mt-1 text-[10px] ${strengthColor}`}>
                Password strength: {strength}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Future Delivery */}
      <div>
        <div className="flex justify-between text-xs">
          <span><Send className="inline w-3.5 mr-1 text-pink-200" />Future Delivery</span>
          <Toggle on={settings.reminder} setOn={v => onUpdate({ ...settings, reminder: v })} />
        </div>
        <AnimatePresence>
          {settings.reminder && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="mt-2 rounded-xl border border-white/10 bg-black/15 p-3 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Reminder Date</span>
                  <Clock3 className="w-3.5 text-white/40" />
                </div>
                <input
                  type="date"
                  value={settings.reminderDate || settings.releaseDate}
                  onChange={e => onUpdate({ ...settings, reminderDate: e.target.value })}
                  className="w-full bg-transparent text-xs outline-none text-white/70 [color-scheme:dark]"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Countdown */}
      <Countdown releaseDate={settings.releaseDate} />

      {/* Privacy */}
      <div className="relative">
        <button
          onClick={() => setPrivacyOpen(!privacyOpen)}
          className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-black/15 p-3 text-xs text-white/65 hover:border-pink-300/30 transition-colors"
        >
          <span>🔐 {settings.privacy}</span>
          <motion.div animate={{ rotate: privacyOpen ? 180 : 0 }}>
            <ChevronDown className="w-4" />
          </motion.div>
        </button>
        <AnimatePresence>
          {privacyOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.95 }}
              className="absolute z-30 mt-1 w-full rounded-xl border border-white/15 bg-[#261043] p-1 shadow-2xl"
            >
              {PRIVACY_OPTIONS.map(p => (
                <motion.button
                  key={p}
                  whileHover={{ x: 2 }}
                  onClick={() => { onUpdate({ ...settings, privacy: p }); setPrivacyOpen(false) }}
                  className={`w-full text-left rounded-lg px-3 py-2 text-xs transition-colors ${
                    settings.privacy === p ? 'bg-fuchsia-500/30 text-white' : 'text-white/65 hover:bg-white/10'
                  }`}
                >
                  {p === 'Private' ? '🔒' : p === 'Friends' ? '👥' : p === 'Family' ? '👨‍👩‍👧' : '🌍'} {p}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* AI Writing */}
      <div className="flex justify-between items-center text-xs">
        <span>🤖 AI Writing</span>
        <Toggle on={settings.ai} setOn={v => onUpdate({ ...settings, ai: v })} />
      </div>
    </motion.aside>
  )
}
