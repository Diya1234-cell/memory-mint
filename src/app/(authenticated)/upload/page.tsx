'use client'

import { useMemo } from 'react'
import { motion, Variants } from 'framer-motion'
import { MemoryProvider } from '@/context/MemoryContext'
import TopNav from '@/components/upload/TopNav'
import MemoryTypeSelector from '@/components/upload/MemoryTypeSelector'
import UploadPortal from '@/components/upload/UploadPortal'
import MemoryDetailsForm from '@/components/upload/MemoryDetailsForm'
import LiveMemoryPreview from '@/components/upload/LiveMemoryPreview'
import AIMemoryAssistant from '@/components/upload/AIMemoryAssistant'
import TimelinePreview from '@/components/upload/TimelinePreview'
import MemoryGalaxyPreview from '@/components/upload/MemoryGalaxyPreview'
import BottomActionBar from '@/components/upload/BottomActionBar'

function lcg(seed: number) {
  let s = seed >>> 0
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296 }
}

const stagger: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.08 },
  },
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
}

function BackgroundAmbience() {
  const stars = useMemo(() => {
    const rng = lcg(1313)
    return Array.from({ length: 30 }).map(() => ({
      x: rng() * 100,
      y: rng() * 100,
      s: rng() * 1.5 + 0.3,
      d: rng() * 5 + 3,
      delay: rng() * 8,
    }))
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {stars.map((s, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.x}%`, top: `${s.y}%`,
            width: s.s, height: s.s,
          }}
          animate={{ opacity: [0, 0.4, 0], scale: [0.5, 1, 0.5] }}
          transition={{
            duration: s.d, repeat: Infinity, delay: s.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
      <div
        className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'nebulaDrift 60s ease-in-out infinite',
        }}
      />
      <div
        className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,75,145,0.05) 0%, transparent 70%)',
          filter: 'blur(100px)',
          animation: 'nebulaDrift2 70s ease-in-out infinite',
        }}
      />
      <style jsx>{`
        @keyframes nebulaDrift {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(40px, -30px); }
        }
        @keyframes nebulaDrift2 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-30px, 40px); }
        }
      `}</style>
    </div>
  )
}

export default function UploadPage() {
  return (
    <MemoryProvider>
      <BackgroundAmbience />
      <motion.div
        className="flex-1 flex flex-col min-h-screen text-slate-100 relative"
        style={{ zIndex: 1 }}
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        <TopNav />

        <div className="flex-1 overflow-y-auto">
          <div className="p-8 space-y-8">

            {/* ─── Hero ─── */}
            <motion.div variants={fadeUp} className="relative">
              <div
                className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-20 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(168,85,247,0.25) 0%, transparent 70%)',
                  filter: 'blur(70px)',
                }}
              />
              <div
                className="absolute -top-12 right-0 w-72 h-72 rounded-full opacity-15 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(255,75,145,0.18) 0%, transparent 70%)',
                  filter: 'blur(60px)',
                }}
              />
              <div className="relative z-10">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                  Capture a{' '}
                  <span className="bg-gradient-to-r from-neonPink via-neonPurple to-cosmicBlue bg-clip-text text-transparent">
                    New Memory
                  </span>
                </h1>
                <p className="text-sm text-gray-400 mt-2 max-w-xl font-medium">
                  Every beautiful story begins with a single moment.
                </p>
              </div>
            </motion.div>

            {/* ─── Memory Type Selector ─── */}
            <motion.div variants={fadeUp}>
              <MemoryTypeSelector />
            </motion.div>

            {/* ─── Upload + Preview ─── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <motion.div variants={fadeUp} className="lg:col-span-5">
                <div className="rounded-3xl p-8 flex items-center justify-center min-h-[500px] relative overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 8px 32px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.04)' }}>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.04)_0%,transparent_70%)] pointer-events-none" />
                  <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/[0.02] pointer-events-none" />
                  <UploadPortal />
                </div>
              </motion.div>
              <motion.div variants={fadeUp} className="lg:col-span-7 space-y-6">
                <MemoryDetailsForm />
                <LiveMemoryPreview />
              </motion.div>
            </div>

            {/* ─── AI Assistant ─── */}
            <motion.div variants={fadeUp}>
              <AIMemoryAssistant />
            </motion.div>

            {/* ─── Timeline + Galaxy ─── */}
            <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TimelinePreview />
              <MemoryGalaxyPreview />
            </motion.div>

            {/* ─── Bottom Action Bar ─── */}
            <motion.div variants={fadeUp}>
              <BottomActionBar />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </MemoryProvider>
  )
}
