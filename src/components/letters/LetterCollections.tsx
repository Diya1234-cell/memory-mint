'use client'

import { motion } from 'framer-motion'
import { COLLECTIONS } from './types'

interface Props {
  activeCollection: string
  onSelect: (name: string) => void
  letterCounts: Record<string, number>
}

export default function LetterCollections({ activeCollection, onSelect, letterCounts }: Props) {
  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="rounded-[24px] p-4"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,.09), rgba(32,12,68,.62) 44%, rgba(14,5,35,.72))',
        border: '1px solid rgba(237,184,255,.17)',
        boxShadow: '0 18px 48px rgba(0,0,0,.32), inset 0 1px rgba(255,255,255,.13), 0 0 32px rgba(210,87,255,.11)',
        backdropFilter: 'blur(26px) saturate(145%)',
      }}
    >
      <h2 className="font-serif text-lg mb-4">✨ Letter Collections</h2>
      <div className="space-y-1.5">
        {COLLECTIONS.map((col, i) => {
          const isActive = activeCollection === col.name
          const count = letterCounts[col.name] || col.count

          return (
            <motion.button
              key={col.name}
              onClick={() => onSelect(col.name)}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04, type: 'spring', stiffness: 300, damping: 25 }}
              whileHover={{ x: 3, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center gap-3 rounded-xl px-3.5 py-3 text-left border transition-all duration-300 focus:ring-2 focus:ring-pink-300 outline-none ${
                isActive
                  ? 'border-pink-300 bg-gradient-to-r from-fuchsia-600/35 to-pink-500/15 shadow-[0_0_20px_rgba(245,70,202,.35)]'
                  : 'border-white/8 bg-white/[.035] hover:border-violet-300/35 hover:bg-white/[.06]'
              }`}
            >
              <motion.span
                className="text-lg"
                animate={isActive ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.4 }}
              >
                {col.icon}
              </motion.span>
              <span className="font-serif text-[15px] flex-1">{col.name}</span>
              <motion.b
                key={count}
                initial={{ scale: 1.3 }}
                animate={{ scale: 1 }}
                className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/70"
              >
                {count}
              </motion.b>
            </motion.button>
          )
        })}
      </div>
      <div className="mt-7 border-t border-white/10 pt-4 text-center">
        <p className="font-serif italic text-sm text-pink-200/80">
          Every letter is a star<br />in your story. ✦
        </p>
      </div>
    </motion.aside>
  )
}
