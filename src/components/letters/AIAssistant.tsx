'use client'

import { motion } from 'framer-motion'
import { Wand2 } from 'lucide-react'
import { AI_TEMPLATES } from './types'

interface Props {
  onApply: (key: string) => void
}

export default function AIAssistant({ onApply }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, type: 'spring', stiffness: 200, damping: 25 }}
      className="rounded-2xl p-3"
      style={{
        background: 'linear-gradient(135deg,rgba(119,55,189,.48),rgba(32,8,66,.7))',
        border: '1px solid rgba(237,184,255,.17)',
        boxShadow: '0 18px 48px rgba(0,0,0,.32), inset 0 1px rgba(255,255,255,.13)',
        backdropFilter: 'blur(26px)',
      }}
    >
      <div className="flex items-center gap-2">
        <motion.div
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Wand2 className="w-4 text-pink-200" />
        </motion.div>
        <div>
          <b className="text-sm">AI Letter Assistant</b>
          <p className="text-[11px] text-white/55">Need inspiration? Let AI help express what&apos;s in your heart.</p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {Object.keys(AI_TEMPLATES).map((key, i) => (
          <motion.button
            key={key}
            onClick={() => onApply(key)}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.04, type: 'spring', stiffness: 400, damping: 25 }}
            whileHover={{ y: -3, scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            className="rounded-xl border border-fuchsia-200/35 bg-gradient-to-r from-fuchsia-500/25 to-violet-500/25 px-3 py-1.5 text-xs shadow-[0_0_12px_rgba(232,84,255,.16)] hover:shadow-[0_0_20px_rgba(232,84,255,.3)] transition-shadow"
          >
            {key}
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}
