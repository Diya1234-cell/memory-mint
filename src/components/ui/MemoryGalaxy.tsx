'use client'

import { useState, useRef, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 49267
  return x - Math.floor(x)
}

interface MemoryGalaxyProps {
  themeColor: string
  coverPhoto: string
  relationshipEmoji: string
}

const themeGlows: Record<string, { main: string; dark: string; glow: string; ring: string }> = {
  pink: { main: '#ff4b91', dark: '#be185d', glow: 'rgba(255,75,145,0.5)', ring: 'border-[#ff4b91]/30' },
  purple: { main: '#a855f7', dark: '#7c3aed', glow: 'rgba(168,85,247,0.5)', ring: 'border-[#a855f7]/30' },
  galaxy: { main: '#6366f1', dark: '#4338ca', glow: 'rgba(99,102,241,0.5)', ring: 'border-[#6366f1]/30' },
  blue: { main: '#06b6d4', dark: '#0891b2', glow: 'rgba(6,182,212,0.5)', ring: 'border-[#06b6d4]/30' },
  green: { main: '#10b981', dark: '#059669', glow: 'rgba(16,185,129,0.5)', ring: 'border-[#10b981]/30' },
  gold: { main: '#f59e0b', dark: '#b45309', glow: 'rgba(245,158,11,0.5)', ring: 'border-[#f59e0b]/30' }
}

