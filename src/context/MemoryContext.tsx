'use client'

import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react'

export interface MemoryDraft {
  title: string
  description: string
  selectedMemoryType: 'photos' | 'videos' | 'voice' | 'journal' | 'location'
  uploadedFileName: string | null
  mediaUrl: string | null
  storybookChapterId: string | null
  date: string
  location: string
  mood: number | null
  weather: number | null
  people: string[]
  category: string
  tags: string[]
  visibility: 'Private' | 'Shared' | 'Public'
  favorite: boolean
  relationship: string
}

const defaultDraft: MemoryDraft = {
  title: '',
  description: '',
  selectedMemoryType: 'photos',
  uploadedFileName: null,
  mediaUrl: null,
  storybookChapterId: null,
  date: '',
  location: '',
  mood: null,
  weather: null,
  people: ['You', 'Rahul', 'Aanya'],
  category: '',
  tags: [],
  visibility: 'Private',
  favorite: false,
  relationship: '',
}

interface MemoryContextType {
  draft: MemoryDraft
  triggerSave: number
  draftSaved: boolean
  showSuccessModal: boolean
  setField: <K extends keyof MemoryDraft>(key: K, value: MemoryDraft[K]) => void
  resetDraft: () => void
  saveDraft: () => void
  triggerSaveMemory: () => void
  dismissSuccessModal: () => void
  setDraftSaved: (v: boolean) => void
}

const MemoryContext = createContext<MemoryContextType | null>(null)

export function MemoryProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<MemoryDraft>(defaultDraft)
  const [triggerSave, setTriggerSave] = useState(0)
  const [draftSaved, setDraftSaved] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const setField = useCallback(<K extends keyof MemoryDraft>(key: K, value: MemoryDraft[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }))
  }, [])

  const resetDraft = useCallback(() => {
    setDraft(defaultDraft)
  }, [])

  const saveDraft = useCallback(() => {
    setDraftSaved(true)
    setTimeout(() => setDraftSaved(false), 2000)
  }, [])

  const triggerSaveMemory = useCallback(() => {
    setTriggerSave((p) => p + 1)
    setTimeout(() => setShowSuccessModal(true), 4500)
  }, [])

  const dismissSuccessModal = useCallback(() => {
    setShowSuccessModal(false)
  }, [])

  const value = useMemo(
    () => ({
      draft,
      triggerSave,
      draftSaved,
      showSuccessModal,
      setField,
      resetDraft,
      saveDraft,
      triggerSaveMemory,
      dismissSuccessModal,
      setDraftSaved,
    }),
    [draft, triggerSave, draftSaved, showSuccessModal, setField, resetDraft, saveDraft, triggerSaveMemory, dismissSuccessModal],
  )

  return <MemoryContext.Provider value={value}>{children}</MemoryContext.Provider>
}

export function useMemory() {
  const ctx = useContext(MemoryContext)
  if (!ctx) throw new Error('useMemory must be used within MemoryProvider')
  return ctx
}
