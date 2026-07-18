'use client'

import { motion } from 'framer-motion'
import { Upload } from 'lucide-react'

const planets = [
  { emoji: '🪐', size: 24, orbit: 260, speed: 25, delay: 0 },
  { emoji: '🌙', size: 16, orbit: 300, speed: 35, delay: 2 },
  { emoji: '🟠', size: 28, orbit: 340, speed: 45, delay: 4 },
  { emoji: '🔵', size: 18, orbit: 220, speed: 20, delay: 1 },
  { emoji: '💫', size: 12, orbit: 380, speed: 55, delay: 3 },
]

export default function CosmicUploadPortal() {
  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Orbiting Planets — ambient rotation only */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {planets.map((p, i) => (
          <motion.div
            key={i}
            className="absolute"
            animate={{ rotate: 360 }}
            transition={{ duration: p.speed, repeat: Infinity, ease: 'linear', delay: p.delay }}
            style={{ width: p.orbit, height: p.orbit }}
          >
            <span
              className="absolute top-0 left-1/2 -translate-x-1/2"
              style={{ fontSize: p.size, filter: 'drop-shadow(0 0 6px rgba(255,75,145,0.3))' }}
            >
              {p.emoji}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Portal — 500px diameter */}
      <div className="relative w-[500px] h-[500px] rounded-full flex items-center justify-center">
        {/* Wormhole layer 1 — outer rotation */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          style={{
            background: 'conic-gradient(from 0deg, transparent 0deg, rgba(168,85,247,0.12) 90deg, transparent 180deg, rgba(111,59,255,0.08) 270deg, transparent 360deg)',
            maskImage: 'radial-gradient(circle at center, black 30%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(circle at center, black 30%, transparent 70%)',
          }}
        />

        {/* Wormhole layer 2 — inner counter-rotation */}
        <motion.div
          className="absolute inset-[15%] rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          style={{
            background: 'conic-gradient(from 0deg, transparent 0deg, rgba(255,75,145,0.06) 60deg, transparent 120deg, rgba(168,85,247,0.08) 200deg, transparent 280deg)',
            maskImage: 'radial-gradient(circle at center, black 40%, transparent 65%)',
            WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 65%)',
          }}
        />

        {/* Breathing center glow */}
        <motion.div
          className="absolute inset-[30%] rounded-full"
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            background: 'radial-gradient(circle at center, rgba(168,85,247,0.35) 0%, rgba(255,75,145,0.1) 50%, transparent 70%)',
            filter: 'blur(12px)',
          }}
        />

        {/* Particle rings */}
        {[0, 1, 2].map((ring) => (
          <motion.div
            key={ring}
            className="absolute rounded-full border border-dashed pointer-events-none"
            animate={{ rotate: 360 }}
            transition={{
              duration: 8 + ring * 4,
              repeat: Infinity,
              ease: 'linear',
              delay: ring * 2,
            }}
            style={{
              width: `calc(100% - ${60 + ring * 40}px)`,
              height: `calc(100% - ${60 + ring * 40}px)`,
              borderColor: `rgba(168,85,247,${0.08 + ring * 0.05})`,
            }}
          />
        ))}

        {/* Center content */}
        <div className="relative z-10 flex flex-col items-center gap-3 text-center">
          <motion.div
            animate={{
              scale: [1, 1.08, 1],
              filter: [
                'drop-shadow(0 0 10px rgba(168,85,247,0.3))',
                'drop-shadow(0 0 25px rgba(168,85,247,0.6))',
                'drop-shadow(0 0 10px rgba(168,85,247,0.3))',
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Upload className="w-10 h-10 text-white" />
          </motion.div>

          <p className="text-white/80 text-sm font-medium">Drag photos, videos...</p>
          <button className="px-5 py-2 rounded-full text-xs font-semibold text-white border border-white/20 bg-white/5 hover:bg-white/10 transition-all duration-300">
            Browse Files
          </button>
        </div>
      </div>

      {/* Supported formats */}
      <div className="mt-4 text-center">
        <p className="text-[10px] text-gray-500 font-medium">
          JPG · PNG · MP4 · MOV · MP3 · WAV · TXT
        </p>
        <p className="text-[10px] text-gray-600 mt-1 font-medium">Max 500MB per file</p>
      </div>
    </div>
  )
}
