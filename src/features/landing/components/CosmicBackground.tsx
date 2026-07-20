'use client'

import { useEffect, useRef, useMemo } from 'react'
import { motion } from 'framer-motion'

function lcg(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

export default function CosmicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const stars = useMemo(() => {
    const rng = lcg(42)
    return Array.from({ length: 120 }).map(() => ({
      x: rng() * 100,
      y: rng() * 100,
      size: rng() * 2 + 0.3,
      speed: rng() * 0.06 + 0.015,
      alpha: rng() * 0.5 + 0.08,
      tint: rng() > 0.8 ? 'warm' : 'cool',
      twinkleSpeed: rng() * 2 + 0.8,
      twinkleOffset: rng() * 6.28,
    }))
  }, [])

  const shootingStars = useMemo(() => {
    const rng = lcg(777)
    return Array.from({ length: 6 }).map(() => ({
      x: rng() * 70 + 10,
      y: rng() * 35 + 5,
      delay: rng() * 25 + 5,
      duration: rng() * 1.2 + 0.8,
      angle: (rng() - 0.5) * 120 + 30,
      length: rng() * 80 + 50,
    }))
  }, [])

  const constellations = useMemo(() => {
    const rng = lcg(333)
    return Array.from({ length: 4 }).map(() => {
      const points = Array.from({ length: Math.floor(rng() * 3) + 3 }).map(() => ({
        x: rng() * 100,
        y: rng() * 100,
      }))
      return { points, delay: rng() * 10 }
    })
  }, [])

  const planets = useMemo(() => {
    const rng = lcg(911)
    return [
      { x: 8, y: 12, size: 5, color: 'rgba(192,132,252,0.22)', glow: 'rgba(192,132,252,0.06)', dur: 28, drift: 4, ring: false },
      { x: 88, y: 18, size: 10, color: 'rgba(168,85,247,0.18)', glow: 'rgba(168,85,247,0.05)', dur: 34, drift: 5, ring: false },
      { x: 92, y: 48, size: 16, color: 'rgba(255,77,184,0.14)', glow: 'rgba(255,77,184,0.04)', dur: 38, drift: 3, ring: false },
      { x: 5, y: 65, size: 12, color: 'rgba(139,92,246,0.18)', glow: 'rgba(139,92,246,0.05)', dur: 32, drift: 6, ring: false },
      { x: 82, y: 75, size: 8, color: 'rgba(99,102,241,0.18)', glow: 'rgba(99,102,241,0.05)', dur: 36, drift: 4, ring: false },
      { x: 15, y: 38, size: 22, color: 'rgba(139,92,246,0.12)', glow: 'rgba(139,92,246,0.04)', dur: 40, drift: 5, ring: true },
      { x: 72, y: 30, size: 7, color: 'rgba(236,72,153,0.15)', glow: 'rgba(236,72,153,0.04)', dur: 30, drift: 3, ring: false },
    ]
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const t = Date.now() * 0.001

      stars.forEach((s) => {
        const x = (s.x / 100) * canvas.width
        const y = ((s.y / 100 + s.speed * t * 0.008) % 1.1) * canvas.height
        const flicker = Math.sin(t * s.twinkleSpeed + s.twinkleOffset) * 0.22 + s.alpha
        const alpha = Math.max(0, Math.min(1, flicker))
        const pulse = 1 + Math.sin(t * 0.4 + s.twinkleOffset) * 0.12

        if (s.tint === 'warm') {
          ctx.fillStyle = `rgba(255, 200, 220, ${alpha})`
        } else {
          ctx.fillStyle = `rgba(190, 195, 255, ${alpha})`
        }
        ctx.beginPath()
        ctx.arc(x, y, s.size * pulse, 0, Math.PI * 2)
        ctx.fill()
      })

      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animId)
    }
  }, [stars])

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Canvas stars */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Deep nebula layers */}
      <div className="absolute top-[-22%] left-[-18%] w-[1000px] h-[1000px] rounded-full opacity-[0.05]"
        style={{
          background: 'radial-gradient(circle, rgba(168,85,247,0.5) 0%, rgba(139,92,246,0.2) 30%, transparent 60%)',
          animation: 'nebulaDrift1 45s ease-in-out infinite',
          filter: 'blur(90px)',
        }}
      />
      <div className="absolute bottom-[-12%] right-[-16%] w-[900px] h-[900px] rounded-full opacity-[0.04]"
        style={{
          background: 'radial-gradient(circle, rgba(255,77,184,0.4) 0%, rgba(236,72,153,0.15) 30%, transparent 60%)',
          animation: 'nebulaDrift2 50s ease-in-out infinite',
          filter: 'blur(90px)',
        }}
      />
      <div className="absolute top-[25%] left-[35%] w-[700px] h-[700px] rounded-full opacity-[0.03]"
        style={{
          background: 'radial-gradient(circle, rgba(99,102,241,0.35) 0%, rgba(139,92,246,0.1) 30%, transparent 60%)',
          animation: 'nebulaDrift3 55s ease-in-out infinite',
          filter: 'blur(80px)',
        }}
      />

      {/* Slow-moving fog layer */}
      <div className="absolute inset-0 opacity-[0.02]"
        style={{
          background: 'linear-gradient(135deg, rgba(168,85,247,0.3) 0%, transparent 30%, rgba(255,77,184,0.2) 60%, transparent 100%)',
          animation: 'nebulaDrift1 60s ease-in-out infinite',
          filter: 'blur(60px)',
        }}
      />

      {/* Aurora wave */}
      <div className="absolute top-[15%] left-0 w-full h-[2px] overflow-hidden opacity-[0.12]">
        <div
          className="absolute w-[200%] h-full"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(168,85,247,0.4) 25%, rgba(255,77,184,0.3) 50%, rgba(99,102,241,0.4) 75%, transparent 100%)',
            animation: 'auroraWave 25s ease-in-out infinite',
            filter: 'blur(8px)',
          }}
        />
      </div>

      {/* Animated planets */}
      {planets.map((p, i) => (
        <motion.div
          key={`planet-${i}`}
          className="absolute pointer-events-none z-[1]"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
          animate={{
            y: [0, -p.size * 0.5, 0, p.size * 0.3, 0],
            x: [0, p.drift, 0, -p.drift * 0.5, 0],
          }}
          transition={{ duration: p.dur, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="relative" style={{ width: p.size, height: p.size }}>
            {/* Glow */}
            <div className="absolute inset-[-150%] rounded-full" style={{
              background: `radial-gradient(circle, ${p.glow} 0%, transparent 60%)`,
              filter: 'blur(6px)',
            }} />
            {/* Body */}
            <div className="w-full h-full rounded-full" style={{
              background: `radial-gradient(circle at 35% 35%, ${p.color.replace(/[\d.]+\)$/, '0.5)')}, ${p.color} 60%, transparent 100%)`,
            }} />
            {/* Ring */}
            {p.ring && (
              <div className="absolute top-1/2 left-1/2 w-[220%] h-[35%] rounded-full border opacity-25"
                style={{
                  borderColor: p.color,
                  transform: 'translate(-50%, -50%) rotateX(72deg)',
                }}
              />
            )}
          </div>
        </motion.div>
      ))}

      {/* Constellation lines (SVG) */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.06]">
        {constellations.map((c, ci) => (
          <g key={ci}>
            {c.points.map((p, pi) => {
              if (pi === 0) return null
              const prev = c.points[pi - 1]
              return (
                <motion.line
                  key={`${ci}-${pi}`}
                  x1={`${prev.x}%`}
                  y1={`${prev.y}%`}
                  x2={`${p.x}%`}
                  y2={`${p.y}%`}
                  stroke="rgba(168,85,247,0.25)"
                  strokeWidth="0.5"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 2, delay: c.delay + pi * 0.5, ease: 'easeOut' }}
                />
              )
            })}
            {c.points.map((p, pi) => (
              <motion.circle
                key={`dot-${ci}-${pi}`}
                cx={`${p.x}%`}
                cy={`${p.y}%`}
                r="1.8"
                fill="rgba(192,132,252,0.45)"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: [0.25, 0.6, 0.25] }}
                transition={{
                  duration: 3,
                  delay: c.delay + pi * 0.5 + 1,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </g>
        ))}
      </svg>

      {/* Shooting stars */}
      {shootingStars.map((ss, i) => (
        <motion.div
          key={`shooting-${i}`}
          className="absolute h-[1px] rounded-full"
          style={{
            left: `${ss.x}%`,
            top: `${ss.y}%`,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.9), rgba(168,85,247,0.3), transparent)',
            width: '0px',
            transform: `rotate(${ss.angle}deg)`,
            transformOrigin: 'left center',
          }}
          animate={{
            width: ['0px', `${ss.length}px`, '0px'],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: ss.duration,
            delay: ss.delay,
            repeat: Infinity,
            repeatDelay: 6 + i * 5,
            ease: 'easeOut',
          }}
        />
      ))}

      {/* Cosmic dust particles */}
      {Array.from({ length: 24 }).map((_, i) => {
        const dustColors = [
          'rgba(255,255,255,0.18)',
          'rgba(255,77,184,0.18)',
          'rgba(168,85,247,0.15)',
          'rgba(99,102,241,0.13)',
          'rgba(192,132,252,0.14)',
          'rgba(236,72,153,0.12)',
        ]
        return (
          <motion.div
            key={`dust-${i}`}
            className="absolute rounded-full"
            style={{
              left: `${(i * 4.3 + (i % 3) * 7) % 100}%`,
              top: `${(i * 7.9 + (i % 2) * 11) % 100}%`,
              width: i % 5 === 0 ? 2.5 : i % 3 === 0 ? 1.8 : 1.2,
              height: i % 5 === 0 ? 2.5 : i % 3 === 0 ? 1.8 : 1.2,
              background: dustColors[i % 6],
            }}
            animate={{
              y: [0, -30 - i * 1.8, 0],
              x: [0, (i % 2 === 0 ? 12 : -12), 0],
              opacity: [0, 0.28, 0],
            }}
            transition={{
              duration: 9 + i * 0.7,
              delay: i * 0.4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )
      })}

      {/* Vignette overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 35%, rgba(9,3,18,0.55) 100%)',
        }}
      />
    </div>
  )
}
