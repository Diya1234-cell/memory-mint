'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Save, Trash2, Plus, Sparkles } from 'lucide-react'
import { useMemory } from '@/context/MemoryContext'
<<<<<<< HEAD
import { useStoryBook } from '@/context/StoryBookContext'
import { useAuth } from '@/providers/AuthProvider'
import { useSpaceData } from '@/hooks/useSpaceData'
=======
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth'
import { uploadImage, uploadVideo } from '@/services/storageService'
>>>>>>> 1795348 (Integrate Firebase auth and fix createSpace service)
import { addMemory } from '@/services/firestoreService'
import { MemoryType } from '@/types/enums'

interface Toast {
  id: number
  message: string
  icon: string
}

export default function BottomActionBar() {
  const { draft, saveDraft, resetDraft, triggerSaveMemory, draftSaved } = useMemory()
<<<<<<< HEAD
  const { addChapter } = useStoryBook()
  const { user } = useAuth()
  const { spaceData } = useSpaceData()
=======
  const { user } = useFirebaseAuth()
>>>>>>> 1795348 (Integrate Firebase auth and fix createSpace service)
  const [showDiscard, setShowDiscard] = useState(false)
  const [showAddAnother, setShowAddAnother] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, icon: string) => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, icon }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 2800)
  }, [])

  const handleSaveDraft = useCallback(() => {
    saveDraft()
    showToast('Draft Saved', '✨')
  }, [saveDraft, showToast])

  const handleDiscard = useCallback(() => {
    resetDraft()
    setShowDiscard(false)
    showToast('Memory Reset', '🔄')
  }, [resetDraft, showToast])

  const handleAddAnother = useCallback(() => {
    resetDraft()
    setShowAddAnother(false)
    showToast('Ready for New Memory', '✨')
  }, [resetDraft, showToast])

  const handleSaveMemory = useCallback(async () => {
<<<<<<< HEAD
    if (!user || !spaceData.spaceId) {
      showToast('Create a universe before saving a memory', 'âš ï¸')
      return
    }

    const typeMap: Record<typeof draft.selectedMemoryType, MemoryType> = {
=======
    if (!user) {
      showToast('Please sign in to save memories', '⚠️')
      return
    }

    if (!draft.uploadedFileName) {
      showToast('Please upload a file first', '⚠️')
      return
    }

    const fileInput = document.querySelector<HTMLInputElement>('input[type="file"]')
    const file = fileInput?.files?.[0]
    if (!file) {
      showToast('File not found. Please re-upload.', '⚠️')
      return
    }

    const isImage = file.type.startsWith('image/')
    const isVideo = file.type.startsWith('video/')

    const uploadResult = isImage
      ? await uploadImage(file, user.uid)
      : isVideo
      ? await uploadVideo(file, user.uid)
      : null

    if (!uploadResult?.success) {
      showToast('Failed to upload file. Please try again.', '❌')
      return
    }

    const memoryTypeMap: Record<string, MemoryType> = {
>>>>>>> 1795348 (Integrate Firebase auth and fix createSpace service)
      photos: MemoryType.PHOTO,
      videos: MemoryType.VIDEO,
      voice: MemoryType.AUDIO,
      journal: MemoryType.JOURNAL,
      location: MemoryType.NOTE,
    }
<<<<<<< HEAD
    const result = await addMemory({
      spaceId: spaceData.spaceId,
      ownerId: user.uid,
      type: typeMap[draft.selectedMemoryType],
      title: draft.title || 'Untitled Memory',
      description: draft.description || undefined,
      mediaUrl: draft.mediaUrl || undefined,
      metadata: {
        date: draft.date,
        location: draft.location,
        people: draft.people,
        category: draft.category,
        tags: draft.tags,
        visibility: draft.visibility,
        favorite: draft.favorite,
        uploadedFileName: draft.uploadedFileName,
      },
    })
    if (!result.success) {
      showToast('Unable to save memory to the database', 'âš ï¸')
      return
    }

    addChapter({
      title: draft.title,
      description: draft.description,
      memoryType: draft.selectedMemoryType,
      uploadedFileName: draft.uploadedFileName,
      date: draft.date,
      location: draft.location,
      mood: draft.mood,
      weather: draft.weather,
      people: draft.people,
      category: draft.category,
      tags: draft.tags,
      visibility: draft.visibility,
      favorite: draft.favorite,
=======

    const result = await addMemory({
      spaceId: user.uid,
      ownerId: user.uid,
      title: draft.title || 'Untitled Memory',
      description: draft.description || undefined,
      type: memoryTypeMap[draft.selectedMemoryType] ?? MemoryType.NOTE,
      mediaUrl: uploadResult.url,
      updatedAt: undefined,
      metadata: {
        fileName: draft.uploadedFileName,
        date: draft.date || undefined,
        location: draft.location || undefined,
        mood: draft.mood ?? undefined,
        weather: draft.weather ?? undefined,
        people: draft.people.length > 0 ? draft.people : undefined,
        category: draft.category || undefined,
        tags: draft.tags.length > 0 ? draft.tags : undefined,
        visibility: draft.visibility,
        favorite: draft.favorite,
        relationship: draft.relationship || undefined,
      },
>>>>>>> 1795348 (Integrate Firebase auth and fix createSpace service)
    })

    if (!result.success) {
      showToast('Failed to save memory. Please try again.', '❌')
      return
    }

    triggerSaveMemory()
<<<<<<< HEAD
    showToast('Memory Saved to StoryBook ✨', '📖')
  }, [draft, addChapter, triggerSaveMemory, showToast, spaceData.spaceId, user])
=======
    showToast('Memory saved to the stars ✨', '🌟')
  }, [user, draft, triggerSaveMemory, showToast])
>>>>>>> 1795348 (Integrate Firebase auth and fix createSpace service)

  return (
    <>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 pb-8">
        {/* Save Draft */}
        <motion.button
          onClick={handleSaveDraft}
          className="relative px-5 py-2.5 rounded-full text-xs font-semibold text-gray-300 bg-white/5 border border-white/[0.06] backdrop-blur-md overflow-hidden group shadow-[0_2px_8px_rgba(0,0,0,0.2)]"
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 300, damping: 18 }}
        >
          <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-400"
            style={{ background: 'radial-gradient(circle at center, rgba(255,255,255,0.05) 0%, transparent 70%)' }}
          />
          <span className="relative z-10 flex items-center gap-2">
            <Save className="w-3.5 h-3.5" />
            {draftSaved ? 'Saved!' : 'Save Draft'}
          </span>
        </motion.button>

        {/* Discard */}
        <motion.button
          onClick={() => setShowDiscard(true)}
          className="relative px-5 py-2.5 rounded-full text-xs font-semibold text-rose-400 bg-rose-500/5 border border-rose-500/15 backdrop-blur-md overflow-hidden group shadow-[0_2px_8px_rgba(0,0,0,0.2)]"
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 300, damping: 18 }}
        >
          <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-400"
            style={{ background: 'radial-gradient(circle at center, rgba(244,63,94,0.08) 0%, transparent 70%)' }}
          />
          <span className="relative z-10 flex items-center gap-2">
            <Trash2 className="w-3.5 h-3.5" />
            Discard
          </span>
        </motion.button>

        {/* Add Another */}
        <motion.button
          onClick={() => setShowAddAnother(true)}
          className="relative px-5 py-2.5 rounded-full text-xs font-semibold text-gray-300 bg-white/5 border border-white/[0.06] backdrop-blur-md overflow-hidden group shadow-[0_2px_8px_rgba(0,0,0,0.2)]"
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 300, damping: 18 }}
        >
          <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-400"
            style={{ background: 'radial-gradient(circle at center, rgba(255,255,255,0.05) 0%, transparent 70%)' }}
          />
          <span className="relative z-10 flex items-center gap-2">
            <Plus className="w-3.5 h-3.5" />
            Add Another
          </span>
        </motion.button>

        {/* Save Memory */}
        <motion.button
          onClick={handleSaveMemory}
          className="relative px-7 py-2.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-neonPink to-neonPurple shadow-[0_4px_20px_rgba(255,75,145,0.45),0_0_40px_rgba(168,85,247,0.15),inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-md overflow-hidden group"
          whileHover={{ scale: 1.03, y: -2, boxShadow: '0 8px 40px rgba(255,75,145,0.6), 0 0 60px rgba(168,85,247,0.25), inset 0 1px 0 rgba(255,255,255,0.15)' }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 300, damping: 18 }}
        >
          <motion.div
            className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-400"
            style={{ background: 'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%)' }}
          />
          <span className="relative z-10 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            Save Memory
          </span>
        </motion.button>
      </div>

      {/* ─── Discard Modal ─── */}
      <AnimatePresence>
        {showDiscard && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div className="absolute inset-0 bg-black/15 backdrop-blur-sm" onClick={() => setShowDiscard(false)} />
            <motion.div
              className="relative w-full max-w-sm rounded-3xl border border-white/10 p-7 shadow-2xl shadow-black/30"
              style={{ background: 'rgba(255,255,255,0.035)', backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)' }}
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-rose-400" />
                </div>
                <h3 className="text-base font-bold text-white">Discard Changes?</h3>
                <p className="text-sm text-gray-400">This will clear everything you&apos;ve entered.</p>
              </div>
              <div className="flex gap-3 mt-6">
                <motion.button
                  onClick={() => setShowDiscard(false)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-gray-300 bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={handleDiscard}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white bg-rose-500/20 border border-rose-500/30 hover:bg-rose-500/30 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Discard
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Add Another Modal ─── */}
      <AnimatePresence>
        {showAddAnother && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div className="absolute inset-0 bg-black/15 backdrop-blur-sm" onClick={() => setShowAddAnother(false)} />
            <motion.div
              className="relative w-full max-w-sm rounded-3xl border border-white/10 p-7 shadow-2xl shadow-black/30"
              style={{ background: 'rgba(255,255,255,0.035)', backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)' }}
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-neonPink/10 border border-neonPink/20 flex items-center justify-center">
                  <Plus className="w-5 h-5 text-neonPink" />
                </div>
                <h3 className="text-base font-bold text-white">Create Another Memory?</h3>
                <p className="text-sm text-gray-400">
                  Your current memory will be cleared so you can start a new one.
                </p>
              </div>
              <div className="flex gap-3 mt-6">
                <motion.button
                  onClick={() => setShowAddAnother(false)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-gray-300 bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Continue Editing
                </motion.button>
                <motion.button
                  onClick={handleAddAnother}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-neonPink/30 to-neonPurple/30 border border-neonPink/30 hover:from-neonPink/40 hover:to-neonPurple/40 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Create Another
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Toasts ─── */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="px-5 py-2.5 rounded-full text-xs font-semibold text-white border border-white/08 shadow-xl shadow-black/20"
              style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)' }}
            >
              <span className="flex items-center gap-2">
                <span>{toast.icon}</span>
                {toast.message}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  )
}
