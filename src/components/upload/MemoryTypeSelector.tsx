'use client'

import { motion } from 'framer-motion'
import { useMemory } from '@/context/MemoryContext'

const types = [
  { id: 'photos' as const, label: 'Photos', icon: '🖼️' },
  { id: 'videos' as const, label: 'Videos', icon: '🎬' },
  { id: 'voice' as const, label: 'Voice Notes', icon: '🎙️' },
  { id: 'journal' as const, label: 'Journal Entry', icon: '📝' },
  { id: 'location' as const, label: 'Location', icon: '📍' },
]

export default function MemoryTypeSelector() {
  const { draft, setField } = useMemory()

  return (
    <div className="inline-flex p-1 rounded-2xl shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]"
      style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.08)' }}>
      {types.map((type) => {
        const isSelected = draft.selectedMemoryType === type.id
        return (
          <motion.button
            key={type.id}
            type="button"
            aria-pressed={isSelected}
            onClick={() => setField('selectedMemoryType', type.id)}
            className="relative px-5 py-2.5 rounded-xl text-sm font-medium"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isSelected && (
              <motion.div
                layoutId="typeGlow"
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-neonPink/20 to-neonPurple/20 border border-neonPink/30 shadow-[0_0_20px_rgba(255,75,145,0.3),inset_0_1px_0_rgba(255,255,255,0.06)]"
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <span className="text-base">{type.icon}</span>
              <span className={isSelected ? 'text-white drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]' : 'text-gray-400'}>
                {type.label}
              </span>
            </span>
          </motion.button>
        )
      })}
    </div>
  )
}
