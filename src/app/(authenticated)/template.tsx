'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

export default function AuthenticatedTemplate({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="w-full flex-1 flex flex-col"
    >
      {children}
    </motion.div>
  )
}
