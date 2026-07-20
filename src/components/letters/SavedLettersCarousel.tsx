'use client'

import { useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Letter } from './types'
import SavedLetterCard from './SavedLetterCard'

interface Props {
  letters: Letter[]
  activeId: string
  onSelect: (letter: Letter) => void
}

export default function SavedLettersCarousel({ letters, activeId, onSelect }: Props) {
  const carouselRef = useRef<HTMLDivElement>(null)

  const scroll = useCallback((dir: number) => {
    carouselRef.current?.scrollBy({ left: dir * 230, behavior: 'smooth' })
  }, [])

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.currentTarget.scrollLeft += e.deltaY
    }
  }, [])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') scroll(-1)
    if (e.key === 'ArrowRight') scroll(1)
  }, [scroll])

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 25 }}
      className="mt-5 rounded-[24px] p-4"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,.09), rgba(32,12,68,.62) 44%, rgba(14,5,35,.72))',
        border: '1px solid rgba(237,184,255,.17)',
        boxShadow: '0 18px 48px rgba(0,0,0,.32), inset 0 1px rgba(255,255,255,.13)',
        backdropFilter: 'blur(26px)',
      }}
    >
      <div className="flex items-end gap-3 mb-4">
        <h2 className="font-serif text-xl">✨ Your Saved Letters</h2>
        <span className="text-xs text-white/50">{letters.length} treasured emotions preserved forever.</span>
      </div>

      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.1, x: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => scroll(-1)}
          className="absolute left-0 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#281144] p-2 shadow-xl border border-white/10 hover:bg-[#361560] transition-colors"
        >
          <ChevronLeft className="w-4 text-white/80" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1, x: 2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => scroll(1)}
          className="absolute right-0 top-1/2 z-10 translate-x-1/2 -translate-y-1/2 rounded-full bg-[#281144] p-2 shadow-xl border border-white/10 hover:bg-[#361560] transition-colors"
        >
          <ChevronRight className="w-4 text-white/80" />
        </motion.button>

        <div
          ref={carouselRef}
          onWheel={handleWheel}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="region"
          aria-label="Saved letters carousel"
          className="flex gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] outline-none focus:ring-2 focus:ring-pink-300/30 rounded-xl px-2"
        >
          {letters.map((letter, i) => (
            <SavedLetterCard
              key={letter.id}
              letter={letter}
              index={i}
              isActive={letter.id === activeId}
              onClick={() => onSelect(letter)}
            />
          ))}
        </div>
      </div>
    </motion.section>
  )
}
