'use client'

import { createContext, useCallback, useContext, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, Info, AlertTriangle } from 'lucide-react'
import { Toast } from './types'

interface ToastContextValue {
  addToast: (message: string, type?: Toast['type']) => void
}

const ToastContext = createContext<ToastContextValue>({ addToast: () => {} })
export const useToast = () => useContext(ToastContext)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((message: string, type: Toast['type'] = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const iconMap = {
    success: <CheckCircle className="w-4 h-4 text-emerald-300" />,
    info: <Info className="w-4 h-4 text-sky-300" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-300" />,
  }

  const borderMap = {
    success: 'border-emerald-400/30',
    info: 'border-sky-400/30',
    warning: 'border-amber-400/30',
  }

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[999] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 30, scale: 0.9, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: 80, scale: 0.9, filter: 'blur(8px)' }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              onClick={() => removeToast(toast.id)}
              className={`pointer-events-auto flex items-center gap-3 rounded-2xl border ${borderMap[toast.type]} bg-[#1a0e35]/90 backdrop-blur-xl px-5 py-3.5 shadow-[0_8px_32px_rgba(0,0,0,.4),0_0_24px_rgba(168,85,247,.15)] cursor-pointer hover:scale-[1.02] transition-transform`}
            >
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-white/10">
                {iconMap[toast.type]}
              </div>
              <span className="text-sm text-white/90 font-medium whitespace-nowrap">{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}
