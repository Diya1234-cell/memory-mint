'use client'

import { motion } from 'framer-motion'
import { Search, Bell, Sparkles } from 'lucide-react'

export default function TopNav() {
  return (
    <nav className="flex items-center justify-between gap-4 px-6 py-3 border-b border-white/5 sticky top-0 z-30"
      style={{ background: 'rgba(255,255,255,0.035)', backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)', border: '1px solid rgba(255,255,255,0.04)' }}>
      {/* Left: Search Bar */}
      <div className="flex items-center gap-4 flex-1 max-w-lg">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            readOnly
            placeholder="Search memories, people..."
             className="w-full text-white placeholder-gray-500 rounded-full py-2 pl-10 pr-14 text-sm outline-none transition-all duration-200 hover:border-white/20 focus:border-neonPink/50"
             style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.08)' }}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] text-gray-500 font-medium">
            <span className="text-[9px]">⌘</span>
            <span>K</span>
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2.5">
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300"
        >
          <Bell className="w-4 h-4" />
          <motion.span
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-neonPink"
          />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300"
        >
          <Sparkles className="w-4 h-4" />
        </motion.button>

        <motion.div
          whileHover={{ scale: 1.04 }}
          className="relative"
        >
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80"
            alt="Profile"
            className="w-8 h-8 rounded-xl object-cover border border-white/10 ring-2 ring-white/5 shadow-md"
          />
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#0c071e]" />
        </motion.div>
      </div>
    </nav>
  )
}
