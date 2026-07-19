'use client'

import { Search } from 'lucide-react'
import { motion } from 'framer-motion'

interface Props {
  value: string
  onChange: (v: string) => void
}

export default function SearchBar({ value, onChange }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="relative w-72 max-w-[58vw]"
    >
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 text-white/45" />
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Search title, recipient, category, mood..."
        className="w-full rounded-full border border-white/10 bg-white/5 py-2 pl-9 pr-4 text-xs text-white outline-none placeholder:text-white/35 focus:border-pink-300/50 focus:shadow-[0_0_12px_rgba(245,70,202,.15)] transition-all duration-300"
      />
      {value && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 text-xs"
        >
          ✕
        </motion.button>
      )}
    </motion.div>
  )
}
