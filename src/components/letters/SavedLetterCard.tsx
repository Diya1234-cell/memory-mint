'use client'

import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { Letter } from './types'

interface Props {
  letter: Letter
  index: number
  isActive: boolean
  onClick: () => void
}

export default function SavedLetterCard({ letter, index, isActive, onClick }: Props) {
  return (
    <motion.button
      onClick={onClick}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, type: 'spring', stiffness: 300, damping: 25 }}
      whileHover={{
        y: -8,
        rotate: index % 2 ? 1.2 : -1.2,
        transition: { duration: 0.3 },
      }}
      whileTap={{ scale: 0.97 }}
      className={`relative min-w-[200px] max-w-[200px] rounded-md p-4 text-left text-[#47233a] focus:outline-none focus:ring-2 focus:ring-pink-300 transition-shadow duration-300 ${
        isActive ? 'ring-2 ring-pink-400 shadow-[0_0_20px_rgba(245,70,202,.35)]' : ''
      }`}
      style={{
        background: 'linear-gradient(135deg,#f6d9d0,#dcaeaa)',
        boxShadow: isActive
          ? '0 13px 26px rgba(0,0,0,.35), 0 0 20px rgba(245,70,202,.25)'
          : '0 13px 26px rgba(0,0,0,.35)',
      }}
    >
      <motion.span
        className="absolute right-4 top-3 text-lg"
        animate={isActive ? { scale: [1, 1.3, 1], rotate: [0, 15, 0] } : {}}
        transition={{ duration: 0.5 }}
      >
        📮
      </motion.span>

      {letter.favorited && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute left-3 top-3"
        >
          <Heart className="w-4 h-4 text-pink-500 fill-pink-500 drop-shadow-sm" />
        </motion.div>
      )}

      <h3 className="font-serif italic text-base leading-tight pr-6">{letter.title}</h3>
      <p className="mt-1 text-[11px] text-[#75484a]/70">{letter.recipient}</p>
      <p className="mt-2 min-h-12 text-xs leading-4 line-clamp-3">{letter.body.slice(0, 74)}…</p>

      <motion.span
        className="absolute right-4 bottom-12 text-3xl select-none"
        animate={isActive ? { opacity: [0.5, 1, 0.5] } : { opacity: 0.55 }}
        transition={{ duration: 1.5, repeat: isActive ? Infinity : 0 }}
      >
        🔴
      </motion.span>

      <div className="mt-5 flex gap-1 text-[9px]">
        <b className="rounded-full bg-white/50 px-2 py-1">◷ {letter.date}</b>
        <b className="rounded-full bg-white/50 px-2 py-1">{letter.mood.split(' ')[0]}</b>
      </div>

      {isActive && (
        <motion.div
          layoutId="activeCardIndicator"
          className="absolute inset-0 rounded-md border-2 border-pink-400/50 pointer-events-none"
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      )}
    </motion.button>
  )
}