export function MemoryGalaxy({ themeColor, coverPhoto, relationshipEmoji }: MemoryGalaxyProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [galaxyHovered, setGalaxyHovered] = useState(false)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const activeGlow = themeGlows[themeColor] || themeGlows.pink

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    setMousePos({
      x: (e.clientX - rect.left - rect.width / 2) / 14,
      y: (e.clientY - rect.top - rect.height / 2) / 14
    })
  }

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 })
    setGalaxyHovered(false)
    setHoveredCard(null)
  }

  const floatingMemories = [
    { id: 1, img: coverPhoto, title: 'Our Universe', date: 'The Beginning', left: '12%', top: '8%', w: 34, h: 42, rotate: -12, delay: 0 },
    { id: 2, img: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=150&q=80', title: 'Romantic Walk', date: '18 May 2024', left: '76%', top: '5%', w: 30, h: 38, rotate: 14, delay: 1.2 },
    { id: 3, img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=150&q=80', title: 'Late Night Call', date: '21 May 2024', left: '3%', top: '45%', w: 36, h: 44, rotate: -7, delay: 0.6 },
    { id: 4, img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=150&q=80', title: 'Himachal Hikes', date: '1 Jun 2024', left: '84%', top: '43%', w: 32, h: 40, rotate: 16, delay: 1.8 },
    { id: 5, img: coverPhoto, title: 'Our Secret Space', date: 'Setup Complete', left: '18%', top: '79%', w: 30, h: 38, rotate: -13, delay: 2.2 },
    { id: 6, img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=150&q=80', title: 'Goa Coastlines', date: '16 May 2024', left: '46%', top: '1%', w: 34, h: 42, rotate: 9, delay: 0.9 },
    { id: 7, img: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=150&q=80', title: 'New Year Sparklers', date: '31 Dec 2024', left: '78%', top: '81%', w: 32, h: 40, rotate: -9, delay: 2.8 },
    { id: 8, img: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=150&q=80', title: 'Cafe Outing', date: '4 Jul 2024', left: '50%', top: '86%', w: 30, h: 38, rotate: -11, delay: 1.5 },
    { id: 9, img: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=150&q=80', title: 'Mountain Sunrise', date: '8 Mar 2024', left: '64%', top: '20%', w: 28, h: 36, rotate: 6, delay: 3.0 },
    { id: 10, img: 'https://images.unsplash.com/photo-1470071459604-7b8ec44ffd5a?auto=format&fit=crop&w=150&q=80', title: 'Forest Walk', date: '22 Feb 2024', left: '34%', top: '22%', w: 32, h: 40, rotate: -5, delay: 0.4 },
    { id: 11, img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=150&q=80', title: 'Starry Night', date: '14 Feb 2024', left: '5%', top: '21%', w: 28, h: 36, rotate: 11, delay: 2.5 },
    { id: 12, img: 'https://images.unsplash.com/photo-1527482797697-8795b03a71fe?auto=format&fit=crop&w=150&q=80', title: 'Rainy Evening', date: '10 Jan 2024', left: '74%', top: '62%', w: 30, h: 38, rotate: -14, delay: 1.2 }
  ]

  const orbiters = [
    { icon: '❤️', radius: 48, speed: 28, delay: 0 },
    { icon: '✨', radius: 62, speed: 38, delay: 1.5 },
    { icon: '🌙', radius: 76, speed: 48, delay: 3 },
    { icon: '🪐', radius: 90, speed: 58, delay: 4.5 },
    { icon: '💌', radius: 55, speed: 32, delay: 0.8 },
    { icon: '🎙️', radius: 70, speed: 42, delay: 2 },
    { icon: '📷', radius: 84, speed: 52, delay: 3.8 },
    { icon: '📖', radius: 98, speed: 62, delay: 5 }
  ]

  const bgStars = useMemo(() =>
    Array.from({ length: 45 }).map((_, i) => ({
      left: `${seededRandom(i * 6) * 100}%`,
      top: `${seededRandom(i * 6 + 1) * 100}%`,
      size: seededRandom(i * 6 + 2) * 2 + 0.8,
      delay: seededRandom(i * 6 + 3) * 8,
      dur: seededRandom(i * 6 + 4) * 4 + 3,
      opacity: seededRandom(i * 6 + 5) * 0.3 + 0.15
    })), []
  )

  const frontParticles = useMemo(() =>
    Array.from({ length: 18 }).map((_, i) => ({
      left: `${seededRandom(i * 7 + 270) * 100}%`,
      top: `${seededRandom(i * 7 + 271) * 100}%`,
      size: seededRandom(i * 7 + 272) * 2 + 1,
      delay: seededRandom(i * 7 + 273) * 10,
      dur: seededRandom(i * 7 + 274) * 10 + 12,
      dx: (seededRandom(i * 7 + 275) - 0.5) * 30,
      dy: -seededRandom(i * 7 + 276) * 40 - 10,
      hue: i % 3 === 0 ? activeGlow.main : i % 3 === 1 ? '#ffffff' : '#c4b5fd'
    })), []
  )

  const constStars = [
    { cx: 36, cy: 28, delay: 0 }, { cx: 100, cy: 11, delay: 1 },
    { cx: 172, cy: 18, delay: 2 }, { cx: 192, cy: 89, delay: 0.5 },
    { cx: 177, cy: 144, delay: 1.5 }, { cx: 110, cy: 151, delay: 2.5 },
    { cx: 48, cy: 139, delay: 0.8 }, { cx: 19, cy: 92, delay: 1.8 },
    { cx: 120, cy: 92, delay: 3 }
  ]

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setGalaxyHovered(true)}
      className="relative w-full h-full flex items-center justify-center overflow-hidden cursor-crosshair select-none"
    >
      {/* L1: Deep space */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#120a28_0%,#04020a_100%)] pointer-events-none -z-30" />

      {/* L2: Distant twinkling stars — client-only to avoid SSR hydration mismatch */}
      {isMounted && bgStars.map((s, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white pointer-events-none -z-20"
          style={{ left: s.left, top: s.top, width: s.size, height: s.size, opacity: s.opacity }}
          animate={{ opacity: [0.1, 0.7, 0.1], scale: [0.8, 1.3, 0.8] }}
          transition={{ duration: s.dur, repeat: Infinity, delay: s.delay, ease: "easeInOut" }}
        />
      ))}

      {/* L3: Nebula glow with parallax */}
      <motion.div
        animate={{ scale: galaxyHovered ? 1.3 : 1.05, opacity: galaxyHovered ? 0.85 : 0.5 }}
        style={{
          x: mousePos.x * 0.3, y: mousePos.y * 0.3,
          background: `radial-gradient(circle at center, ${activeGlow.main}35 0%, ${activeGlow.dark}18 45%, transparent 70%)`
        }}
        className="absolute w-[92%] h-[92%] rounded-full blur-[30px] pointer-events-none -z-10 transition-all duration-1000"
      />

      {/* L4: Spiral galaxy arms */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="absolute w-[85%] h-[85%] pointer-events-none -z-10"
        style={{
          background: `conic-gradient(from 0deg, transparent 0deg, ${activeGlow.main}0a 35deg, transparent 70deg, transparent 120deg, ${activeGlow.main}08 155deg, transparent 190deg, transparent 240deg, ${activeGlow.main}0a 275deg, transparent 310deg)`,
          maskImage: 'radial-gradient(circle at center, black 28%, transparent 68%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black 28%, transparent 68%)'
        }}
      />

      {/* L5: Orbital rings */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        className={`absolute rounded-full border border-dashed ${activeGlow.ring} opacity-[0.15] w-[65%] h-[65%] pointer-events-none z-0`}
        style={{ boxShadow: `0 0 12px ${activeGlow.glow.replace('0.5', '0.06')}` }}
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 75, repeat: Infinity, ease: "linear" }}
        className={`absolute rounded-full border ${activeGlow.ring} opacity-[0.1] w-[88%] h-[88%] pointer-events-none z-0`}
        style={{ boxShadow: `0 0 18px ${activeGlow.glow.replace('0.5', '0.04')}` }}
      />

      {/* L6: Constellation lines with star nodes */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-0" viewBox="0 0 240 185" preserveAspectRatio="xMidYMid meet">
        <motion.path
          d="M 36 28 L 100 11 L 172 18 L 192 89 L 177 144 L 110 151 L 48 139 L 19 92 Z"
          fill="none" stroke={activeGlow.main} strokeWidth="1" strokeDasharray="3 4"
          className="opacity-25"
          animate={{ strokeDashoffset: [0, -14] }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
        />
        <motion.path
          d="M 36 28 L 120 92 L 172 18 M 19 92 L 120 92 L 192 89 M 48 139 L 120 92 L 177 144"
          fill="none" stroke={activeGlow.main} strokeWidth="0.6" strokeDasharray="2 3"
          className="opacity-10"
          animate={{ strokeDashoffset: [0, -10] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
        <motion.path
          d="M 100 11 L 120 92 L 110 151 M 172 18 L 120 92 L 48 139"
          fill="none" stroke={activeGlow.main} strokeWidth="0.4" strokeDasharray="1.5 4"
          className="opacity-[0.06]"
          animate={{ strokeDashoffset: [0, -8] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        />
        {constStars.map((s) => (
          <motion.circle
            key={s.cx}
            cx={s.cx} cy={s.cy} r="1.5" fill={activeGlow.main}
            className="opacity-50"
            animate={{ opacity: [0.2, 1, 0.2], r: [1, 2, 1] }}
            transition={{ duration: 3.5, repeat: Infinity, delay: s.delay, ease: "easeInOut" }}
          />
        ))}
      </svg>

      {/* L7: Orbiting icons */}
      {orbiters.map((orb, i) => (
        <div key={i} className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: orb.speed, repeat: Infinity, ease: "linear", delay: orb.delay }}
            style={{ width: orb.radius * 2, height: orb.radius * 2 }}
            className="relative flex items-center justify-center"
          >
            <motion.span
              className="absolute top-0 text-[7px] leading-none"
              style={{ filter: `drop-shadow(0 0 3px ${activeGlow.glow.replace('0.5', '0.6')})` }}
              animate={{ opacity: galaxyHovered ? [0.5, 1, 0.5] : [0.3, 0.65, 0.3] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
            >
              {orb.icon}
            </motion.span>
          </motion.div>
        </div>
      ))}

      {/* L8: Heart nebula center */}
      <div className="relative z-10 flex items-center justify-center">
        <motion.div
          animate={{ scale: galaxyHovered ? [1, 1.35, 1] : [1, 1.12, 1], opacity: galaxyHovered ? [0.7, 1, 0.7] : [0.35, 0.55, 0.35] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-[72px] h-[72px] rounded-full blur-[18px]"
          style={{ backgroundColor: activeGlow.main }}
        />
        <motion.div
          animate={{ scale: galaxyHovered ? [1, 1.2, 1] : [1, 1.06, 1] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-[48px] h-[48px] rounded-full blur-[10px]"
          style={{ backgroundColor: activeGlow.glow.replace('0.5', '0.8') }}
        />
        <motion.div
          animate={{ scale: galaxyHovered ? [1, 1.08, 1] : [1, 1.03, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="relative p-[5px] rounded-full bg-black/35 border border-white/[12%] backdrop-blur-md shadow-2xl flex items-center justify-center"
          style={{ boxShadow: `0 0 20px ${activeGlow.glow}` }}
        >
          <Heart className="w-[22px] h-[22px] fill-current text-white" style={{ filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.7))' }} />
          <div className="absolute -bottom-[2px] -right-[2px] bg-black/65 border border-white/12 px-[3px] py-[1px] rounded-full text-[7px] backdrop-blur-sm z-30 shadow-md leading-none">
            {relationshipEmoji}
          </div>
        </motion.div>
      </div>

      {/* L9: Floating memory polaroids */}
      {floatingMemories.map((m) => (
        <motion.div
          key={m.id}
          onMouseEnter={() => setHoveredCard(m.id)}
          onMouseLeave={() => setHoveredCard(null)}
          style={{
            left: m.left, top: m.top,
            x: mousePos.x * (0.6 + m.delay * 0.05),
            y: mousePos.y * (0.6 + m.delay * 0.05),
            width: m.w,
            height: m.h
          }}
          animate={{
            y: [0, -(3 + m.delay * 0.5), 3 + m.delay * 0.3, 0],
            x: [0, 1.5 + m.delay * 0.2, -(1.5 + m.delay * 0.2), 0],
            rotate: [m.rotate, m.rotate - 1.5, m.rotate + 1.5, m.rotate]
          }}
          transition={{ duration: 9 + m.delay * 1.5, repeat: Infinity, ease: "easeInOut" }}
          whileHover={{ scale: 1.55, zIndex: 50, rotate: 0, y: -12, boxShadow: `0 0 20px ${activeGlow.glow}` }}
          className="absolute bg-[#180a32]/90 p-[2px] pb-[5px] border border-white/[18%] rounded-[3px] shadow-2xl flex-shrink-0 cursor-pointer pointer-events-auto transition-shadow duration-300"
        >
          <div className="w-full h-[72%] bg-cover bg-center rounded-[2px] pointer-events-none" style={{ backgroundImage: `url('${m.img}')` }} />

          {hoveredCard === m.id && (
            <div className="absolute bottom-[105%] left-1/2 -translate-x-1/2 bg-black/90 border border-white/10 px-[6px] py-[3px] rounded shadow-xl text-left pointer-events-none z-50 min-w-[72px]">
              <span className="text-[7px] font-extrabold text-white block truncate leading-tight">{m.title}</span>
              <span className="text-[6px] text-gray-400 block mt-[1px] font-semibold">{m.date}</span>
            </div>
          )}
        </motion.div>
      ))}

      {/* L10: Front drifting particles — client-only to avoid SSR hydration mismatch */}
      {isMounted && frontParticles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none z-30"
          style={{ left: p.left, top: p.top, width: p.size, height: p.size, backgroundColor: p.hue }}
          animate={{ y: [0, p.dy], x: [0, p.dx], opacity: [0, 0.7, 0] }}
          transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: "easeOut" }}
        />
      ))}
    </div>
  )
}
