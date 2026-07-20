'use client'

import { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Heart, Camera, MessageSquare, Video, BookOpen } from 'lucide-react'

function lcg(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

const floatingIcons = [
  { icon: Video, label: 'Videos', color: 'text-indigo-400', x: -310, y: -240, floatDur: 7.8, floatAmp: 7, rotateAmp: 2, driftX: 3, glow: 'rgba(99,102,241,0.25)' },
  { icon: Heart, label: 'Love', color: 'text-neonPink', x: -330, y: 30, floatDur: 6.8, floatAmp: 9, rotateAmp: -1.5, driftX: -2, glow: 'rgba(255,77,184,0.3)' },
  { icon: BookOpen, label: 'StoryBook', color: 'text-purple-400', x: 330, y: -70, floatDur: 9, floatAmp: 5, rotateAmp: 1.8, driftX: 2.5, glow: 'rgba(168,85,247,0.25)' },
  { icon: MessageSquare, label: 'Messages', color: 'text-neonPurple', x: -300, y: 260, floatDur: 8.5, floatAmp: 6, rotateAmp: -2, driftX: -3, glow: 'rgba(168,85,247,0.25)' },
  { icon: Camera, label: 'Photos', color: 'text-neonPink', x: 310, y: 260, floatDur: 7.2, floatAmp: 8, rotateAmp: 1.5, driftX: 2, glow: 'rgba(255,77,184,0.25)' },
]

const stars = (() => {
  const rng = lcg(42)
  return Array.from({ length: 28 }).map(() => ({
    x: rng() * 100,
    y: rng() * 100,
    size: rng() * 2.5 + 0.4,
    delay: rng() * 6,
    dur: rng() * 3 + 2,
  }))
})()

const particles = (() => {
  const rng = lcg(137)
  return Array.from({ length: 16 }).map((_, i) => ({
    x: rng() * 100,
    y: rng() * 100,
    size: rng() * 3 + 1,
    delay: rng() * 8,
    dur: rng() * 6 + 4,
    color: i % 4 === 0 ? 'rgba(255,77,184,0.18)' : i % 4 === 1 ? 'rgba(168,85,247,0.15)' : i % 4 === 2 ? 'rgba(192,132,252,0.14)' : 'rgba(99,102,241,0.13)',
  }))
})()

const orbitRings = [
  { rx: 260, ry: 78, rotate: -15, speed: 50, opacity: 0.12 },
  { rx: 290, ry: 95, rotate: 22, speed: 65, opacity: 0.08 },
  { rx: 320, ry: 60, rotate: -35, speed: 80, opacity: 0.05 },
]

function FloatingIcon({ node, mouseX, mouseY }: {
  node: typeof floatingIcons[0]
  mouseX: ReturnType<typeof useMotionValue<number>>
  mouseY: ReturnType<typeof useMotionValue<number>>
}) {
  const [hovered, setHovered] = useState(false)
  const px = useTransform(mouseX, (v: number) => v * 0.01)
  const py = useTransform(mouseY, (v: number) => v * 0.01)
  const springPx = useSpring(px, { stiffness: 25, damping: 20 })
  const springPy = useSpring(py, { stiffness: 25, damping: 20 })

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 z-30"
      style={{
        x: useTransform(springPx, (v: number) => node.x + v),
        y: useTransform(springPy, (v: number) => node.y + v),
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.9, delay: 0.4 + Math.abs(node.y) * 0.0015 }}
    >
      <motion.div
        className="relative cursor-default"
        animate={{
          y: [0, -node.floatAmp, 0, node.floatAmp * 0.5, 0],
          x: [0, node.driftX, 0, -node.driftX * 0.5, 0],
          rotate: [0, node.rotateAmp, 0, -node.rotateAmp * 0.6, 0],
        }}
        transition={{ duration: node.floatDur, repeat: Infinity, ease: 'easeInOut' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Ambient glow beneath */}
        <div
          className="absolute inset-[-12px] rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${node.glow} 0%, transparent 65%)`,
            filter: 'blur(12px)',
            opacity: hovered ? 0.9 : 0.45,
            transition: 'opacity 0.5s ease',
          }}
        />

        {/* Glass sphere */}
        <motion.div
          className="relative w-14 h-14 rounded-full flex items-center justify-center"
          style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.12)',
            boxShadow: `
              0 0 20px ${node.glow},
              0 0 40px ${node.glow},
              inset 0 1px 0 rgba(255,255,255,0.15),
              inset 0 -1px 0 rgba(0,0,0,0.1),
              inset 2px 2px 6px rgba(255,255,255,0.05)
            `,
          }}
          animate={{ scale: hovered ? 1.1 : 1, y: hovered ? -4 : 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 18 }}
        >
          {/* Glass highlight */}
          <div className="absolute top-[3px] left-[6px] w-[14px] h-[6px] rounded-full bg-white/[0.08] blur-[1px] pointer-events-none" />
          <node.icon className={`w-5 h-5 ${node.color}`} />
        </motion.div>

        {/* Label */}
        <motion.span
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-semibold tracking-wider uppercase text-white/25 whitespace-nowrap pointer-events-none"
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 4 }}
          transition={{ duration: 0.25 }}
        >
          {node.label}
        </motion.span>
      </motion.div>
    </motion.div>
  )
}

