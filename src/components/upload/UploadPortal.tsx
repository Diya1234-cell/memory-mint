'use client'

import { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Sparkles, Check } from 'lucide-react'
import { useMemory } from '@/context/MemoryContext'

function lcg(seed: number): () => number {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

const planets = [
  { emoji: '🪐', size: 30, orbit: 270, speed: 28, delay: 0, color: '#d8b4fe' },
  { emoji: '🌙', size: 18, orbit: 310, speed: 38, delay: 2, color: '#fbcfe8' },
  { emoji: '🟠', size: 34, orbit: 350, speed: 48, delay: 4, color: '#fdba74' },
  { emoji: '🔵', size: 22, orbit: 230, speed: 22, delay: 1, color: '#93c5fd' },
]

const orbitRings = [
  { rx: 260, ry: 80, rotate: -15, speed: 40 },
  { rx: 290, ry: 100, rotate: 20, speed: 55 },
  { rx: 320, ry: 60, rotate: -35, speed: 70 },
]

export default function UploadPortal() {
  const { setField } = useMemory()
  const [isHovered, setIsHovered] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'complete'>('idle')
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const starData = useMemo(() => {
    const rng = lcg(42)
    return Array.from({ length: 24 }).map((_, i) => ({
      x: rng() * 100,
      y: rng() * 100,
      size: rng() * 2 + 0.5,
      delay: rng() * 6,
      dur: rng() * 3 + 2,
    }))
  }, [])

  const particleData = useMemo(() => {
    const rng = lcg(137)
    return Array.from({ length: 14 }).map((_, i) => ({
      x: rng() * 100,
      y: rng() * 100,
      size: rng() * 3 + 1,
      delay: rng() * 8,
      dur: rng() * 6 + 4,
    }))
  }, [])

  const portalStars = useMemo(() => {
    const rng = lcg(999)
    return Array.from({ length: 16 }).map(() => ({
      x: rng() * 80 + 10,
      y: rng() * 80 + 10,
      s: rng() * 1.5 + 0.3,
      d: rng() * 4 + 2,
      delay: rng() * 5,
    }))
  }, [])

  const portalDust = useMemo(() => {
    const rng = lcg(888)
    return Array.from({ length: 10 }).map(() => ({
      x: rng() * 90 + 5,
      y: rng() * 90 + 5,
      s: rng() * 1.5 + 0.5,
      dur: rng() * 5 + 3,
      delay: rng() * 4,
    }))
  }, [])

  const cleanupInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  useEffect(() => {
    return cleanupInterval
  }, [cleanupInterval])

  const simulateUpload = useCallback(() => {
    setUploadState('uploading')
    setProgress(0)
    let p = 0
    intervalRef.current = setInterval(() => {
      p += Math.random() * 8 + 2
      if (p >= 100) {
        p = 100
        cleanupInterval()
        setTimeout(() => setUploadState('complete'), 400)
      }
      setProgress(Math.min(Math.round(p), 100))
    }, 120)
  }, [cleanupInterval])

  const handleFile = useCallback((file: File | undefined) => {
    if (!file) return
    setSelectedFile(file)
    setField('uploadedFileName', file.name)
    simulateUpload()
  }, [simulateUpload, setField])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    handleFile(e.dataTransfer.files[0])
  }, [handleFile])

  const handleBrowse = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0])
  }, [handleFile])

  const resetPortal = useCallback(() => {
    setUploadState('idle')
    setProgress(0)
    setSelectedFile(null)
    setField('uploadedFileName', null)
    cleanupInterval()
  }, [cleanupInterval, setField])

  const portalScale = isDragOver ? 1.06 : isHovered ? 1.03 : 1
  const glowIntensity = isDragOver ? 0.9 : isHovered ? 0.6 : 0.3
  const ringSpeed = isHovered ? 0.7 : 1

  return (
    <div
      className="relative flex flex-col items-center justify-center select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* ─── Nebula Background ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-20 -left-20 w-[300px] h-[300px] rounded-full opacity-40"
          style={{
            background: 'radial-gradient(circle, rgba(168,85,247,0.3) 0%, transparent 70%)',
            filter: 'blur(50px)',
            animation: 'nebulaDrift1 35s ease-in-out infinite',
          }}
        />
        <div
          className="absolute -bottom-16 -right-16 w-[280px] h-[280px] rounded-full opacity-35"
          style={{
            background: 'radial-gradient(circle, rgba(255,75,145,0.25) 0%, transparent 70%)',
            filter: 'blur(45px)',
            animation: 'nebulaDrift2 40s ease-in-out infinite',
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)',
            filter: 'blur(55px)',
            animation: 'nebulaDrift3 45s ease-in-out infinite',
          }}
        />
      </div>

      {/* ─── Twinkling Stars ─── */}
      {starData.map((s, i) => (
        <motion.div
          key={`star-${i}`}
          className="absolute rounded-full bg-white pointer-events-none"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
          }}
          animate={{
            opacity: [0.15, 0.8, 0.15],
            scale: [0.8, 1.3, 0.8],
          }}
          transition={{
            duration: s.dur,
            repeat: Infinity,
            delay: s.delay,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* ─── Floating Particles ─── */}
      {particleData.map((p, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: i % 3 === 0
              ? 'rgba(168,85,247,0.4)'
              : i % 3 === 1
              ? 'rgba(255,75,145,0.35)'
              : 'rgba(99,102,241,0.3)',
          }}
          animate={{
            y: [0, -15, 0],
            opacity: [0, 0.7, 0],
          }}
          transition={{
            duration: p.dur,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* ─── Comet ─── */}
      <motion.div
        className="absolute pointer-events-none"
        style={{ top: '15%', left: '5%' }}
        animate={{
          x: [0, 500],
          y: [0, 200],
          opacity: [0, 0.7, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          delay: 8,
          ease: 'easeOut',
        }}
      >
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
          <div className="w-16 h-[1px] bg-gradient-to-r from-white/60 to-transparent rounded-full" />
        </div>
      </motion.div>

      {/* ─── Orbit Rings (elliptical) ─── */}
      {orbitRings.map((ring, i) => (
        <motion.div
          key={`orbit-${i}`}
          className="absolute pointer-events-none"
          style={{
            width: ring.rx * 2,
            height: ring.ry * 2,
            border: `1px solid rgba(168,85,247,${0.1 + i * 0.04})`,
            borderRadius: '50%',
            transform: `rotate(${ring.rotate}deg)`,
          }}
          animate={{ rotate: [ring.rotate, ring.rotate + 360] }}
          transition={{
            duration: ring.speed,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}

      {/* ─── Orbiting Planets ─── */}
      {planets.map((p, i) => (
        <motion.div
          key={`planet-${i}`}
          className="absolute pointer-events-none"
          animate={{ rotate: 360 }}
          transition={{
            duration: p.speed,
            repeat: Infinity,
            ease: 'linear',
            delay: p.delay,
          }}
          style={{ width: p.orbit, height: p.orbit }}
        >
          <motion.div
            className="absolute top-0 left-1/2 -translate-x-1/2"
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 6 + i * 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span
              className="block"
              style={{
                fontSize: p.size,
                filter: `drop-shadow(0 0 14px ${p.color}CC)`,
              }}
            >
              {p.emoji}
            </span>
          </motion.div>
        </motion.div>
      ))}

      {/* ─── Portal Container ─── */}
      <motion.div
        className="relative"
        animate={{ scale: portalScale }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        {/* Outer Galaxy Ring — brighter and more visible */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: `conic-gradient(from 0deg, 
              rgba(168,85,247,0.2) 0deg, 
              rgba(255,105,180,0.25) 90deg, 
              rgba(168,85,247,0.2) 180deg, 
              rgba(130,70,255,0.25) 270deg, 
              rgba(168,85,247,0.2) 360deg)`,
            maskImage: 'radial-gradient(circle at center, black 50%, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(circle at center, black 50%, transparent 75%)',
            boxShadow: `0 0 ${isHovered ? 80 : 50}px rgba(168,85,247,${glowIntensity + 0.2})`,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
        />

        {/* Enhanced outer glow bloom */}
        <motion.div
          className="absolute inset-[-20px] rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, rgba(168,85,247,${(glowIntensity + 0.1) * 0.35}) 30%, transparent 70%)`,
            filter: 'blur(25px)',
          }}
          animate={{
            scale: [1, 1.04, 1],
            opacity: [0.35, 0.65, 0.35],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Soft purple bloom ring */}
        <motion.div
          className="absolute inset-[-30px] rounded-full pointer-events-none"
          style={{
            boxShadow: '0 0 60px rgba(255,105,180,0.18)',
            borderRadius: '50%',
          }}
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Inner Ring */}
        <motion.div
          className="absolute inset-[25px] rounded-full"
          style={{
            border: '1px solid rgba(255,255,255,0.1)',
          }}
          animate={{ rotate: -360 }}
          transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
        />

        {/* Secondary inner ring */}
        <motion.div
          className="absolute inset-[50px] rounded-full"
          style={{
            border: '1px dashed rgba(168,85,247,0.15)',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
        />

        {/* ─── Main Portal Circle (500px) — now transparent glass ─── */}
        <div
          className="relative w-[500px] h-[500px] rounded-full overflow-hidden cursor-pointer"
          onClick={handleBrowse}
        >
          {/* Energy portal glass surface — Apple Vision Pro crystal glass */}
          <div
            className="absolute inset-0 rounded-full transition-all duration-250 ease-out"
            style={{
              background: `
                radial-gradient(circle at center, rgba(255,255,255,0.03) 0%, transparent 40%),
                radial-gradient(circle at center, rgba(168,100,255,0.06) 0%, rgba(168,100,255,0.03) 50%, transparent 80%),
                radial-gradient(circle at center, rgba(255,255,255,0.015) 0%, transparent 60%)
              `,
              backdropFilter: 'blur(28px)',
              WebkitBackdropFilter: 'blur(28px)',
              border: '1px solid rgba(255,255,255,0.05)',
              boxShadow: '0 0 60px rgba(168,100,255,0.08), 0 0 100px rgba(200,130,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.1)',
            }}
            onMouseEnter={(e) => {
              const target = e.currentTarget as HTMLElement
              target.style.background = `
                radial-gradient(circle at center, rgba(255,255,255,0.05) 0%, transparent 40%),
                radial-gradient(circle at center, rgba(168,100,255,0.09) 0%, rgba(168,100,255,0.05) 50%, transparent 80%),
                radial-gradient(circle at center, rgba(255,255,255,0.025) 0%, transparent 60%)
              `
              target.style.boxShadow = '0 0 80px rgba(168,100,255,0.12), 0 0 140px rgba(200,130,255,0.06), inset 0 1px 0 rgba(255,255,255,0.09), inset 0 -1px 0 rgba(0,0,0,0.1)'
            }}
            onMouseLeave={(e) => {
              const target = e.currentTarget as HTMLElement
              target.style.background = `
                radial-gradient(circle at center, rgba(255,255,255,0.03) 0%, transparent 40%),
                radial-gradient(circle at center, rgba(168,100,255,0.06) 0%, rgba(168,100,255,0.03) 50%, transparent 80%),
                radial-gradient(circle at center, rgba(255,255,255,0.015) 0%, transparent 60%)
              `
              target.style.boxShadow = '0 0 60px rgba(168,100,255,0.08), 0 0 100px rgba(200,130,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.1)'
            }}
          />

          {/* Faint rotating nebula texture inside the portal */}
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none opacity-[0.08]"
            style={{
              background: 'conic-gradient(from 0deg, transparent, rgba(168,85,247,0.025), transparent, rgba(255,105,180,0.015), transparent)',
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          />

          {/* Secondary nebula swirl */}
          <motion.div
            className="absolute inset-[10%] rounded-full pointer-events-none opacity-[0.04]"
            style={{
              background: 'conic-gradient(from 0deg, rgba(130,70,255,0.015), transparent, rgba(255,75,145,0.01), transparent, rgba(130,70,255,0.015))',
            }}
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          />

          {/* Gentle animated energy ripple */}
          <motion.div
            className="absolute inset-[15%] rounded-full pointer-events-none border"
            style={{
              borderColor: 'rgba(168,85,247,0.03)',
            }}
            animate={{
              scale: [1, 1.08, 1],
              opacity: [0.05, 0.14, 0.05],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Second ripple */}
          <motion.div
            className="absolute inset-[30%] rounded-full pointer-events-none border"
            style={{
              borderColor: 'rgba(255,105,180,0.02)',
            }}
            animate={{
              scale: [1, 1.12, 1],
              opacity: [0.04, 0.1, 0.04],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          />

          {/* Soft core glow */}
          <motion.div
            className="absolute inset-[120px] rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle at center, rgba(160,100,255,0.03) 0%, transparent 70%)',
              filter: 'blur(25px)',
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.08, 0.2, 0.08],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Tiny stars within the portal */}
          {portalStars.map((s, i) => (
            <motion.div
              key={`ps-${i}`}
              className="absolute rounded-full bg-white pointer-events-none"
              style={{
                left: `${s.x}%`, top: `${s.y}%`,
                width: s.s, height: s.s,
              }}
              animate={{ opacity: [0.04, 0.25, 0.04], scale: [0.8, 1.2, 0.8] }}
              transition={{
                duration: s.d, repeat: Infinity, delay: s.delay, ease: 'easeInOut',
              }}
            />
          ))}

          {/* Subtle dust inside portal */}
          {portalDust.map((d, i) => (
            <motion.div
              key={`pd-${i}`}
              className="absolute rounded-full pointer-events-none"
              style={{
                left: `${d.x}%`, top: `${d.y}%`,
                width: d.s, height: d.s,
                background: i % 2 === 0 ? 'rgba(168,85,247,0.04)' : 'rgba(255,105,180,0.03)',
              }}
              animate={{
                y: [0, -8, 0],
                opacity: [0, 0.08, 0],
              }}
              transition={{
                duration: d.dur, repeat: Infinity, delay: d.delay, ease: 'easeInOut',
              }}
            />
          ))}

          {/* Inner energy rings */}
          {[0, 1, 2].map((r) => (
            <motion.div
              key={`energy-${r}`}
              className="absolute rounded-full border border-dashed pointer-events-none"
              animate={{ rotate: r % 2 === 0 ? 360 : -360 }}
              transition={{
                duration: 12 + r * 5,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{
                inset: `${70 + r * 25}px`,
                borderColor: `rgba(168,85,247,${0.02 + r * 0.01})`,
              }}
            />
          ))}

          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, transparent 25%, rgba(255,255,255,0.015) 45%, transparent 65%)',
            }}
            animate={{
              backgroundPosition: ['0% 0%', '200% 200%'],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          />

          {/* ─── Center Content ─── */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
            <AnimatePresence mode="wait">
              {uploadState === 'idle' && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex flex-col items-center gap-4 text-center px-8"
                >
                  {/* Sparkle icon */}
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      filter: [
                        'drop-shadow(0 0 8px rgba(168,85,247,0.3))',
                        'drop-shadow(0 0 20px rgba(168,85,247,0.6))',
                        'drop-shadow(0 0 8px rgba(168,85,247,0.3))',
                      ],
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <Sparkles className="w-12 h-12 text-white" />
                  </motion.div>

                  {/* Text */}
                  <div className="space-y-1">
                    <p className="text-white/90 text-sm font-medium leading-relaxed">
                      Drag photos, videos, voice notes, journal entries
                    </p>
                    <p className="text-white/50 text-xs">
                      or click to upload
                    </p>
                  </div>

                  {/* Browse Button - enhanced glow */}
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="mt-2 px-8 py-3 rounded-full text-sm font-semibold text-white border border-white/20 bg-gradient-to-r from-neonPink/35 to-neonPurple/35 backdrop-blur-md shadow-[0_0_30px_rgba(255,75,145,0.35),0_0_60px_rgba(168,85,247,0.15)] hover:shadow-[0_0_50px_rgba(255,75,145,0.55),0_0_80px_rgba(168,85,247,0.25)] transition-all duration-300"
                    onClick={(e) => { e.stopPropagation(); handleBrowse() }}
                  >
                    Browse Files
                  </motion.button>
                </motion.div>
              )}

              {uploadState === 'uploading' && (
                <motion.div
                  key="uploading"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex flex-col items-center gap-5"
                >
                  {/* Progress Ring */}
                  <div className="relative w-32 h-32">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                      <circle
                        cx="60" cy="60" r="52"
                        fill="none"
                        stroke="rgba(255,255,255,0.08)"
                        strokeWidth="4"
                      />
                      <motion.circle
                        cx="60" cy="60" r="52"
                        fill="none"
                        stroke="url(#progressGrad)"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 52}
                        animate={{ strokeDashoffset: 2 * Math.PI * 52 * (1 - progress / 100) }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                      />
                      <defs>
                        <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#ff4b91" />
                          <stop offset="100%" stopColor="#a855f7" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-extrabold text-white">{progress}%</span>
                      <span className="text-[9px] text-gray-400 font-semibold uppercase mt-0.5">Uploading</span>
                    </div>
                  </div>

                  {/* File name */}
                  <p className="text-xs text-gray-400 font-medium max-w-[200px] truncate text-center">
                    {selectedFile?.name}
                  </p>

                  {/* Animated progress bar */}
                  <div className="w-48 h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-neonPink to-neonPurple"
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </motion.div>
              )}

              {uploadState === 'complete' && (
                <motion.div
                  key="complete"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-3"
                >
                  {/* Flash effect */}
                  <motion.div
                    className="absolute inset-0 rounded-full pointer-events-none"
                    style={{
                      background: 'radial-gradient(circle at center, rgba(255,255,255,0.3) 0%, transparent 60%)',
                    }}
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                  />

                  {/* Checkmark */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                    className="w-16 h-16 rounded-full bg-gradient-to-r from-neonPink to-neonPurple flex items-center justify-center shadow-[0_0_30px_rgba(255,75,145,0.5)]"
                  >
                    <Check className="w-8 h-8 text-white" strokeWidth={3} />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-center"
                  >
                    <p className="text-white font-bold text-sm flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-neonPink" />
                      Memory Ready
                    </p>
                    <p className="text-gray-400 text-[10px] mt-1 font-medium max-w-[200px] truncate">
                      {selectedFile?.name}
                    </p>
                  </motion.div>

                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    onClick={(e) => { e.stopPropagation(); resetPortal() }}
                    className="mt-2 px-5 py-1.5 rounded-full text-[10px] font-semibold text-gray-400 border border-white/10 hover:text-white hover:border-white/20 transition-all duration-300"
                  >
                    Upload Another
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ─── Drag Over Overlay ─── */}
          <AnimatePresence>
            {isDragOver && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 rounded-full z-20 flex items-center justify-center"
                style={{
                  background: 'radial-gradient(circle at center, rgba(168,85,247,0.06) 0%, rgba(255,75,145,0.03) 50%, transparent 70%)',
                  backdropFilter: 'blur(4px)',
                }}
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-center"
                >
                  <Upload className="w-10 h-10 text-white mx-auto mb-2" />
                  <p className="text-white text-sm font-semibold">Release to upload</p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* ─── Supported Formats ─── */}
      <motion.div
        className="mt-6 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <p className="text-[10px] text-gray-500 font-medium">
          JPG · PNG · WEBP · MP4 · MOV · MP3 · WAV · TXT · PDF
        </p>
        <p className="text-[10px] text-gray-600 mt-1 font-medium">Max 500MB per file</p>
      </motion.div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileSelect}
        accept="image/*,video/*,audio/*,.txt,.pdf"
      />

      {/* ─── Keyframes ─── */}
      <style jsx>{`
        @keyframes nebulaDrift1 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(30px, 20px) scale(1.05); }
        }
        @keyframes nebulaDrift2 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(-25px, -15px) scale(0.95); }
        }
        @keyframes nebulaDrift3 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(20px, -20px) scale(1.03); }
        }
      `}</style>
    </div>
  )
}
