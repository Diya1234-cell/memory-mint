'use client'

import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'

interface PeopleSelectorProps {
  people: string[]
  onAdd: () => void
}

const avatarImages: Record<string, string> = {
  You: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80',
  Rahul: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80',
  Aanya: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80',
}

export default function PeopleSelector({ people, onAdd }: PeopleSelectorProps) {
  return (
    <div className="flex items-center gap-2.5 flex-wrap">
      {people.map((name, i) => (
        <motion.div
          key={name}
          className="relative flex-shrink-0"
          whileHover={{ scale: 1.08, y: -2 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        >
          <div
            className={`w-9 h-9 rounded-full overflow-hidden border-2 shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] ${
              i === 0
                ? 'border-neonPink/50 shadow-[0_0_12px_rgba(255,75,145,0.35),inset_0_2px_4px_rgba(0,0,0,0.2)]'
                : 'border-white/15 shadow-[0_0_8px_rgba(255,255,255,0.06),inset_0_2px_4px_rgba(0,0,0,0.2)]'
            }`}
            style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
            <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
            <img
              src={avatarImages[name] || avatarImages.You}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>
          {i === 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-neonPink border-2 border-[#0c071e] flex items-center justify-center shadow-[0_0_8px_rgba(255,75,145,0.5)]">
              <span className="text-[6px] text-white font-bold">&#x2713;</span>
            </span>
          )}
          <span className="text-[7px] text-gray-400 font-medium text-center block mt-1">{name}</span>
        </motion.div>
      ))}
      <motion.button
        onClick={onAdd}
        className="w-9 h-9 rounded-full border border-dashed border-white/20 flex items-center justify-center text-gray-400 hover:text-neonPink hover:border-neonPink/40 hover:bg-neonPink/10 transition-all duration-300 flex-shrink-0"
        whileHover={{ scale: 1.08, rotate: 90 }}
        whileTap={{ scale: 0.92 }}
      >
        <Plus className="w-4 h-4" />
      </motion.button>
    </div>
  )
}
