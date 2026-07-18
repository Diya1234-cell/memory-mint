'use client'

import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import Sidebar from '@/components/navigation/Sidebar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isPublic = pathname === '/' || pathname === '/login' || pathname === '/signup' || pathname === '/landing'

  if (isPublic) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen flex text-slate-100 font-sans">
      {/* Permanent left glass sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 md:pl-72 min-h-screen relative z-10 w-full flex flex-col">
        {/* Entry animation for page transitions */}
        <motion.div
          key={pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="flex-1 flex flex-col"
        >
          {children}
        </motion.div>
      </div>
    </div>
  )
}
