'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'

function Stars() {
  const stars = useMemo(() =>
    Array.from({ length: 120 }, (_, i) => ({
      x: (i * 47 + 11) % 100,
      y: (i * 71 + 19) % 100,
      size: i % 7 === 0 ? 2.5 : i % 5 === 0 ? 1.8 : 1,
      dur: 2.5 + (i % 8) * 0.6,
      delay: (i % 12) * 0.3,
      brightness: 0.3 + (i % 4) * 0.2,
    })), [])

  return (
    <>
      {stars.map((star, i) => (
        <motion.div
          key={`star-${i}`}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            boxShadow: star.size > 1.5 ? `0 0 ${star.size * 4}px rgba(246,162,255,0.6)` : undefined,
          }}
          animate={{ opacity: [star.brightness, 1, star.brightness], scale: [0.8, 1.4, 0.8] }}
          transition={{ duration: star.dur, delay: star.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </>
  )
}

function ShootingStars() {
  const meteors = useMemo(() =>
    Array.from({ length: 4 }, (_, i) => ({
      startX: 15 + i * 22,
      startY: -5 + i * 8,
      angle: 35 + i * 8,
      delay: i * 7 + 2,
      dur: 2.2,
    })), [])

  return (
    <>
      {meteors.map((m, i) => (
        <motion.div
          key={`meteor-${i}`}
          className="absolute h-[1px] rounded-full"
          style={{
            left: `${m.startX}%`,
            top: `${m.startY}%`,
            width: 80,
            background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.8), rgba(255,200,255,0))',
            transform: `rotate(${m.angle}deg)`,
          }}
          animate={{ opacity: [0, 1, 0], x: [0, 200], y: [0, 120] }}
          transition={{ duration: m.dur, delay: m.delay, repeat: Infinity, repeatDelay: 10 + i * 5, ease: 'easeOut' }}
        />
      ))}
    </>
  )
}

function NebulaClouds() {
  return (
    <>
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full opacity-[0.12]"
        style={{
          left: '5%', top: '10%',
          background: 'radial-gradient(circle, rgba(237,57,201,0.4), transparent 70%)',
          filter: 'blur(60px)',
        }}
        animate={{ x: [0, 60, 0], y: [0, 40, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute w-[600px] h-[400px] rounded-full opacity-[0.08]"
        style={{
          right: '5%', top: '20%',
          background: 'radial-gradient(circle, rgba(112,68,234,0.4), transparent 70%)',
          filter: 'blur(70px)',
        }}
        animate={{ x: [0, -50, 0], y: [0, -30, 0], scale: [1, 0.92, 1] }}
        transition={{ duration: 35, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full opacity-[0.07]"
        style={{
          left: '30%', bottom: '5%',
          background: 'radial-gradient(circle, rgba(71,63,200,0.35), transparent 70%)',
          filter: 'blur(50px)',
        }}
        animate={{ x: [0, 40, -20, 0], y: [0, -40, 20, 0], rotate: [0, 180, 360] }}
        transition={{ duration: 40, repeat: Infinity, ease: 'easeInOut' }}
      />
    </>
  )
}

function Planets() {
  const planets = useMemo(() => [
    { x: 85, y: 12, size: 50, colors: ['#eac3b6', '#dcb4ac'], glow: 'rgba(234,195,182,0.3)', speed: 45 },
    { x: 10, y: 60, size: 35, colors: ['#a78bfa', '#7c3aed'], glow: 'rgba(167,139,250,0.3)', speed: 55 },
    { x: 75, y: 70, size: 28, colors: ['#93c5fd', '#3b82f6'], glow: 'rgba(147,197,253,0.25)', speed: 60 },
  ], [])

  return (
    <>
      {planets.map((p, i) => (
        <motion.div
          key={`planet-${i}`}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`, top: `${p.y}%`,
            width: p.size, height: p.size,
            background: `radial-gradient(circle at 35% 35%, ${p.colors[0]}, ${p.colors[1]})`,
            boxShadow: `0 0 ${p.size}px ${p.glow}, inset -${p.size/4}px -${p.size/4}px ${p.size/2}px rgba(0,0,0,0.3)`,
          }}
          animate={{ y: [0, -10, 0], rotate: [0, 360] }}
          transition={{ y: { duration: p.speed * 0.3, repeat: Infinity, ease: 'easeInOut' }, rotate: { duration: p.speed, repeat: Infinity, ease: 'linear' } }}
        />
      ))}
    </>
  )
}

function Constellations() {
  const constellations = useMemo(() => {
    const groups = []
    for (let g = 0; g < 5; g++) {
      const points = []
      const baseX = 10 + g * 18
      const baseY = 15 + (g % 3) * 25
      for (let p = 0; p < 4 + (g % 2); p++) {
        points.push({
          x: baseX + (p * 4) + ((g + p) % 3) * 2,
          y: baseY + ((p * 7 + g * 3) % 10),
        })
      }
      groups.push(points)
    }
    return groups
  }, [])

  return (
    <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
      {constellations.map((points, gi) => (
        <g key={`const-${gi}`}>
          {points.slice(0, -1).map((pt, pi) => (
            <motion.line
              key={`line-${gi}-${pi}`}
              x1={`${pt.x}%`} y1={`${pt.y}%`}
              x2={`${points[pi + 1].x}%`} y2={`${points[pi + 1].y}%`}
              stroke="rgba(200,180,255,0.15)"
              strokeWidth="0.5"
              animate={{ opacity: [0.08, 0.25, 0.08] }}
              transition={{ duration: 3 + gi, delay: pi * 0.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
          {points.map((pt, pi) => (
            <motion.circle
              key={`cnode-${gi}-${pi}`}
              cx={`${pt.x}%`} cy={`${pt.y}%`} r="1.5"
              fill="rgba(220,200,255,0.6)"
              animate={{ opacity: [0.3, 0.8, 0.3], scale: [1, 1.5, 1] }}
              transition={{ duration: 2.5 + pi * 0.3, delay: gi * 0.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
        </g>
      ))}
    </svg>
  )
}

function Particles() {
  const particles = useMemo(() =>
    Array.from({ length: 30 }, (_, i) => ({
      x: (i * 31 + 7) % 100,
      y: 20 + (i * 43 + 13) % 70,
      size: 1 + (i % 3) * 0.5,
      dur: 8 + (i % 6) * 3,
      delay: (i % 10) * 1.5,
    })), [])

  return (
    <>
      {particles.map((p, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute rounded-full bg-white/30"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          animate={{ y: [0, -40, 0], opacity: [0, 0.5, 0], scale: [0.5, 1, 0.5] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </>
  )
}

function Moon() {
  return (
    <motion.div
      className="absolute"
      style={{ right: '12%', top: '8%' }}
      animate={{ rotate: [0, 360] }}
      transition={{ duration: 200, repeat: Infinity, ease: 'linear' }}
    >
      <div
        className="w-16 h-16 rounded-full"
        style={{
          background: 'radial-gradient(circle at 40% 35%, #fef3c7, #fbbf24 50%, #d97706 100%)',
          boxShadow: '0 0 40px rgba(251,191,36,0.3), 0 0 80px rgba(251,191,36,0.15)',
        }}
      />
    </motion.div>
  )
}

function Comets() {
  return (
    <>
      {[0, 1].map(i => (
        <motion.div
          key={`comet-${i}`}
          className="absolute"
          style={{ left: `${20 + i * 50}%`, top: `${5 + i * 15}%` }}
          animate={{ x: [0, 300], y: [0, 100], opacity: [0, 1, 0] }}
          transition={{ duration: 3, delay: i * 15 + 8, repeat: Infinity, repeatDelay: 20, ease: 'easeOut' }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-white" style={{ boxShadow: '0 0 6px white, -20px -5px 15px rgba(200,180,255,0.4), -40px -8px 8px rgba(200,180,255,0.15)' }} />
        </motion.div>
      ))}
    </>
  )
}

export default function CosmicBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-[#080215] pointer-events-none" style={{ position: 'fixed', inset: 0, zIndex: -10 }}>
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 52% 3%, rgba(237,57,201,.22), transparent 31%), radial-gradient(ellipse at 82% 30%, rgba(112,68,234,.18), transparent 28%), radial-gradient(ellipse at 13% 71%, rgba(71,63,200,.14), transparent 30%), linear-gradient(180deg, #14052b, #07020f 72%)',
        }}
      />
      <NebulaClouds />
      <Stars />
      <Constellations />
      <Planets />
      <Moon />
      <ShootingStars />
      <Comets />
      <Particles />
    </div>
  )
}
