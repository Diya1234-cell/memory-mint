'use client'

import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMemory } from '@/context/MemoryContext'

const lcg = (seed: number) => {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

const stars = [
  { x: 40, y: 80, r: 2.5, label: 'S1' },
  { x: 75, y: 32, r: 3, label: 'S2' },
  { x: 120, y: 58, r: 4, label: 'S3' },
  { x: 165, y: 22, r: 2, label: 'S4' },
  { x: 210, y: 62, r: 3, label: 'S5' },
]

const pendingPos = { x: 255, y: 35 }

const constellationPath = stars.map((s) => `${s.x},${s.y}`).join(' L ')
const fullPath = `M ${constellationPath} L ${pendingPos.x},${pendingPos.y}`

export default function MemoryGalaxyPreview() {
  const { triggerSave, showSuccessModal, dismissSuccessModal, resetDraft } = useMemory()
  const cardRef = useRef<HTMLDivElement>(null)
  const mouseRef = useRef({ x: 0.5, y: 0.5 })
  const prevTrigger = useRef(0)

  const [phase, setPhase] = useState<'idle' | 'constellation' | 'glowing' | 'shooting' | 'exploding' | 'expanding' | 'text' | 'modal'>('idle')

  const floatingParticles = useMemo(() => {
    const rng = lcg(606)
    return Array.from({ length: 8 }).map(() => ({
      x: rng() * 100,
      y: rng() * 100,
      size: rng() * 1.5 + 0.5,
      dur: rng() * 5 + 3,
      delay: rng() * 4,
    }))
  }, [])

  const sparkleParticles = useMemo(() => {
    const rng = lcg(808)
    return Array.from({ length: 10 }).map(() => ({
      x: rng() * 100,
      y: rng() * 100,
      size: rng() * 1 + 0.3,
      delay: rng() * 6,
    }))
  }, [])

  const burstParticles = useMemo(() => {
    const rng = lcg(909)
    return Array.from({ length: 8 }).map(() => ({
      angle: rng() * 360,
      dist: rng() * 20 + 8,
      size: rng() * 1.5 + 0.5,
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

  useEffect(() => {
    const t = setTimeout(() => setPhase('constellation'), 600)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (triggerSave > prevTrigger.current && phase === 'constellation') {
      prevTrigger.current = triggerSave
      setPhase('glowing')
    }
  }, [triggerSave, phase])

  useEffect(() => {
    if (phase === 'glowing') {
      const t = setTimeout(() => setPhase('shooting'), 1200)
      return () => clearTimeout(t)
    }
    if (phase === 'shooting') {
      const t = setTimeout(() => setPhase('exploding'), 1000)
      return () => clearTimeout(t)
    }
    if (phase === 'exploding') {
      const t = setTimeout(() => setPhase('expanding'), 800)
      return () => clearTimeout(t)
    }
    if (phase === 'expanding') {
      const t = setTimeout(() => setPhase('text'), 1400)
      return () => clearTimeout(t)
    }
    if (phase === 'text') {
      const t = setTimeout(() => setPhase('modal'), 2200)
      return () => clearTimeout(t)
    }
  }, [phase])

  const handleCreateAnother = useCallback(() => {
    dismissSuccessModal()
    setPhase('constellation')
    resetDraft()
  }, [dismissSuccessModal, resetDraft])

  const handleContinueEditing = useCallback(() => {
    dismissSuccessModal()
  }, [dismissSuccessModal])

  const renderStar = (s: typeof stars[number], i: number) => {
    const isCenter = i === 2
    const isBright = phase === 'glowing' || phase === 'shooting' || phase === 'exploding' || phase === 'expanding' || phase === 'text'
    return (
      <g key={s.label}>
        <motion.circle
          cx={s.x} cy={s.y} r={s.r * 3}
          fill={`rgba(168,85,247,${isCenter && isBright ? 0.06 : 0.02})`}
          animate={{
            r: isCenter && isBright ? [s.r * 3, s.r * 5, s.r * 3] : [s.r * 3, s.r * 3.5, s.r * 3],
            opacity: isCenter && isBright ? [0.04, 0.12, 0.04] : [0.015, 0.04, 0.015],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.circle
          cx={s.x} cy={s.y} r={s.r * 2}
          fill={`rgba(255,75,145,${isCenter && isBright ? 0.1 : 0.035})`}
          animate={{
            r: isCenter && isBright ? [s.r * 2, s.r * 3.5, s.r * 2] : [s.r * 2, s.r * 2.5, s.r * 2],
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }}
        />
        <motion.circle
          cx={s.x} cy={s.y} r={s.r}
          fill="#fff"
          animate={{
            r: isCenter && isBright ? [s.r, s.r * 1.4, s.r] : [s.r, s.r * 1.15, s.r],
            opacity: isCenter && isBright ? [0.7, 1, 0.7] : [0.45, 0.85, 0.45],
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.15 }}
        />
        <motion.circle
          cx={s.x} cy={s.y} r={s.r * 0.4}
          fill="rgba(255,255,255,0.8)"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.1 }}
        />
      </g>
    )
  }

  const renderCurrentMemoryStar = () => {
    if (phase === 'idle' || phase === 'constellation') return null
    const sx = 120, sy = 58
    return (
      <g>
        <motion.circle
          cx={sx} cy={sy} r={8}
          fill="rgba(255,75,145,0.08)"
          animate={{ r: [8, 20, 8], opacity: [0.06, 0.15, 0.06] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.circle
          cx={sx} cy={sy} r={5}
          fill="rgba(168,85,247,0.12)"
          animate={{ r: [5, 14, 5] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.circle
          cx={sx} cy={sy} r={4}
          fill="#ff4b91"
          animate={{ r: [4, 6, 4], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.circle
          cx={sx} cy={sy} r={2}
          fill="#fff"
          animate={{ r: [2, 3, 2] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </g>
    )
  }

  const renderPendingStar = () => {
    const isOccupied = phase === 'exploding' || phase === 'expanding' || phase === 'text' || phase === 'modal'
    if (isOccupied) {
      return (
        <g>
          <motion.circle
            cx={pendingPos.x} cy={pendingPos.y} r={8}
            fill="rgba(255,75,145,0.1)"
            animate={{ r: [8, 14, 8], opacity: [0.06, 0.15, 0.06] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.circle
            cx={pendingPos.x} cy={pendingPos.y} r={5}
            fill="rgba(168,85,247,0.15)"
            animate={{ r: [5, 10, 5] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.circle
            cx={pendingPos.x} cy={pendingPos.y} r={3.5}
            fill="#ff4b91"
            animate={{ r: [3.5, 5, 3.5], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.circle
            cx={pendingPos.x} cy={pendingPos.y} r={1.8}
            fill="#fff"
            animate={{ r: [1.8, 2.5, 1.8] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </g>
      )
    }
    return (
      <g>
        <motion.circle
          cx={pendingPos.x} cy={pendingPos.y} r={2}
          fill="rgba(168,85,247,0.2)"
          animate={{ r: [2, 2.5, 2], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.circle
          cx={pendingPos.x} cy={pendingPos.y} r={1}
          fill="rgba(255,255,255,0.15)"
          animate={{ opacity: [0.1, 0.25, 0.1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </g>
    )
  }

  const sx = 120, sy = 58
  const ex = pendingPos.x, ey = pendingPos.y

  const renderShootingStar = () => {
    if (phase !== 'shooting') return null
    return (
      <g>
        <defs>
          <linearGradient id="shootingGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(168,85,247,0)" />
            <stop offset="60%" stopColor="rgba(255,75,145,0.6)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.9)" />
          </linearGradient>
        </defs>
        <motion.line
          x1={sx} y1={sy} x2={sx} y2={sy}
          stroke="url(#shootingGrad)"
          strokeWidth="2"
          strokeLinecap="round"
          animate={{ x2: ex, y2: ey }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
        />
        <motion.circle
          cx={sx} cy={sy} r={3}
          fill="#fff"
          animate={{ cx: ex, cy: ey }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          style={{ filter: 'drop-shadow(0 0 8px rgba(168,85,247,0.7))' }}
        />
        <motion.circle
          cx={sx} cy={sy} r={1.5}
          fill="#a855f7"
          animate={{ cx: ex, cy: ey }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
        />
        {/* Trail sparkles */}
        {[0.2, 0.4, 0.6, 0.8].map((t, idx) => (
          <motion.circle
            key={`trail-${idx}`}
            cx={sx} cy={sy} r={1}
            fill="rgba(255,255,255,0.4)"
            animate={{
              cx: sx + (ex - sx) * t,
              cy: sy + (ey - sy) * t,
              opacity: [0, 0.6, 0],
              r: [0, 1.5, 0],
            }}
            transition={{
              duration: 0.5,
              ease: 'easeOut',
              delay: t * 0.15,
            }}
          />
        ))}
      </g>
    )
  }

  const renderBurst = () => {
    if (phase !== 'exploding') return null
    return (
      <g>
        {burstParticles.map((bp, i) => (
          <motion.circle
            key={i}
            cx={pendingPos.x} cy={pendingPos.y} r={bp.size}
            fill="#ff4b91"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              cx: pendingPos.x + Math.cos((bp.angle * Math.PI) / 180) * bp.dist,
              cy: pendingPos.y + Math.sin((bp.angle * Math.PI) / 180) * bp.dist,
              opacity: [0, 0.8, 0],
              scale: [0, 1.2, 0],
            }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: i * 0.03 }}
          />
        ))}
      </g>
    )
  }

  return (
    <>
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouse}
        className="relative rounded-3xl p-6 overflow-hidden group"
        style={{ background: 'rgba(255,255,255,0.035)', backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.03)' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ y: -2 }}
      >
        <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/[0.02] pointer-events-none" />
        <div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at ${mouseRef.current.x * 100}% ${mouseRef.current.y * 100}%, rgba(255,255,255,0.03) 0%, transparent 60%)`,
          }}
        />

        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-[0.04] pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.3) 0%, transparent 70%)', filter: 'blur(50px)' }}
        />
        <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full opacity-[0.03] pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(255,75,145,0.2) 0%, transparent 70%)', filter: 'blur(40px)' }}
        />

        {floatingParticles.map((p, i) => (
          <motion.div
            key={`fp-${i}`}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: `${p.x}%`, top: `${p.y}%`,
              width: p.size, height: p.size,
              backgroundColor: 'rgba(168,85,247,0.15)',
            }}
            animate={{ y: [0, -10, 0], opacity: [0, 0.4, 0] }}
            transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
          />
        ))}

        {sparkleParticles.map((p, i) => (
          <motion.div
            key={`sp-${i}`}
            className="absolute rounded-full pointer-events-none bg-white"
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
          />
        ))}

        <div className="relative z-10">
          <div className="mb-3">
            <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">
              Memory Galaxy Preview
            </h3>
            <p className="text-[9px] text-gray-600 font-medium mt-1">
              This memory will become a new star.
            </p>
          </div>

          <div className="relative w-full h-[130px]">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 120" preserveAspectRatio="xMidYMid meet">
              <motion.path
                d={fullPath}
                fill="none"
                stroke="rgba(168,85,247,0.12)"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: 'easeOut' }}
              />
              <motion.path
                d={fullPath}
                fill="none"
                stroke="rgba(255,75,145,0.08)"
                strokeWidth="1.5"
                strokeDasharray="4 8"
                animate={{ strokeDashoffset: [0, -24] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              />
              {(phase === 'expanding' || phase === 'text' || phase === 'modal') && (
                <>
                  {[3, 4].map((idx) => {
                    const s = stars[idx]
                    return (
                      <motion.line
                        key={`conn-${idx}`}
                        x1={s.x} y1={s.y}
                        x2={pendingPos.x} y2={pendingPos.y}
                        stroke="rgba(255,75,145,0.2)"
                        strokeWidth="1"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 + idx * 0.15 }}
                      />
                    )
                  })}
                </>
              )}

              {stars.map((s, i) => renderStar(s, i))}
              {renderCurrentMemoryStar()}
              {renderPendingStar()}
              {renderBurst()}
              {renderShootingStar()}
            </svg>

            <AnimatePresence>
              {phase === 'text' && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                  <span className="text-xs font-bold text-white drop-shadow-[0_0_12px_rgba(168,85,247,0.4)] px-4 py-2 rounded-full bg-black/30 backdrop-blur-sm border border-white/10">
                    ✨ Memory Added To Your Universe
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div className="absolute inset-0 bg-black/15 backdrop-blur-sm" onClick={handleContinueEditing} />
            <motion.div
              className="relative w-full max-w-sm rounded-3xl border border-white/10 p-7 shadow-2xl overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)' }}
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-20 pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.3) 0%, transparent 70%)', filter: 'blur(30px)' }}
              />
              <div className="relative z-10 text-center space-y-4">
                <div className="w-16 h-16 mx-auto relative">
                  <motion.div
                    className="absolute inset-0 rounded-full blur-lg"
                    style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.3) 0%, transparent 70%)' }}
                    animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <div className="absolute inset-[15%] rounded-full flex items-center justify-center"
                    style={{
                      background: 'radial-gradient(circle at 40% 35%, rgba(168,85,247,0.4) 0%, rgba(255,75,145,0.2) 50%, transparent 80%)',
                    }}
                  >
                    <motion.span
                      className="text-xl"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      ✨
                    </motion.span>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white">✨ Memory Ready</h3>
                <p className="text-sm text-gray-400">
                  Your memory is ready to become part of your universe.
                </p>
              </div>
              <div className="relative z-10 flex gap-3 mt-6">
                <motion.button
                  onClick={handleContinueEditing}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-gray-300 bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Continue Editing
                </motion.button>
                <motion.button
                  onClick={handleCreateAnother}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-neonPink/30 to-neonPurple/30 border border-neonPink/30 hover:from-neonPink/40 hover:to-neonPurple/40 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Create Another Memory
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