export default function CosmicIllustration() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 40, damping: 22 })
  const springY = useSpring(mouseY, { stiffness: 40, damping: 22 })
  const rotateX = useTransform(springY, (v: number) => -v * 0.012)
  const rotateY = useTransform(springX, (v: number) => v * 0.012)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    mouseX.set(e.clientX - (rect.left + rect.width / 2))
    mouseY.set(e.clientY - (rect.top + rect.height / 2))
  }

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, scale: 0.88 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-[560px] h-[560px] cube-scene"
      style={{ perspective: 900 }}
    >
      {/* ── Layer 1: Stars ── */}
      {stars.map((s, i) => (
        <motion.div
          key={`star-${i}`}
          className="absolute rounded-full bg-white pointer-events-none z-0"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
          }}
          animate={{ opacity: [0.06, 0.5, 0.06], scale: [0.7, 1.4, 0.7] }}
          transition={{ duration: s.dur, repeat: Infinity, delay: s.delay, ease: 'easeInOut' }}
        />
      ))}

      {/* ── Layer 2: Outer Bloom ── */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, rgba(255,77,184,0.04) 30%, transparent 60%)',
          filter: 'blur(50px)',
          animation: 'pulseBreathing 5s ease-in-out infinite',
        }}
      />

      {/* ── Layer 3: Orbit Rings ── */}
      {orbitRings.map((ring, i) => (
        <motion.div
          key={`ring-${i}`}
          className="absolute pointer-events-none z-[1]"
          style={{
            width: ring.rx * 2,
            height: ring.ry * 2,
            border: `1px solid rgba(168,85,247,${ring.opacity})`,
            borderRadius: '50%',
            left: '50%',
            top: '50%',
            marginLeft: -ring.rx,
            marginTop: -ring.ry,
            transform: `rotate(${ring.rotate}deg)`,
            boxShadow: `0 0 12px rgba(168,85,247,${ring.opacity * 0.3})`,
          }}
          animate={{ rotate: [ring.rotate, ring.rotate + 360] }}
          transition={{ duration: ring.speed, repeat: Infinity, ease: 'linear' }}
        />
      ))}

      {/* ── Layer 4: Glass Cube ── */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[2]"
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      >
        <motion.div
          className="cube-container relative flex items-center justify-center"
          animate={{ rotateX: [-18, -18], rotateY: [0, 360] }}
          transition={{ rotateY: { duration: 18, repeat: Infinity, ease: 'linear' }, rotateX: { duration: 0 } }}
          style={{ width: '205px', height: '205px' }}
        >
          <div className="cube-face cube-face-front" />
          <div className="cube-face cube-face-back" />
          <div className="cube-face cube-face-right" />
          <div className="cube-face cube-face-left" />
          <div className="cube-face cube-face-top" />
          <div className="cube-face cube-face-bottom" />

          {/* Center: tiny floating heart orb */}
          <div className="absolute z-10 pointer-events-none" style={{ animation: 'heartFloat 3.5s ease-in-out infinite' }}>
            <div className="relative">
              {/* Soft ambient light cast on cube walls */}
              <div className="absolute inset-[-22px] rounded-full pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(255,77,184,0.1) 0%, rgba(255,77,184,0.02) 55%, transparent 70%)',
                  filter: 'blur(12px)',
                }}
              />
              <Heart className="w-7 h-7 text-neonPink fill-current relative z-10" style={{
                filter: 'drop-shadow(0 0 8px rgba(255,77,184,0.6)) drop-shadow(0 0 20px rgba(255,77,184,0.2))',
                opacity: 0.85,
              }} />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* ── Layer 5: Floating Icons (outside orbit) ── */}
      {floatingIcons.map((node) => (
        <FloatingIcon key={node.label} node={node} mouseX={mouseX} mouseY={mouseY} />
      ))}

      {/* ── Layer 6: Ambient particles ── */}
      {particles.map((p, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute rounded-full pointer-events-none z-[4]"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.color,
          }}
          animate={{ y: [0, -16, 0], opacity: [0, 0.35, 0] }}
          transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
        />
      ))}

      {/* ── Layer 7: Sparkles around cube ── */}
      {[
        { x: 28, y: 35, size: 2, delay: 0 },
        { x: 72, y: 28, size: 1.5, delay: 1.2 },
        { x: 42, y: 70, size: 2.2, delay: 2.5 },
        { x: 65, y: 62, size: 1.8, delay: 3.8 },
        { x: 50, y: 20, size: 1.5, delay: 0.8 },
        { x: 35, y: 55, size: 2, delay: 4.2 },
      ].map((sp, i) => (
        <motion.div
          key={`sparkle-${i}`}
          className="absolute pointer-events-none z-[5]"
          style={{
            left: `${sp.x}%`,
            top: `${sp.y}%`,
            width: sp.size,
            height: sp.size,
          }}
          animate={{
            opacity: [0, 0.7, 0],
            scale: [0.5, 1.3, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: sp.delay,
            ease: 'easeInOut',
          }}
        >
          <div className="w-full h-full rounded-full bg-white"
            style={{ boxShadow: '0 0 4px rgba(255,255,255,0.6), 0 0 8px rgba(255,77,184,0.3)' }}
          />
        </motion.div>
      ))}
    </motion.div>
  )
}
