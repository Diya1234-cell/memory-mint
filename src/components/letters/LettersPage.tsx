'use client'

import { useEffect, useMemo, useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, ChevronDown } from 'lucide-react'
import { Letter, Settings, MOODS } from './types'
import { generateLetters } from './data'
import CosmicBackground from './CosmicBackground'
import FloatingDecorations from './FloatingDecorations'
import { ToastProvider, useToast } from './ToastProvider'
import SearchBar from './SearchBar'
import MusicPlayer from './MusicPlayer'
import LetterCollections from './LetterCollections'
import LetterToolbar from './LetterToolbar'
import LetterEditor, { LetterEditorHandle } from './LetterEditor'
import SavedLettersCarousel from './SavedLettersCarousel'
import Timeline from './Timeline'
import TimeCapsulePanel from './TimeCapsulePanel'
import AIAssistant from './AIAssistant'
import LetterPreviewModal from './LetterPreviewModal'
import { AI_TEMPLATES } from './types'

const STORAGE_KEY = 'memoryverse-letters-v2'

function LettersContent() {
  const { addToast } = useToast()
  const allLetters = useMemo(generateLetters, [])
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const editorRef = useRef<LetterEditorHandle>(null)
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [letters, setLetters] = useState<Letter[]>(allLetters)
  const [current, setCurrent] = useState<Letter>(allLetters[0])
  const [collection, setCollection] = useState('Love Letters')
  const [timeline, setTimeline] = useState('2026')
  const [query, setQuery] = useState('')
  const [moodOpen, setMoodOpen] = useState(false)
  const [editMode, setEditMode] = useState(true)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const [previewLetter, setPreviewLetter] = useState<Letter | null>(null)

  const [settings, setSettings] = useState<Settings>({
    releaseDate: '2030-05-19',
    locked: true,
    reminder: true,
    ai: true,
    music: true,
    privacy: 'Private',
    reminderDate: '2030-05-19',
  })

  const [history, setHistory] = useState<string[]>([allLetters[0].body])
  const [historyIndex, setHistoryIndex] = useState(0)
  const undoRef = useRef<() => void>(() => {})
  const redoRef = useRef<() => void>(() => {})

  // Load from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const saved = JSON.parse(raw)
        if (saved.current) setCurrent(saved.current)
        if (saved.collection) setCollection(saved.collection)
        if (saved.timeline) setTimeline(saved.timeline)
        if (saved.settings) setSettings(saved.settings)
        if (saved.letters) setLetters(saved.letters)
      }
    } catch {}
  }, [])

  // Auto-save
  const triggerAutoSave = useCallback(() => {
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current)
    setSaveStatus('saving')
    autoSaveTimer.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ current, collection, timeline, settings, letters }))
        setSaveStatus('saved')
        setTimeout(() => setSaveStatus('idle'), 2000)
      } catch {}
    }, 1500)
  }, [current, collection, timeline, settings, letters])

  useEffect(() => { triggerAutoSave() }, [current, collection, timeline, settings])

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setMoodOpen(false); setPreviewLetter(null) }
      if (e.ctrlKey && e.key.toLowerCase() === 's') {
        e.preventDefault()
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ current, collection, timeline, settings, letters }))
        addToast('✓ Letter Saved', 'success')
      }
      if (e.ctrlKey && e.key.toLowerCase() === 'z' && !e.shiftKey) { e.preventDefault(); undoRef.current() }
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'z') { e.preventDefault(); redoRef.current() }
      if (e.ctrlKey && e.key.toLowerCase() === 'b') { e.preventDefault(); editorRef.current?.execCommand('bold') }
      if (e.ctrlKey && e.key.toLowerCase() === 'i') { e.preventDefault(); editorRef.current?.execCommand('italic') }
      if (e.ctrlKey && e.key.toLowerCase() === 'u') { e.preventDefault(); editorRef.current?.execCommand('underline') }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [current, collection, timeline, settings, letters, addToast])

  const updateCurrent = useCallback((patch: Partial<Letter>, record = false) => {
    setCurrent(prev => {
      const next = { ...prev, ...patch }
      if (record && patch.body !== undefined) {
        setHistory(h => {
          const nextH = [...h.slice(0, historyIndex + 1), patch.body!]
          setHistoryIndex(nextH.length - 1)
          return nextH
        })
      }
      return next
    })
    if (patch.title || patch.body || patch.recipient || patch.mood || patch.date) {
      setLetters(prev => prev.map(l => l.id === current.id ? { ...l, ...patch } : l))
    }
  }, [current.id, historyIndex])

  const undo = useCallback(() => {
    setHistoryIndex(prev => {
      if (prev <= 0) return prev
      const next = prev - 1
      setCurrent(c => ({ ...c, body: history[next] }))
      setLetters(ls => ls.map(l => l.id === current.id ? { ...l, body: history[next] } : l))
      return next
    })
  }, [history, current.id])

  const redo = useCallback(() => {
    setHistoryIndex(prev => {
      if (prev >= history.length - 1) return prev
      const next = prev + 1
      setCurrent(c => ({ ...c, body: history[next] }))
      setLetters(ls => ls.map(l => l.id === current.id ? { ...l, body: history[next] } : l))
      return next
    })
  }, [history, current.id])

  undoRef.current = undo
  redoRef.current = redo

  const loadLetter = useCallback((letter: Letter) => {
    setCurrent(letter)
    setCollection(letter.collection)
    setTimeline(letter.timeline)
    setHistory([letter.body])
    setHistoryIndex(0)
    addToast(`✓ Loaded "${letter.title.slice(0, 30)}..."`, 'info')
    window.scrollTo({ top: 100, behavior: 'smooth' })
  }, [addToast])

  const selectCollection = useCallback((name: string) => {
    const first = letters.find(l => l.collection === name && !l.archived)
    if (first) { loadLetter(first) } else { setCurrent({ ...allLetters[0], collection: name, body: '', title: 'Untitled Letter' }) }
    setCollection(name)
    setTimeline('2026')
    addToast(`✓ Collection: ${name}`, 'success')
  }, [letters, allLetters, loadLetter, addToast])

  const typeTextIntoEditor = useCallback((text: string) => {
    editorRef.current?.focus()
    if (typingTimer.current) clearTimeout(typingTimer.current)
    const chars = text.split('')
    let idx = 0
    const type = () => {
      if (idx < chars.length) {
        document.execCommand('insertText', false, chars[idx])
        idx++
        typingTimer.current = setTimeout(type, 8 + Math.random() * 12)
      }
    }
    type()
  }, [])

  const applyTemplate = useCallback((key: string) => {
    const t = AI_TEMPLATES[key]
    if (!t) return
    setEditMode(true)
    const next: Letter = { ...current, ...t }
    setCurrent(next)
    setLetters(prev => prev.map(l => l.id === current.id ? next : l))
    setHistory([t.body])
    setHistoryIndex(0)
    setTimeout(() => typeTextIntoEditor(t.body), 100)
    addToast(`✓ Applied ${key} template`, 'success')
  }, [current, addToast, typeTextIntoEditor])

  const handleTimelineSelect = useCallback((year: string) => {
    setTimeline(year)
    const l = letters.find(x => x.timeline === year) || allLetters.find(x => x.timeline === year)
    if (l) loadLetter(l)
    addToast(`✓ Timeline: ${year}`, 'info')
  }, [letters, allLetters, loadLetter, addToast])

  // Letter actions
  const duplicateLetter = useCallback((letter: Letter) => {
    const dup: Letter = { ...letter, id: `letter-${Date.now()}`, title: `${letter.title} (Copy)` }
    setLetters(prev => [...prev, dup])
    loadLetter(dup)
    addToast('✓ Letter Duplicated', 'success')
  }, [loadLetter, addToast])

  const deleteLetter = useCallback((id: string) => {
    setLetters(prev => prev.filter(l => l.id !== id))
    addToast('✓ Letter Deleted', 'success')
  }, [addToast])

  const favoriteLetter = useCallback((id: string) => {
    setLetters(prev => prev.map(l => l.id === id ? { ...l, favorited: !l.favorited } : l))
    setCurrent(prev => prev.id === id ? { ...prev, favorited: !prev.favorited } : prev)
    addToast('✓ Favorite Toggled', 'success')
  }, [addToast])

  const archiveLetter = useCallback((id: string) => {
    setLetters(prev => prev.map(l => l.id === id ? { ...l, archived: true } : l))
    addToast('✓ Letter Archived', 'success')
  }, [addToast])

  const shareLetter = useCallback((letter: Letter) => {
    if (navigator.share) {
      navigator.share({ title: letter.title, text: letter.body })
    } else {
      navigator.clipboard.writeText(`${letter.title}\n\n${letter.body}`)
      addToast('✓ Copied to Clipboard', 'success')
    }
  }, [addToast])

  const createNewLetter = useCallback(() => {
    const newLetter: Letter = {
      id: `letter-${Date.now()}`,
      collection,
      title: 'Untitled Letter',
      recipient: 'Dear You',
      body: '',
      mood: 'Calm ☁️',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      timeline: '2026',
    }
    setLetters(prev => [...prev, newLetter])
    loadLetter(newLetter)
    setEditMode(true)
    addToast('✓ New Letter Created', 'success')
  }, [collection, loadLetter, addToast])

  const filtered = useMemo(() =>
    letters.filter(l =>
      !l.archived &&
      (collection === 'All' || l.collection === collection) &&
      `${l.title} ${l.recipient} ${l.collection} ${l.mood} ${l.date}`.toLowerCase().includes(query.toLowerCase())
    ), [letters, collection, query])

  const letterCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const l of letters) { if (!l.archived) counts[l.collection] = (counts[l.collection] || 0) + 1 }
    return counts
  }, [letters])

  return (
    <main className="min-h-screen overflow-hidden text-white pb-10">
      <CosmicBackground />
      <FloatingDecorations />

      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="h-16 px-6 flex items-center justify-between border-b border-white/10 bg-[#100521]/55 backdrop-blur-xl sticky top-0 z-40"
      >
        <SearchBar value={query} onChange={setQuery} />
        <div className="flex items-center gap-3">
          <MusicPlayer enabled={settings.music} onToggle={() => setSettings(s => ({ ...s, music: !s.music }))} />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative rounded-full p-2.5 border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
          >
            <Bell className="w-4" />
            <i className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-pink-400" />
          </motion.button>
        </div>
      </motion.header>

      <div className="relative mx-auto max-w-[1600px] px-4 md:px-7">
        <section className="py-5 text-center">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 20 }}>
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl tracking-tight bg-gradient-to-r from-fuchsia-300 via-pink-200 to-violet-300 bg-clip-text text-transparent">
              💌 Letters &amp; Time Capsule
            </h1>
            <p className="mt-2 text-sm md:text-base text-violet-100/75">
              Write messages for the future. Preserve emotions that time can never erase.
            </p>
          </motion.div>
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-[280px_minmax(0,1fr)_285px] gap-5 items-start">
          <LetterCollections activeCollection={collection} onSelect={selectCollection} letterCounts={letterCounts} />

          <div className="space-y-4 min-w-0">
            {/* Editor */}
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 25 }}
              className="rounded-[24px] p-4 md:p-5"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,.09), rgba(32,12,68,.62) 44%, rgba(14,5,35,.72))',
                border: '1px solid rgba(237,184,255,.17)',
                boxShadow: '0 18px 48px rgba(0,0,0,.32), inset 0 1px rgba(255,255,255,.13), 0 0 32px rgba(210,87,255,.11)',
                backdropFilter: 'blur(26px) saturate(145%)',
              }}
            >
              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <label className="min-w-[150px] flex-[1.4] rounded-xl border border-white/10 bg-black/10 px-3 py-1.5 focus-within:border-pink-300/30 transition-colors">
                  <span className="block text-[9px] text-white/40">Letter Title</span>
                  <input value={current.title} onChange={e => updateCurrent({ title: e.target.value })} className="w-full bg-transparent text-xs text-white outline-none" disabled={!editMode} />
                </label>
                <label className="min-w-[120px] flex-1 rounded-xl border border-white/10 bg-black/10 px-3 py-1.5 focus-within:border-pink-300/30 transition-colors">
                  <span className="block text-[9px] text-white/40">To</span>
                  <input value={current.recipient} onChange={e => updateCurrent({ recipient: e.target.value })} className="w-full bg-transparent text-xs text-white outline-none" disabled={!editMode} />
                </label>
                <label className="min-w-[125px] flex-1 rounded-xl border border-white/10 bg-black/10 px-3 py-1.5 focus-within:border-pink-300/30 transition-colors">
                  <span className="block text-[9px] text-white/40">Date</span>
                  <input type="date" value={new Date(current.date).toISOString().slice(0, 10)} onChange={e => updateCurrent({ date: new Date(e.target.value).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) })} className="w-full bg-transparent text-xs text-white outline-none [color-scheme:dark]" disabled={!editMode} />
                </label>
                <div className="relative min-w-[125px] flex-1">
                  <button onClick={() => setMoodOpen(!moodOpen)} className="w-full rounded-xl border border-white/10 bg-black/10 px-3 py-2.5 text-left text-xs text-white hover:border-pink-300/30 transition-colors flex items-center justify-between">
                    <span>{current.mood}</span>
                    <motion.div animate={{ rotate: moodOpen ? 180 : 0 }}><ChevronDown className="w-4" /></motion.div>
                  </button>
                  <AnimatePresence>
                    {moodOpen && (
                      <motion.div initial={{ opacity: 0, y: -6, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: 0.95 }} className="absolute z-30 mt-1 w-full rounded-xl border border-white/15 bg-[#261043] p-1 shadow-2xl">
                        {MOODS.map(m => (
                          <motion.button key={m} whileHover={{ x: 2, backgroundColor: 'rgba(255,255,255,0.1)' }} onClick={() => { updateCurrent({ mood: m }); setMoodOpen(false); addToast(`✓ Mood: ${m}`, 'success') }} className={`w-full text-left rounded-lg px-3 py-2 text-xs transition-colors ${current.mood === m ? 'bg-fuchsia-500/30 text-white' : 'text-white/65'}`}>{m}</motion.button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Save Status */}
              <div className="flex items-center gap-2 mb-2">
                <AnimatePresence mode="wait">
                  {saveStatus === 'saving' && (
                    <motion.span key="saving" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-[10px] text-amber-300 flex items-center gap-1">
                      <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1, repeat: Infinity }} className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400" />Saving...
                    </motion.span>
                  )}
                  {saveStatus === 'saved' && (
                    <motion.span key="saved" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-[10px] text-emerald-300">✓ Saved</motion.span>
                  )}
                </AnimatePresence>
              </div>

              {/* Toolbar */}
              <AnimatePresence>
                {editMode && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                    <LetterToolbar
                      onExec={(cmd, val) => editorRef.current?.execCommand(cmd, val)}
                      onUndo={undo}
                      onRedo={redo}
                      canUndo={historyIndex > 0}
                      canRedo={historyIndex < history.length - 1}
                      editMode={editMode}
                      onToggleEditMode={() => setEditMode(!editMode)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Paper */}
              <div className="mt-3">
                <LetterEditor
                  ref={editorRef}
                  body={current.body}
                  mood={current.mood}
                  editMode={editMode}
                  onBodyChange={(text) => updateCurrent({ body: text }, true)}
                />
              </div>
            </motion.section>

            <AIAssistant onApply={applyTemplate} />
            <Timeline activeTimeline={timeline} onSelect={handleTimelineSelect} allLetters={allLetters} />
          </div>

          <TimeCapsulePanel settings={settings} onUpdate={setSettings} />
        </section>

        {/* Saved Letters */}
        <section className="mt-5 rounded-[24px] p-4" style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,.09), rgba(32,12,68,.62) 44%, rgba(14,5,35,.72))',
          border: '1px solid rgba(237,184,255,.17)',
          boxShadow: '0 18px 48px rgba(0,0,0,.32), inset 0 1px rgba(255,255,255,.13)',
          backdropFilter: 'blur(26px)',
        }}>
          <div className="flex items-end gap-3 mb-4">
            <h2 className="font-serif text-xl">✨ Your Saved Letters</h2>
            <span className="text-xs text-white/50">{filtered.length} treasured emotions preserved forever.</span>
          </div>

          {filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="py-16 text-center">
              <motion.div animate={{ y: [0, -12, 0], rotate: [-5, 5, -5] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} className="text-6xl mb-4">💌</motion.div>
              <p className="font-serif italic text-lg text-pink-200/80 mb-2">Every unforgettable story begins with a single letter.</p>
              <p className="text-xs text-white/40 mb-6">No letters in this collection yet.</p>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={createNewLetter}
                className="rounded-xl border border-fuchsia-300/30 bg-gradient-to-r from-fuchsia-500/25 to-violet-500/25 px-6 py-3 text-sm text-white font-medium shadow-[0_0_16px_rgba(232,84,255,.2)] hover:shadow-[0_0_24px_rgba(232,84,255,.35)] transition-shadow"
              >
                ✨ Write First Letter
              </motion.button>
            </motion.div>
          ) : (
            <SavedLettersCarousel
              letters={filtered}
              activeId={current.id}
              onSelect={loadLetter}
              onPreview={setPreviewLetter}
            />
          )}
        </section>
      </div>

      <LetterPreviewModal
        letter={previewLetter}
        onClose={() => setPreviewLetter(null)}
        onEdit={(l) => { loadLetter(l); setEditMode(true) }}
        onDuplicate={duplicateLetter}
        onDelete={deleteLetter}
        onFavorite={favoriteLetter}
        onArchive={archiveLetter}
        onShare={shareLetter}
      />
    </main>
  )
}

export default function LettersPage() {
  return (
    <ToastProvider>
      <LettersContent />
    </ToastProvider>
  )
}
