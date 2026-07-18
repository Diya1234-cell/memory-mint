'use client'

import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'

const lcg = (seed: number) => {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

const nodePositions = [10, 28, 50, 72, 90]
const nodeLabels = ['May 1', 'May 15', 'Jun 1', 'Jun 15', 'Jun 30']

const mockMemories = [
  {
    id: 0,
    title: '✨ First Trip',
    date: 'May 1, 2026',
    dateStr: '2026-05-01',
    mood: '😊 Happy',
    moodColor: '#facc15',
    summary: 'A beautiful day exploring the mountains together for the first time.',
    image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 1,
    title: '🌟 Bonfire Night',
    date: 'May 15, 2026',
    dateStr: '2026-05-15',
    mood: '💜 Magical',
    moodColor: '#a855f7',
    summary: 'Laughter and stories under a sky full of stars around a warm fire.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 2,
    title: '✨ Beach Sunset',
    date: 'Jun 1, 2026',
    dateStr: '2026-06-01',
    mood: '🌊 Peaceful',
    moodColor: '#14b8a6',
    summary: 'Waves gently kissing the shore as the sun dipped below the horizon.',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 3,
    title: '🎂 Birthday Surprise',
    date: 'Jun 15, 2026',
    dateStr: '2026-06-15',
    mood: '❤️ Loved',
    moodColor: '#ec4899',
    summary: 'The most unexpected and heartwarming celebration with close friends.',
    image: 'https://images.unsplash.com/photo-1470071459604-7b8ec44ffd5a?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 4,
    title: '🌌 Stargazing Together',
    date: 'Jun 30, 2026',
    dateStr: '2026-06-30',
    mood: '💜 Magical',
    moodColor: '#a855f7',
    summary: 'A peaceful summer night filled with laughter under the stars.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80',
  },
]

function findClosestNode(pct: number): number {
  let closest = 0
  let minDist = Infinity
  nodePositions.forEach((pos, i) => {
    const dist = Math.abs(pos - pct)
    if (dist < minDist) {
      minDist = dist
      closest = i
    }
  })
  return minDist < 12 ? closest : -1
}

export default function TimelinePreview() {
  const [selectedNode, setSelectedNode] = useState<number | null>(null)
  const [hoveredNode, setHoveredNode] = useState<number | null>(null)
  const [energyWavePos, setEnergyWavePos] = useState<number | null>(null)

  const cardRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const dragState = useRef({ isDragging: false, startX: 0, startNode: 0 })
  const mouseRef = useRef({ x: 0.5, y: 0.5 })
  const prevSelected = useRef<number | null>(null)

  const inView = useInView(cardRef, { once: true, amount: 0.3 })

  const displayMemory = selectedNode !== null ? mockMemories[selectedNode] : null

  const floatingParticles = useMemo(() => {
    const r = lcg(404)
    return Array.from({ length: 6 }).map(() => ({
      x: r() * 100,
      y: r() * 80 + 10,
      size: r() * 1.5 + 0.5,
      dur: r() * 4 + 3,
      delay: r() * 3,
    }))
  }, [])

  const bgStars = useMemo(() => {
    const r = lcg(505)
    return Array.from({ length: 12 }).map(() => ({
      x: r() * 100,
      y: r() * 100,
      size: r() * 1.2 + 0.2,
      dur: r() * 5 + 3,
      delay: r() * 6,
    }))
  }, [])

  const orbitParticles = useMemo(() => {
    const r = lcg(606)
    return Array.from({ length: 6 }).map(() => ({
      angle: r() * 360,
      dist: r() * 10 + 8,
      size: r() * 1 + 0.5,
      dur: r() * 4 + 3,
      delay: r() * 2,
    }))
  }, [])

  const handleNodeClick = useCallback((index: number) => {
    prevSelected.current = selectedNode
    setSelectedNode((prev) => (prev === index ? null : index))
  }, [selectedNode])

  useEffect(() => {
    if (selectedNode !== null && prevSelected.current !== selectedNode) {
      const from = prevSelected.current !== null ? nodePositions[prevSelected.current] : nodePositions[0]
      const to = nodePositions[selectedNode]
      setEnergyWavePos(from)
      const startTime = performance.now()
      const animate = (now: number) => {
        const elapsed = now - startTime
        const progress = Math.min(elapsed / 600, 1)
        const eased = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress
        const current = from + (to - from) * eased
        setEnergyWavePos(current)
        if (progress < 1) requestAnimationFrame(animate)
        else setEnergyWavePos(null)
      }
      requestAnimationFrame(animate)
    }
  }, [selectedNode])

  const handleMouse = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    mouseRef.current = {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    }
  }, [])

  const handleTimelineMouseDown = useCallback((e: React.MouseEvent) => {
    if (!timelineRef.current) return
    const rect = timelineRef.current.getBoundingClientRect()
    dragState.current = {
      isDragging: true,
      startX: e.clientX,
      startNode: selectedNode ?? 0,
    }
    const pct = ((e.clientX - rect.left) / rect.width) * 100
    const closest = findClosestNode(pct)
    if (closest >= 0) handleNodeClick(closest)
  }, [handleNodeClick, selectedNode])

  const handleTimelineMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragState.current.isDragging || !timelineRef.current) return
    const rect = timelineRef.current.getBoundingClientRect()
    const pct = ((e.clientX - rect.left) / rect.width) * 100
    const closest = findClosestNode(pct)
    if (closest >= 0 && closest !== selectedNode) {
      prevSelected.current = selectedNode
      setSelectedNode(closest)
    }
  }, [selectedNode])

  const handleTimelineMouseUp = useCallback(() => {
    dragState.current.isDragging = false
  }, [])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (selectedNode === null) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault()
        prevSelected.current = null
        setSelectedNode(0)
      }
      return
    }
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      const next = Math.min(selectedNode + 1, mockMemories.length - 1)
      prevSelected.current = selectedNode
      setSelectedNode(next)
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      const prev = Math.max(selectedNode - 1, 0)
      prevSelected.current = selectedNode
      setSelectedNode(prev)
    }
    if (e.key === 'Escape') {
      setSelectedNode(null)
    }
  }, [selectedNode])

  useEffect(() => {
    window.addEventListener('mouseup', handleTimelineMouseUp)
    return () => window.removeEventListener('mouseup', handleTimelineMouseUp)
  }, [handleTimelineMouseUp])

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouse}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="relative rounded-3xl p-6 overflow-hidden group outline-none"
      style={{ background: 'rgba(255,255,255,0.035)', backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.03)' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -2 }}
    >
      <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/[0.02] pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at ${mouseRef.current.x * 100}% ${mouseRef.current.y * 100}%, rgba(255,255,255,0.03) 0%, transparent 60%)`,
        }}
      />

      <div className="absolute -top-16 -left-16 w-40 h-40 rounded-full opacity-[0.04] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(168,85,247,0.3) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
      />

      {/* Background drifting stars */}
      {bgStars.map((s, i) => (
        <motion.div
          key={`bgs-${i}`}
          className="absolute rounded-full bg-white pointer-events-none"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size }}
          animate={{ opacity: [0, 0.3, 0], scale: [0.5, 1, 0.5] }}
          transition={{ duration: s.dur, repeat: Infinity, delay: s.delay, ease: 'easeInOut' }}
        />
      ))}

      {/* Shooting star */}
      <motion.div
        className="absolute pointer-events-none"
        style={{ top: '12%', left: '80%' }}
        animate={{ x: [-300, 300], y: [0, 120], opacity: [0, 0.6, 0] }}
        transition={{ duration: 3, repeat: Infinity, delay: 10, ease: 'easeOut' }}
      >
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.6)]" />
          <div className="w-12 h-[0.5px] bg-gradient-to-r from-white/50 to-transparent rounded-full" />
        </div>
      </motion.div>

      {floatingParticles.map((p, i) => (
        <motion.div
          key={`fp-${i}`}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${p.x}%`, top: `${p.y}%`,
            width: p.size, height: p.size,
            backgroundColor: 'rgba(168,85,247,0.2)',
          }}
          animate={{ y: [0, -12, 0], opacity: [0, 0.5, 0] }}
          transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
        />
      ))}

      <div className="relative z-10">
        <div className="mb-5">
          <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">
            Timeline Preview
          </h3>
          <p className="text-[9px] text-gray-600 font-medium mt-1">
            {selectedNode !== null ? 'Click a memory to explore' : 'Where this memory will appear in your timeline'}
          </p>
        </div>

        <div
          ref={timelineRef}
          className="relative h-28 flex items-center cursor-pointer select-none"
          onMouseDown={handleTimelineMouseDown}
          onMouseMove={handleTimelineMouseMove}
        >
          <div className="absolute left-[5%] right-[5%] h-[1.5px] rounded-full pointer-events-none overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-neonPink/30 to-transparent"
              initial={{ scaleX: 0, originX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            />
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            />
          </div>

          {/* Energy wave */}
          <AnimatePresence>
            {energyWavePos !== null && (
              <motion.div
                key="energy-wave"
                className="absolute top-1/2 -translate-y-1/2 w-6 h-6 pointer-events-none"
                style={{ left: `${energyWavePos}%`, x: '-50%' }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: [0, 0.8, 0], scale: [0.5, 1.5, 0.5] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
              >
                <div className="w-full h-full rounded-full bg-gradient-to-r from-neonPink/60 to-neonPurple/60 blur-md" />
              </motion.div>
            )}
          </AnimatePresence>

          {nodePositions.map((pos, i) => {
            const isActive = selectedNode === i
            const isHovered = hoveredNode === i
            return (
              <motion.div
                key={i}
                className="absolute flex flex-col items-center"
                style={{ left: `${pos}%`, top: '50%' }}
                initial={{ opacity: 0, scale: 0, y: '-50%' }}
                animate={inView ? { opacity: 1, scale: 1, x: '-50%', y: '-50%' } : {}}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.4 + i * 0.1 }}
              >
                {/* Outer neon ring for active node */}
                {isActive && (
                  <motion.div
                    className="absolute rounded-full pointer-events-none"
                    style={{
                      width: 20, height: 20,
                      border: '1.5px solid rgba(255,75,145,0.5)',
                      boxShadow: '0 0 12px rgba(255,75,145,0.3), inset 0 0 8px rgba(255,75,145,0.1)',
                    }}
                    animate={{
                      scale: [1, 1.15, 1],
                      opacity: [0.5, 0.9, 0.5],
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  />
                )}

                {/* Floating particles around active node */}
                {isActive && orbitParticles.map((op, oi) => (
                  <motion.div
                    key={`op-${oi}`}
                    className="absolute w-1 h-1 rounded-full pointer-events-none"
                    style={{ backgroundColor: oi % 2 === 0 ? '#a855f7' : '#ff4b91' }}
                    animate={{
                      x: [
                        Math.cos((op.angle * Math.PI) / 180) * op.dist,
                        Math.cos(((op.angle + 180) * Math.PI) / 180) * op.dist,
                        Math.cos((op.angle * Math.PI) / 180) * op.dist,
                      ],
                      y: [
                        Math.sin((op.angle * Math.PI) / 180) * op.dist,
                        Math.sin(((op.angle + 180) * Math.PI) / 180) * op.dist,
                        Math.sin((op.angle * Math.PI) / 180) * op.dist,
                      ],
                      opacity: [0, 0.6, 0],
                    }}
                    transition={{
                      duration: op.dur,
                      repeat: Infinity,
                      delay: op.delay,
                      ease: 'easeInOut',
                    }}
                  />
                ))}

                {/* Node button */}
                <motion.button
                  onClick={() => handleNodeClick(i)}
                  onMouseEnter={() => setHoveredNode(i)}
                  onMouseLeave={() => setHoveredNode(null)}
                  whileHover={{ scale: 1.25 }}
                  whileTap={{ scale: 0.9 }}
                  animate={
                    isActive
                      ? {
                          scale: [1, 1.15, 1],
                          boxShadow: [
                            '0 0 5px rgba(255,75,145,0.2), 0 0 15px rgba(168,85,247,0.15)',
                            '0 0 15px rgba(255,75,145,0.5), 0 0 30px rgba(168,85,247,0.3)',
                            '0 0 5px rgba(255,75,145,0.2), 0 0 15px rgba(168,85,247,0.15)',
                          ],
                        }
                      : isHovered
                        ? { scale: 1.25, boxShadow: '0 0 8px rgba(255,75,145,0.15)' }
                        : { scale: 1 }
                  }
                  transition={
                    isActive
                      ? { duration: 3, repeat: Infinity, ease: 'easeInOut' }
                      : { type: 'spring', stiffness: 300, damping: 18 }
                  }
                  className={`rounded-full border transition-colors duration-300 cursor-pointer ${
                    isActive
                      ? 'w-3 h-3 border-neonPink/60 bg-neonPink/20'
                      : 'w-2 h-2 border-white/15 bg-white/5'
                  }`}
                  style={isActive ? { boxShadow: '0 0 12px rgba(255,75,145,0.35)' } : {}}
                  role="button"
                  tabIndex={0}
                  aria-label={`Select memory: ${mockMemories[i].title}`}
                />

                {/* Tooltip on hover */}
                <AnimatePresence>
                  {isHovered && !isActive && (
                    <motion.div
                      className="absolute bottom-full mb-3 px-3 py-2 rounded-xl pointer-events-none"
                      initial={{ opacity: 0, y: 6, filter: 'blur(4px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: 6, filter: 'blur(4px)' }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      style={{
                        background: 'rgba(20,16,45,0.28)',
                        backdropFilter: 'blur(24px)',
                        WebkitBackdropFilter: 'blur(24px)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <p className="text-[9px] font-bold text-white leading-tight">{mockMemories[i].title}</p>
                      <p className="text-[7px] text-gray-400 font-medium mt-0.5">{mockMemories[i].date}</p>
                      <p className="text-[7px] text-gray-500 font-medium mt-0.5">{mockMemories[i].mood}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <span className={`text-[7px] font-medium mt-2 transition-colors duration-300 ${
                  isActive ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {nodeLabels[i]}
                </span>
              </motion.div>
            )
          })}

          {/* Star indicator for context date (if different from selected) */}
          {selectedNode === null && (
            <motion.div
              key="context-star"
              className="absolute flex flex-col items-center pointer-events-none"
              style={{ top: '50%', left: '50%' }}
              initial={false}
            >
              <motion.div
                className="absolute w-8 h-8 rounded-full blur-md"
                style={{
                  background: 'radial-gradient(circle, rgba(168,85,247,0.2) 0%, transparent 70%)',
                }}
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              />
            </motion.div>
          )}
        </div>

        {/* Memory preview below timeline */}
        <AnimatePresence mode="wait">
          {displayMemory ? (
            <motion.div
              key={displayMemory.id}
              className="mt-3 rounded-2xl overflow-hidden"
              initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{
                background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div className="flex items-stretch gap-3 p-3">
                <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={displayMemory.image}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-white truncate">
                      {displayMemory.title}
                    </span>
                    <span className="text-[9px]">{displayMemory.mood.split(' ')[0]}</span>
                  </div>
                  <p className="text-[8px] text-gray-500 font-medium mt-0.5">
                    {displayMemory.date}
                  </p>
                  <p className="text-[8px] text-gray-400 font-medium mt-1 leading-relaxed line-clamp-2">
                    &ldquo;{displayMemory.summary}&rdquo;
                  </p>
                </div>
              </div>
            </motion.div>
          ) : selectedNode === null ? (
            <motion.div
              className="text-center mt-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-[9px] text-gray-600 font-medium">
                Select a date or click a node to preview
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
