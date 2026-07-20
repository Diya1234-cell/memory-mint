'use client'

import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useRef, useState } from 'react'
import { Camera, Sparkles, Globe, Clock, Heart, BarChart3 } from 'lucide-react'

const features = [
  {
    icon: Camera,
    title: 'Save Every Memory',
    description: 'Upload photos, videos, voice notes, journals, and milestones into your personal universe.',
    color: '#FF4DB8',
    glow: 'rgba(255,77,184,0.12)',
    bg: 'rgba(255,77,184,0.06)',
    border: 'rgba(255,77,184,0.18)',
  },
  {
    icon: Sparkles,
    title: 'AI StoryBook',
    description: 'Turn scattered memories into cinematic storybooks that read like chapters of your life.',
    color: '#A855F7',
    glow: 'rgba(168,85,247,0.12)',
    bg: 'rgba(168,85,247,0.06)',
    border: 'rgba(168,85,247,0.18)',
  },
  {
    icon: Globe,
    title: 'Memory Galaxy',
    description: 'Visualize memories as stars connected through an interactive constellation timeline.',
    color: '#6366F1',
    glow: 'rgba(99,102,241,0.12)',
    bg: 'rgba(99,102,241,0.06)',
    border: 'rgba(99,102,241,0.18)',
  },
  {
    icon: Clock,
    title: 'Time Machine',
    description: 'Travel back to any day, relive moments, anniversaries, and hidden memories.',
    color: '#F59E0B',
    glow: 'rgba(245,158,11,0.12)',
    bg: 'rgba(245,158,11,0.06)',
    border: 'rgba(245,158,11,0.18)',
  },
  {
    icon: Heart,
    title: 'Letters & Time Capsules',
    description: 'Write letters to your future self or loved ones and unlock them on meaningful dates.',
    color: '#06B6D4',
    glow: 'rgba(6,182,212,0.12)',
    bg: 'rgba(6,182,212,0.06)',
    border: 'rgba(6,182,212,0.18)',
  },
  {
    icon: BarChart3,
    title: 'Relationship Pulse',
    description: 'Track shared milestones, memories, emotional trends, and relationship growth beautifully.',
    color: '#EC4899',
    glow: 'rgba(236,72,153,0.12)',
    bg: 'rgba(236,72,153,0.06)',
    border: 'rgba(236,72,153,0.18)',
  },
]

function FeatureCard({ feature, index, inView }: {
  feature: typeof features[0]
  index: number
  inView: boolean
}) {
  const [hovered, setHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 150, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 150, damping: 20 })
  const rotateX = useTransform(springY, (v: number) => -v * 0.015)
  const rotateY = useTransform(springX, (v: number) => v * 0.015)

  const handleMouse = (e: React.MouseEvent) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    mouseX.set(e.clientX - (rect.left + rect.width / 2))
    mouseY.set(e.clientY - (rect.top + rect.height / 2))
  }

  const handleLeave = () => {
    setHovered(false)
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.7,
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      onMouseMove={handleMouse}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleLeave}
      className="group relative cursor-default"
      style={{
        perspective: 800,
      }}
    >
      <motion.div
        className="relative rounded-[26px] p-8 h-[240px] flex flex-col justify-between overflow-hidden"
        style={{
          background: 'rgba(20,14,36,0.45)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          border: '1px solid rgba(255,255,255,0.06)',
          rotateX: hovered ? rotateX : 0,
          rotateY: hovered ? rotateY : 0,
          transformStyle: 'preserve-3d',
        }}
        animate={{
          y: hovered ? -8 : 0,
          boxShadow: hovered
            ? `0 24px 60px -12px rgba(0,0,0,0.5), 0 0 50px ${feature.glow}, inset 0 1px 0 rgba(255,255,255,0.08)`
            : '0 4px 20px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.04)',
          borderColor: hovered ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.06)',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      >
        {/* Glass reflection sweep */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.03) 50%, transparent 60%)',
          }}
          animate={{ x: hovered ? ['0%', '120%'] : '0%' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />

        {/* Icon */}
        <motion.div
          className="w-[60px] h-[60px] rounded-[18px] flex items-center justify-center relative"
          style={{
            background: feature.bg,
            border: `1px solid ${feature.border}`,
            boxShadow: `0 0 30px ${feature.glow}`,
          }}
          animate={{ rotate: hovered ? 6 : 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        >
          <feature.icon className="w-6 h-6" style={{ color: feature.color }} />
        </motion.div>

        {/* Text */}
        <div>
          <h3 className="text-white font-bold text-[20px] mb-2 tracking-[-0.01em]">
            {feature.title}
          </h3>
          <p className="text-white/40 text-[15px] leading-[1.65] line-clamp-3">
            {feature.description}
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function FeatureCards() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="features" className="relative z-10 py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] text-[10px] font-bold tracking-[0.15em] uppercase text-neonPink mb-7"
          >
            Features
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif-hero text-[2.5rem] md:text-[3.5rem] lg:text-[64px] font-bold text-white leading-[1.05] tracking-[-0.03em] max-w-[900px] mx-auto"
            style={{ marginBottom: '24px' }}
          >
            Features designed to{' '}
            <span className="gradient-text-universe animate-preserve-glow text-[0.88em]">preserve</span>
            <br />
            <span className="gradient-text-universe animate-preserve-glow text-[0.88em]">your memories</span> forever.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.25, ease: 'easeOut' }}
            className="text-[18px] font-normal text-[#A7A0B8] max-w-[650px] mx-auto leading-[1.7]"
          >
            Every feature is thoughtfully designed to help you capture,
            relive and preserve your most meaningful memories.
          </motion.p>
        </div>

        {/* Cards Grid */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  )
}
