'use client'

import { motion } from 'framer-motion'
import { Clock3 } from 'lucide-react'
import { TIMELINE_MILESTONES, Letter } from './types'

interface Props {
  activeTimeline: string
  onSelect: (year: string) => void
  allLetters: Letter[]
}

export default function Timeline({ activeTimeline, onSelect, allLetters }: Props) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 25 }}
      className="rounded-[22px] p-3"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,.09), rgba(32,12,68,.62) 44%, rgba(14,5,35,.72))',
        border: '1px solid rgba(237,184,255,.17)',
        boxShadow: '0 18px 48px rgba(0,0,0,.32), inset 0 1px rgba(255,255,255,.13)',
        backdropFilter: 'blur(26px)',
      }}
    >
      <div className="flex items-center gap-2 px-2 mb-3">
        <Clock3 className="w-4 text-pink-200" />
        <h2 className="font-serif">Future Timeline</h2>
        <span className="text-[11px] text-white/45">Milestones worth writing about.</span>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
        {TIMELINE_MILESTONES.map((m, i) => {
          const isActive = activeTimeline === m.year
          return (
            <motion.button
              key={m.year}
              onClick={() => onSelect(m.year)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02, type: 'spring', stiffness: 300, damping: 25 }}
              whileHover={{ y: -4, scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`min-w-[118px] rounded-xl border px-3 py-3 text-left transition-all duration-300 ${
                isActive
                  ? 'border-pink-300 bg-fuchsia-500/25 shadow-[0_0_16px_rgba(236,73,204,.28)]'
                  : 'border-white/10 bg-black/10 hover:border-violet-300/30'
              }`}
            >
              <b className="block text-sm">{m.icon} {m.year}</b>
              <span className="text-[10px] text-white/55">{m.label}</span>
            </motion.button>
          )
        })}
      </div>
    </motion.section>
  )
}
