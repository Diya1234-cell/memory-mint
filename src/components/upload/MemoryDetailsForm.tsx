'use client'

import { useState, useRef, useEffect, useCallback, useId } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, MapPin, ChevronDown, Lock, Heart } from 'lucide-react'
import type { MemoryDraft } from '@/context/MemoryContext'
import { useMemory } from '@/context/MemoryContext'
import MoodPlanets from './MoodPlanets'
import WeatherIcons from './WeatherIcons'
import PeopleSelector from './PeopleSelector'

const inputBase =
  'w-full rounded-2xl px-4 pt-6 pb-3 text-sm text-white outline-none transition-all duration-300 border border-white/[0.06] focus:border-neonPink/50 focus:ring-[2px] focus:ring-neonPink/20 hover:border-white/15'
const inputStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.04)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.2)',
}

const labelBase =
  'absolute pointer-events-none transition-all duration-300 left-4'

export default function MemoryDetailsForm() {
  const uid = useId()
  const { draft, setField } = useMemory()

  const [focused, setFocused] = useState<string | null>(null)
  const [showCategory, setShowCategory] = useState(false)
  const [tagInput, setTagInput] = useState('')
  const [showVisibility, setShowVisibility] = useState(false)

  const catRef = useRef<HTMLDivElement>(null)
  const visRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node)) setShowCategory(false)
      if (visRef.current && !visRef.current.contains(e.target as Node)) setShowVisibility(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleTagKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && tagInput.trim()) {
        e.preventDefault()
        setField('tags', [...draft.tags, tagInput.trim()])
        setTagInput('')
      }
    },
    [tagInput, draft.tags, setField],
  )

  const removeTag = useCallback((i: number) => {
    setField('tags', draft.tags.filter((_, idx) => idx !== i))
  }, [draft.tags, setField])

  const categoryOptions = [
    'First Date',
    'Vacation',
    'Anniversary',
    'Birthday',
    'Everyday Moment',
    'Family',
    'Adventure',
    'Festival',
    'Custom',
  ]

  const visibilityOptions = ['Private', 'Shared', 'Public']

  const isFloating = (id: string, override?: string) => {
    const valMap: Record<string, string | undefined> = {
      title: draft.title,
      description: draft.description,
      date: draft.date,
      location: draft.location,
      category: draft.category,
      tagInput,
    }
    return focused === id || !!valMap[id]
  }

  const focusProps = (id: string) => ({
    onFocus: () => setFocused(id),
    onBlur: () => setFocused(null),
  })

  return (
    <motion.div
      className="relative rounded-3xl p-6 md:p-7 overflow-hidden group"
      style={{ background: 'rgba(255,255,255,0.035)', backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.03)' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -1 }}
    >
      <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/[0.02] pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{
          background: 'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.02) 0%, transparent 60%)',
        }}
      />
      <div className="flex items-center gap-3 mb-7">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-neonPink/20 to-neonPurple/20 border border-neonPink/30 flex items-center justify-center shadow-[0_0_12px_rgba(255,75,145,0.2)]">
          <span className="text-[10px] font-extrabold text-neonPink">2</span>
        </div>
        <span className="text-sm font-medium text-white">Memory Details</span>
      </div>

      <div className="space-y-4 md:space-y-5">
        {/* ═══════ ROW 1: Title | Description ═══════ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative group">
            <input
              id={`${uid}-title`}
              type="text"
              value={draft.title}
              onChange={(e) => setField('title', e.target.value)}
              placeholder={focused === 'title' ? 'Give your memory a beautiful title...' : ''}
              className={inputBase}
              style={inputStyle}
              {...focusProps('title')}
            />
            <label
              htmlFor={`${uid}-title`}
              className={`${labelBase} ${
                isFloating('title')
                  ? 'top-2 text-[9px] text-neonPink/80 drop-shadow-[0_0_4px_rgba(255,75,145,0.3)]'
                  : 'top-1/2 -translate-y-1/2 text-xs text-gray-400'
              }`}
            >
              Memory Title
            </label>
          </div>

          <div className="relative group">
            <textarea
              id={`${uid}-desc`}
              rows={3}
              value={draft.description}
              onChange={(e) => setField('description', e.target.value)}
              placeholder={focused === 'description' ? 'Write about this moment...' : ''}
              className={`${inputBase} resize-none min-h-[56px]`}
              style={inputStyle}
              {...focusProps('description')}
            />
            <label
              htmlFor={`${uid}-desc`}
              className={`${labelBase} ${
                isFloating('description')
                  ? 'top-2 text-[9px] text-neonPink/80 drop-shadow-[0_0_4px_rgba(255,75,145,0.3)]'
                  : 'top-4 text-xs text-gray-400'
              }`}
            >
              Description
            </label>
          </div>
        </div>

        {/* ═══════ ROW 2: Date | Location | People ═══════ */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-3 relative group">
            <input
              id={`${uid}-date`}
              type="date"
              value={draft.date}
              onChange={(e) => setField('date', e.target.value)}
              className={`${inputBase} ${
                 !draft.date ? 'text-transparent' : 'text-white'
               } [color-scheme:dark]`}
              style={inputStyle}
              {...focusProps('date')}
            />
            <label
              htmlFor={`${uid}-date`}
              className={`${labelBase} ${
                isFloating('date')
                  ? 'top-2 text-[9px] text-neonPink/80 drop-shadow-[0_0_4px_rgba(255,75,145,0.3)]'
                  : 'top-1/2 -translate-y-1/2 text-xs text-gray-400'
              }`}
            >
              Date
            </label>
            <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          <div className="md:col-span-5 relative group">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-neonPink transition-colors duration-200 z-10 pointer-events-none" />
            <input
              id={`${uid}-location`}
              type="text"
              value={draft.location}
              onChange={(e) => setField('location', e.target.value)}
              placeholder={focused === 'location' ? 'Search location...' : ''}
              className={`${inputBase} pl-11`}
              style={inputStyle}
              {...focusProps('location')}
            />
            <label
              htmlFor={`${uid}-location`}
              className={`${labelBase} left-11 ${
                isFloating('location')
                  ? 'top-2 text-[9px] text-neonPink/80 drop-shadow-[0_0_4px_rgba(255,75,145,0.3)]'
                  : 'top-1/2 -translate-y-1/2 text-xs text-gray-400'
              }`}
            >
              Location
            </label>
          </div>

          <div className="md:col-span-4 flex flex-col justify-end">
            <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2 ml-0.5">
              People
            </label>
            <PeopleSelector
              people={draft.people}
              onAdd={() => {
                /* placeholder – no backend */
              }}
            />
          </div>
        </div>

        {/* ═══════ ROW 3: Mood | Weather ═══════ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider block">
              Mood
            </label>
            <p className="text-[8px] text-gray-600 font-medium mt-0.5 mb-3">Select mood planet</p>
            <MoodPlanets selected={draft.mood} onSelect={(i) => setField('mood', i)} />
          </div>

          <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider block">
              Weather
            </label>
            <p className="text-[8px] text-gray-600 font-medium mt-0.5 mb-3">Select weather</p>
            <WeatherIcons selected={draft.weather} onSelect={(i) => setField('weather', i)} />
          </div>
        </div>

        {/* ═══════ ROW 4: Category | Tags | Visibility | Favorite ═══════ */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-3 relative group" ref={catRef}>
            <button
              onClick={() => setShowCategory((v) => !v)}
              className={`${inputBase} text-left flex items-center justify-between cursor-pointer ${
                 !draft.category ? 'text-gray-400' : 'text-white'
               }`}
              style={inputStyle}
            >
              <span className="pt-2">{draft.category || 'Category'}</span>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                  showCategory ? 'rotate-180' : ''
                }`}
              />
            </button>
            <label
              className={`${labelBase} ${
                draft.category || showCategory
                  ? 'top-2 text-[9px] text-neonPink/80 drop-shadow-[0_0_4px_rgba(255,75,145,0.3)]'
                  : 'top-1/2 -translate-y-1/2 text-xs text-gray-400'
              }`}
            >
              Category
            </label>

            <AnimatePresence>
              {showCategory && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scaleY: 0.95 }}
                  animate={{ opacity: 1, y: 4, scaleY: 1 }}
                  exit={{ opacity: 0, y: -8, scaleY: 0.95 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="absolute top-full left-0 right-0 z-20 mt-1 rounded-2xl p-1.5 overflow-hidden"
                  style={{ transformOrigin: 'top', background: 'rgba(20,16,45,0.28)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 12px 40px rgba(140,90,255,0.08), 0 0 80px rgba(200,120,255,0.06)' }}
                >
                  {categoryOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        setField('category', opt)
                        setShowCategory(false)
                      }}
                      className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                        draft.category === opt
                          ? 'bg-neonPink/15 text-neonPink border border-neonPink/20'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="md:col-span-3 relative group">
            <div
              className={`${inputBase} flex flex-wrap items-center gap-1.5 min-h-[56px] pt-6 pb-2 cursor-text`}
              style={inputStyle}
              onClick={() => document.getElementById(`${uid}-tag-input`)?.focus()}
            >
              {draft.tags.map((tag, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold bg-neonPink/10 border border-neonPink/20 text-neonPink/90"
                >
                  {tag}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      removeTag(i)
                    }}
                    className="hover:text-white transition-colors"
                  >
                    &times;
                  </button>
                </span>
              ))}
              <input
                id={`${uid}-tag-input`}
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKey}
                placeholder={draft.tags.length === 0 && focused !== 'tagInput' ? '' : ''}
                className="flex-1 min-w-[60px] bg-transparent text-sm text-white outline-none placeholder-gray-500"
                {...focusProps('tagInput')}
              />
            </div>
            <label
              htmlFor={`${uid}-tag-input`}
              className={`${labelBase} ${
                isFloating('tagInput') || draft.tags.length > 0
                  ? 'top-2 text-[9px] text-neonPink/80 drop-shadow-[0_0_4px_rgba(255,75,145,0.3)]'
                  : 'top-1/2 -translate-y-1/2 text-xs text-gray-400'
              }`}
            >
              Tags
            </label>
          </div>

          <div className="md:col-span-3 relative group" ref={visRef}>
            <button
              onClick={() => setShowVisibility((v) => !v)}
              className={`${inputBase} text-left flex items-center gap-3 cursor-pointer ${
                 !draft.visibility ? 'text-gray-400' : 'text-white'
               }`}
              style={inputStyle}
            >
              <Lock className={`w-4 h-4 ${draft.visibility === 'Private' ? 'text-neonPink' : draft.visibility === 'Shared' ? 'text-neonPurple' : 'text-gray-400'}`} />
              <span className="pt-1">{draft.visibility || 'Visibility'}</span>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 ml-auto transition-transform duration-200 ${
                  showVisibility ? 'rotate-180' : ''
                }`}
              />
            </button>
            <label
              className={`${labelBase} left-12 ${
                draft.visibility
                  ? 'top-2 text-[9px] text-neonPink/80 drop-shadow-[0_0_4px_rgba(255,75,145,0.3)]'
                  : 'top-1/2 -translate-y-1/2 text-xs text-gray-400'
              }`}
            >
              Visibility
            </label>

            <AnimatePresence>
              {showVisibility && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scaleY: 0.95 }}
                  animate={{ opacity: 1, y: 4, scaleY: 1 }}
                  exit={{ opacity: 0, y: -8, scaleY: 0.95 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="absolute top-full left-0 right-0 z-20 mt-1 rounded-2xl p-1.5 overflow-hidden"
                  style={{ transformOrigin: 'top', background: 'rgba(20,16,45,0.28)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 12px 40px rgba(140,90,255,0.08), 0 0 80px rgba(200,120,255,0.06)' }}
                >
                  {visibilityOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        setField('visibility', opt as MemoryDraft['visibility'])
                        setShowVisibility(false)
                      }}
                      className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 flex items-center gap-3 ${
                        draft.visibility === opt
                          ? 'bg-neonPink/15 text-neonPink border border-neonPink/20'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Lock className={`w-3.5 h-3.5 ${opt === 'Private' ? 'text-neonPink' : opt === 'Shared' ? 'text-neonPurple' : 'text-gray-400'}`} />
                      {opt}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="md:col-span-3 flex flex-col justify-end">
            <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2 ml-0.5">
              Favorite
            </label>
            <motion.button
              onClick={() => setField('favorite', !draft.favorite)}
              className={`w-full h-[56px] rounded-2xl border flex items-center justify-center gap-2.5 text-sm font-medium transition-all duration-300 ${
                 draft.favorite
                   ? 'bg-gradient-to-r from-neonPink/20 to-neonPurple/20 border-neonPink/40 text-neonPink shadow-[0_0_20px_rgba(255,75,145,0.25)]'
                   : 'border-white/10 text-gray-400 hover:border-white/20 hover:bg-white/5'
               }`}
              style={!draft.favorite ? { background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' } : {}}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
            >
              <motion.div
                animate={
                  draft.favorite
                    ? { scale: [1, 1.25, 1] }
                    : { scale: 1 }
                }
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                <Heart
                  className={`w-4 h-4 transition-all duration-300 ${
                    draft.favorite ? 'fill-neonPink drop-shadow-[0_0_8px_rgba(255,75,145,0.6)]' : ''
                  }`}
                />
              </motion.div>
              <span>{draft.favorite ? 'Favorited' : 'Favorite'}</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
