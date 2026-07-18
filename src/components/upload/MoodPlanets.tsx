'use client'

import { useState, useMemo, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'

interface MoodPlanetsProps {
  selected: number | null
  onSelect: (index: number) => void
}

interface Particle {
  x: number
  y: number
  size: number
  delay: number
  dur: number
  driftX: number
  driftY: number
}

const lcg = (seed: number) => {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

const moods = [
  {
    emoji: '😊', label: 'Happy',
    color1: '#facc15', color2: '#f59e0b',
    glow: 'rgba(250,204,21,0.4)',
    ringColor: 'rgba(250,204,21,0.2)',
    particles: { count: 4, color: '#fde047', type: 'sparkles' as const },
  },
  {
    emoji: '❤️', label: 'Loved',
    color1: '#ec4899', color2: '#e11d48',
    glow: 'rgba(236,72,153,0.4)',
    ringColor: 'rgba(236,72,153,0.2)',
    particles: { count: 4, color: '#f472b6', type: 'hearts' as const },
  },
  {
    emoji: '🥹', label: 'Emotional',
    color1: '#8b5cf6', color2: '#6d28d9',
    glow: 'rgba(139,92,246,0.4)',
    ringColor: 'rgba(139,92,246,0.2)',
    particles: { count: 5, color: '#a78bfa', type: 'mist' as const },
  },
  {
    emoji: '🌧️', label: 'Rainy',
    color1: '#60a5fa', color2: '#3b82f6',
    glow: 'rgba(96,165,250,0.35)',
    ringColor: 'rgba(96,165,250,0.15)',
    particles: { count: 4, color: '#93c5fd', type: 'droplets' as const },
  },
  {
    emoji: '✨', label: 'Magical',
    color1: '#a855f7', color2: '#7c3aed',
    glow: 'rgba(168,85,247,0.45)',
    ringColor: 'rgba(168,85,247,0.2)',
    particles: { count: 5, color: '#c084fc', type: 'stars' as const },
  },
  {
    emoji: '🌊', label: 'Peaceful',
    color1: '#14b8a6', color2: '#0d9488',
    glow: 'rgba(20,184,166,0.35)',
    ringColor: 'rgba(20,184,166,0.15)',
    particles: { count: 3, color: '#5eead4', type: 'waves' as const },
  },
  {
    emoji: '😆', label: 'Funny',
    color1: '#f97316', color2: '#ea580c',
    glow: 'rgba(249,115,22,0.4)',
    ringColor: 'rgba(249,115,22,0.2)',
    particles: { count: 3, color: '#fb923c', type: 'bounce' as const },
  },
  {
    emoji: '🌅', label: 'Nostalgic',
    color1: '#f59e0b', color2: '#d97706',
    glow: 'rgba(245,158,11,0.4)',
    ringColor: 'rgba(245,158,11,0.2)',
    particles: { count: 4, color: '#fbbf24', type: 'embers' as const },
  },
]

const particleConfigs: Record<string, (p: Particle, color: string, i: number) => React.ReactNode> = {
  sparkles: (p, color, i) => (
    <motion.div
      key={`sparkle-${i}`}
      className="absolute rounded-full pointer-events-none"
      style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, backgroundColor: color }}
      animate={{ opacity: [0, 0.9, 0], scale: [0, 1.3, 0], y: [0, -12 - p.driftY * 6] }}
      transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: 'easeOut' }}
    />
  ),
  hearts: (p, color, i) => (
    <motion.span
      key={`heart-${i}`}
      className="absolute pointer-events-none text-[6px]"
      style={{ left: `${p.x}%`, top: `${p.y}%` }}
      animate={{ opacity: [0, 1, 0], y: [0, -14 - p.driftY * 6], x: [0, p.driftX * 4] }}
      transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: 'easeOut' }}
    >
      ♥
    </motion.span>
  ),
  mist: (p, color, i) => (
    <motion.div
      key={`mist-${i}`}
      className="absolute rounded-full pointer-events-none blur-[2px]"
      style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size * 2.5, height: p.size * 2.5, backgroundColor: color }}
      animate={{ opacity: [0, 0.5, 0], scale: [0, 1.6, 0], x: [0, p.driftX * 8] }}
      transition={{ duration: p.dur * 1.5, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
    />
  ),
  droplets: (p, color, i) => (
    <motion.div
      key={`droplet-${i}`}
      className="absolute rounded-full pointer-events-none"
      style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size * 0.8, height: p.size * 1.8, backgroundColor: color }}
      animate={{ opacity: [0, 0.7, 0], y: [0, 10 + p.driftY * 4] }}
      transition={{ duration: p.dur * 0.8, repeat: Infinity, delay: p.delay, ease: 'easeIn' }}
    />
  ),
  stars: (p, color, i) => (
    <motion.div
      key={`star-particle-${i}`}
      className="absolute pointer-events-none"
      style={{ left: `${p.x}%`, top: `${p.y}%` }}
      animate={{ opacity: [0, 1, 0], rotate: [0, 180, 360], scale: [0, 1.2, 0] }}
      transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: 'easeOut' }}
    >
      <svg width={p.size * 2.5} height={p.size * 2.5} viewBox="0 0 10 10" fill={color}>
        <polygon points="5,0 6.5,3.5 10,4 7.5,6.5 8,10 5,8 2,10 2.5,6.5 0,4 3.5,3.5" />
      </svg>
    </motion.div>
  ),
  waves: (p, color, i) => (
    <motion.div
      key={`wave-${i}`}
      className="absolute rounded-full pointer-events-none border"
      style={{
        left: `${p.x}%`, top: `${p.y}%`,
        width: p.size * 2, height: p.size * 1.2,
        borderColor: color, backgroundColor: 'transparent',
      }}
      animate={{ opacity: [0, 0.6, 0], scale: [0, 1.5, 0], x: [0, p.driftX * 6] }}
      transition={{ duration: p.dur * 1.2, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
    />
  ),
  bounce: (p, color, i) => (
    <motion.div
      key={`bounce-${i}`}
      className="absolute rounded-full pointer-events-none"
      style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, backgroundColor: color }}
      animate={{ opacity: [0, 0.8, 0], y: [0, -8, 0, -5, 0], scale: [0, 1, 0] }}
      transition={{ duration: p.dur * 0.7, repeat: Infinity, delay: p.delay, ease: 'easeOut' }}
    />
  ),
  embers: (p, color, i) => (
    <motion.div
      key={`ember-${i}`}
      className="absolute rounded-full pointer-events-none blur-[1px]"
      style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, backgroundColor: color, boxShadow: `0 0 4px ${color}` }}
      animate={{ opacity: [0, 0.9, 0], y: [0, -10 - p.driftY * 5], scale: [0, 1.4, 0] }}
      transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: 'easeOut' }}
    />
  ),
}

