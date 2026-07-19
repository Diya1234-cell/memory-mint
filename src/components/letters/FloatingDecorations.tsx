'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'

interface FloatItem {
  emoji: string
  x: number
  y: number
  size: string
  dur: number
  delay: number
  rotateRange: [number, number]
  yRange: [number, number]
  opacity: number
}

export default function FloatingDecorations() {
  const items = useMemo<FloatItem[]>(() => {
    const emojis = ['💌', '✉️', '🪶', '🌹', '💕', '✨', '🌸', '🦋', '🕊️', '💌', '📜', '💝']
    return Array.from({ length: 16 }, (_, i) => ({
      emoji: emojis[i % emojis.length],
      x: (i * 23 + 5) % 95,
      y: (i * 37 + 10) % 85,
      size: ['text-xl', 'text-2xl', 'text-lg'][i % 3],
      dur: 10 + (i % 7) * 4,
      delay: (i % 6) * 2,
      rotateRange: [-15, 15] as [number, number],
      yRange: [-20, 20] as [number, number],
      opacity: 0.15 + (i % 4) * 0.05,
    }))
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-[1]">
      {items.map((item, i) => (
        <motion.div
          key={`float-${i}`}
          className={`absolute ${item.size} select-none`}
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            opacity: item.opacity,
          }}
          animate={{
            y: item.yRange,
            x: [-8, 8, -8],
            rotate: item.rotateRange,
          }}
          transition={{
            duration: item.dur,
            delay: item.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {item.emoji}
        </motion.div>
      ))}
    </div>
  )
}
