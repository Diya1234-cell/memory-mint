'use client'

import { motion } from 'framer-motion'
import { Sparkles, Heart, ArrowRight } from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, delay: i * 0.13, ease: [0.16, 1, 0.3, 1] },
  }),
}

export default function HeroLeft() {
  return (
    <div className="flex flex-col justify-center max-w-xl lg:max-w-[540px]">
      {/* Badge */}
      <motion.div
        custom={0}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="inline-flex items-center gap-2 px-4 py-[6px] rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md mb-8 w-fit"
      >
        <span className="w-[6px] h-[6px] rounded-full bg-neonPink animate-ping" />
        <span className="text-[10px] font-bold tracking-[0.16em] uppercase text-neonPink">
          #1 AI-Powered Memory Platform
        </span>
      </motion.div>

      {/* Headline */}
      <motion.h1
        custom={1}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="font-sans-grotesk text-[3.25rem] md:text-[4.25rem] lg:text-[4.75rem] font-extrabold tracking-[-0.03em] leading-[1.04] mb-7 text-white"
      >
        Remember <br />
        <span className="gradient-text-universe">
          Forever.
        </span>
      </motion.h1>

      {/* Description */}
      <motion.div
        custom={2}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="mb-10"
      >
        <p className="text-[15.5px] text-white/45 max-w-[400px] leading-[1.75]">
          Capture every moment. Relive every memory. Strengthen every bond with
          emotional intelligence built directly into your digital archive.
        </p>
      </motion.div>

      {/* Feature Pills */}
      <motion.div
        custom={3}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="flex flex-wrap gap-2.5 mb-10"
      >
        {[
          { icon: Sparkles, label: 'AI-Powered', color: 'text-neonPink' },
          { icon: Heart, label: 'Private & Secure', color: 'text-neonPurple' },
        ].map(({ icon: Icon, label, color }) => (
          <span
            key={label}
            className="flex items-center gap-1.5 px-3.5 py-[5px] rounded-full bg-white/[0.03] backdrop-blur-sm text-[11px] border border-white/[0.07] text-white/55 hover:bg-white/[0.06] hover:border-white/[0.12] hover:text-white/75 transition-all duration-300 cursor-default"
          >
            <Icon className={`w-3 h-3 ${color}`} />
            {label}
          </span>
        ))}
      </motion.div>

      {/* CTA + Avatars */}
      <motion.div
        custom={4}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="flex flex-col sm:flex-row items-center gap-5 mb-8"
      >
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('open-auth'))}
          className="relative px-7 py-3.5 bg-gradient-to-r from-neonPink to-neonPurple text-white text-[14px] font-bold rounded-full shadow-[0_0_25px_rgba(255,77,184,0.35)] hover:shadow-[0_0_45px_rgba(255,77,184,0.6)] hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 overflow-hidden group"
        >
          <span className="relative z-10 flex items-center gap-2">
            Start Your Journey
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </span>
          <span className="absolute inset-0 bg-gradient-to-r from-neonPink via-[#d946ef] to-neonPurple rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </button>

        <div className="flex items-center gap-3.5">
          <div className="flex -space-x-3">
            {[
              'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80',
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80',
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80',
            ].map((src, i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-[#090312] bg-gray-700 overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
                <img src={src} alt="" className="object-cover w-full h-full" />
              </div>
            ))}
          </div>
          <p className="text-[11px] text-white/35">
            Loved by <span className="text-white/80 font-bold">10,000+</span> couples worldwide
          </p>
        </div>
      </motion.div>
    </div>
  )
}
