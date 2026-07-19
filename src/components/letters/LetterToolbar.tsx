'use client'

import { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Quote, Heading1, Heading2, Image, Smile, Link2, Minus, Undo2, Redo2,
  Type, Palette, Highlighter, Pencil, Eye,
} from 'lucide-react'
import { EMOJIS } from './types'
import ToolbarPopup from './ToolbarPopup'

interface Props {
  onExec: (cmd: string, val?: string) => void
  onUndo: () => void
  onRedo: () => void
  canUndo: boolean
  canRedo: boolean
  editMode: boolean
  onToggleEditMode: () => void
}

export default function LetterToolbar({ onExec, onUndo, onRedo, canUndo, canRedo, editMode, onToggleEditMode }: Props) {
  const [emojiOpen, setEmojiOpen] = useState(false)
  const [colorOpen, setColorOpen] = useState(false)
  const [highlightOpen, setHighlightOpen] = useState(false)
  const [fontSizeOpen, setFontSizeOpen] = useState(false)
  const [linkOpen, setLinkOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [linkTitle, setLinkTitle] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const colorBtnRef = useRef<HTMLDivElement>(null)
  const highlightBtnRef = useRef<HTMLDivElement>(null)
  const fontSizeBtnRef = useRef<HTMLDivElement>(null)
  const emojiBtnRef = useRef<HTMLDivElement>(null)
  const linkBtnRef = useRef<HTMLDivElement>(null)

  const colors = ['#26142b', '#ff4b91', '#a855f7', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ffffff']
  const highlights = ['#fef08a', '#bbf7d0', '#bfdbfe', '#fbcfe8', '#fde68a', '#e9d5ff', '#fecaca', '#d1fae5']
  const fontSizes = ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px']

  const closeAll = useCallback(() => {
    setEmojiOpen(false); setColorOpen(false); setHighlightOpen(false); setFontSizeOpen(false); setLinkOpen(false)
  }, [])

  const handleImagePick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleImageFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const img = `<img src="${reader.result}" alt="${file.name}" style="max-width:100%;border-radius:8px;margin:8px 0;" />`
      onExec('insertHTML', img)
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }, [onExec])

  const handleInsertLink = useCallback(() => {
    if (linkUrl) {
      const html = linkTitle
        ? `<a href="${linkUrl}" target="_blank" style="color:#a855f7;text-decoration:underline;">${linkTitle}</a>`
        : `<a href="${linkUrl}" target="_blank" style="color:#a855f7;text-decoration:underline;">${linkUrl}</a>`
      onExec('insertHTML', html)
      setLinkUrl('')
      setLinkTitle('')
      setLinkOpen(false)
    }
  }, [linkUrl, linkTitle, onExec])

  const ToolBtn = ({ icon: Icon, onClick, disabled, title, active }: { icon: React.ComponentType<{className?: string}>; onClick: () => void; disabled?: boolean; title?: string; active?: boolean }) => (
    <motion.button
      whileHover={{ scale: 1.15, y: -1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-1.5 rounded-lg transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed ${
        active ? 'bg-pink-500/30 text-pink-200 shadow-[0_0_8px_rgba(245,70,202,.3)]' : 'hover:bg-white/15 text-[#56344d] hover:text-[#26142b]'
      }`}
    >
      <Icon className="w-3.5 h-3.5" />
    </motion.button>
  )

  const Divider = () => <div className="w-px h-5 bg-[#75484a]/20 mx-0.5" />

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative z-10 flex flex-wrap items-center gap-1 border-t border-[#75484a]/20 pt-3 text-[10px] text-[#56344d]"
    >
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageFile} />

      <ToolBtn icon={Undo2} onClick={onUndo} disabled={!canUndo} title="Undo (Ctrl+Z)" />
      <ToolBtn icon={Redo2} onClick={onRedo} disabled={!canRedo} title="Redo (Ctrl+Shift+Z)" />
      <Divider />
      <ToolBtn icon={Bold} onClick={() => onExec('bold')} title="Bold (Ctrl+B)" />
      <ToolBtn icon={Italic} onClick={() => onExec('italic')} title="Italic (Ctrl+I)" />
      <ToolBtn icon={Underline} onClick={() => onExec('underline')} title="Underline (Ctrl+U)" />
      <ToolBtn icon={Strikethrough} onClick={() => onExec('strikeThrough')} title="Strikethrough" />
      <Divider />
      <ToolBtn icon={Heading1} onClick={() => onExec('formatBlock', 'h1')} title="Heading 1" />
      <ToolBtn icon={Heading2} onClick={() => onExec('formatBlock', 'h2')} title="Heading 2" />
      <ToolBtn icon={Quote} onClick={() => onExec('formatBlock', 'blockquote')} title="Quote" />
      <Divider />

      {/* Text Color */}
      <div ref={colorBtnRef}>
        <ToolBtn icon={Palette} onClick={() => { closeAll(); setColorOpen(!colorOpen) }} title="Text Color" />
      </div>
      <ToolbarPopup open={colorOpen} onClose={() => setColorOpen(false)} anchorRef={colorBtnRef} width={128} align="left">
        <div className="flex gap-1.5 flex-wrap">
          {colors.map(c => (
            <motion.button key={c} whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} onClick={() => { onExec('foreColor', c); setColorOpen(false) }} className="w-6 h-6 rounded-full border border-white/20 shadow-sm" style={{ background: c }} />
          ))}
        </div>
      </ToolbarPopup>

      {/* Highlight Color */}
      <div ref={highlightBtnRef}>
        <ToolBtn icon={Highlighter} onClick={() => { closeAll(); setHighlightOpen(!highlightOpen) }} title="Highlight" />
      </div>
      <ToolbarPopup open={highlightOpen} onClose={() => setHighlightOpen(false)} anchorRef={highlightBtnRef} width={128} align="left">
        <div className="flex gap-1.5 flex-wrap">
          {highlights.map(c => (
            <motion.button key={c} whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} onClick={() => { onExec('hiliteColor', c); setHighlightOpen(false) }} className="w-6 h-6 rounded-full border border-white/20 shadow-sm" style={{ background: c }} />
          ))}
        </div>
      </ToolbarPopup>

      <Divider />
      <ToolBtn icon={AlignLeft} onClick={() => onExec('justifyLeft')} title="Align Left" />
      <ToolBtn icon={AlignCenter} onClick={() => onExec('justifyCenter')} title="Align Center" />
      <ToolBtn icon={AlignRight} onClick={() => onExec('justifyRight')} title="Align Right" />
      <ToolBtn icon={AlignJustify} onClick={() => onExec('justifyFull')} title="Justify" />
      <Divider />
      <ToolBtn icon={List} onClick={() => onExec('insertUnorderedList')} title="Bullet List" />
      <ToolBtn icon={ListOrdered} onClick={() => onExec('insertOrderedList')} title="Numbered List" />
      <Divider />

      {/* Font Size */}
      <div ref={fontSizeBtnRef}>
        <ToolBtn icon={Type} onClick={() => { closeAll(); setFontSizeOpen(!fontSizeOpen) }} title="Font Size" />
      </div>
      <ToolbarPopup open={fontSizeOpen} onClose={() => setFontSizeOpen(false)} anchorRef={fontSizeBtnRef} width={108} align="left">
        <div>
          {fontSizes.map(s => (
            <motion.button key={s} whileHover={{ x: 2 }} onClick={() => { onExec('fontSize', String(fontSizes.indexOf(s) + 1)); setFontSizeOpen(false) }} className="block w-full px-3 py-1 text-left text-xs text-white/80 hover:bg-white/10 rounded-lg">
              {s}
            </motion.button>
          ))}
        </div>
      </ToolbarPopup>

      <Divider />
      <ToolBtn icon={Image} onClick={handleImagePick} title="Insert Image" />

      {/* Emoji */}
      <div ref={emojiBtnRef}>
        <ToolBtn icon={Smile} onClick={() => { closeAll(); setEmojiOpen(!emojiOpen) }} title="Emoji" />
      </div>
      <ToolbarPopup open={emojiOpen} onClose={() => setEmojiOpen(false)} anchorRef={emojiBtnRef} width={248} align="left">
        <div className="grid grid-cols-8 gap-1">
          {EMOJIS.map(e => (
            <motion.button key={e} whileHover={{ scale: 1.3 }} whileTap={{ scale: 0.85 }} onClick={() => { onExec('insertText', e); setEmojiOpen(false) }} className="text-base p-0.5 hover:bg-white/10 rounded">
              {e}
            </motion.button>
          ))}
        </div>
      </ToolbarPopup>

      {/* Link */}
      <div ref={linkBtnRef}>
        <ToolBtn icon={Link2} onClick={() => { closeAll(); setLinkOpen(!linkOpen) }} title="Insert Link" />
      </div>
      <ToolbarPopup open={linkOpen} onClose={() => { setLinkOpen(false); setLinkUrl(''); setLinkTitle('') }} anchorRef={linkBtnRef} width={228} align="left">
        <div className="space-y-2">
          <input value={linkTitle} onChange={e => setLinkTitle(e.target.value)} placeholder="Link text (optional)" className="w-full rounded-lg bg-black/30 border border-white/10 px-3 py-1.5 text-xs text-white outline-none placeholder:text-white/30" />
          <input value={linkUrl} onChange={e => setLinkUrl(e.target.value)} placeholder="https://..." className="w-full rounded-lg bg-black/30 border border-white/10 px-3 py-1.5 text-xs text-white outline-none placeholder:text-white/30" />
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleInsertLink} className="w-full rounded-lg bg-fuchsia-500/30 border border-fuchsia-300/30 px-3 py-1.5 text-xs text-white font-medium hover:bg-fuchsia-500/40 transition-colors">
            Insert Link
          </motion.button>
        </div>
      </ToolbarPopup>

      <ToolBtn icon={Minus} onClick={() => onExec('insertHorizontalRule')} title="Divider" />

      <Divider />

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onToggleEditMode}
        className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[10px] font-medium border transition-all duration-300 ${
          editMode
            ? 'border-emerald-400/30 bg-emerald-500/15 text-emerald-700'
            : 'border-amber-400/30 bg-amber-500/15 text-amber-700'
        }`}
      >
        {editMode ? <><Pencil className="w-3 h-3" /> Edit</> : <><Eye className="w-3 h-3" /> View</>}
      </motion.button>
    </motion.div>
  )
}
