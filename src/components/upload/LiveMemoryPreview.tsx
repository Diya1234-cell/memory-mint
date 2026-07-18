'use client'

import { useState, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play, Pause, Sparkles, Pencil, ChevronLeft, ChevronRight,
  Heart, MapPin, Users, Bookmark, Sun, Star, Volume2
} from 'lucide-react'
import { useMemory } from '@/context/MemoryContext'

const lcg = (seed: number) => {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

const sampleImages = [
  'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1470071459604-7b8ec44ffd5a?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=600&q=80',
]

const thumbnailData = sampleImages.map((img, i) => ({ id: i, img }))

const moodOptions = [
  { icon: '✨', label: 'Magical' },
  { icon: '🌸', label: 'Romantic' },
  { icon: '🌅', label: 'Happy' },
  { icon: '🌊', label: 'Calm' },
]

const weatherOptions = [
  { icon: '🌙', label: 'Clear Night' },
  { icon: '☀️', label: 'Sunny' },
  { icon: '🌧️', label: 'Rainy' },
  { icon: '❄️', label: 'Snowy' },
]

const typeTabs = [
  { id: 'photo', label: 'Photo', icon: '🖼️' },
  { id: 'video', label: 'Video', icon: '🎬' },
  { id: 'voice', label: 'Voice', icon: '🎙️' },
  { id: 'journal', label: 'Journal', icon: '📝' },
] as const

type MemoryType = typeof typeTabs[number]['id']

const waveformHeights = [
  6, 8, 13, 17, 20, 19, 16, 12, 9, 7, 8, 12, 16, 19, 20, 17,
  13, 9, 7, 8, 12, 16, 19, 20, 17, 13, 9, 7, 8, 12, 16, 19
]

export default function LiveMemoryPreview() {
  const { draft, setField } = useMemory()
  const [selectedType, setSelectedType] = useState<MemoryType>('photo')
  const [selectedThumb, setSelectedThumb] = useState(0)
  const [isImagePlaying, setIsImagePlaying] = useState(false)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)
  const mouseRef = useRef({ x: 0.5, y: 0.5 })

  const dustParticles = useMemo(() => {
    const rng = lcg(99)
    return Array.from({ length: 12 }).map(() => ({
      x: rng() * 100,
      y: rng() * 100,
      size: rng() * 2 + 1,
      dur: rng() * 6 + 4,
      delay: rng() * 4,
    }))
  }, [])

  const starParticles = useMemo(() => {
    const rng = lcg(202)
    return Array.from({ length: 8 }).map(() => ({
      x: rng() * 100,
      y: rng() * 100,
      size: rng() * 1.5 + 0.5,
      delay: rng() * 5,
    }))
  }, [])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!previewRef.current) return
    const rect = previewRef.current.getBoundingClientRect()
    mouseRef.current = {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    }
  }

  const handlePrevThumb = () => {
    setSelectedThumb(p => (p > 0 ? p - 1 : thumbnailData.length - 1))
  }

  const handleNextThumb = () => {
    setSelectedThumb(p => (p < thumbnailData.length - 1 ? p + 1 : 0))
  }

  const renderPhotoPreview = () => (
    <div className="relative w-full h-full overflow-hidden rounded-2xl">
      <AnimatePresence mode="wait">
        <motion.img
          key={selectedThumb}
          src={sampleImages[selectedThumb]}
          alt=""
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>
      <div                     className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-black/5" />
      <div className="absolute inset-0" style={{
        background: `radial-gradient(circle at ${mouseRef.current.x * 100}% ${mouseRef.current.y * 100}%, rgba(255,255,255,0.04) 0%, transparent 60%)`,
        pointerEvents: 'none',
      }} />
      {dustParticles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${p.x}%`, top: `${p.y}%`,
            width: p.size, height: p.size,
            background: 'radial-gradient(circle, rgba(255,255,255,0.5), transparent)',
          }}
          animate={{ y: [0, -20, 0], opacity: [0, 0.6, 0] }}
          transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )

  const renderVideoPreview = () => (
    <div className="relative w-full h-full overflow-hidden rounded-2xl flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.25)' }}>
      <motion.img
        src={sampleImages[selectedThumb]}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-60"
        animate={{ scale: isImagePlaying ? 1.05 : 1 }}
        transition={{ duration: 10, repeat: isImagePlaying ? Infinity : 0, ease: 'linear' }}
      />
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.12)' }} />
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsImagePlaying(!isImagePlaying)}
          className="w-16 h-16 rounded-full bg-neonPink/30 border border-neonPink/50 flex items-center justify-center backdrop-blur-md shadow-[0_0_30px_rgba(255,75,145,0.3)]"
        >
          {isImagePlaying
            ? <Pause className="w-7 h-7 text-white fill-current" />
            : <Play className="w-7 h-7 text-white fill-current ml-1" />
          }
        </motion.button>
      </div>
      {isImagePlaying && (
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-neonPink to-neonPurple"
                animate={{ width: ['0%', '100%'] }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              />
            </div>
            <span className="text-[9px] text-white/70 font-medium">3:42 / 5:10</span>
          </div>
        </div>
      )}
    </div>
  )

  const renderVoicePreview = () => (
    <div className="relative w-full h-full overflow-hidden rounded-2xl flex flex-col items-center justify-center gap-4 px-8" style={{ background: 'rgba(0,0,0,0.25)' }}>
      <AnimatePresence mode="wait">
        {starParticles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: `${p.x}%`, top: `${p.y}%`,
              width: p.size, height: p.size,
              backgroundColor: i % 2 === 0 ? 'rgba(168,85,247,0.3)' : 'rgba(255,75,145,0.25)',
            }}
            animate={{ opacity: [0, 0.8, 0], scale: [0, 1.2, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
          />
        ))}
      </AnimatePresence>
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsImagePlaying(!isImagePlaying)}
        className="w-14 h-14 rounded-full bg-neonPink/30 border border-neonPink/50 flex items-center justify-center backdrop-blur-md shadow-[0_0_30px_rgba(255,75,145,0.3)] relative z-10"
      >
        {isImagePlaying
          ? <Pause className="w-6 h-6 text-white fill-current" />
          : <Play className="w-6 h-6 text-white fill-current ml-0.5" />
        }
      </motion.button>
      <div className="w-full flex items-end gap-1 h-16 relative z-10">
        {waveformHeights.map((h, i) => (
          <motion.div
            key={i}
            className="flex-1 rounded-full"
            animate={{
              height: isImagePlaying
                ? [h, h * (0.5 + Math.random() * 0.8), h]
                : h,
              backgroundColor: isImagePlaying
                ? ['rgba(255,75,145,0.5)', 'rgba(168,85,247,0.7)', 'rgba(255,75,145,0.5)']
                : 'rgba(255,255,255,0.12)',
            }}
            transition={{
              duration: 0.6 + Math.random() * 0.4,
              repeat: isImagePlaying ? Infinity : 0,
              ease: 'easeInOut',
              delay: i * 0.04,
            }}
          />
        ))}
      </div>
      <div className="flex items-center gap-3 text-[10px] text-gray-400 font-medium relative z-10">
        <span>0:00</span>
        <div className="w-40 h-1 rounded-full bg-white/5 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-neonPink to-neonPurple"
            animate={{ width: isImagePlaying ? ['0%', '100%'] : '0%' }}
            transition={{ duration: 45, repeat: isImagePlaying ? Infinity : 0, ease: 'linear' }}
          />
        </div>
        <span>3:42</span>
      </div>
    </div>
  )

  const renderJournalPreview = () => (
    <div className="relative w-full h-full overflow-hidden rounded-2xl flex items-center justify-center p-5">
      <motion.div
        className="w-full h-full rounded-xl border border-white/10 p-5 shadow-2xl relative overflow-hidden"
        style={{ background: 'linear-gradient(180deg, rgba(26,15,46,0.4), rgba(18,10,34,0.3))', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
        whileHover={{ rotate: -1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 28px, rgba(255,255,255,0.1) 28px, rgba(255,255,255,0.1) 29px)',
          }}
        />
        <div className="relative z-10 space-y-3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-sm font-extrabold text-white leading-tight">
              {draft.title || 'A Magical Night Under the Stars'}
            </h3>
            <p className="text-[8px] text-neonPink/60 font-semibold uppercase tracking-wider mt-1">
              {draft.date ? new Date(draft.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'May 20, 2024'}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-[10px] text-gray-300 leading-relaxed italic font-medium">
              {draft.description || '&ldquo;The mountains stood silent as we sat by the bonfire, the Milky Way painting itself across the sky like a cosmic river of light. Every star felt like a witness to our story.&rdquo;'}
            </p>
          </motion.div>
          {starParticles.slice(0, 4).map((p, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full pointer-events-none"
              style={{
                left: `${p.x}%`, top: `${p.y}%`,
                width: p.size, height: p.size,
                backgroundColor: 'rgba(255,215,0,0.2)',
              }}
              animate={{ opacity: [0, 0.6, 0], scale: [0, 1, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  )

  const renderEmptyState = () => (
    <div className="w-full h-full rounded-2xl flex flex-col items-center justify-center gap-3 px-8">
      <svg className="w-20 h-20" viewBox="0 0 100 100" fill="none">
        <motion.circle
          cx="50" cy="50" r="3"
          fill="#ff4b91"
          animate={{ r: [3, 5, 3], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        {[
          { x2: 30, y2: 20 }, { x2: 70, y2: 20 },
          { x2: 20, y2: 40 }, { x2: 80, y2: 40 },
          { x2: 30, y2: 70 }, { x2: 70, y2: 70 },
          { x2: 50, y2: 15 }, { x2: 50, y2: 80 },
        ].map((p, i) => (
          <motion.line
            key={i}
            x1="50" y1="50" x2={p.x2} y2={p.y2}
            stroke="rgba(168,85,247,0.15)"
            strokeWidth="0.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: i * 0.15, ease: 'easeOut' }}
          />
        ))}
        {[
          { cx: 30, cy: 20 }, { cx: 70, cy: 20 },
          { cx: 20, cy: 40 }, { cx: 80, cy: 40 },
          { cx: 30, cy: 70 }, { cx: 70, cy: 70 },
          { cx: 50, cy: 15 }, { cx: 50, cy: 80 },
        ].map((p, i) => (
          <motion.circle
            key={`s-${i}`}
            cx={p.cx} cy={p.cy} r="1.5"
            fill="rgba(255,255,255,0.3)"
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3, ease: 'easeInOut' }}
          />
        ))}
      </svg>
      <p className="text-sm text-gray-400 font-medium text-center">
        Your memory preview will appear here
      </p>
      <p className="text-[10px] text-gray-600 font-medium text-center max-w-[200px]">
        Select a memory to watch it become a new star.
      </p>
    </div>
  )

  const previewContent = () => {
    switch (selectedType) {
      case 'photo': return renderPhotoPreview()
      case 'video': return renderVideoPreview()
      case 'voice': return renderVoicePreview()
      case 'journal': return renderJournalPreview()
      default: return renderPhotoPreview()
    }
  }

  const moodIcon = draft.mood !== null ? moodOptions[draft.mood % moodOptions.length]?.icon + ' ' + moodOptions[draft.mood % moodOptions.length]?.label : '✨ Magical'
  const weatherIcon = draft.weather !== null ? weatherOptions[draft.weather % weatherOptions.length]?.icon + ' ' + weatherOptions[draft.weather % weatherOptions.length]?.label : '🌙 Clear Night'

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return 'May 20, 2024'
    const d = new Date(dateStr + 'T12:00:00')
    if (isNaN(d.getTime())) return 'May 20, 2024'
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  }

  return (
    <motion.div
      ref={previewRef}
      onMouseMove={handleMouseMove}
      className="relative rounded-3xl p-6 space-y-4 overflow-hidden group"
      style={{ background: 'rgba(255,255,255,0.035)', backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.03)' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/[0.02] pointer-events-none" />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-neonPink/20 to-neonPurple/20 border border-neonPink/30 flex items-center justify-center shadow-[0_0_8px_rgba(255,75,145,0.15)]">
            <Sparkles className="w-3.5 h-3.5 text-neonPink" />
          </div>
          <span className="text-[10px] font-extrabold text-gray-300 uppercase tracking-wider">
            Live Memory Preview
          </span>
        </div>
        <div className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-neonPink/20 to-neonPurple/20 border border-neonPink/30 text-[8px] font-extrabold text-neonPink uppercase tracking-wider shadow-[0_0_8px_rgba(255,75,145,0.15)]">
          Preview
        </div>
      </div>

      <div className="flex gap-2">
        {typeTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedType(tab.id)}
            className={`relative px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all duration-300 ${
              selectedType === tab.id
                ? 'bg-neonPink/15 border border-neonPink/30 text-white shadow-[0_0_10px_rgba(255,75,145,0.15)]'
                : 'bg-white/5 border border-white/10 text-gray-500 hover:text-white hover:bg-white/10'
            }`}
          >
            <span className="mr-1">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-7">
          <motion.div
            layout
            className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 shadow-xl group"
            style={{
              background: 'radial-gradient(circle at center, rgba(18,11,47,0.6) 0%, rgba(5,3,18,0.8) 100%)',
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedType}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0"
              >
                {previewContent()}
              </motion.div>
            </AnimatePresence>

            <div
              className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: `radial-gradient(circle at ${mouseRef.current.x * 100}% ${mouseRef.current.y * 100}%, rgba(255,255,255,0.04) 0%, transparent 60%)`,
              }}
            />

            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/[0.04] pointer-events-none" />
          </motion.div>
        </div>

        <div className="md:col-span-5 space-y-2.5">
          <div className="group/title">
            {isEditingTitle ? (
              <input
                value={draft.title}
                onChange={e => setField('title', e.target.value)}
                onBlur={() => setIsEditingTitle(false)}
                onKeyDown={e => e.key === 'Enter' && setIsEditingTitle(false)}
                className="w-full border border-neonPink/30 rounded-lg px-2 py-1 text-xs font-bold text-white outline-none shadow-[0_0_10px_rgba(255,75,145,0.1)]"
                style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
                autoFocus
              />
            ) : (
              <div
                className="flex items-center gap-1.5 cursor-pointer"
                onClick={() => setIsEditingTitle(true)}
              >
                <h4 className="text-[11px] font-extrabold text-white leading-tight line-clamp-2">
                  {draft.title || 'A Magical Night Under the Stars'}
                </h4>
                <Pencil className="w-2.5 h-2.5 text-gray-500 opacity-0 group-hover/title:opacity-100 transition-opacity flex-shrink-0" />
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 text-[8px] text-gray-500 font-semibold">
            <span>{formatDisplayDate(draft.date)}</span>
            <span className="text-white/20">•</span>
            <span>8:30 PM</span>
          </div>

          {[
            { icon: Star, label: 'Mood', value: moodIcon, key: 'Mood' },
            { icon: Sun, label: 'Weather', value: weatherIcon, key: 'Weather' },
            { icon: Users, label: 'People', value: `${draft.people.length} People`, key: 'People' },
            { icon: MapPin, label: 'Location', value: draft.location || 'Manali, Himalayas', key: 'Location' },
            { icon: Bookmark, label: 'Category', value: draft.category || 'Vacation', key: 'Category' },
            { icon: Heart, label: 'Favorite', value: draft.favorite ? '❤️ Yes' : '♡ No', key: 'Favorite' },
          ].map((item, i) => (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
              className="flex items-center gap-2 py-1 px-2 rounded-lg hover:bg-white/5 transition-colors duration-300 group/info"
            >
              <item.icon className="w-2.5 h-2.5 text-gray-500 group-hover/info:text-neonPink transition-colors" />
              <div className="flex-1 flex items-center justify-between">
                <span className="text-[7px] text-gray-500 font-semibold uppercase tracking-wider">{item.label}</span>
                <span className="text-[8px] text-gray-300 font-medium">{item.value}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={handlePrevThumb}
            className="flex-shrink-0 w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <ChevronLeft className="w-3 h-3 text-gray-400" />
          </button>
          <div className="flex gap-1.5 flex-1 overflow-x-auto scrollbar-none">
            {thumbnailData.map((t, i) => (
              <motion.button
                key={t.id}
                onClick={() => setSelectedThumb(i)}
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                className={`relative rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all duration-300 ${
                  i === selectedThumb
                    ? 'border-neonPink shadow-[0_0_10px_rgba(255,75,145,0.3)]'
                    : 'border-white/10 opacity-60 hover:opacity-90'
                }`}
              >
                <img src={t.img} alt="" className="w-10 h-9 object-cover" />
              </motion.button>
            ))}
          </div>
          <button
            onClick={handleNextThumb}
            className="flex-shrink-0 w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <ChevronRight className="w-3 h-3 text-gray-400" />
          </button>
        </div>
        <div className="flex items-center justify-center mt-1.5">
          <span className="text-[8px] text-gray-600 font-medium">
            {selectedThumb + 1} / {thumbnailData.length}
          </span>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 p-3" style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.15), rgba(18,10,34,0.15), rgba(0,0,0,0.15))', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsImagePlaying(!isImagePlaying)}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-neonPink/30 to-neonPurple/30 border border-neonPink/40 flex items-center justify-center flex-shrink-0 shadow-[0_0_10px_rgba(255,75,145,0.2)]"
          >
            {isImagePlaying
              ? <Pause className="w-3.5 h-3.5 text-white fill-current" />
              : <Play className="w-3.5 h-3.5 text-white fill-current ml-0.5" />
            }
          </motion.button>

          <div className="flex-1 flex items-end gap-[2px] h-7">
            {waveformHeights.map((h, i) => (
              <motion.div
                key={i}
                className="flex-1 rounded-full"
                animate={{
                  height: isImagePlaying
                    ? [h * 0.5, h, h * 0.5]
                    : h * 0.5,
                  backgroundColor: isImagePlaying
                    ? [
                        `rgba(${255 - i * 4}, ${75 + i * 2}, ${145 + i * 4}, ${0.3 + (h / 20) * 0.4})`,
                        `rgba(${168 + i * 3}, ${85 - i * 2}, ${247 - i * 3}, ${0.5 + (h / 20) * 0.4})`,
                        `rgba(${255 - i * 4}, ${75 + i * 2}, ${145 + i * 4}, ${0.3 + (h / 20) * 0.4})`,
                      ]
                    : 'rgba(255,255,255,0.08)',
                }}
                transition={{
                  duration: 0.5 + (i % 5) * 0.1,
                  repeat: isImagePlaying ? Infinity : 0,
                  ease: 'easeInOut',
                  delay: i * 0.03,
                }}
              />
            ))}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <Volume2 className="w-3 h-3 text-gray-500" />
            <span className="text-[9px] text-gray-400 font-medium">3:42</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
