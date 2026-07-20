'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Heart, Sparkles, ArrowRight, CheckCircle2, Clock, Star } from 'lucide-react'

import Navbar from '@/features/landing/components/Navbar'
import HeroSection from '@/features/landing/components/HeroSection'
import FeatureCards from '@/features/landing/components/FeatureCards'
import CosmicBackground from '@/features/landing/components/CosmicBackground'
import AuthModal from '@/features/landing/components/AuthModal'

function lcg(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

export default function HomePage() {
  const router = useRouter()
  const [isTransitioning, setIsTransitioning] = useState(false)

  const handleStartJourney = () => {
    setIsTransitioning(true)
    setTimeout(() => router.push('/create-space'), 500)
  }

  return (
    <main className="relative min-h-screen text-white overflow-x-hidden">
      {/* Cinematic Background */}
      <CosmicBackground />
      <AuthModal />

      {/* Page transition wrapper */}
      <div className={`relative z-10 transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>

        {/* Navbar */}
        <Navbar />

        {/* Hero Section */}
        <HeroSection />

        {/* Feature Cards */}
        <FeatureCards />

        {/* AI Features */}
        <section id="ai-features" className="relative z-10 py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <AIFeaturesSection />
          </div>
        </section>

        {/* Timeline / How It Works */}
        <section id="timeline" className="relative z-10 py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <TimelineSection />
          </div>
        </section>

        {/* Roadmap */}
        <section id="roadmap" className="relative z-10 py-10 md:py-16">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <RoadmapSection />
          </div>
        </section>

        {/* StoryBook Showcase */}
        <section id="storybook" className="relative z-10 py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <StoryBookShowcase />
          </div>
        </section>

        {/* Letters Section */}
        <section id="letters" className="relative z-10 py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <LettersSection />
          </div>
        </section>

        {/* About */}
        <section id="about" className="relative z-10 py-20 md:py-28">
          <div className="max-w-4xl mx-auto px-6 md:px-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] text-[10px] font-bold tracking-[0.15em] uppercase text-neonPink mb-5">
                About
              </span>
              <h2 className="font-serif-hero text-3xl md:text-[2.75rem] font-bold text-white leading-tight mb-6">
                Built for those who{' '}
                <span className="gradient-text-universe">refuse to forget</span>
              </h2>
              <p className="text-[16px] text-white/35 max-w-xl mx-auto leading-relaxed mb-6">
                MemoryVerse was born from a simple belief: your most precious moments deserve more
                than a camera roll. They deserve a universe — protected, intelligent, and eternal.
              </p>
              <p className="text-[15px] text-white/30 max-w-xl mx-auto leading-relaxed">
                We combine military-grade encryption with cutting-edge AI to give you a platform
                where memories aren&apos;t just stored — they&apos;re alive.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="relative z-10 py-24 md:py-32">
          <div className="max-w-4xl mx-auto px-6 md:px-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="font-serif-hero text-3xl md:text-[3.5rem] font-bold text-white leading-tight mb-6">
                Every Memory Deserves
                <br />
                <span className="gradient-text-universe">Its Own Universe</span>
              </h2>
              <p className="text-[16px] text-white/35 max-w-lg mx-auto mb-10 leading-relaxed">
                Start preserving your digital legacy today. Your memories are waiting to become eternal.
              </p>
              <button
                onClick={handleStartJourney}
                className="btn-cosmic-primary text-[15px] px-10 py-4 inline-flex items-center gap-3 group"
              >
                <Sparkles className="w-5 h-5" />
                Begin Your Journey
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 border-t border-white/[0.04] py-16">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <div className="grid md:grid-cols-5 gap-10 mb-12">
              {/* Brand */}
              <div className="md:col-span-2">
                <a href="/" className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-neonPink via-neonPurple to-cosmicBlue flex items-center justify-center">
                    <Heart className="w-4 h-4 text-white fill-white" />
                  </div>
                  <span className="text-base font-bold">
                    <span className="text-white/90">Forever </span>
                    <span className="bg-gradient-to-r from-neonPink to-neonPurple bg-clip-text text-transparent">Remembered</span>
                  </span>
                </a>
                <p className="text-[13px] text-white/30 max-w-xs leading-relaxed mb-5">
                  The AI-powered platform for preserving your most meaningful memories across your personal universe.
                </p>
                <div className="flex gap-3">
                  {[
                    <svg key="x" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z" /><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" /></svg>,
                    <svg key="ig" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>,
                    <svg key="gh" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>,
                  ].map((icon, i) => (
                    <a
                      key={i}
                      href="#"
                      className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-white/30 hover:text-white/70 hover:border-white/[0.12] hover:bg-white/[0.08] transition-all duration-300"
                    >
                      {icon}
                    </a>
                  ))}
                </div>
              </div>

              {/* Links */}
              {[
                {
                  title: 'Product',
                  links: ['Features', 'AI Engine', 'Pricing', 'Roadmap'],
                },
                {
                  title: 'Company',
                  links: ['About', 'Blog', 'Careers', 'Contact'],
                },
                {
                  title: 'Resources',
                  links: ['Privacy', 'Terms', 'Security', 'Help Center'],
                },
              ].map((col) => (
                <div key={col.title}>
                  <h5 className="text-[11px] font-bold text-white/50 uppercase tracking-[0.15em] mb-4">
                    {col.title}
                  </h5>
                  <ul className="space-y-2.5">
                    {col.links.map((link) => (
                      <li key={link}>
                        <a
                          href="#"
                          className="text-[13px] text-white/25 hover:text-white/60 transition-colors duration-300"
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="border-t border-white/[0.04] pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
              <p className="text-[11px] text-white/20">
                &copy; 2026 Forever Remembered. All rights reserved.
              </p>
              <p className="text-[11px] text-white/15">
                Crafted with love for the universe of memories.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </main>
  )
}

/* ─── Sub-Sections ─── */

function AIFeaturesSection() {
  const inViewRef = useRef(null)
  const inView = useInView(inViewRef, { once: true, margin: '-60px' })

  return (
    <div ref={inViewRef}>
      {/* Header */}
      <div className="text-center mb-16">
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] text-[10px] font-bold tracking-[0.15em] uppercase text-neonPink mb-6"
        >
          AI Features
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif-hero text-[2.5rem] md:text-[3.5rem] lg:text-[64px] font-bold text-white leading-[1.05] tracking-[-0.03em] max-w-[900px] mx-auto"
          style={{ marginBottom: '24px' }}
        >
          Powerful AI that understands your{' '}
          <span className="gradient-text-universe animate-preserve-glow">memories</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.25, ease: 'easeOut' }}
          className="text-[18px] font-normal text-[#A7A0B8] max-w-[700px] mx-auto leading-[1.7]"
        >
          Artificial Intelligence that transforms scattered memories into stories, timelines, insights and emotional journeys.
        </motion.p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <GalaxyCard delay={0} inView={inView} />
        <StoryCard delay={0.12} inView={inView} />
        <TimeCard delay={0.24} inView={inView} />
        <PulseCard delay={0.36} inView={inView} />
      </div>
    </div>
  )
}

/* ── Card 1: AI Memory Galaxy ── */
function GalaxyCard({ delay, inView }: { delay: number; inView: boolean }) {
  const [hovered, setHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 150, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 150, damping: 20 })
  const rotateX = useTransform(springY, (v: number) => -v * 0.02)
  const rotateY = useSpring(useTransform(mouseX, (v: number) => v * 0.02), { stiffness: 150, damping: 20 })

  const stars = useMemo(() => {
    const rng = lcg(101)
    return Array.from({ length: 18 }).map(() => ({
      x: rng() * 85 + 7,
      y: rng() * 55 + 10,
      size: rng() * 2.5 + 1,
      delay: rng() * 4,
      dur: rng() * 3 + 2,
    }))
  }, [])

  const connections = useMemo(() => {
    const pts = [
      { x: 25, y: 30 }, { x: 50, y: 18 }, { x: 72, y: 35 },
      { x: 38, y: 52 }, { x: 62, y: 55 }, { x: 80, y: 22 },
      { x: 15, y: 48 }, { x: 55, y: 40 },
    ]
    const lines = [[0,1],[1,2],[0,3],[3,4],[2,5],[6,3],[1,7],[7,4]]
    return { pts, lines }
  }, [])

  const handleMouse = (e: React.MouseEvent) => {
    if (!cardRef.current) return
    const r = cardRef.current.getBoundingClientRect()
    mouseX.set(e.clientX - (r.left + r.width / 2))
    mouseY.set(e.clientY - (r.top + r.height / 2))
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40, scale: 0.96, filter: 'blur(6px)' }}
      animate={inView ? { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouse}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); mouseX.set(0); mouseY.set(0) }}
      className="relative cursor-default"
      style={{ perspective: 800 }}
    >
      <motion.div
        className="relative rounded-[28px] overflow-hidden h-[420px] flex flex-col"
        style={{
          background: 'rgba(18,10,35,0.55)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          border: '1px solid rgba(255,255,255,0.06)',
          rotateX: hovered ? rotateX : 0,
          rotateY: hovered ? rotateY : 0,
          transformStyle: 'preserve-3d',
        }}
        animate={{
          y: hovered ? -8 : [0, -6, 0, 6, 0],
          boxShadow: hovered
            ? '0 30px 70px -15px rgba(0,0,0,0.6), 0 0 60px rgba(168,85,247,0.12), inset 0 1px 0 rgba(255,255,255,0.08)'
            : '0 4px 30px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.04)',
          borderColor: hovered ? 'rgba(168,85,247,0.2)' : 'rgba(255,255,255,0.06)',
        }}
        transition={{ y: { duration: 8, repeat: Infinity, ease: 'easeInOut' }, boxShadow: { duration: 0.4 }, borderColor: { duration: 0.4 } }}
      >
        {/* Reflection sweep */}
        <motion.div className="absolute inset-0 pointer-events-none z-20"
          style={{ background: 'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.03) 50%, transparent 65%)' }}
          animate={{ x: hovered ? ['0%', '120%'] : ['-120%', '-120%'] }}
          transition={{ duration: 0.8, ease: 'easeOut', repeat: hovered ? 0 : Infinity, repeatDelay: 6 }}
        />

        {/* Preview area */}
        <div className="flex-1 relative overflow-hidden">
          {/* Nebula glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180px] h-[180px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 60%)', filter: 'blur(30px)' }} />

          {/* Stars */}
          {stars.map((s, i) => (
            <motion.div key={i} className="absolute rounded-full bg-white"
              style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size }}
              animate={{ opacity: [0.2, 0.8, 0.2], scale: [0.8, 1.3, 0.8] }}
              transition={{ duration: s.dur, repeat: Infinity, delay: s.delay, ease: 'easeInOut' }}
            />
          ))}

          {/* Constellation lines */}
          <svg className="absolute inset-0 w-full h-full">
            {connections.lines.map(([a, b], i) => {
              const pa = connections.pts[a]
              const pb = connections.pts[b]
              return (
                <motion.line key={i}
                  x1={`${pa.x}%`} y1={`${pa.y}%`} x2={`${pb.x}%`} y2={`${pb.y}%`}
                  stroke="rgba(168,85,247,0.2)" strokeWidth="0.8"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: [0.15, 0.4, 0.15] }}
                  transition={{ pathLength: { duration: 2, delay: 0.3 + i * 0.15 }, opacity: { duration: 4, repeat: Infinity, delay: i * 0.3 } }}
                />
              )
            })}
            {connections.pts.map((p, i) => (
              <motion.circle key={`n-${i}`}
                cx={`${p.x}%`} cy={`${p.y}%`} r="3"
                fill="rgba(168,85,247,0.5)"
                animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.4, ease: 'easeInOut' }}
              />
            ))}
          </svg>

          {/* Floating particles */}
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div key={`p-${i}`} className="absolute rounded-full"
              style={{
                left: `${15 + (i * 9)}%`, top: `${20 + (i * 7) % 50}%`,
                width: 1.5, height: 1.5, background: 'rgba(192,132,252,0.3)',
              }}
              animate={{ y: [0, -20, 0], opacity: [0, 0.5, 0] }}
              transition={{ duration: 5 + i, repeat: Infinity, delay: i * 0.6, ease: 'easeInOut' }}
            />
          ))}
        </div>

        {/* Text */}
        <div className="relative z-10 p-6 pt-4">
          <h3 className="text-white font-bold text-[18px] mb-1.5">AI Memory Galaxy</h3>
          <p className="text-white/35 text-[14px] leading-relaxed">Every memory becomes a living constellation.</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ── Card 2: AI StoryBook ── */
function StoryCard({ delay, inView }: { delay: number; inView: boolean }) {
  const [hovered, setHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 150, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 150, damping: 20 })
  const rotateX = useTransform(springY, (v: number) => -v * 0.02)
  const rotateY = useSpring(useTransform(mouseX, (v: number) => v * 0.02), { stiffness: 150, damping: 20 })

  const fullText = "The sun painted the whitewashed buildings in shades of gold as she stepped onto the balcony..."
  const [displayText, setDisplayText] = useState('')
  const [cursorVisible, setCursorVisible] = useState(true)
  const charIndex = useRef(0)

  useEffect(() => {
    const typeTimer = setInterval(() => {
      if (charIndex.current < fullText.length) {
        setDisplayText(fullText.slice(0, charIndex.current + 1))
        charIndex.current++
      } else {
        clearInterval(typeTimer)
      }
    }, 50)
    const cursorTimer = setInterval(() => setCursorVisible(v => !v), 530)
    return () => { clearInterval(typeTimer); clearInterval(cursorTimer) }
  }, [])

  const handleMouse = (e: React.MouseEvent) => {
    if (!cardRef.current) return
    const r = cardRef.current.getBoundingClientRect()
    mouseX.set(e.clientX - (r.left + r.width / 2))
    mouseY.set(e.clientY - (r.top + r.height / 2))
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40, scale: 0.96, filter: 'blur(6px)' }}
      animate={inView ? { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouse}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); mouseX.set(0); mouseY.set(0) }}
      className="relative cursor-default"
      style={{ perspective: 800 }}
    >
      <motion.div
        className="relative rounded-[28px] overflow-hidden h-[420px] flex flex-col"
        style={{
          background: 'rgba(18,10,35,0.55)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          border: '1px solid rgba(255,255,255,0.06)',
          rotateX: hovered ? rotateX : 0,
          rotateY: hovered ? rotateY : 0,
          transformStyle: 'preserve-3d',
        }}
        animate={{
          y: hovered ? -8 : [0, -6, 0, 6, 0],
          boxShadow: hovered
            ? '0 30px 70px -15px rgba(0,0,0,0.6), 0 0 60px rgba(255,77,184,0.1), inset 0 1px 0 rgba(255,255,255,0.08)'
            : '0 4px 30px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.04)',
          borderColor: hovered ? 'rgba(255,77,184,0.2)' : 'rgba(255,255,255,0.06)',
        }}
        transition={{ y: { duration: 8, repeat: Infinity, ease: 'easeInOut' }, boxShadow: { duration: 0.4 }, borderColor: { duration: 0.4 } }}
      >
        <motion.div className="absolute inset-0 pointer-events-none z-20"
          style={{ background: 'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.03) 50%, transparent 65%)' }}
          animate={{ x: hovered ? ['0%', '120%'] : ['-120%', '-120%'] }}
          transition={{ duration: 0.8, ease: 'easeOut', repeat: hovered ? 0 : Infinity, repeatDelay: 6 }}
        />

        {/* Preview */}
        <div className="flex-1 relative overflow-hidden p-6 flex items-center justify-center">
          <motion.div
            className="w-full max-w-[220px] rounded-xl p-5 relative"
            style={{
              background: 'linear-gradient(145deg, rgba(30,18,50,0.7), rgba(20,12,38,0.5))',
              border: '1px solid rgba(255,255,255,0.06)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
            }}
            animate={{ rotateY: hovered ? 3 : 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            {/* Book spine glow */}
            <div className="absolute left-0 top-0 bottom-0 w-[2px] rounded-full"
              style={{ background: 'linear-gradient(180deg, rgba(255,77,184,0.3), rgba(168,85,247,0.3))' }} />

            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-5 rounded-md flex items-center justify-center"
                style={{ background: 'rgba(255,77,184,0.12)', border: '1px solid rgba(255,77,184,0.2)' }}>
                <span className="text-[8px]">✨</span>
              </div>
              <span className="text-[10px] text-white/50 font-medium">Summer in Santorini</span>
            </div>

            <div className="h-[1px] bg-white/[0.06] mb-3" />

            <p className="text-[11px] text-white/50 leading-[1.8] italic font-light min-h-[80px]">
              {displayText}
              <span className="inline-block w-[1.5px] h-[12px] ml-[1px] align-middle"
                style={{
                  background: '#FF4DB8',
                  opacity: cursorVisible ? 0.8 : 0,
                  transition: 'opacity 0.1s',
                }} />
            </p>

            <div className="flex gap-2 mt-3">
              {[0.7, 0.5, 0.6].map((o, i) => (
                <div key={i} className="w-12 h-8 rounded-md"
                  style={{ background: `rgba(168,85,247,${o * 0.08})`, border: '1px solid rgba(255,255,255,0.04)' }} />
              ))}
            </div>
          </motion.div>
        </div>

        <div className="relative z-10 p-6 pt-4">
          <h3 className="text-white font-bold text-[18px] mb-1.5">AI StoryBook</h3>
          <p className="text-white/35 text-[14px] leading-relaxed">Turn memories into beautifully written chapters.</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ── Card 3: Time Machine ── */
function TimeCard({ delay, inView }: { delay: number; inView: boolean }) {
  const [hovered, setHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 150, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 150, damping: 20 })
  const rotateX = useTransform(springY, (v: number) => -v * 0.02)
  const rotateY = useSpring(useTransform(mouseX, (v: number) => v * 0.02), { stiffness: 150, damping: 20 })

  const [phase, setPhase] = useState(0) // 0=query, 1=searching, 2=result
  const [dots, setDots] = useState('')

  useEffect(() => {
    const cycle = setInterval(() => {
      setPhase(0)
      setDots('')
      let count = 0
      const searchTimer = setInterval(() => {
        count++
        setDots('.'.repeat(count % 4))
        if (count > 8) {
          clearInterval(searchTimer)
          setPhase(2)
          setTimeout(() => setPhase(0), 3000)
        }
      }, 300)
    }, 6000)
    return () => clearInterval(cycle)
  }, [])

  const handleMouse = (e: React.MouseEvent) => {
    if (!cardRef.current) return
    const r = cardRef.current.getBoundingClientRect()
    mouseX.set(e.clientX - (r.left + r.width / 2))
    mouseY.set(e.clientY - (r.top + r.height / 2))
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40, scale: 0.96, filter: 'blur(6px)' }}
      animate={inView ? { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouse}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); mouseX.set(0); mouseY.set(0) }}
      className="relative cursor-default"
      style={{ perspective: 800 }}
    >
      <motion.div
        className="relative rounded-[28px] overflow-hidden h-[420px] flex flex-col"
        style={{
          background: 'rgba(18,10,35,0.55)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          border: '1px solid rgba(255,255,255,0.06)',
          rotateX: hovered ? rotateX : 0,
          rotateY: hovered ? rotateY : 0,
          transformStyle: 'preserve-3d',
        }}
        animate={{
          y: hovered ? -8 : [0, -6, 0, 6, 0],
          boxShadow: hovered
            ? '0 30px 70px -15px rgba(0,0,0,0.6), 0 0 60px rgba(99,102,241,0.1), inset 0 1px 0 rgba(255,255,255,0.08)'
            : '0 4px 30px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.04)',
          borderColor: hovered ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.06)',
        }}
        transition={{ y: { duration: 8, repeat: Infinity, ease: 'easeInOut' }, boxShadow: { duration: 0.4 }, borderColor: { duration: 0.4 } }}
      >
        <motion.div className="absolute inset-0 pointer-events-none z-20"
          style={{ background: 'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.03) 50%, transparent 65%)' }}
          animate={{ x: hovered ? ['0%', '120%'] : ['-120%', '-120%'] }}
          transition={{ duration: 0.8, ease: 'easeOut', repeat: hovered ? 0 : Infinity, repeatDelay: 6 }}
        />

        {/* Preview - Terminal */}
        <div className="flex-1 relative overflow-hidden p-5">
          <motion.div
            className="w-full h-full rounded-xl p-4 flex flex-col"
            style={{
              background: 'rgba(12,6,24,0.7)',
              border: '1px solid rgba(255,255,255,0.05)',
              boxShadow: 'inset 0 0 40px rgba(168,85,247,0.04)',
            }}
          >
            {/* Terminal header */}
            <div className="flex items-center gap-1.5 mb-3">
              <div className="w-2 h-2 rounded-full bg-red-500/40" />
              <div className="w-2 h-2 rounded-full bg-yellow-500/40" />
              <div className="w-2 h-2 rounded-full bg-green-500/40" />
              <span className="text-[9px] text-white/20 ml-2 font-mono">MemoryVerse AI</span>
            </div>

            <div className="flex-1 flex flex-col justify-center gap-3 font-mono text-[11px]">
              {/* User query */}
              <div className="flex items-start gap-2">
                <span className="text-neonPink/60">›</span>
                <span className="text-white/60">Show our funniest vacation</span>
                <motion.span className="inline-block w-[6px] h-[12px] bg-neonPink/50"
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }} />
              </div>

              {/* Searching */}
              <motion.div className="flex items-center gap-2 text-white/25"
                animate={{ opacity: phase === 0 ? 1 : 0.4 }}>
                <span className="text-neonPurple/50">↻</span>
                <span>Searching memories{phase <= 1 ? dots : ''}</span>
              </motion.div>

              {/* Results */}
              <motion.div className="space-y-2"
                animate={{ opacity: phase === 2 ? 1 : 0.2, y: phase === 2 ? 0 : 5 }}
                transition={{ duration: 0.4 }}>
                {['Bali Trip 2024', 'Tokyo Nights', 'Beach Day'].map((m, i) => (
                  <div key={i} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg"
                    style={{ background: 'rgba(168,85,247,0.06)', border: '1px solid rgba(168,85,247,0.08)' }}>
                    <div className="w-5 h-5 rounded bg-gradient-to-br from-neonPink/20 to-neonPurple/20" />
                    <span className="text-white/50 text-[10px]">{m}</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>

        <div className="relative z-10 p-6 pt-4">
          <h3 className="text-white font-bold text-[18px] mb-1.5">Time Machine</h3>
          <p className="text-white/35 text-[14px] leading-relaxed">Ask AI about any memory using natural language.</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ── Card 4: Relationship Pulse ── */
function PulseCard({ delay, inView }: { delay: number; inView: boolean }) {
  const [hovered, setHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 150, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 150, damping: 20 })
  const rotateX = useTransform(springY, (v: number) => -v * 0.02)
  const rotateY = useSpring(useTransform(mouseX, (v: number) => v * 0.02), { stiffness: 150, damping: 20 })

  const [emotionScore, setEmotionScore] = useState(0)
  const [happyCount, setHappyCount] = useState(0)
  const [growth, setGrowth] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setEmotionScore(v => (v < 98 ? v + 1 : 98))
      setHappyCount(v => (v < 842 ? v + 12 : 842))
      setGrowth(v => (v < 28 ? v + 1 : 28))
    }, 40)
    return () => clearInterval(timer)
  }, [])

  const handleMouse = (e: React.MouseEvent) => {
    if (!cardRef.current) return
    const r = cardRef.current.getBoundingClientRect()
    mouseX.set(e.clientX - (r.left + r.width / 2))
    mouseY.set(e.clientY - (r.top + r.height / 2))
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40, scale: 0.96, filter: 'blur(6px)' }}
      animate={inView ? { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouse}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); mouseX.set(0); mouseY.set(0) }}
      className="relative cursor-default"
      style={{ perspective: 800 }}
    >
      <motion.div
        className="relative rounded-[28px] overflow-hidden h-[420px] flex flex-col"
        style={{
          background: 'rgba(18,10,35,0.55)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          border: '1px solid rgba(255,255,255,0.06)',
          rotateX: hovered ? rotateX : 0,
          rotateY: hovered ? rotateY : 0,
          transformStyle: 'preserve-3d',
        }}
        animate={{
          y: hovered ? -8 : [0, -6, 0, 6, 0],
          boxShadow: hovered
            ? '0 30px 70px -15px rgba(0,0,0,0.6), 0 0 60px rgba(236,72,153,0.1), inset 0 1px 0 rgba(255,255,255,0.08)'
            : '0 4px 30px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.04)',
          borderColor: hovered ? 'rgba(236,72,153,0.2)' : 'rgba(255,255,255,0.06)',
        }}
        transition={{ y: { duration: 8, repeat: Infinity, ease: 'easeInOut' }, boxShadow: { duration: 0.4 }, borderColor: { duration: 0.4 } }}
      >
        <motion.div className="absolute inset-0 pointer-events-none z-20"
          style={{ background: 'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.03) 50%, transparent 65%)' }}
          animate={{ x: hovered ? ['0%', '120%'] : ['-120%', '-120%'] }}
          transition={{ duration: 0.8, ease: 'easeOut', repeat: hovered ? 0 : Infinity, repeatDelay: 6 }}
        />

        {/* Preview */}
        <div className="flex-1 relative overflow-hidden p-5">
          <div className="w-full h-full rounded-xl p-4 flex flex-col gap-3"
            style={{ background: 'rgba(12,6,24,0.5)', border: '1px solid rgba(255,255,255,0.04)' }}>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Emotion Score', value: `${emotionScore}%`, color: '#FF4DB8' },
                { label: 'Happy Moments', value: happyCount.toString(), color: '#A855F7' },
                { label: 'Growth', value: `+${growth}%`, color: '#06B6D4' },
              ].map((s) => (
                <div key={s.label} className="text-center p-2 rounded-lg" style={{ background: `${s.color}08`, border: `1px solid ${s.color}15` }}>
                  <div className="text-[18px] font-bold" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-[8px] text-white/30 mt-0.5 uppercase tracking-wider">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Heartbeat line */}
            <div className="flex-1 relative">
              <svg className="w-full h-full" viewBox="0 0 200 60" preserveAspectRatio="none">
                <motion.path
                  d="M0,30 L30,30 L35,10 L40,50 L45,20 L50,40 L55,30 L80,30 L85,15 L90,45 L95,25 L100,35 L105,30 L130,30 L135,12 L140,48 L145,22 L150,38 L155,30 L200,30"
                  fill="none"
                  stroke="url(#pulseGrad)"
                  strokeWidth="1.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                />
                <defs>
                  <linearGradient id="pulseGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FF4DB8" />
                    <stop offset="50%" stopColor="#A855F7" />
                    <stop offset="100%" stopColor="#06B6D4" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Mini bar chart */}
            <div className="flex items-end gap-1 h-[30px]">
              {[40, 55, 35, 65, 50, 70, 45, 80, 60, 75, 55, 85].map((h, i) => (
                <motion.div key={i} className="flex-1 rounded-t-sm"
                  style={{ background: `linear-gradient(180deg, rgba(255,77,184,0.3), rgba(168,85,247,0.15))` }}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ duration: 0.6, delay: i * 0.05, ease: 'easeOut' }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-10 p-6 pt-4">
          <h3 className="text-white font-bold text-[18px] mb-1.5">Relationship Pulse</h3>
          <p className="text-white/35 text-[14px] leading-relaxed">Visualize emotional growth across your journey.</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

function RoadmapSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const scrollProgress = useMotionValue(0)
  const inView = useInView(sectionRef, { once: false, margin: '-100px' })

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const rect = el.getBoundingClientRect()
            const viewH = window.innerHeight
            const progress = Math.min(1, Math.max(0, 1 - (rect.bottom - viewH) / (rect.height + viewH)))
            scrollProgress.set(progress)
          }
        })
      },
      { threshold: Array.from({ length: 20 }, (_, i) => i / 19) }
    )
    observer.observe(el)

    const onScroll = () => {
      if (!el) return
      const rect = el.getBoundingClientRect()
      const viewH = window.innerHeight
      const progress = Math.min(1, Math.max(0, (viewH - rect.top) / (rect.height + viewH)))
      scrollProgress.set(progress)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { observer.disconnect(); window.removeEventListener('scroll', onScroll) }
  }, [scrollProgress])

  const steps = [
    {
      num: '01',
      title: 'Create Your Memory Universe',
      desc: 'Create your private memory space where every moment is securely stored forever.',
      visual: 'folder' as const,
    },
    {
      num: '02',
      title: 'Invite the People You Love',
      desc: 'Build a shared universe with friends, family, or your partner and preserve memories together.',
      visual: 'avatars' as const,
    },
    {
      num: '03',
      title: 'Capture Every Memory',
      desc: 'Upload photos, videos, voice notes, journals and milestones into your personal galaxy.',
      visual: 'photos' as const,
    },
    {
      num: '04',
      title: 'Relive Them Forever',
      desc: 'AI transforms your memories into storybooks, constellations, timelines and emotional insights that grow with time.',
      visual: 'storybook' as const,
    },
  ]

  return (
    <div ref={sectionRef}>
      {/* Header */}
      <div className="text-center mb-6">
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] text-[10px] font-bold tracking-[0.15em] uppercase text-neonPink mb-3"
        >
          How It Works
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif-hero text-[2.5rem] md:text-[3.5rem] lg:text-[64px] font-bold text-white leading-[1.05] tracking-[-0.03em] max-w-[900px] mx-auto"
          style={{ marginBottom: '12px' }}
        >
          Simple steps to{' '}
          <span className="gradient-text-universe animate-preserve-glow">preserve</span>
          <br />
          your memories forever.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.25, ease: 'easeOut' }}
          className="text-[17px] font-normal text-[#A7A0B8] max-w-[700px] mx-auto leading-[1.65]"
        >
          Create your own digital universe where every memory becomes a star, every story becomes a chapter, and every relationship lasts forever.
        </motion.p>
      </div>

      {/* Timeline */}
      <div className="relative max-w-5xl mx-auto">
        {/* Animated center line */}
        <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-[3px] rounded-full overflow-hidden hidden md:block"
          style={{ background: 'rgba(255,77,184,0.08)' }}>
          <motion.div
            className="w-full rounded-full origin-top"
            style={{
              background: 'linear-gradient(180deg, #FF4DB8, #A855F7, #FF4DB8)',
              scaleY: scrollProgress,
              height: '100%',
              boxShadow: '0 0 10px rgba(255,77,184,0.35), 0 0 25px rgba(168,85,247,0.15)',
            }}
          />
        </div>

        {/* Steps */}
        <div className="space-y-5 md:space-y-7">
          {steps.map((step, i) => (
            <TimelineStep key={step.num} step={step} index={i} scrollProgress={scrollProgress} />
          ))}
        </div>
      </div>
    </div>
  )
}

function TimelineStep({ step, index, scrollProgress }: { step: { num: string; title: string; desc: string; visual: string }; index: number; scrollProgress: any }) {
  const isLeft = index % 2 === 0
  const nodeRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 150, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 150, damping: 20 })
  const rotateX = useTransform(springY, (v: number) => -v * 0.015)
  const rotateY = useSpring(useTransform(mouseX, (v: number) => v * 0.015), { stiffness: 150, damping: 20 })

  const handleMouse = (e: React.MouseEvent) => {
    if (!nodeRef.current) return
    const r = nodeRef.current.getBoundingClientRect()
    mouseX.set(e.clientX - (r.left + r.width / 2))
    mouseY.set(e.clientY - (r.top + r.height / 2))
  }

  return (
    <div className="relative">
      {/* Mobile: stacked layout */}
      <div className="md:hidden flex flex-col items-center gap-3">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.12 }}
          className="relative z-10"
        >
          <div className="w-9 h-9 rounded-full flex items-center justify-center relative"
            style={{
              background: 'rgba(18,10,35,0.8)',
              border: '2px solid rgba(255,77,184,0.4)',
              boxShadow: '0 0 16px rgba(255,77,184,0.25), 0 0 30px rgba(168,85,247,0.1)',
            }}>
            <span className="text-[10px] font-bold text-neonPink">{step.num}</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: index * 0.12 + 0.1 }}
          className="text-center max-w-md px-4"
        >
          <h3 className="text-white font-bold text-[19px] mb-1.5">{step.title}</h3>
          <p className="text-white/40 text-[14px] leading-relaxed">{step.desc}</p>
        </motion.div>

        <motion.div
          ref={nodeRef}
          initial={{ opacity: 0, y: 30, scale: 0.96, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: index * 0.12 + 0.2 }}
          onMouseMove={handleMouse}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => { setHovered(false); mouseX.set(0); mouseY.set(0) }}
          className="w-full max-w-[300px]"
          style={{ perspective: 800 }}
        >
          <StepVisual step={step} hovered={hovered} rotateX={rotateX} rotateY={rotateY} />
        </motion.div>
      </div>

      {/* Desktop: alternating layout */}
      <div className="hidden md:grid md:grid-cols-[1fr_56px_1fr] items-center">
        {/* Left content */}
        <div className={`${isLeft ? '' : 'order-3'}`}>
          {isLeft ? (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: index * 0.1 }}
              className="pr-8 text-right"
            >
              <h3 className="text-white font-bold text-[21px] mb-1.5">{step.title}</h3>
              <p className="text-white/40 text-[14px] leading-relaxed max-w-[300px] ml-auto">{step.desc}</p>
            </motion.div>
          ) : (
            <motion.div
              ref={nodeRef}
              initial={{ opacity: 0, x: 30, scale: 0.96, filter: 'blur(6px)' }}
              whileInView={{ opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: index * 0.1 + 0.15 }}
              onMouseMove={handleMouse}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => { setHovered(false); mouseX.set(0); mouseY.set(0) }}
              className="pl-8"
              style={{ perspective: 800 }}
            >
              <StepVisual step={step} hovered={hovered} rotateX={rotateX} rotateY={rotateY} />
            </motion.div>
          )}
        </div>

        {/* Center node */}
        <div className="flex justify-center order-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 + 0.05 }}
            className="relative z-10"
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center relative"
              style={{
                background: 'rgba(18,10,35,0.8)',
                border: '2px solid rgba(255,77,184,0.4)',
                boxShadow: '0 0 16px rgba(255,77,184,0.25), 0 0 30px rgba(168,85,247,0.1)',
              }}>
              <span className="text-[11px] font-bold text-neonPink">{step.num}</span>
              <motion.div
                className="absolute inset-[-4px] rounded-full"
                style={{ border: '1px solid rgba(255,77,184,0.15)' }}
                animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: index * 0.5 }}
              />
            </div>
          </motion.div>
        </div>

        {/* Right content */}
        <div className={`${isLeft ? 'order-3' : ''}`}>
          {isLeft ? (
            <motion.div
              ref={nodeRef}
              initial={{ opacity: 0, x: 30, scale: 0.96, filter: 'blur(6px)' }}
              whileInView={{ opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: index * 0.1 + 0.15 }}
              onMouseMove={handleMouse}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => { setHovered(false); mouseX.set(0); mouseY.set(0) }}
              className="pl-8"
              style={{ perspective: 800 }}
            >
              <StepVisual step={step} hovered={hovered} rotateX={rotateX} rotateY={rotateY} />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: index * 0.1 }}
              className="pr-8 text-left"
            >
              <h3 className="text-white font-bold text-[21px] mb-1.5">{step.title}</h3>
              <p className="text-white/40 text-[14px] leading-relaxed max-w-[300px]">{step.desc}</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

function StepVisual({ step, hovered, rotateX, rotateY }: { step: { visual: string; num: string }; hovered: boolean; rotateX: any; rotateY: any }) {
  return (
    <motion.div
      className="relative rounded-[26px] overflow-hidden aspect-[2/1]"
      style={{
        background: 'rgba(18,10,35,0.55)',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        border: '1px solid rgba(255,255,255,0.06)',
        rotateX: hovered ? rotateX : 0,
        rotateY: hovered ? rotateY : 0,
        transformStyle: 'preserve-3d',
      }}
      animate={{
        y: hovered ? -6 : 0,
        boxShadow: hovered
          ? '0 24px 60px -12px rgba(0,0,0,0.5), 0 0 50px rgba(255,77,184,0.1), inset 0 1px 0 rgba(255,255,255,0.08)'
          : '0 4px 30px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.04)',
        borderColor: hovered ? 'rgba(255,77,184,0.15)' : 'rgba(255,255,255,0.06)',
      }}
      transition={{ type: 'spring', stiffness: 200, damping: 22 }}
    >
      {/* Reflection sweep */}
      <motion.div className="absolute inset-0 pointer-events-none z-10"
        style={{ background: 'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.03) 50%, transparent 65%)' }}
        animate={{ x: hovered ? ['0%', '120%'] : '-120%' }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      />

      {/* Step-specific visual */}
      <div className="absolute inset-0 flex items-center justify-center">
        {step.visual === 'folder' && <FolderVisual />}
        {step.visual === 'avatars' && <AvatarsVisual />}
        {step.visual === 'photos' && <PhotosVisual />}
        {step.visual === 'storybook' && <StoryVisual />}
      </div>
    </motion.div>
  )
}

function FolderVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <motion.div className="relative scale-[0.55]"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
        {/* Folder body */}
        <div className="w-[120px] h-[80px] rounded-lg relative"
          style={{ background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.2)' }}>
          {/* Folder tab */}
          <div className="absolute top-[-8px] left-3 w-[40px] h-[8px] rounded-t-md"
            style={{ background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.2)', borderBottom: 'none' }} />
          {/* Stars inside */}
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div key={i} className="absolute rounded-full bg-white"
              style={{ left: `${20 + i * 18}%`, top: `${30 + (i % 2) * 25}%`, width: 2 + (i % 2), height: 2 + (i % 2) }}
              animate={{ opacity: [0.2, 0.8, 0.2], scale: [0.8, 1.3, 0.8] }}
              transition={{ duration: 2 + i * 0.5, repeat: Infinity, delay: i * 0.3 }}
            />
          ))}
        </div>
        {/* Glow */}
        <div className="absolute inset-[-20px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 60%)' }} />
      </motion.div>
    </div>
  )
}

function AvatarsVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="relative w-[160px] h-[100px] scale-[0.55]">
        {/* Avatar cards */}
        {[
          { x: 10, y: 20, color: '#FF4DB8', delay: 0 },
          { x: 55, y: 10, color: '#A855F7', delay: 0.3 },
          { x: 100, y: 25, color: '#6366F1', delay: 0.6 },
        ].map((a, i) => (
          <motion.div key={i} className="absolute w-[44px] h-[44px] rounded-full"
            style={{
              left: a.x, top: a.y,
              background: `linear-gradient(135deg, ${a.color}40, ${a.color}20)`,
              border: `1.5px solid ${a.color}30`,
            }}
            animate={{ y: [0, -4, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity, delay: a.delay, ease: 'easeInOut' }}
          />
        ))}
        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <motion.line x1="32" y1="42" x2="77" y2="32" stroke="rgba(255,77,184,0.2)" strokeWidth="1"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, delay: 0.5 }} />
          <motion.line x1="77" y1="32" x2="122" y2="47" stroke="rgba(168,85,247,0.2)" strokeWidth="1"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, delay: 0.8 }} />
        </svg>
        {/* Heart */}
        <motion.div className="absolute text-[10px]"
          style={{ left: 68, top: 45 }}
          animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1.2 }}
        >
          <Heart className="w-3 h-3 text-neonPink fill-current" />
        </motion.div>
      </div>
    </div>
  )
}

function PhotosVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="relative w-[150px] h-[100px] scale-[0.55]">
        {[
          { x: 5, y: 10, rot: -5, color: '#FF4DB8' },
          { x: 40, y: 5, rot: 3, color: '#A855F7' },
          { x: 75, y: 15, rot: -2, color: '#6366F1' },
        ].map((p, i) => (
          <motion.div key={i} className="absolute w-[50px] h-[38px] rounded-md overflow-hidden"
            style={{
              left: p.x, top: p.y,
              rotate: `${p.rot}deg`,
              background: `linear-gradient(135deg, ${p.color}15, ${p.color}08)`,
              border: '1px solid rgba(255,255,255,0.06)',
              boxShadow: `0 4px 15px rgba(0,0,0,0.2), 0 0 20px ${p.color}10`,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 + i * 0.2 }}
          >
            <div className="w-full h-full" style={{ background: `linear-gradient(135deg, ${p.color}10, transparent)` }} />
          </motion.div>
        ))}
        {/* Sparkles */}
        {[
          { x: 100, y: 5, delay: 0.5 },
          { x: 20, y: 60, delay: 1 },
          { x: 120, y: 65, delay: 1.5 },
        ].map((s, i) => (
          <motion.div key={i} className="absolute w-1.5 h-1.5 rounded-full bg-white"
            style={{ left: s.x, top: s.y }}
            animate={{ opacity: [0, 0.8, 0], scale: [0.5, 1.2, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, delay: s.delay }}
          />
        ))}
      </div>
    </div>
  )
}

function StoryVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="relative w-[130px] h-[95px] scale-[0.55]">
        {/* Mini book */}
        <motion.div className="w-full h-full rounded-lg p-3 relative"
          style={{
            background: 'linear-gradient(145deg, rgba(30,18,50,0.7), rgba(20,12,38,0.5))',
            border: '1px solid rgba(255,255,255,0.06)',
            boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
          }}
          animate={{ rotateY: [0, 2, 0, -2, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="flex items-center gap-1.5 mb-2">
            <div className="w-3 h-3 rounded flex items-center justify-center"
              style={{ background: 'rgba(255,77,184,0.15)' }}>
              <Sparkles className="w-2 h-2 text-neonPink" />
            </div>
            <span className="text-[7px] text-white/40">Chapter 1</span>
          </div>
          <div className="space-y-1">
            {[0.8, 0.6, 0.7, 0.5, 0.65].map((w, i) => (
              <div key={i} className="h-[2px] rounded-full" style={{ width: `${w * 100}%`, background: 'rgba(255,255,255,0.08)' }} />
            ))}
          </div>
        </motion.div>
        {/* Constellation dots */}
        {[
          { x: -10, y: 10, d: 0.8 },
          { x: 135, y: 15, d: 1.2 },
          { x: 125, y: 80, d: 1.6 },
        ].map((d, i) => (
          <motion.div key={i} className="absolute w-1 h-1 rounded-full bg-neonPurple/50"
            style={{ left: d.x, top: d.y }}
            animate={{ opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: d.d }}
          />
        ))}
      </div>
    </div>
  )
}

function TimelineSection() {
  const steps = [
    { num: '01', title: 'Create Your Universe', desc: 'Build a private cosmic space tailored to your story.', color: 'from-pink-500/20 to-rose-500/20', border: 'border-pink-500/20' },
    { num: '02', title: 'Invite Your Constellation', desc: 'Bring your loved ones into your shared galaxy.', color: 'from-purple-500/20 to-violet-500/20', border: 'border-purple-500/20' },
    { num: '03', title: 'Preserve Every Moment', desc: 'Upload memories — photos, videos, journals, and more.', color: 'from-indigo-500/20 to-blue-500/20', border: 'border-indigo-500/20' },
    { num: '04', title: 'Relive Among the Stars', desc: 'AI transforms your memories into cinematic stories.', color: 'from-pink-500/15 to-purple-500/15', border: 'border-pink-400/15' },
  ]

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] text-[10px] font-bold tracking-[0.15em] uppercase text-neonPink mb-5">
          How It Works
        </span>
        <h2 className="font-serif-hero text-3xl md:text-[2.75rem] font-bold text-white leading-tight">
          Your journey through the <span className="gradient-text-universe">cosmos</span>
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-4 gap-6">
        {steps.map((step, i) => (
          <motion.div
            key={step.num}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: i * 0.12 }}
            className="relative"
          >
            {/* Connector line */}
            {i < steps.length - 1 && (
              <div className="hidden md:block absolute top-8 left-full w-full h-[1px] bg-gradient-to-r from-white/[0.08] to-transparent z-0" />
            )}

            <div className="feature-card p-6 relative z-10">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${step.color} border ${step.border} flex items-center justify-center mb-4`}>
                <span className="text-[11px] font-bold text-white/70">{step.num}</span>
              </div>
              <h3 className="text-[15px] font-bold text-white mb-2">{step.title}</h3>
              <p className="text-[13px] text-white/35 leading-relaxed">{step.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function StoryBookShowcase() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="text-center"
    >
      <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] text-[10px] font-bold tracking-[0.15em] uppercase text-neonPink mb-5">
        AI StoryBook
      </span>
      <h2 className="font-serif-hero text-3xl md:text-[2.75rem] font-bold text-white leading-tight mb-5">
        Your memories become <span className="gradient-text-universe">cinematic stories</span>
      </h2>
      <p className="text-[15px] text-white/35 max-w-lg mx-auto mb-12 leading-relaxed">
        Our AI reads through your memories and weaves them into beautiful, shareable storybooks that capture the essence of your most precious moments.
      </p>

      {/* Mock StoryBook UI */}
      <motion.div
        className="relative max-w-2xl mx-auto"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="feature-card p-6 md:p-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neonPink/20 to-neonPurple/20 border border-white/[0.08] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-neonPink" />
            </div>
            <div className="text-left">
              <h4 className="text-[13px] font-bold text-white">Summer in Santorini</h4>
              <p className="text-[11px] text-white/30">Chapter 1 of 12 &middot; Generated by AI</p>
            </div>
          </div>

          <div className="space-y-4 text-left">
            <div className="h-[1px] bg-white/[0.04]" />
            <p className="text-[14px] text-white/50 leading-relaxed italic font-light">
              &ldquo;The sun painted the whitewashed buildings in shades of gold as you stepped onto the balcony for the first time. The Aegean breeze carried the scent of jasmine, and in that moment, the world seemed to pause — just for you two.&rdquo;
            </p>
            <div className="flex gap-3">
              {[
                'bg-gradient-to-br from-pink-500/10 to-purple-500/10',
                'bg-gradient-to-br from-purple-500/10 to-indigo-500/10',
                'bg-gradient-to-br from-indigo-500/10 to-pink-500/10',
              ].map((bg, i) => (
                <div key={i} className={`w-20 h-16 rounded-xl ${bg} border border-white/[0.05]`} />
              ))}
            </div>
            <div className="h-[1px] bg-white/[0.04]" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function LettersSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="text-center"
    >
      <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] text-[10px] font-bold tracking-[0.15em] uppercase text-neonPink mb-5">
        Time Capsule Letters
      </span>
      <h2 className="font-serif-hero text-3xl md:text-[2.75rem] font-bold text-white leading-tight mb-5">
        Letters that <span className="gradient-text-universe">transcend time</span>
      </h2>
      <p className="text-[15px] text-white/35 max-w-lg mx-auto mb-12 leading-relaxed">
        Write letters to your future self, your partner, or your children. Schedule them to arrive at the perfect moment — years from now.
      </p>

      {/* Mock Letter UI */}
      <div className="max-w-lg mx-auto feature-card p-6 md:p-8 text-left">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/20 flex items-center justify-center text-[14px]">
            💌
          </div>
          <div>
            <h4 className="text-[13px] font-bold text-white">Letter to Future Us</h4>
            <p className="text-[11px] text-white/30">Arrives December 25, 2030</p>
          </div>
        </div>
        <div className="h-[1px] bg-white/[0.04] mb-4" />
        <p className="text-[14px] text-white/45 leading-relaxed italic font-light">
          &ldquo;By the time you read this, we will have built a lifetime of memories. Remember this moment — the excitement, the hope, the love that started it all...&rdquo;
        </p>
      </div>
    </motion.div>
  )
}
