'use client'

import { useState, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const actions = [
  { icon: '✨', label: 'Generate Caption' },
  { icon: '📖', label: 'Generate Story' },
  { icon: '📝', label: 'Describe this Memory' },
  { icon: '🏷️', label: 'Suggest Tags' },
  { icon: '💜', label: 'Detect Mood' },
  { icon: '🎙️', label: 'Summarize Voice Note' },
]

const lcg = (seed: number) => {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

export default function AIMemoryAssistant() {
  const [modalOpen, setModalOpen] = useState(false)
  const [activeAction, setActiveAction] = useState('')
  const cardRef = useRef<HTMLDivElement>(null)
  const mouseRef = useRef({ x: 0.5, y: 0.5 })

  const orbParticles = useMemo(() => {
    const rng = lcg(555)
    return Array.from({ length: 6 }).map(() => ({
      angle: rng() * 360,
      dist: rng() * 30 + 20,
      size: rng() * 1.5 + 0.5,
      dur: rng() * 4 + 3,
      delay: rng() * 3,
      color: rng() > 0.5 ? '#a855f7' : '#ff4b91',
    }))
  }, [])

  const starParticles = useMemo(() => {
    const rng = lcg(777)
    return Array.from({ length: 4 }).map(() => ({
      angle: rng() * 360,
      dist: rng() * 10 + 35,
      size: rng() * 1 + 0.5,
      dur: rng() * 3 + 2,
      delay: rng() * 2,
    }))
  }, [])

  const handleMouse = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    mouseRef.current = {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    }
  }, [])

  const openModal = useCallback((label: string) => {
    setActiveAction(label)
    setModalOpen(true)
  }, [])

  return (
    <>
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouse}
        className="relative rounded-3xl p-6 md:p-7 overflow-hidden group"
        style={{ background: 'rgba(255,255,255,0.035)', backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.03)' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ y: -2 }}
      >
        <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/[0.02] pointer-events-none" />
        {/* Glass reflection overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          style={{
            background: `radial-gradient(circle at ${mouseRef.current.x * 100}% ${mouseRef.current.y * 100}%, rgba(255,255,255,0.03) 0%, transparent 60%)`,
          }}
        />

        {/* Inner ambient glow */}
        <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full opacity-[0.04] pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(168,85,247,0.3) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />

        <div className="relative z-10 flex flex-col md:flex-row items-start gap-6">
          {/* ─── Left: Header + Button Grid ─── */}
          <div className="flex-1 w-full space-y-5">
            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-neonPink/20 to-neonPurple/20 border border-neonPink/30 flex items-center justify-center shadow-[0_0_12px_rgba(255,75,145,0.2)]">
                <span className="text-sm">✨</span>
              </div>
              <span className="text-sm font-medium text-white">AI Memory Assistant</span>
            </div>

            {/* Action Button Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {actions.map((action) => (
                <motion.button
                  key={action.label}
                  onClick={() => openModal(action.label)}
                  className="relative px-4 py-3 rounded-2xl text-xs font-medium text-left border backdrop-blur-sm bg-white/[0.04] border-white/10 text-gray-300 overflow-hidden group/btn"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                >
                  {/* Hover bloom */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{
                      background: 'radial-gradient(circle at center, rgba(168,85,247,0.08) 0%, transparent 70%)',
                    }}
                  />

                  {/* Glass shimmer on hover */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.03) 50%, transparent 70%)',
                    }}
                  />

                  {/* Border glow on hover */}
                  <div className="absolute inset-0 rounded-2xl border border-transparent group-hover/btn:border-neonPink/20 transition-all duration-300 pointer-events-none" />

                  <span className="relative z-10 flex items-center gap-2.5">
                    <span className="text-base drop-shadow-[0_0_6px_rgba(255,255,255,0.15)]">{action.icon}</span>
                    <span className="relative">
                      {action.label}
                      <span className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-neonPink/0 to-transparent group-hover/btn:via-neonPink/30 transition-all duration-300" />
                    </span>
                  </span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* ─── Right: AI Orb ─── */}
          <div className="flex-shrink-0 w-28 h-28 md:w-32 md:h-32 relative mx-auto md:mx-0 md:mt-8">
            {/* Outer glow */}
            <motion.div
              className="absolute inset-[-10px] rounded-full blur-xl pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)',
              }}
              animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.05, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Orbiting ring 1 */}
            <motion.div
              className="absolute inset-[-6px] rounded-full border pointer-events-none"
              style={{
                borderColor: 'rgba(168,85,247,0.15)',
                borderWidth: '1.5px',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            />

            {/* Orbiting ring 2 (dashed) */}
            <motion.div
              className="absolute inset-[-12px] rounded-full pointer-events-none"
              style={{
                border: '1px dashed rgba(255,75,145,0.1)',
              }}
              animate={{ rotate: -360 }}
              transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
            />

            {/* Orbiting ring 3 (partial) */}
            <motion.div
              className="absolute inset-[-18px] rounded-full pointer-events-none"
              style={{
                borderTop: '1px solid rgba(168,85,247,0.08)',
                clipPath: 'inset(0 40% 0 40%)',
              }}
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
            />

            {/* Conic gradient ring */}
            <motion.div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background: 'conic-gradient(from 0deg, transparent, rgba(168,85,247,0.2), transparent, rgba(255,75,145,0.15), transparent)',
                maskImage: 'radial-gradient(circle at center, transparent 45%, black 48%, black 52%, transparent 55%)',
                WebkitMaskImage: 'radial-gradient(circle at center, transparent 45%, black 48%, black 52%, transparent 55%)',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            />

            {/* Core sphere */}
            <motion.div
              className="absolute inset-[15%] rounded-full flex items-center justify-center overflow-hidden"
              style={{
                background: 'radial-gradient(circle at 40% 35%, rgba(168,85,247,0.5) 0%, rgba(255,75,145,0.25) 40%, rgba(99,102,241,0.15) 70%, transparent 100%)',
                boxShadow: '0 0 30px rgba(168,85,247,0.3), inset 0 0 20px rgba(255,75,145,0.1)',
              }}
              animate={{
                scale: [1, 1.04, 1],
                boxShadow: [
                  '0 0 25px rgba(168,85,247,0.25), inset 0 0 15px rgba(255,75,145,0.08)',
                  '0 0 40px rgba(168,85,247,0.4), inset 0 0 25px rgba(255,75,145,0.12)',
                  '0 0 25px rgba(168,85,247,0.25), inset 0 0 15px rgba(255,75,145,0.08)',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              {/* Inner nebula swirl */}
              <motion.div
                className="absolute inset-[-50%] rounded-full"
                style={{
                  background: 'conic-gradient(from 0deg, transparent, rgba(168,85,247,0.15), transparent, rgba(255,75,145,0.1), transparent)',
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
              />

              {/* Glass reflection on core */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'radial-gradient(circle at 35% 25%, rgba(255,255,255,0.15) 0%, transparent 50%)',
                }}
              />

              {/* AI text */}
              <span className="relative z-10 text-[10px] font-extrabold text-white/90 tracking-wider drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]">
                AI
              </span>
            </motion.div>

            {/* Orbiting star particles */}
            {starParticles.map((p, i) => (
              <motion.div
                key={`star-${i}`}
                className="absolute w-1 h-1 rounded-full pointer-events-none"
                style={{ backgroundColor: i % 2 === 0 ? '#a855f7' : '#ff4b91' }}
                animate={{
                  x: [
                    Math.cos((p.angle * Math.PI) / 180) * p.dist,
                    Math.cos(((p.angle + 180) * Math.PI) / 180) * p.dist,
                    Math.cos((p.angle * Math.PI) / 180) * p.dist,
                  ],
                  y: [
                    Math.sin((p.angle * Math.PI) / 180) * p.dist,
                    Math.sin(((p.angle + 180) * Math.PI) / 180) * p.dist,
                    Math.sin((p.angle * Math.PI) / 180) * p.dist,
                  ],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  duration: p.dur,
                  repeat: Infinity,
                  delay: p.delay,
                  ease: 'easeInOut',
                }}
              />
            ))}

            {/* Floating particles */}
            {orbParticles.map((p, i) => (
              <motion.div
                key={`orb-${i}`}
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: p.size,
                  height: p.size,
                  backgroundColor: p.color,
                  left: '50%',
                  top: '50%',
                }}
                animate={{
                  x: [
                    Math.cos((p.angle * Math.PI) / 180) * p.dist,
                    Math.cos(((p.angle + 90) * Math.PI) / 180) * p.dist * 1.2,
                    Math.cos(((p.angle + 180) * Math.PI) / 180) * p.dist,
                    Math.cos(((p.angle + 270) * Math.PI) / 180) * p.dist * 0.8,
                    Math.cos((p.angle * Math.PI) / 180) * p.dist,
                  ],
                  y: [
                    Math.sin((p.angle * Math.PI) / 180) * p.dist,
                    Math.sin(((p.angle + 90) * Math.PI) / 180) * p.dist * 1.2,
                    Math.sin(((p.angle + 180) * Math.PI) / 180) * p.dist,
                    Math.sin(((p.angle + 270) * Math.PI) / 180) * p.dist * 0.8,
                    Math.sin((p.angle * Math.PI) / 180) * p.dist,
                  ],
                  opacity: [0, 0.8, 0, 0.5, 0],
                  scale: [0, 1, 0, 0.6, 0],
                }}
                transition={{
                  duration: p.dur,
                  repeat: Infinity,
                  delay: p.delay,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* ─── Modal ─── */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/15 backdrop-blur-sm"
              onClick={() => setModalOpen(false)}
            />

            {/* Modal panel */}
            <motion.div
              className="relative w-full max-w-md rounded-3xl border border-white/10 p-8 shadow-2xl overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)' }}
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Ambient glow */}
              <div
                className="absolute -top-20 -left-20 w-48 h-48 rounded-full opacity-20 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(168,85,247,0.25) 0%, transparent 70%)',
                  filter: 'blur(40px)',
                }}
              />

              <div className="relative z-10 flex flex-col items-center text-center gap-5">
                {/* Animated AI orb (small) */}
                <div className="w-20 h-20 relative">
                  <motion.div
                    className="absolute inset-[-6px] rounded-full border pointer-events-none"
                    style={{ borderColor: 'rgba(168,85,247,0.15)' }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                  />

                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: 'conic-gradient(from 0deg, transparent, rgba(168,85,247,0.2), transparent, rgba(255,75,145,0.15), transparent)',
                      maskImage: 'radial-gradient(circle at center, transparent 40%, black 43%, black 57%, transparent 60%)',
                      WebkitMaskImage: 'radial-gradient(circle at center, transparent 40%, black 43%, black 57%, transparent 60%)',
                    }}
                    animate={{ rotate: -360 }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                  />

                  <motion.div
                    className="absolute inset-[12%] rounded-full flex items-center justify-center"
                    style={{
                      background: 'radial-gradient(circle at 40% 35%, rgba(168,85,247,0.5) 0%, rgba(255,75,145,0.25) 50%, transparent 80%)',
                      boxShadow: '0 0 25px rgba(168,85,247,0.3)',
                    }}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: 'radial-gradient(circle at 35% 25%, rgba(255,255,255,0.12) 0%, transparent 50%)',
                      }}
                    />
                    <motion.span
                      className="relative z-10 text-[9px] font-extrabold text-white/80 tracking-wider"
                      animate={{ opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      AI
                    </motion.span>
                  </motion.div>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white">
                    ✨ Coming Soon
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
                    The AI Memory Assistant is currently being crafted. Soon you&apos;ll be able to generate
                    captions, stories, descriptions, mood insights, tags, and summaries directly from your memories.
                  </p>
                </div>

                {/* Got it button */}
                <motion.button
                  onClick={() => setModalOpen(false)}
                  className="mt-2 px-8 py-3 rounded-2xl text-sm font-semibold text-white border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Got it
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
