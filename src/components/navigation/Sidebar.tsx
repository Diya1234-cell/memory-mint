'use client'

import { usePathname, useRouter } from 'next/navigation'
import { 
  Heart, 
  Menu, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  SkipForward,
  Volume2
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

import { useSpaceData } from '@/hooks/useSpaceData'

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isPlaying, setIsPlaying] = useState(true)
  const { spaceData } = useSpaceData()
  const themeColor = spaceData.themeColor || 'pink'
  const isStoryBook = pathname === '/storybook'

  // Navigation Items
  const items = [
    { label: 'Dashboard', href: '/dashboard', emoji: '🏡' },
    { label: 'Upload Memory', href: '/upload', emoji: '📸' },
    { label: 'Timeline', href: '/timeline', emoji: '📅' },
    { label: 'AI StoryBook', href: '/storybook', emoji: '📖' },
    { label: 'Letters & Time Capsule', href: '/letters', emoji: '💌' },
    { label: 'Relationship Pulse', href: '/pulse', emoji: '❤️' },
    { label: 'Settings', href: '/settings', emoji: '⚙' },
  ]

  const isActive = (href: string) => pathname === href

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault()
    router.push('/')
  }

  const handleNavigate = (href: string) => {
    setIsOpen(false)
    router.push(href)
  }

  // Adjust parent layout padding when collapsed status changes
  useEffect(() => {
    const contentArea = document.querySelector('.md\\:pl-72') as HTMLElement
    if (contentArea) {
      if (isCollapsed) {
        contentArea.style.paddingLeft = '80px'
      } else {
        contentArea.style.paddingLeft = ''
      }
    }
  }, [isCollapsed])

  // Mapping theme properties to match active configuration
  const themeStyles = {
    purple: {
      gradient: 'from-[#a855f7] to-[#6366f1]',
      text: 'text-neonPurple',
      bg: 'bg-neonPurple',
      activeLink: 'bg-gradient-to-r from-[#a855f7]/15 to-[#6366f1]/5 border-l-2 border-[#a855f7] text-white',
      glow: 'shadow-[0_0_15px_rgba(168,85,247,0.4)]',
      border: 'border-neonPurple/20',
      badgeBg: 'bg-neonPurple/10 text-neonPurple border-neonPurple/20'
    },
    galaxy: {
      gradient: 'from-[#3b82f6] to-[#1d4ed8]',
      text: 'text-blue-400',
      bg: 'bg-blue-400',
      activeLink: 'bg-gradient-to-r from-[#3b82f6]/15 to-[#1d4ed8]/5 border-l-2 border-[#3b82f6] text-white',
      glow: 'shadow-[0_0_15px_rgba(59,130,246,0.4)]',
      border: 'border-blue-500/20',
      badgeBg: 'bg-blue-500/10 text-blue-400 border-blue-500/20'
    },
    pink: {
      gradient: 'from-neonPink to-neonPurple',
      text: 'text-neonPink',
      bg: 'bg-neonPink',
      activeLink: 'bg-gradient-to-r from-neonPink/15 to-neonPurple/15 border-l-2 border-neonPink text-white',
      glow: 'shadow-[0_0_15px_rgba(255,75,145,0.4)]',
      border: 'border-neonPink/20',
      badgeBg: 'bg-neonPink/10 text-neonPink border-neonPink/20'
    },
    blue: {
      gradient: 'from-[#06b6d4] to-[#3b82f6]',
      text: 'text-cyan-400',
      bg: 'bg-cyan-400',
      activeLink: 'bg-gradient-to-r from-[#06b6d4]/15 to-[#3b82f6]/5 border-l-2 border-[#06b6d4] text-white',
      glow: 'shadow-[0_0_15px_rgba(6,182,212,0.4)]',
      border: 'border-cyan-500/20',
      badgeBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
    },
    green: {
      gradient: 'from-[#10b981] to-[#06b6d4]',
      text: 'text-emerald-400',
      bg: 'bg-emerald-400',
      activeLink: 'bg-gradient-to-r from-[#10b981]/15 to-[#06b6d4]/5 border-l-2 border-[#10b981] text-white',
      glow: 'shadow-[0_0_15px_rgba(16,185,129,0.4)]',
      border: 'border-emerald-500/20',
      badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    },
    gold: {
      gradient: 'from-[#f59e0b] to-[#d97706]',
      text: 'text-amber-400',
      bg: 'bg-amber-400',
      activeLink: 'bg-gradient-to-r from-[#f59e0b]/15 to-[#d97706]/5 border-l-2 border-[#f59e0b] text-white',
      glow: 'shadow-[0_0_15px_rgba(245,158,11,0.4)]',
      border: 'border-amber-500/20',
      badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    }
  }

  const activeTheme = themeStyles[themeColor as keyof typeof themeStyles] || themeStyles.pink

  return (
    <>
      {/* CSS Keyframes for Music Waves */}
      <style jsx global>{`
        @keyframes wave {
          0%, 100% { height: 4px; }
          50% { height: 16px; }
        }
        .music-bar-1 { animation: wave 1.2s ease-in-out infinite; }
        .music-bar-2 { animation: wave 0.8s ease-in-out infinite; animation-delay: 0.15s; }
        .music-bar-3 { animation: wave 1.4s ease-in-out infinite; animation-delay: 0.3s; }
        .music-bar-4 { animation: wave 1s ease-in-out infinite; animation-delay: 0.45s; }
      `}</style>

      {/* Mobile Hamburger Menu Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2.5 rounded-xl border border-white/10 text-white md:hidden shadow-glow-pink hover:scale-105 active:scale-95 transition-all duration-300"
        style={{ background: 'rgba(20,16,45,0.28)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 h-screen glass-panel border-r border-white/5 flex flex-col justify-between py-6 px-4 z-40 transition-all duration-300 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isCollapsed ? 'w-20' : 'w-72'}`}
      >
        
        {/* Toggle Collapse Button (hidden on mobile) */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 rounded-full border border-white/10 text-gray-400 hover:text-white flex items-center justify-center cursor-pointer shadow-lg hidden md:flex z-50 hover:scale-105 transition-all"
          style={{ background: 'rgba(20,16,45,0.28)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}
        >
          {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>

        <div className="flex flex-col flex-1 overflow-hidden">
          
          {/* Logo / Brand Header */}
          <motion.button
            onClick={() => { if (pathname !== '/') router.push('/') }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            animate={pathname === '/' ? { boxShadow: ['0 0 0px rgba(168,85,247,0)', '0 0 14px rgba(168,85,247,0.35)', '0 0 0px rgba(168,85,247,0)'] } : {}}
            transition={{ duration: 0.2 }}
            aria-label="Go to MemoryVerse Home"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (pathname !== '/') router.push('/') } }}
            className={`flex items-center gap-2.5 px-2 mt-2 md:mt-0 mb-6 rounded-xl transition-all duration-200 group outline-none focus-visible:ring-2 focus-visible:ring-purple-400/50 ${
              isCollapsed ? 'justify-center' : ''
            } ${
              pathname === '/'
                ? 'border border-purple-400/20 bg-purple-500/5'
                : 'border border-transparent hover:border-white/10 hover:bg-white/[0.03]'
            }`}
          >
            <motion.div
              className={`${isStoryBook ? 'w-9 h-9' : 'w-8 h-8'} rounded-lg bg-gradient-to-tr ${activeTheme.gradient} flex items-center justify-center flex-shrink-0 ${activeTheme.glow} transition-shadow duration-200 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.5)]`}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Heart className={`${isStoryBook ? 'w-5 h-5' : 'w-4.5 h-4.5'} text-white fill-current animate-pulse`} />
            </motion.div>
            
            {!isCollapsed && (
              <span className={`${isStoryBook ? 'text-[17px]' : 'text-md'} font-bold tracking-tight bg-gradient-to-r from-white to-pink-100 bg-clip-text text-transparent truncate transition-all duration-200 group-hover:brightness-125`}>
                Forever Remembered
              </span>
            )}
          </motion.button>

          {/* DYNAMIC SPACE DETAILS */}
          <div className={`px-2 mb-6 transition-all duration-300 ${isCollapsed ? 'flex justify-center' : ''}`}>
            {isCollapsed ? (
              <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-sm shadow-md">
                {spaceData.relationshipEmoji}
              </div>
            ) : (
              <div className={`${isStoryBook ? 'p-4 gap-3.5' : 'p-3.5 gap-3'} rounded-2xl border border-white/10 shadow-inner flex items-center`} style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)' }}>
                <div className={`${isStoryBook ? 'text-2xl' : 'text-xl'}`}>{spaceData.relationshipEmoji}</div>
                <div className="overflow-hidden">
                  <span className={`${isStoryBook ? 'text-sm' : 'text-xs'} font-bold text-white block truncate leading-tight`}>
                    {spaceData.spaceName}
                  </span>
                  <span className={`${isStoryBook ? 'text-[10px]' : 'text-[9px]'} font-extrabold uppercase tracking-widest block mt-0.5 ${activeTheme.text}`}>
                    {spaceData.selectedRelation === 'couple' ? 'Couple Space' : spaceData.selectedRelation === 'family' ? 'Family Space' : 'Friends Space'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* NAVIGATION LINKS */}
          <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1">
            {items.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => handleNavigate(item.href)}
                className={`flex w-full items-center text-left rounded-xl transition-all duration-300 group relative ${
                  isCollapsed ? 'justify-center py-3' : 'px-4 py-3.5 gap-3'
                } ${
                  isActive(item.href)
                    ? activeTheme.activeLink
                    : 'text-gray-400 hover:text-white hover:bg-white/5 hover:translate-x-1'
                }`}
              >
                <span className={`${isStoryBook ? 'text-xl' : 'text-lg'} group-hover:scale-115 transition-transform duration-300`}>
                  {item.emoji}
                </span>

                {!isCollapsed && (
                  <span className={`${isStoryBook ? 'text-sm' : 'text-xs'} font-medium`}>{item.label}</span>
                )}

                {/* Collapsed Mode Tooltip */}
                {isCollapsed && (
                  <div className="absolute left-20 py-2 px-3 rounded-lg bg-[#0c071e] border border-white/10 text-xs text-white font-bold opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 shadow-xl whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* BOTTOM MUSIC CONTROLLER WIDGET & LOGOUT */}
        <div className="border-t border-white/5 pt-4 space-y-4 px-2">
          
          {/* Music Widget */}
          <div className="glass-panel border border-white/5 rounded-2xl p-2.5 overflow-hidden transition-all duration-300">
            {isCollapsed ? (
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className={`w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:scale-105 active:scale-95 transition-all ${activeTheme.text}`}
              >
                {isPlaying ? (
                  <div className="flex gap-0.5 items-end justify-center h-4">
                    <span className={`w-0.5 music-bar-1 ${activeTheme.bg}`} />
                    <span className={`w-0.5 music-bar-2 ${activeTheme.bg}`} />
                    <span className={`w-0.5 music-bar-3 ${activeTheme.bg}`} />
                  </div>
                ) : (
                  <Play className="w-3.5 h-3.5 fill-current" />
                )}
              </button>
            ) : (
              <div className="flex items-center gap-2.5">
                
                {/* Audio visualizer */}
                <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-end justify-center gap-0.5 pb-2">
                  <span className={`w-0.5 rounded-full ${activeTheme.bg} ${isPlaying ? 'music-bar-1' : 'h-1'}`} />
                  <span className={`w-0.5 rounded-full ${activeTheme.bg} ${isPlaying ? 'music-bar-2' : 'h-2'}`} />
                  <span className={`w-0.5 rounded-full ${activeTheme.bg} ${isPlaying ? 'music-bar-3' : 'h-1.5'}`} />
                  <span className={`w-0.5 rounded-full ${activeTheme.bg} ${isPlaying ? 'music-bar-4' : 'h-1'}`} />
                </div>

                <div className="flex-1 overflow-hidden">
                  <span className={`${isStoryBook ? 'text-[12px]' : 'text-[10px]'} font-extrabold text-white block truncate leading-none`}>
                    Cosmic Whispers
                  </span>
                  <span className={`${isStoryBook ? 'text-[9px]' : 'text-[8px]'} text-gray-500 font-bold uppercase mt-0.5 block truncate`}>
                    Stardust Harmony
                  </span>
                </div>

                {/* Control Toggles */}
                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-1 rounded bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all"
                  >
                    {isPlaying ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
                  </button>
                  <button className="p-1 rounded bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all">
                    <SkipForward className="w-3 h-3" />
                  </button>
                </div>

              </div>
            )}
          </div>

          {/* Logout Action */}
          <a
            href="/"
            onClick={handleLogout}
            className={`flex items-center rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all duration-300 group ${
              isCollapsed ? 'justify-center py-3' : 'px-4 py-3.5 gap-3 hover:translate-x-1'
            }`}
          >
            <span className="text-lg group-hover:scale-115 transition-transform">🚪</span>
            
            {!isCollapsed && (
              <span className={`${isStoryBook ? 'text-sm' : 'text-xs'} font-medium`}>Logout</span>
            )}

            {isCollapsed && (
              <div className="absolute left-20 py-2 px-3 rounded-lg bg-[#0c071e] border border-white/10 text-xs text-rose-400 font-bold opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 shadow-xl whitespace-nowrap z-50">
                Logout
              </div>
            )}
          </a>

        </div>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-35 md:hidden transition-opacity duration-300"
        />
      )}
    </>
  )
}
