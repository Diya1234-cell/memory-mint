'use client'

import { useRef, useEffect, useState, useCallback, useLayoutEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'

interface Props {
  open: boolean
  onClose: () => void
  anchorRef: React.RefObject<HTMLElement | null>
  children: React.ReactNode
  width?: number
  align?: 'left' | 'right' | 'center'
  side?: 'bottom' | 'top'
}

export default function ToolbarPopup({ open, onClose, anchorRef, children, width = 200, align = 'left', side = 'bottom' }: Props) {
  const popupRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ top: 0, left: 0, actualSide: side as 'bottom' | 'top' })

  const calcPosition = useCallback(() => {
    if (!anchorRef.current) return
    const rect = anchorRef.current.getBoundingClientRect()
    const popupEl = popupRef.current
    const popupH = popupEl ? popupEl.offsetHeight : 200
    const viewH = window.innerHeight
    const viewW = window.innerWidth
    const margin = 8

    let top: number
    let actualSide = side

    if (side === 'bottom') {
      if (rect.bottom + popupH + margin > viewH && rect.top - popupH - margin > 0) {
        actualSide = 'top'
        top = rect.top - popupH - margin
      } else {
        top = rect.bottom + margin
      }
    } else {
      if (rect.top - popupH - margin < 0 && rect.bottom + popupH + margin < viewH) {
        actualSide = 'bottom'
        top = rect.bottom + margin
      } else {
        top = rect.top - popupH - margin
      }
    }

    let left: number
    if (align === 'left') left = rect.left
    else if (align === 'right') left = rect.right - width
    else left = rect.left + rect.width / 2 - width / 2

    if (left < margin) left = margin
    if (left + width > viewW - margin) left = viewW - width - margin
    if (left < margin) left = margin

    setPos({ top, left, actualSide })
  }, [anchorRef, width, align, side])

  useLayoutEffect(() => {
    if (open) calcPosition()
  }, [open, calcPosition])

  useEffect(() => {
    if (!open) return
    const handler = () => calcPosition()
    window.addEventListener('scroll', handler, true)
    window.addEventListener('resize', handler)
    return () => {
      window.removeEventListener('scroll', handler, true)
      window.removeEventListener('resize', handler)
    }
  }, [open, calcPosition])

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (
        popupRef.current && !popupRef.current.contains(e.target as Node) &&
        anchorRef.current && !anchorRef.current.contains(e.target as Node)
      ) {
        onClose()
      }
    }
    const timer = setTimeout(() => document.addEventListener('mousedown', handler), 10)
    return () => { clearTimeout(timer); document.removeEventListener('mousedown', handler) }
  }, [open, onClose, anchorRef])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler, true)
    return () => document.removeEventListener('keydown', handler, true)
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <motion.div
      ref={popupRef}
      initial={{ opacity: 0, y: pos.actualSide === 'bottom' ? -6 : 6, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="fixed z-[9999] p-2 rounded-xl bg-[#261043] border border-white/15 backdrop-blur-xl"
      style={{
        top: pos.top,
        left: pos.left,
        width,
        boxShadow: '0 18px 48px rgba(0,0,0,.45), 0 0 24px rgba(168,85,247,.12), inset 0 1px rgba(255,255,255,.1)',
      }}
    >
      {children}
    </motion.div>,
    document.body
  )
}
