'use client'

import { useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'

interface WeatherIconsProps {
  selected: number | null
  onSelect: (index: number) => void
}

const weathers = [
  { icon: '☀️', label: 'Sunny' },
  { icon: '🌧️', label: 'Rain' },
  { icon: '❄️', label: 'Snow' },
  { icon: '⛈️', label: 'Storm' },
  { icon: '🌙', label: 'Night' },
]

export default function WeatherIcons({ selected, onSelect }: WeatherIconsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mouseRef = useRef({ x: 0.5, y: 0.5 })
  const [mouseInside, setMouseInside] = useState(false)

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
      className="flex gap-2.5 flex-wrap"
    >
      {weathers.map((w, i) => {
        const isSelected = selected === i
        const mx = mouseInside ? (mouseRef.current.x - 0.5) * 3 : 0
        const my = mouseInside ? (mouseRef.current.y - 0.5) * 3 : 0

        return (
          <motion.button
            key={w.label}
            onClick={() => onSelect(i)}
            className="flex flex-col items-center gap-1.5 group"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
          >
            <div className="relative">
              {/* Atmosphere glow */}
              {isSelected && (
                <motion.div
                  className="absolute inset-[-6px] rounded-full blur-md pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle, rgba(255,75,145,0.35) 0%, transparent 70%)',
                  }}
                  animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.12, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}

              {/* Chip body */}
              <motion.div
                className={`relative w-10 h-10 rounded-full flex items-center justify-center text-base border overflow-hidden ${
                   isSelected
                     ? 'border-neonPink/50 bg-gradient-to-br from-neonPink/25 to-neonPurple/25'
                     : 'border-white/10 group-hover:bg-white/10 group-hover:border-white/20'
                 }`}
                style={{ background: isSelected ? undefined : 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', boxShadow: isSelected ? 'inset 0 1px 0 rgba(255,255,255,0.1)' : 'inset 0 1px 0 rgba(255,255,255,0.03)' }}
                animate={
                  isSelected
                    ? {
                        scale: [1, 1.08, 1],
                        boxShadow: [
                          '0 0 12px rgba(255,75,145,0.25), inset 0 1px 0 rgba(255,255,255,0.1)',
                          '0 0 28px rgba(255,75,145,0.45), inset 0 1px 0 rgba(255,255,255,0.1)',
                          '0 0 12px rgba(255,75,145,0.25), inset 0 1px 0 rgba(255,255,255,0.1)',
                        ],
                      }
                    : {
                        boxShadow: mouseInside
                          ? `0 0 ${6 + mx * 2}px rgba(255,255,255,0.06), inset 0 1px 0 rgba(255,255,255,0.03)`
                          : '0 0 0px transparent, inset 0 1px 0 rgba(255,255,255,0.03)',
                      }
                }
                transition={{ duration: 1.5, repeat: isSelected ? Infinity : 0, ease: 'easeInOut' }}
              >
                {/* Glass reflection */}
                <div
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle at 30% 25%, rgba(255,255,255,0.25) 0%, transparent 55%)',
                  }}
                />

                {/* Secondary rim highlight */}
                <div
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle at 70% 15%, rgba(255,255,255,0.08) 0%, transparent 35%)',
                  }}
                />

                {/* Bottom shadow */}
                <div
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle at 50% 85%, rgba(0,0,0,0.25) 0%, transparent 50%)',
                  }}
                />

                <span className={`relative z-10 transition-all duration-300 ${
                  isSelected ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] scale-110' : ''
                }`}>
                  {w.icon}
                </span>
              </motion.div>

              {/* Selected ring */}
              {isSelected && (
                <motion.div
                  className="absolute inset-[-3px] rounded-full border border-neonPink/40"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: [0.4, 0.8, 0.4], scale: 1 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}
            </div>

            <span
              className={`text-[8px] font-medium transition-all duration-300 ${
                isSelected
                  ? 'text-white drop-shadow-[0_0_4px_rgba(255,75,145,0.3)]'
                  : 'text-gray-500 group-hover:text-gray-300'
              }`}
            >
              {w.label}
            </span>
          </motion.button>
        )
      })}
    </div>
  )
}