export default function MoodPlanets({ selected, onSelect }: MoodPlanetsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mouseRef = useRef({ x: 0.5, y: 0.5 })
  const [mouseInside, setMouseInside] = useState(false)

  const particles = useMemo(() => {
    const rng = lcg(303)
    return moods.map((m) =>
      Array.from({ length: m.particles.count }).map(() => ({
        x: rng() * 80 + 10,
        y: rng() * 70 + 15,
        size: rng() * 2 + 1.5,
        delay: rng() * 4,
        dur: rng() * 2 + 2,
        driftX: rng() * 2 - 1,
        driftY: rng() * 2 - 1,
      })),
    )
  }, [])

  const handleMouse = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    mouseRef.current = {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    }
  }, [])

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouse}
      onMouseEnter={() => setMouseInside(true)}
      onMouseLeave={() => setMouseInside(false)}
      className="flex gap-2 md:gap-2.5 flex-wrap"
    >
      {moods.map((mood, i) => {
        const isSelected = selected === i
        return (
          <motion.button
            key={mood.label}
            onClick={() => onSelect(i)}
            className="flex flex-col items-center gap-1.5 group relative"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
          >
            <div className="relative">
              {/* Atmosphere glow */}
              <motion.div
                className="absolute inset-[-8px] rounded-full blur-md pointer-events-none"
                style={{ background: `radial-gradient(circle, ${mood.glow} 0%, transparent 70%)` }}
                animate={{
                  opacity: isSelected ? [0.5, 1, 0.5] : 0.25,
                  scale: isSelected ? [1, 1.2, 1] : 1,
                }}
                transition={{ duration: 3, repeat: isSelected ? Infinity : 0, ease: 'easeInOut' }}
              />

              {/* Outer orbit ring */}
              <motion.div
                className="absolute inset-[-10px] rounded-full border pointer-events-none"
                style={{ borderColor: mood.ringColor }}
                animate={{ rotate: 360 }}
                transition={{ duration: 14 + i * 2, repeat: Infinity, ease: 'linear' }}
              />

              {/* Partial orbit ring accent */}
              <motion.div
                className="absolute inset-[-10px] rounded-full pointer-events-none"
                style={{
                  borderTop: `1.5px solid ${mood.ringColor}`,
                  clipPath: 'inset(0 45% 0 45%)',
                }}
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 10 + i * 3, repeat: Infinity, ease: 'linear' }}
              />

              {/* Planet body */}
              <motion.div
                className="relative w-11 h-11 rounded-full flex items-center justify-center text-lg overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${mood.color1}, ${mood.color2})`,
                  boxShadow: `0 0 20px ${mood.glow}, inset 0 -4px 8px rgba(0,0,0,0.3)`,
                }}
                animate={
                  isSelected
                    ? {
                        y: [0, -3, 0],
                        rotate: [0, 6, 0],
                        scale: 1.05,
                      }
                    : {
                        y: [0, -2, 0],
                        rotate: [0, 4, 0],
                      }
                }
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.15 }}
              >
                {/* Surface texture highlight (glass reflection) */}
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'radial-gradient(circle at 30% 25%, rgba(255,255,255,0.35) 0%, transparent 55%)',
                  }}
                />

                {/* Secondary rim light */}
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'radial-gradient(circle at 70% 20%, rgba(255,255,255,0.1) 0%, transparent 40%)',
                  }}
                />

                {/* Shadow at bottom */}
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'radial-gradient(circle at 50% 85%, rgba(0,0,0,0.35) 0%, transparent 50%)',
                  }}
                />

                {/* Subtle ring shadow on planet surface */}
                <div
                  className="absolute w-full h-[40%] top-[55%] rounded-full"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${mood.color1}44, transparent)`,
                    filter: 'blur(2px)',
                    opacity: 0.4,
                  }}
                />

                {/* Equatorial band */}
                <div
                  className="absolute w-full h-[6px] top-[48%] rounded-full"
                  style={{
                    background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)`,
                    filter: 'blur(2px)',
                  }}
                />

                <span className="relative z-10 drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
                  {mood.emoji}
                </span>
              </motion.div>

              {/* Selected outer glow ring */}
              {isSelected && (
                <motion.div
                  className="absolute inset-[-5px] rounded-full border-2 border-neonPink/60"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: [0.5, 1, 0.5], scale: 1 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ boxShadow: '0 0 14px rgba(255,75,145,0.35), inset 0 0 6px rgba(255,75,145,0.15)' }}
                />
              )}

              {/* Sparkle burst on selection */}
              {isSelected &&
                Array.from({ length: 4 }).map((_, si) => {
                  const angle = (si / 4) * 360
                  const dist = 14 + si * 2
                  return (
                    <motion.div
                      key={`burst-${si}`}
                      className="absolute w-1 h-1 rounded-full bg-neonPink pointer-events-none"
                      initial={{ x: 0, y: 0, opacity: 0 }}
                      animate={{
                        x: [0, Math.cos((angle * Math.PI) / 180) * dist],
                        y: [0, Math.sin((angle * Math.PI) / 180) * dist],
                        opacity: [0, 0.8, 0],
                        scale: [0, 1.5, 0],
                      }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                  )
                })}

              {/* Per-mood floating particles */}
              {particles[i].map((p, pi) => {
                const renderer = particleConfigs[mood.particles.type]
                return renderer ? renderer(p, mood.particles.color, pi) : null
              })}
            </div>

            <span
              className={`text-[8px] font-medium transition-all duration-300 ${
                isSelected
                  ? 'text-white drop-shadow-[0_0_4px_rgba(255,75,145,0.3)]'
                  : 'text-gray-500 group-hover:text-gray-300'
              }`}
            >
              {mood.label}
            </span>
          </motion.button>
        )
      })}
    </div>
  )
}
