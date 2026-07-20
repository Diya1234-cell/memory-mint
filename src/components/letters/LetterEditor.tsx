'use client'

import { useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from 'react'
import { motion } from 'framer-motion'

interface Props {
  body: string
  mood: string
  editMode: boolean
  onBodyChange: (text: string) => void
}

export interface LetterEditorHandle {
  execCommand: (cmd: string, val?: string) => void
  focus: () => void
}

const LetterEditor = forwardRef<LetterEditorHandle, Props>(({ body, mood, editMode, onBodyChange }, ref) => {
  const editorRef = useRef<HTMLDivElement>(null)
  const isUpdating = useRef(false)

  useImperativeHandle(ref, () => ({
    execCommand: (cmd: string, val?: string) => {
      editorRef.current?.focus()
      document.execCommand(cmd, false, val)
    },
    focus: () => editorRef.current?.focus(),
  }))

  useEffect(() => {
    if (editorRef.current && !isUpdating.current) {
      isUpdating.current = true
      editorRef.current.innerText = body
      requestAnimationFrame(() => { isUpdating.current = false })
    }
  }, [body])

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      const text = editorRef.current.innerText
      isUpdating.current = true
      onBodyChange(text)
      requestAnimationFrame(() => { isUpdating.current = false })
    }
  }, [onBodyChange])

  const romanticShadow = mood.includes('Romantic') ? 'rgba(255,75,175,.25)' : 'rgba(0,0,0,.25)'

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="relative overflow-hidden rounded-xl border border-amber-100/35 px-8 py-8 md:px-10 min-h-[310px]"
      style={{
        background: 'radial-gradient(circle at 20% 15%, rgba(255,255,255,.45), transparent 28%), linear-gradient(120deg,#eac3b6,#f7ddd5 46%,#dcb4ac)',
        boxShadow: `inset 0 0 28px rgba(102,50,35,.22), 0 15px 30px ${romanticShadow}`,
      }}
    >
      <div className="absolute inset-y-0 left-0 w-5 bg-gradient-to-r from-[#4d201d] via-[#b98258] to-transparent" />
      <span className="absolute right-6 bottom-0 text-7xl opacity-55 rotate-[20deg] select-none">🪶</span>

      <motion.div
        ref={editorRef}
        contentEditable={editMode}
        suppressContentEditableWarning
        onInput={handleInput}
        className={`relative z-10 min-h-[220px] whitespace-pre-wrap font-serif text-[17px] leading-7 text-[#26142b] outline-none transition-all duration-300 ${
          editMode ? 'cursor-text' : 'cursor-default select-text'
        }`}
        style={{ caretColor: editMode ? '#a855f7' : 'transparent' }}
        animate={editMode ? { boxShadow: 'inset 0 0 0 2px rgba(168,85,247,0.15)' } : { boxShadow: 'inset 0 0 0 0px transparent' }}
      />

      {!editMode && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-3 right-3 z-20 px-2 py-1 rounded-lg bg-[#4d201d]/20 text-[10px] text-[#75484a] font-sans"
        >
          📖 Read Only
        </motion.div>
      )}
    </motion.div>
  )
})

LetterEditor.displayName = 'LetterEditor'
export default LetterEditor
