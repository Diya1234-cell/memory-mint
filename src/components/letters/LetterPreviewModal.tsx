'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Pencil, Copy, Archive, Trash2, Heart, Share2 } from 'lucide-react'
import { Letter } from './types'

interface Props {
  letter: Letter | null
  onClose: () => void
  onEdit: (letter: Letter) => void
  onDuplicate: (letter: Letter) => void
  onDelete: (id: string) => void
  onFavorite: (id: string) => void
  onArchive: (id: string) => void
  onShare: (letter: Letter) => void
}

const glass = {
  background: 'linear-gradient(135deg, rgba(255,255,255,.09), rgba(32,12,68,.62) 44%, rgba(14,5,35,.72))',
  border: '1px solid rgba(237,184,255,.17)',
  boxShadow: '0 18px 48px rgba(0,0,0,.32), inset 0 1px rgba(255,255,255,.13), 0 0 32px rgba(210,87,255,.11)',
  backdropFilter: 'blur(26px) saturate(145%)',
}

export default function LetterPreviewModal({ letter, onClose, onEdit, onDuplicate, onDelete, onFavorite, onArchive, onShare }: Props) {
  if (!letter) return null

  const actions = [
    { icon: Pencil, label: 'Edit', onClick: () => { onEdit(letter); onClose() }, color: 'text-amber-300 hover:bg-amber-400/15' },
    { icon: Copy, label: 'Duplicate', onClick: () => { onDuplicate(letter); onClose() }, color: 'text-sky-300 hover:bg-sky-400/15' },
    { icon: Heart, label: 'Favorite', onClick: () => onFavorite(letter.id), color: letter.favorited ? 'text-pink-400 bg-pink-400/15' : 'text-pink-300 hover:bg-pink-400/15' },
    { icon: Share2, label: 'Share', onClick: () => onShare(letter), color: 'text-violet-300 hover:bg-violet-400/15' },
    { icon: Archive, label: 'Archive', onClick: () => { onArchive(letter.id); onClose() }, color: 'text-orange-300 hover:bg-orange-400/15' },
    { icon: Trash2, label: 'Delete', onClick: () => { onDelete(letter.id); onClose() }, color: 'text-red-400 hover:bg-red-400/15' },
  ]

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 40 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          onClick={e => e.stopPropagation()}
          className="relative w-full max-w-lg rounded-[24px] overflow-hidden"
          style={glass}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
            <div>
              <h3 className="font-serif text-lg text-white">{letter.title}</h3>
              <p className="text-[11px] text-white/50">To {letter.recipient} · {letter.date} · {letter.mood}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 transition-colors"
            >
              <X className="w-4" />
            </motion.button>
          </div>

          {/* Paper */}
          <div className="p-5">
            <div
              className="relative overflow-hidden rounded-xl border border-amber-100/35 px-8 py-8 min-h-[260px]"
              style={{
                background: 'radial-gradient(circle at 20% 15%, rgba(255,255,255,.45), transparent 28%), linear-gradient(120deg,#eac3b6,#f7ddd5 46%,#dcb4ac)',
                boxShadow: 'inset 0 0 28px rgba(102,50,35,.22)',
              }}
            >
              <div className="absolute inset-y-0 left-0 w-5 bg-gradient-to-r from-[#4d201d] via-[#b98258] to-transparent" />
              <span className="absolute right-6 bottom-0 text-7xl opacity-55 rotate-[20deg] select-none">🪶</span>
              <p className="relative z-10 whitespace-pre-wrap font-serif text-[17px] leading-7 text-[#26142b]">
                {letter.body}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 px-5 pb-5">
            {actions.map(({ icon: Icon, label, onClick, color }, i) => (
              <motion.button
                key={label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ y: -2, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClick}
                className={`flex items-center gap-1.5 rounded-xl border border-white/10 px-3 py-2 text-xs transition-colors ${color}`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
