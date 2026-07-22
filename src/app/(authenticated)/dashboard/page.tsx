'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Heart, 
  Sparkles, 
  Search, 
  Bell, 
  Plus, 
  Calendar, 
  BookOpen, 
  Clock, 
  Users, 
  ChevronDown,
  Activity,
  ShieldCheck,
  Upload,
  Mail,
  Hourglass,
  Smile,
  Mountain,
  CloudRain
} from 'lucide-react'
import { motion } from 'framer-motion'

import { useSpaceData } from '@/hooks/useSpaceData'
import { useDashboardData } from '@/hooks/useDashboardData'
import { useAuth } from '@/providers/AuthProvider'
import { MemoryGalaxy } from '@/components/ui/MemoryGalaxy'
import AIPulseModal from '@/components/ui/AIPulseModal'

export default function DashboardPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const { spaceData } = useSpaceData()
  const { stats: firestoreStats } = useDashboardData()
  const { user } = useAuth()
  const activeSpace = spaceData.spaceName

  const [isAiModalOpen, setIsAiModalOpen] = useState(false)
  const [isScanning, setIsScanning] = useState(false)

  const handleStartScan = () => {
    if (isScanning) return
    setIsScanning(true)
    setTimeout(() => {
      setIsScanning(false)
      setIsAiModalOpen(true)
    }, 2800)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    card.style.setProperty('--mx', `${x}px`)
    card.style.setProperty('--my', `${y}px`)
  }

  const memoriesScrollRef = useRef<HTMLDivElement | null>(null)

  const handleScrollMemories = (direction: 'left' | 'right') => {
    const container = memoriesScrollRef.current
    if (container) {
      const scrollAmount = 208 // card width + gap (192px + 16px)
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  // Mapping theme properties to match active configuration
  const themeStyles = {
    purple: {
      color: '#a855f7',
      text: 'text-neonPurple',
      bg: 'bg-neonPurple',
      glow: 'shadow-[0_0_20px_rgba(168,85,247,0.4)]',
      border: 'border-neonPurple/30',
      outlineBorder: 'border-neonPurple/10',
      glowHeart: 'drop-shadow-[0_0_10px_rgba(168,85,247,0.85)]',
      btn: 'bg-gradient-to-r from-[#a855f7] to-[#6366f1] text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)]'
    },
    galaxy: {
      color: '#3b82f6',
      text: 'text-blue-400',
      bg: 'bg-blue-400',
      glow: 'shadow-[0_0_20px_rgba(59,130,246,0.4)]',
      border: 'border-blue-500/30',
      outlineBorder: 'border-blue-500/10',
      glowHeart: 'drop-shadow-[0_0_10px_rgba(59,130,246,0.85)]',
      btn: 'bg-gradient-to-r from-[#3b82f6] to-[#1d4ed8] text-white shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)]'
    },
    pink: {
      color: '#ff4b91',
      text: 'text-neonPink',
      bg: 'bg-neonPink',
      glow: 'shadow-glow-pink',
      border: 'border-neonPink/30',
      outlineBorder: 'border-neonPink/10',
      glowHeart: 'drop-shadow-[0_0_10px_rgba(255,75,145,0.85)]',
      btn: 'bg-gradient-to-r from-neonPink to-neonPurple text-white shadow-glow-pink hover:shadow-[0_0_30px_rgba(255,75,145,0.6)]'
    },
    blue: {
      color: '#06b6d4',
      text: 'text-cyan-400',
      bg: 'bg-cyan-400',
      glow: 'shadow-[0_0_20px_rgba(6,182,212,0.4)]',
      border: 'border-cyan-500/30',
      outlineBorder: 'border-cyan-500/10',
      glowHeart: 'drop-shadow-[0_0_10px_rgba(6,182,212,0.85)]',
      btn: 'bg-gradient-to-r from-[#06b6d4] to-[#3b82f6] text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)]'
    },
    green: {
      color: '#10b981',
      text: 'text-emerald-400',
      bg: 'bg-emerald-400',
      glow: 'shadow-[0_0_20px_rgba(16,185,129,0.4)]',
      border: 'border-emerald-500/30',
      outlineBorder: 'border-emerald-500/10',
      glowHeart: 'drop-shadow-[0_0_10px_rgba(16,185,129,0.85)]',
      btn: 'bg-gradient-to-r from-[#10b981] to-[#06b6d4] text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)]'
    },
    gold: {
      color: '#f59e0b',
      text: 'text-amber-400',
      bg: 'bg-amber-400',
      glow: 'shadow-[0_0_20px_rgba(245,158,11,0.4)]',
      border: 'border-amber-500/30',
      outlineBorder: 'border-amber-500/10',
      glowHeart: 'drop-shadow-[0_0_10px_rgba(245,158,11,0.85)]',
      btn: 'bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-white shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[0_0_30px_rgba(245,158,11,0.6)]'
    }
  }

  const activeTheme = themeStyles[spaceData.themeColor as keyof typeof themeStyles] || themeStyles.pink
  
  // Quick stats array to display inside Hero Section
  const stats = [
    { label: 'Memories', value: String(firestoreStats.memoryCount), icon: '📸', color: activeTheme.text },
    { label: 'Days Shared', value: String(firestoreStats.daysShared), icon: '📅', color: 'text-neonPurple' },
    { label: 'Members', value: String(firestoreStats.memberCount), icon: '🫂', color: 'text-blue-400' },
    { label: 'Security', value: '100%', icon: '🔒', color: 'text-emerald-400' }
  ]

  return (
    <div className="flex-1 flex flex-col min-h-screen text-slate-100 font-sans pb-12">
      
      {/* TOP NAVIGATION */}
      <nav className="w-full flex flex-col sm:flex-row justify-between items-center gap-4 py-4 px-6 md:px-8 border-b border-white/5 bg-[#0c071e]/40 backdrop-blur-md sticky top-0 z-30">
        
        {/* Space Selector Dropdown */}
        <div className="flex items-center gap-2 relative">
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-all duration-300 group shadow-lg">
            <span className="text-sm">👥</span>
            <span className="text-xs font-bold text-white tracking-wide">{activeSpace}</span>
            <span className={`text-xs ${activeTheme.text}`}>{spaceData.relationshipEmoji}</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-white transition-colors ml-1" />
          </div>
        </div>

        {/* Search and Action items */}
        <div className="flex items-center gap-4 w-full sm:w-auto">
          {/* Glass Search Input */}
          <div className="relative flex-1 sm:w-64 max-w-xs">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search space..."
              className="w-full bg-black/35 border border-white/10 text-white placeholder-gray-500 rounded-xl py-2 px-4 pl-9 focus:outline-none focus:border-neonPink transition-all duration-300 text-xs"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
          </div>

          {/* Notification Button */}
          <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 active:scale-95 transition-all duration-300 relative">
            <Bell className="w-4 h-4" />
            <span className={`absolute top-2 right-2 w-1.5 h-1.5 rounded-full ${activeTheme.bg} animate-pulse`} />
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-neonPink to-neonPurple flex items-center justify-center text-white text-sm font-bold border border-white/10 shadow-md">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="hidden lg:block text-left">
              <span className="text-[10px] font-extrabold text-white block leading-tight">{user?.email?.split('@')[0] || 'User'}</span>
              <span className="text-[8px] text-gray-400 block font-bold uppercase tracking-wider mt-0.5">Creator</span>
            </div>
          </div>
        </div>
      </nav>

      {/* MAIN CONTAINER */}
      <div className="p-6 md:p-8 space-y-8 flex-1 flex flex-col justify-start">
        
        {/* HERO GREETINGS SECTION */}
        <header className="glass-panel rounded-3xl border border-white/5 bg-[#120a22]/30 p-6 md:p-8 shadow-xl relative overflow-hidden group hover:border-white/10 hover:bg-[#120a22]/40 transition-all duration-500">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,75,145,0.06)_0%,transparent_60%)] pointer-events-none" />
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative z-10">
            {/* Left side details */}
            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
                  {spaceData.spaceName} <span className="animate-pulse">{spaceData.relationshipEmoji}</span>
                </h1>
                
                <div className="flex gap-1.5">
                  <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-[8px] font-extrabold uppercase tracking-wider text-gray-300">
                    👥 {spaceData.selectedRelation === 'couple' ? 'Couple Space' : spaceData.selectedRelation === 'family' ? 'Family Space' : 'Friends Space'}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-[8px] font-extrabold uppercase tracking-wider text-gray-300">
                    {spaceData.isPrivate ? '🔒 Private' : '🌐 Public'}
                  </span>
                </div>
              </div>

              <div className={`flex items-center gap-2 text-xs font-bold ${activeTheme.text}`}>
                <Calendar className="w-4 h-4" />
                <span>Together Since {(() => {
                  if (!spaceData.specialDate) return ''
                  const d = new Date(spaceData.specialDate)
                  if (isNaN(d.getTime())) return spaceData.specialDate
                  const day = d.getDate()
                  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                  return `${day} ${months[d.getMonth()]} ${d.getFullYear()}`
                })()}</span>
              </div>

              <p className="text-xs italic text-gray-400 leading-relaxed max-w-xl border-l-2 border-white/10 pl-3.5">
                &ldquo;{spaceData.description}&rdquo;
              </p>
            </div>

            {/* Right side: Living Memory Galaxy */}
            <div className="relative w-full max-w-[240px] aspect-[1.3] flex items-center justify-center flex-shrink-0 mx-auto md:mx-0 overflow-hidden rounded-2xl">
              <MemoryGalaxy
                themeColor={spaceData.themeColor}
                coverPhoto={spaceData.coverPhoto}
                relationshipEmoji={spaceData.relationshipEmoji}
              />
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/5">
            {stats.map((stat) => (
              <div 
                key={stat.label}
                className="flex items-center gap-3.5 px-4 py-3 rounded-2xl bg-black/25 border border-white/5 hover:border-white/10 transition-all duration-300"
              >
                <span className="text-xl">{stat.icon}</span>
                <div>
                  <span className={`text-base font-extrabold ${stat.color} block leading-tight`}>
                    {stat.value}
                  </span>
                  <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider mt-0.5 block">
                    {stat.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </header>

        {/* DASHBOARD LAYOUT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT ZONES: Main Activities / Timelines (Col Span 8) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Quick Actions Grid */}
            <div className="space-y-3.5">
              <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                
                {/* Action 1: Upload Memory */}
                <motion.div
                  onClick={() => router.push('/upload')}
                  onMouseMove={handleMouseMove}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="glass-panel border border-white/5 bg-[#120a22]/30 p-4.5 rounded-3xl relative overflow-hidden group hover:border-pink-500/20 hover:bg-[#120a22]/50 shadow-lg cursor-pointer transition-all duration-300 flex flex-col justify-between h-[155px] before:absolute before:inset-0 before:bg-[radial-gradient(180px_circle_at_var(--mx,0px)_var(--my,0px),rgba(255,255,255,0.05),transparent_80%)] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500 before:pointer-events-none"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Glass Reflection Shimmer Effect */}
                  <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-25deg] group-hover:left-[200%] transition-all duration-1000 ease-out pointer-events-none" />
                  
                  {/* Icon */}
                  <div className="w-9 h-9 rounded-xl bg-pink-500/15 border border-pink-500/20 flex items-center justify-center relative z-10 shadow-glow-pink">
                    <Upload className="w-4.5 h-4.5 text-neonPink" />
                  </div>

                  {/* Title & Desc */}
                  <div className="relative z-10 mt-auto">
                    <h4 className="text-[13px] font-bold text-white leading-tight">Upload Memory</h4>
                    <p className="text-[10px] text-gray-500 mt-1 leading-snug font-bold">
                      Photos, videos, audio or journal
                    </p>
                  </div>
                </motion.div>

                {/* Action 2: Generate Story */}
                <motion.div
                  onClick={() => router.push('/storybook')}
                  onMouseMove={handleMouseMove}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="glass-panel border border-white/5 bg-[#120a22]/30 p-4.5 rounded-3xl relative overflow-hidden group hover:border-purple-500/20 hover:bg-[#120a22]/50 shadow-lg cursor-pointer transition-all duration-300 flex flex-col justify-between h-[155px] before:absolute before:inset-0 before:bg-[radial-gradient(180px_circle_at_var(--mx,0px)_var(--my,0px),rgba(255,255,255,0.05),transparent_80%)] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500 before:pointer-events-none"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-25deg] group-hover:left-[200%] transition-all duration-1000 ease-out pointer-events-none" />
                  
                  <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/20 flex items-center justify-center relative z-10 shadow-[0_0_15px_rgba(168,85,247,0.25)]">
                    <BookOpen className="w-4.5 h-4.5 text-neonPurple" />
                  </div>

                  <div className="relative z-10 mt-auto">
                    <h4 className="text-[13px] font-bold text-white leading-tight">Generate Story</h4>
                    <p className="text-[10px] text-gray-500 mt-1 leading-snug font-bold">
                      AI will craft your beautiful story
                    </p>
                  </div>
                </motion.div>

                {/* Action 3: Write Letter */}
                <motion.div
                  onClick={() => router.push('/letters')}
                  onMouseMove={handleMouseMove}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="glass-panel border border-white/5 bg-[#120a22]/30 p-4.5 rounded-3xl relative overflow-hidden group hover:border-fuchsia-500/20 hover:bg-[#120a22]/50 shadow-lg cursor-pointer transition-all duration-300 flex flex-col justify-between h-[155px] before:absolute before:inset-0 before:bg-[radial-gradient(180px_circle_at_var(--mx,0px)_var(--my,0px),rgba(255,255,255,0.05),transparent_80%)] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500 before:pointer-events-none"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/10 via-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-25deg] group-hover:left-[200%] transition-all duration-1000 ease-out pointer-events-none" />
                  
                  <div className="w-9 h-9 rounded-xl bg-fuchsia-500/15 border border-fuchsia-500/20 flex items-center justify-center relative z-10 shadow-[0_0_15px_rgba(217,70,239,0.25)]">
                    <Mail className="w-4.5 h-4.5 text-fuchsia-400" />
                  </div>

                  <div className="relative z-10 mt-auto">
                    <h4 className="text-[13px] font-bold text-white leading-tight">Write Letter</h4>
                    <p className="text-[10px] text-gray-500 mt-1 leading-snug font-bold">
                      Write a letter to your future selves
                    </p>
                  </div>
                </motion.div>

                {/* Action 4: Create Time Capsule */}
                <motion.div
                  onClick={() => router.push('/letters')}
                  onMouseMove={handleMouseMove}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="glass-panel border border-white/5 bg-[#120a22]/30 p-4.5 rounded-3xl relative overflow-hidden group hover:border-blue-500/20 hover:bg-[#120a22]/50 shadow-lg cursor-pointer transition-all duration-300 flex flex-col justify-between h-[155px] before:absolute before:inset-0 before:bg-[radial-gradient(180px_circle_at_var(--mx,0px)_var(--my,0px),rgba(255,255,255,0.05),transparent_80%)] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500 before:pointer-events-none"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-25deg] group-hover:left-[200%] transition-all duration-1000 ease-out pointer-events-none" />
                  
                  <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/20 flex items-center justify-center relative z-10 shadow-[0_0_15px_rgba(59,130,246,0.25)]">
                    <Hourglass className="w-4.5 h-4.5 text-blue-400" />
                  </div>

                  <div className="relative z-10 mt-auto">
                    <h4 className="text-[13px] font-bold text-white leading-tight">Create Time Capsule</h4>
                    <p className="text-[10px] text-gray-500 mt-1 leading-snug font-bold">
                      Lock memories for the future
                    </p>
                  </div>
                </motion.div>

              </div>
            </div>

            {/* Row containing Universe Overview and Shared Members side-by-side */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Universe Overview Section (spanning 7 cols on LG) */}
              <div className="md:col-span-7 space-y-3.5">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">
                    Universe Overview
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Metric 1: Relationship */}
                  <div 
                    onMouseMove={handleMouseMove}
                    className="glass-panel border border-white/5 bg-[#120a22]/30 p-4.5 rounded-3xl flex flex-col justify-between h-[130px] relative overflow-hidden group hover:border-white/10 hover:bg-[#120a22]/40 transition-all duration-300 before:absolute before:inset-0 before:bg-[radial-gradient(150px_circle_at_var(--mx,0px)_var(--my,0px),rgba(255,255,255,0.04),transparent_80%)] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500 before:pointer-events-none"
                  >
                    <div className="w-8 h-8 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center relative z-10">
                      <Heart className="w-4 h-4 text-neonPink animate-pulse" />
                    </div>
                    <div className="relative z-10">
                      <span className="text-[17px] font-extrabold text-white tracking-tight block truncate capitalize">
                        {spaceData.selectedRelation}
                      </span>
                      <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block mt-0.5">
                        Relationship
                      </span>
                      <span className="text-[9px] text-emerald-400 font-semibold block mt-0.5">
                        ▲ Active Space
                      </span>
                    </div>
                  </div>

                  {/* Metric 2: Members */}
                  <div 
                    onMouseMove={handleMouseMove}
                    className="glass-panel border border-white/5 bg-[#120a22]/30 p-4.5 rounded-3xl flex flex-col justify-between h-[130px] relative overflow-hidden group hover:border-white/10 hover:bg-[#120a22]/40 transition-all duration-300 before:absolute before:inset-0 before:bg-[radial-gradient(150px_circle_at_var(--mx,0px)_var(--my,0px),rgba(255,255,255,0.04),transparent_80%)] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500 before:pointer-events-none"
                  >
                    <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center relative z-10">
                      <Users className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="relative z-10">
                      <span className="text-[17px] font-extrabold text-white tracking-tight block truncate">
                        {1 + (spaceData.invites?.length || 0)} Members
                      </span>
                      <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block mt-0.5">
                        Collaborators
                      </span>
                      <span className="text-[9px] text-emerald-400 font-semibold block mt-0.5">
                        Active Space
                      </span>
                    </div>
                  </div>

                  {/* Metric 3: Privacy */}
                  <div 
                    onMouseMove={handleMouseMove}
                    className="glass-panel border border-white/5 bg-[#120a22]/30 p-4.5 rounded-3xl flex flex-col justify-between h-[130px] relative overflow-hidden group hover:border-white/10 hover:bg-[#120a22]/40 transition-all duration-300 before:absolute before:inset-0 before:bg-[radial-gradient(150px_circle_at_var(--mx,0px)_var(--my,0px),rgba(255,255,255,0.04),transparent_80%)] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500 before:pointer-events-none"
                  >
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center relative z-10">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="relative z-10">
                      <span className="text-[17px] font-extrabold text-white tracking-tight block truncate">
                        {spaceData.isPrivate ? 'Private' : 'Public'}
                      </span>
                      <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block mt-0.5">
                        Privacy Status
                      </span>
                      <span className="text-[9px] text-emerald-400 font-semibold block mt-0.5">
                        🔒 Vault Encrypted
                      </span>
                    </div>
                  </div>

                  {/* Metric 4: Theme */}
                  <div 
                    onMouseMove={handleMouseMove}
                    className="glass-panel border border-white/5 bg-[#120a22]/30 p-4.5 rounded-3xl flex flex-col justify-between h-[130px] relative overflow-hidden group hover:border-white/10 hover:bg-[#120a22]/40 transition-all duration-300 before:absolute before:inset-0 before:bg-[radial-gradient(150px_circle_at_var(--mx,0px)_var(--my,0px),rgba(255,255,255,0.04),transparent_80%)] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500 before:pointer-events-none"
                  >
                    <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center relative z-10">
                      <Sparkles className="w-4 h-4 text-neonPurple" />
                    </div>
                    <div className="relative z-10">
                      <span className="text-[17px] font-extrabold text-white tracking-tight block truncate">
                        {(() => {
                          const map: Record<string, string> = {
                            pink: 'Aurora Pink',
                            purple: 'Nebula Purple',
                            galaxy: 'Midnight Galaxy',
                            blue: 'Ocean Blue',
                            green: 'Emerald Forest',
                            gold: 'Golden Sunset'
                          }
                          return map[spaceData.themeColor] || spaceData.themeColor
                        })()}
                      </span>
                      <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block mt-0.5">
                        Space Theme
                      </span>
                      <span className="text-[9px] text-emerald-400 font-semibold block mt-0.5">
                        🎨 Configured
                      </span>
                    </div>
                  </div>

                  {/* Metric 5: Category */}
                  <div 
                    onMouseMove={handleMouseMove}
                    className="glass-panel border border-white/5 bg-[#120a22]/30 p-4.5 rounded-3xl flex flex-col justify-between h-[130px] relative overflow-hidden group hover:border-white/10 hover:bg-[#120a22]/40 transition-all duration-300 before:absolute before:inset-0 before:bg-[radial-gradient(150px_circle_at_var(--mx,0px)_var(--my,0px),rgba(255,255,255,0.04),transparent_80%)] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500 before:pointer-events-none"
                  >
                    <div className="w-8 h-8 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center relative z-10">
                      <Activity className="w-4 h-4 text-teal-400" />
                    </div>
                    <div className="relative z-10">
                      <span className="text-[17px] font-extrabold text-white tracking-tight block truncate">
                        {spaceData.category}
                      </span>
                      <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block mt-0.5">
                        Memory Category
                      </span>
                      <span className="text-[9px] text-emerald-400 font-semibold block mt-0.5">
                        📂 Active Target
                      </span>
                    </div>
                  </div>

                  {/* Metric 6: Together Since */}
                  <div 
                    onMouseMove={handleMouseMove}
                    className="glass-panel border border-white/5 bg-[#120a22]/30 p-4.5 rounded-3xl flex flex-col justify-between h-[130px] relative overflow-hidden group hover:border-white/10 hover:bg-[#120a22]/40 transition-all duration-300 before:absolute before:inset-0 before:bg-[radial-gradient(150px_circle_at_var(--mx,0px)_var(--my,0px),rgba(255,255,255,0.04),transparent_80%)] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500 before:pointer-events-none"
                  >
                    <div className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center relative z-10">
                      <Calendar className="w-4 h-4 text-rose-400" />
                    </div>
                    <div className="relative z-10">
                      <span className="text-[17px] font-extrabold text-white tracking-tight block truncate">
                        {(() => {
                          if (!spaceData.specialDate) return ''
                          const d = new Date(spaceData.specialDate)
                          if (isNaN(d.getTime())) return spaceData.specialDate
                          const day = d.getDate()
                          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                          return `${day} ${months[d.getMonth()]} ${d.getFullYear()}`
                        })()}
                      </span>
                      <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block mt-0.5">
                        Together Since
                      </span>
                      <span className="text-[9px] text-emerald-400 font-semibold block mt-0.5">
                        ⏳ Timeline Begun
                      </span>
                    </div>
                  </div>

                  {/* Metric 7: Cover Image */}
                  <div 
                    onMouseMove={handleMouseMove}
                    className="glass-panel border border-white/5 bg-[#120a22]/30 p-4.5 rounded-3xl flex flex-col justify-between h-[130px] relative overflow-hidden group hover:border-white/10 hover:bg-[#120a22]/40 transition-all duration-300 before:absolute before:inset-0 before:bg-[radial-gradient(150px_circle_at_var(--mx,0px)_var(--my,0px),rgba(255,255,255,0.04),transparent_80%)] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500 before:pointer-events-none"
                  >
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center relative z-10">
                      <Upload className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div className="flex-1 flex flex-col justify-end mt-2 relative z-10">
                      <div className="w-full h-8 rounded-lg overflow-hidden border border-white/10 relative">
                        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${spaceData.coverPhoto || 'https://images.unsplash.com/photo-1501908731398-23b3efd7ccab?auto=format&fit=crop&w=150&q=80'}')` }} />
                      </div>
                      <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block mt-1">
                        Cover Asset
                      </span>
                    </div>
                  </div>

                  {/* Metric 8: Vault Protection */}
                  <div 
                    onMouseMove={handleMouseMove}
                    className="glass-panel border border-white/5 bg-[#120a22]/30 p-4.5 rounded-3xl flex flex-col justify-between h-[130px] relative overflow-hidden group hover:border-white/10 hover:bg-[#120a22]/40 transition-all duration-300 before:absolute before:inset-0 before:bg-[radial-gradient(150px_circle_at_var(--mx,0px)_var(--my,0px),rgba(255,255,255,0.04),transparent_80%)] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500 before:pointer-events-none"
                  >
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center relative z-10">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="relative z-10">
                      <span className="text-[17px] font-extrabold text-white tracking-tight block truncate">
                        100% Secure
                      </span>
                      <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block mt-0.5">
                        Vault Access
                      </span>
                      <span className="text-[9px] text-emerald-400 font-semibold block mt-0.5">
                        🔒 Fully Private
                      </span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Shared Members Section (spanning 5 cols on LG) */}
              <div className="md:col-span-5 space-y-3.5">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">
                    Shared Members
                  </h3>
                  <span onClick={() => router.push('/settings')} className="text-[9px] text-blue-400 hover:underline cursor-pointer">View All</span>
                </div>

                <div 
                  onMouseMove={handleMouseMove}
                  className="glass-panel border border-white/5 bg-[#120a22]/30 p-5 rounded-3xl flex flex-col justify-between min-h-[276px] relative overflow-hidden group hover:border-white/10 hover:bg-[#120a22]/40 transition-all duration-300 before:absolute before:inset-0 before:bg-[radial-gradient(180px_circle_at_var(--mx,0px)_var(--my,0px),rgba(255,255,255,0.05),transparent_80%)] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500 before:pointer-events-none"
                >
                  <div className="space-y-3.5 relative z-10">
                    {/* Creator / Owner */}
                    <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-black/25 border border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img 
                            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=60&q=80" 
                            alt="Savni" 
                            className="w-9 h-9 rounded-xl object-cover border border-white/10"
                          />
                          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-[#04020a]" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-white block">Savni (You)</span>
                          <span className="text-[9px] text-gray-500 font-bold uppercase mt-0.5 block">Owner</span>
                        </div>
                      </div>
                      <span className="text-sm">👑</span>
                    </div>

                    {/* Dynamic invited members list */}
                    {spaceData.invites?.map((invite) => (
                      <div key={invite.email} className="flex items-center justify-between py-2 px-3 rounded-xl bg-black/20 border border-white/5">
                        <div className="flex items-center gap-3">
                          <img 
                            src={invite.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=60&q=80'} 
                            alt="" 
                            className="w-9 h-9 rounded-xl object-cover border border-white/5"
                          />
                          <div>
                            <span className="text-xs font-bold text-white block truncate max-w-[120px]">
                              {invite.email.split('@')[0]}
                            </span>
                            <span className="text-[9px] text-gray-500 font-bold uppercase mt-0.5 block truncate max-w-[120px]">
                              {invite.email}
                            </span>
                          </div>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-extrabold uppercase tracking-wider ${
                          invite.status === 'Accepted'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : invite.status === 'Pending'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}>
                          {invite.status}
                        </span>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => router.push('/invite')}
                    className="w-full mt-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-extrabold text-white uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-white/10 active:scale-95 transition-all duration-300 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Invite More</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Row 4: Recent Memories & Upcoming Moments Side-by-Side */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Recent Memories Slider Column (Col Span 7) */}
              <div className="lg:col-span-7 space-y-3.5 relative">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">
                    Recent Memories
                  </h3>
                  <span onClick={() => router.push('/memories')} className="text-[9px] text-blue-400 hover:underline cursor-pointer">View All</span>
                </div>

                {/* Slider wrapper container */}
                <div className="relative group/slider">
                  
                  {/* Horizontal scroll container */}
                  <div ref={memoriesScrollRef} className="flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory relative z-10">
                    {firestoreStats.recentMemories.length === 0 && (
                      <div className="flex items-center justify-center w-full h-[262px] text-gray-500 text-xs">
                        No memories yet. Upload your first memory!
                      </div>
                    )}
                    {firestoreStats.recentMemories.map((mem) => (
                      <motion.div
                        key={mem.id}
                        onMouseMove={handleMouseMove}
                        whileHover={{ y: -6, scale: 1.02 }}
                        className="glass-panel border border-white/5 bg-[#120a22]/30 p-3 rounded-3xl flex flex-col justify-start h-[262px] min-w-[192px] w-[192px] relative overflow-hidden group hover:border-white/10 hover:bg-[#120a22]/40 transition-all duration-300 snap-start before:absolute before:inset-0 before:bg-[radial-gradient(150px_circle_at_var(--mx,0px)_var(--my,0px),rgba(255,255,255,0.05),transparent_80%)] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500 before:pointer-events-none"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-25deg] group-hover:left-[200%] transition-all duration-1000 ease-out pointer-events-none" />
                        
                        <div className="w-full h-28 rounded-2xl overflow-hidden relative border border-white/5 bg-black/20 z-10">
                          <img 
                            src={mem.mediaUrl || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=250&q=80'} 
                            alt={mem.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          {mem.id.startsWith('sample-') && (
                            <span className="absolute left-2 top-2 rounded-full bg-black/60 px-2 py-1 text-[8px] font-bold uppercase tracking-wide text-white/80 backdrop-blur-sm">
                              Sample
                            </span>
                          )}
                        </div>

                        <div className="relative z-10">
                          <span className="text-[8px] text-gray-500 font-extrabold tracking-wide uppercase mt-2.5 block">
                            {mem.createdAt ? new Date(mem.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                          </span>
                          <h4 className="text-xs font-extrabold text-white tracking-tight mt-0.5 truncate flex items-center gap-1">
                            {mem.title}
                          </h4>
                          
                          <p className="text-[10px] text-gray-400 mt-2.5 leading-relaxed italic line-clamp-3">
                            &ldquo;{mem.description || 'A precious memory.'}&rdquo;
                          </p>
                        </div>
                      </motion.div>
                    ))}

                  </div>

                  {/* Left/Right Overlaid navigation buttons */}
                  <button 
                    onClick={() => handleScrollMemories('left')}
                    className="absolute left-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-white/10 bg-black/55 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300 z-20 hover:scale-105 active:scale-95 shadow-md cursor-pointer"
                  >
                    <span>&lsaquo;</span>
                  </button>
                  <button 
                    onClick={() => handleScrollMemories('right')}
                    className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-white/10 bg-black/55 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300 z-20 hover:scale-105 active:scale-95 shadow-md cursor-pointer"
                  >
                    <span>&rsaquo;</span>
                  </button>

                  {/* Indicators dots */}
                  <div className="flex gap-1.5 justify-center mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                    <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                    <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                  </div>

                </div>
              </div>

              {/* Upcoming Moments Column (Col Span 5) */}
              <div className="lg:col-span-5 space-y-3.5">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">
                    Upcoming Moments
                  </h3>
                  <span onClick={() => router.push('/timeline')} className="text-[9px] text-blue-400 hover:underline cursor-pointer">View All</span>
                </div>

                <div 
                  onMouseMove={handleMouseMove}
                  className="glass-panel border border-white/5 bg-[#120a22]/30 p-5 rounded-3xl flex flex-col justify-between min-h-[308px] relative overflow-hidden group hover:border-white/10 hover:bg-[#120a22]/40 transition-all duration-300 before:absolute before:inset-0 before:bg-[radial-gradient(180px_circle_at_var(--mx,0px)_var(--my,0px),rgba(255,255,255,0.05),transparent_80%)] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500 before:pointer-events-none"
                >
                  <div className="space-y-3.5 relative z-10">
                    {/* Card 1: Our Anniversary */}
                    {(() => {
                      const today = new Date('2026-07-18')
                      const target = new Date(spaceData.specialDate || '2024-05-12')
                      const currentYear = today.getFullYear()
                      let nextAnniversary = new Date(currentYear, target.getMonth(), target.getDate())
                      if (nextAnniversary.getTime() < today.getTime()) {
                        nextAnniversary.setFullYear(currentYear + 1)
                      }
                      const diffTime = nextAnniversary.getTime() - today.getTime()
                      const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                      
                      const day = nextAnniversary.getDate()
                      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                      const dateStr = `${day} ${months[nextAnniversary.getMonth()]} ${nextAnniversary.getFullYear()}`

                      return (
                        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-black/20 border border-white/5 hover:border-white/10 transition-all duration-300">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center flex-shrink-0">
                              <Heart className="w-4 h-4 text-neonPink animate-pulse" />
                            </div>
                            <div>
                              <span className="text-xs font-bold text-white block">Our Anniversary 💖</span>
                              <span className="text-[9px] text-gray-500 font-bold block mt-0.5">{dateStr}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-base font-extrabold text-white block leading-none">{daysLeft}</span>
                            <span className="text-[8px] text-gray-500 font-bold uppercase tracking-wider block mt-1">Days Left</span>
                          </div>
                        </div>
                      )
                    })()}

                    {/* Card 2: Time Capsule Unlock */}
                    {(() => {
                      const today = new Date('2026-07-18')
                      const unlockDate = new Date('2026-08-30')
                      const diffTime = unlockDate.getTime() - today.getTime()
                      const daysLeft = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))
                      
                      return (
                        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-black/20 border border-white/5 hover:border-white/10 transition-all duration-300">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                              <Hourglass className="w-4 h-4 text-blue-400" />
                            </div>
                            <div>
                              <span className="text-xs font-bold text-white block">Time Capsule Unlock</span>
                              <span className="text-[9px] text-gray-500 font-bold block mt-0.5">30 Aug 2026</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-base font-extrabold text-white block leading-none">{daysLeft}</span>
                            <span className="text-[8px] text-gray-500 font-bold uppercase tracking-wider block mt-1">Days Left</span>
                          </div>
                        </div>
                      )
                    })()}

                    {/* Card 3: Birthday */}
                    {(() => {
                      const today = new Date('2026-07-18')
                      const bdayDate = new Date('2026-08-28')
                      const diffTime = bdayDate.getTime() - today.getTime()
                      const daysLeft = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))
                      
                      return (
                        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-black/20 border border-white/5 hover:border-white/10 transition-all duration-300">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
                              <Sparkles className="w-4 h-4 text-neonPurple" />
                            </div>
                            <div>
                              <span className="text-xs font-bold text-white block">Rahul&apos;s Birthday 🎂</span>
                              <span className="text-[9px] text-gray-500 font-bold block mt-0.5">28 Aug 2026</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-base font-extrabold text-white block leading-none">{daysLeft}</span>
                            <span className="text-[8px] text-gray-500 font-bold uppercase tracking-wider block mt-1">Days Left</span>
                          </div>
                        </div>
                      )
                    })()}
                  </div>
                </div>
              </div>

            </div>

            {/* Row 5: AI Insights & Memory Gallery Side-by-Side */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* AI Insights Section (lg:col-span-7) */}
              <div className="lg:col-span-7">
                <section 
                  onMouseMove={handleMouseMove}
                  className="glass-panel rounded-3xl border border-white/5 bg-[#120a22]/30 p-6 shadow-xl h-full relative overflow-hidden group hover:border-white/10 hover:bg-[#120a22]/40 transition-all duration-500 flex flex-col justify-between before:absolute before:inset-0 before:bg-[radial-gradient(180px_circle_at_var(--mx,0px)_var(--my,0px),rgba(255,255,255,0.05),transparent_80%)] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500 before:pointer-events-none"
                >
                  <div className="relative z-10">
                    <div className="flex items-center gap-2.5 mb-6">
                      <Sparkles className={`w-4 h-4 ${activeTheme.text}`} />
                      <h2 className="text-sm font-bold text-white uppercase tracking-wider">AI Insights</h2>
                      <span className="bg-purple-500/20 border border-purple-500/30 text-neonPurple text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-widest animate-pulse">New</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3.5 mb-6">
                      
                      {/* Insight 1: Smile */}
                      <div className="glass-panel border border-white/5 bg-black/20 p-3 rounded-2xl flex flex-col items-center justify-center text-center hover:border-white/10 transition-all duration-300">
                        <div className="w-8 h-8 rounded-full bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mb-2">
                          <Smile className="w-4 h-4 text-neonPink animate-bounce" />
                        </div>
                        <span className="text-[9px] text-gray-400 font-bold leading-tight">
                          You smiled the most during July.
                        </span>
                      </div>

                      {/* Insight 2: Mountain */}
                      <div className="glass-panel border border-white/5 bg-black/20 p-3 rounded-2xl flex flex-col items-center justify-center text-center hover:border-white/10 transition-all duration-300">
                        <div className="w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-2">
                          <Mountain className="w-4 h-4 text-cyan-400" />
                        </div>
                        <span className="text-[9px] text-gray-400 font-bold leading-tight">
                          You visited mountains 14 times.
                        </span>
                      </div>

                      {/* Insight 3: Clouds */}
                      <div className="glass-panel border border-white/5 bg-black/20 p-3 rounded-2xl flex flex-col items-center justify-center text-center hover:border-white/10 transition-all duration-300">
                        <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-2">
                          <CloudRain className="w-4 h-4 text-blue-400 animate-pulse" />
                        </div>
                        <span className="text-[9px] text-gray-400 font-bold leading-tight">
                          Rainy days in 23% of memories.
                        </span>
                      </div>

                      {/* Insight 4: Calendar */}
                      <div className="glass-panel border border-white/5 bg-black/20 p-3 rounded-2xl flex flex-col items-center justify-center text-center hover:border-white/10 transition-all duration-300">
                        <div className="w-8 h-8 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-2">
                          <Calendar className="w-4 h-4 text-neonPurple" />
                        </div>
                        <span className="text-[9px] text-gray-400 font-bold leading-tight">
                          Weekend memories make you happiest.
                        </span>
                      </div>

                    </div>
                  </div>

                  <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-[10px] font-extrabold text-white uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(236,72,153,0.3)] hover:opacity-90 active:scale-95 transition-all duration-300 cursor-pointer relative z-10">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate Monthly Report</span>
                  </button>
                </section>
              </div>

              {/* Memory Gallery Section (lg:col-span-5) */}
              <div className="lg:col-span-5">
                <section 
                  onMouseMove={handleMouseMove}
                  className="glass-panel rounded-3xl border border-white/5 bg-[#120a22]/30 p-6 shadow-xl h-full relative overflow-hidden group hover:border-white/10 hover:bg-[#120a22]/40 transition-all duration-500 flex flex-col justify-between before:absolute before:inset-0 before:bg-[radial-gradient(180px_circle_at_var(--mx,0px)_var(--my,0px),rgba(255,255,255,0.05),transparent_80%)] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500 before:pointer-events-none"
                >
                  <div className="flex justify-between items-center mb-4 relative z-10">
                    <div className="flex items-center gap-2.5">
                      <Heart className={`w-4 h-4 ${activeTheme.text}`} />
                      <h2 className="text-sm font-bold text-white uppercase tracking-wider">Memory Gallery</h2>
                    </div>
                    <span onClick={() => router.push('/memories')} className="text-[9px] text-blue-400 hover:underline cursor-pointer">View All</span>
                  </div>

                  {/* Horizontal scrolling list of Polaroids */}
                  <div className="flex gap-4 overflow-x-auto py-3 scrollbar-none snap-x snap-mandatory relative z-10">
                    
                    {/* Polaroid 1 */}
                    <motion.div
                      whileHover={{ y: -10, rotate: 0, scale: 1.1, zIndex: 30 }}
                      className="bg-white/10 p-1.5 pb-5 border border-white/15 rounded-lg shadow-lg relative flex-shrink-0 w-[84px] h-[102px] cursor-pointer select-none snap-start rotate-[-4deg] hover:shadow-[0_0_15px_rgba(168,85,247,0.35)] transition-all duration-200"
                    >
                      <img 
                        src="https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=150&q=80" 
                        alt="Walk" 
                        className="w-full h-[64px] object-cover rounded pointer-events-none"
                      />
                    </motion.div>

                    {/* Polaroid 2 */}
                    <motion.div
                      whileHover={{ y: -10, rotate: 0, scale: 1.1, zIndex: 30 }}
                      className="bg-white/10 p-1.5 pb-5 border border-white/15 rounded-lg shadow-lg relative flex-shrink-0 w-[84px] h-[102px] cursor-pointer select-none snap-start rotate-[3deg] hover:shadow-[0_0_15px_rgba(168,85,247,0.35)] transition-all duration-200"
                    >
                      <img 
                        src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=150&q=80" 
                        alt="Beach" 
                        className="w-full h-[64px] object-cover rounded pointer-events-none"
                      />
                    </motion.div>

                    {/* Polaroid 3 */}
                    <motion.div
                      whileHover={{ y: -10, rotate: 0, scale: 1.1, zIndex: 30 }}
                      className="bg-white/10 p-1.5 pb-5 border border-white/15 rounded-lg shadow-lg relative flex-shrink-0 w-[84px] h-[102px] cursor-pointer select-none snap-start rotate-[-2deg] hover:shadow-[0_0_15px_rgba(168,85,247,0.35)] transition-all duration-200"
                    >
                      <img 
                        src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=150&q=80" 
                        alt="Kiss" 
                        className="w-full h-[64px] object-cover rounded pointer-events-none"
                      />
                    </motion.div>

                    {/* Polaroid 4 */}
                    <motion.div
                      whileHover={{ y: -10, rotate: 0, scale: 1.1, zIndex: 30 }}
                      className="bg-white/10 p-1.5 pb-5 border border-white/15 rounded-lg shadow-lg relative flex-shrink-0 w-[84px] h-[102px] cursor-pointer select-none snap-start rotate-[5deg] hover:shadow-[0_0_15px_rgba(168,85,247,0.35)] transition-all duration-200"
                    >
                      <img 
                        src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=150&q=80" 
                        alt="Mountain" 
                        className="w-full h-[64px] object-cover rounded pointer-events-none"
                      />
                    </motion.div>

                    {/* Polaroid 5 */}
                    <motion.div
                      whileHover={{ y: -10, rotate: 0, scale: 1.1, zIndex: 30 }}
                      className="bg-white/10 p-1.5 pb-5 border border-white/15 rounded-lg shadow-lg relative flex-shrink-0 w-[84px] h-[102px] cursor-pointer select-none snap-start rotate-[-3deg] hover:shadow-[0_0_15px_rgba(168,85,247,0.35)] transition-all duration-200"
                    >
                      <img 
                        src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=150&q=80" 
                        alt="Sparklers" 
                        className="w-full h-[64px] object-cover rounded pointer-events-none"
                      />
                    </motion.div>

                  </div>
                </section>
              </div>

            </div>

          </div>

          {/* RIGHT ZONES: Widgets Column (Col Span 4) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Widget 1: Relationship Pulse */}
            <article 
              onMouseMove={handleMouseMove}
              className="glass-panel rounded-3xl border border-white/5 bg-[#120a22]/30 p-6 shadow-xl relative overflow-hidden group hover:border-white/10 hover:bg-[#120a22]/40 transition-all duration-500 before:absolute before:inset-0 before:bg-[radial-gradient(180px_circle_at_var(--mx,0px)_var(--my,0px),rgba(255,255,255,0.05),transparent_80%)] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500 before:pointer-events-none"
            >
              <div className="flex justify-between items-center mb-6 relative z-10">
                <div className="flex items-center gap-2.5">
                  <Heart className={`w-4 h-4 animate-pulse ${activeTheme.text}`} />
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">Relationship Pulse</h2>
                </div>
                <span className="text-xs text-gray-500 hover:text-white cursor-pointer transition-colors">•••</span>
              </div>

              {/* Radial Chart & EKG Heartbeat Area */}
              <div className="flex flex-col items-center py-4 relative z-10">
                
                {/* Radial Chart circle */}
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    {/* Background Track */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      className="stroke-white/5"
                      strokeWidth="5"
                      fill="transparent"
                    />
                    {/* Active Path (97% of 251.3 circumference) */}
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="url(#pulse-radial-grad)"
                      strokeWidth="5.5"
                      fill="transparent"
                      strokeDasharray="251.3"
                      initial={{ strokeDashoffset: 251.3 }}
                      animate={{ strokeDashoffset: 7.5 }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="pulse-radial-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={activeTheme.color} />
                        <stop offset="100%" stopColor="#a855f7" />
                      </linearGradient>
                    </defs>
                  </svg>
                  
                  {/* Center stats */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-extrabold text-white leading-none">97%</span>
                    <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider mt-1">Connected</span>
                  </div>
                </div>

                {/* Animated Heartbeat EKG wave */}
                <div className="w-full relative h-8 mt-4 flex items-center justify-center overflow-hidden">
                  {/* Laser Scan Sweep Line */}
                  {isScanning && (
                    <motion.div
                      animate={{ y: [-15, 15, -15] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-current to-transparent blur-[1px] opacity-90 pointer-events-none"
                      style={{ color: activeTheme.color }}
                    />
                  )}

                  {/* Pulse path SVG */}
                  <svg viewBox="0 0 200 30" className={`w-full h-full opacity-65 ${activeTheme.text} ${isScanning ? 'animate-pulse scale-y-125 duration-300' : ''}`}>
                    <path
                      d="M 10 15 H 70 L 75 5 L 80 25 L 85 15 H 90"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M 110 15 H 115 L 120 5 L 125 25 L 130 15 H 190"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  
                  {/* Centered pulsing Heart as button */}
                  <button 
                    onClick={handleStartScan}
                    disabled={isScanning}
                    className="absolute inset-0 flex items-center justify-center cursor-pointer group/heart active:scale-95 transition-transform"
                    title="Click to scan connection pulse"
                  >
                    <Heart className={`w-4 h-4 fill-current opacity-65 absolute ${activeTheme.text} ${
                      isScanning ? 'animate-[ping_0.5s_infinite] scale-150' : 'animate-ping group-hover/heart:scale-125 transition-transform'
                    }`} />
                    <Heart className={`w-4 h-4 fill-current relative z-10 ${activeTheme.text} ${activeTheme.glowHeart} ${
                      isScanning ? 'animate-pulse scale-110' : 'group-hover/heart:scale-110 transition-transform'
                    }`} />
                  </button>
                </div>

                {/* AI Scan Trigger Button */}
                <button
                  onClick={handleStartScan}
                  disabled={isScanning}
                  className={`w-full py-2 px-4 rounded-xl border text-[10px] font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-4 relative overflow-hidden group/btn ${
                    isScanning 
                      ? 'bg-white/5 border-white/10 text-gray-500 cursor-not-allowed shadow-none'
                      : `bg-white/5 border-white/10 hover:border-current hover:bg-[#120a22]/50 text-white shadow-[0_0_15px_rgba(255,255,255,0.02)]`
                  }`}
                  style={{ color: !isScanning ? activeTheme.color : undefined }}
                >
                  <Sparkles className={`w-3 h-3 ${!isScanning ? 'animate-pulse' : ''}`} />
                  {isScanning ? 'Syncing pulses...' : 'AI Connection Scan'}
                </button>

              </div>

                  {/* 2x2 Grid Statistics */}
                  <div className="grid grid-cols-2 gap-y-5 gap-x-4 pt-5 border-t border-white/5 mt-2 text-center relative z-10">
                    <div>
                      <span className="text-base font-extrabold text-white block leading-tight">{firestoreStats.daysShared}</span>
                      <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider mt-0.5 block">
                        Days Together
                      </span>
                    </div>
                    <div>
                      <span className="text-base font-extrabold text-white block leading-tight">{firestoreStats.memoryCount}</span>
                      <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider mt-0.5 block">
                        Memories
                      </span>
                    </div>
                    <div>
                      <span className="text-base font-extrabold text-white block leading-tight">{firestoreStats.memberCount}</span>
                      <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider mt-0.5 block">
                        Members
                      </span>
                    </div>
                    <div>
                      <span className="text-base font-extrabold text-white block leading-tight">100%</span>
                      <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider mt-0.5 block">
                        Secure
                      </span>
                    </div>
                  </div>
            </article>

            {/* Widget 2: Today's Prompt */}
            <article 
              onMouseMove={handleMouseMove}
              className="glass-panel rounded-3xl border border-white/5 bg-[#120a22]/30 p-5 shadow-xl relative overflow-hidden group hover:border-white/10 transition-all duration-300 before:absolute before:inset-0 before:bg-[radial-gradient(180px_circle_at_var(--mx,0px)_var(--my,0px),rgba(255,255,255,0.05),transparent_80%)] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500 before:pointer-events-none"
            >
              <div className="relative z-10">
                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block mb-2">
                  Today&apos;s Prompt
                </span>
                <p className="text-xs font-semibold text-white tracking-wide leading-relaxed">
                  &ldquo;What&apos;s one memory you never want to forget?&rdquo;
                </p>
              </div>
            </article>

            {/* Widget 3: Memory of the Day */}
            <article 
              onMouseMove={handleMouseMove}
              className="glass-panel rounded-3xl border border-white/5 bg-[#120a22]/30 p-5 shadow-xl relative overflow-hidden group hover:border-white/10 transition-all duration-300 before:absolute before:inset-0 before:bg-[radial-gradient(180px_circle_at_var(--mx,0px)_var(--my,0px),rgba(255,255,255,0.05),transparent_80%)] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500 before:pointer-events-none"
            >
              <div className="relative z-10">
                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block mb-3">
                  Memory of the Day
                </span>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img 
                      src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=120&q=80" 
                      alt="Sunset" 
                      className="w-11 h-11 rounded-lg object-cover border border-white/10"
                    />
                    <div>
                      <span className="text-xs font-bold text-white block">Sunset at Marine Drive</span>
                      <span className="text-[9px] text-gray-500 font-bold mt-0.5 block">12 May 2024</span>
                    </div>
                  </div>
                  <Heart className={`w-4 h-4 fill-current animate-pulse ${activeTheme.text} ${activeTheme.glowHeart}`} />
                </div>
              </div>
            </article>

            {/* Widget 4: Current Streak */}
            <article 
              onMouseMove={handleMouseMove}
              className="glass-panel rounded-3xl border border-white/5 bg-[#120a22]/30 p-6 shadow-xl relative overflow-hidden group hover:border-white/10 hover:bg-[#120a22]/40 transition-all duration-500 before:absolute before:inset-0 before:bg-[radial-gradient(180px_circle_at_var(--mx,0px)_var(--my,0px),rgba(255,255,255,0.05),transparent_80%)] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500 before:pointer-events-none"
            >
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block">
                    Current Streak
                  </span>
                  <span className="text-xs text-gray-500 hover:text-white cursor-pointer transition-colors">•••</span>
                </div>
                
                <div className="flex items-baseline">
                  <span className="text-3xl font-extrabold text-white leading-none">143</span>
                  <span className="text-xs font-semibold text-gray-400 ml-1.5">Days</span>
                </div>

                {/* Sparkline wave path */}
                <div className="w-full h-12 mt-4 relative">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 200 40">
                    <path
                      d="M 0 30 Q 25 15, 50 28 T 100 20 T 150 32 T 200 15"
                      fill="none"
                      stroke="#ff4b91"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      className="drop-shadow-[0_0_8px_rgba(255,75,145,0.7)]"
                    />
                    <path
                      d="M 0 30 Q 25 15, 50 28 T 100 20 T 150 32 T 200 15 L 200 40 L 0 40 Z"
                      fill="url(#streak-grad)"
                      className="opacity-15"
                    />
                    <defs>
                      <linearGradient id="streak-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#ff4b91" />
                        <stop offset="100%" stopColor="transparent" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
            </article>

            {/* Widget 5: Weather */}
            <article 
              onMouseMove={handleMouseMove}
              className="glass-panel rounded-3xl border border-white/5 bg-[#120a22]/30 p-5 shadow-xl relative overflow-hidden group hover:border-white/10 hover:bg-[#120a22]/40 transition-all duration-500 flex items-center justify-between before:absolute before:inset-0 before:bg-[radial-gradient(180px_circle_at_var(--mx,0px)_var(--my,0px),rgba(255,255,255,0.05),transparent_80%)] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500 before:pointer-events-none"
            >
              <div className="relative z-10">
                <span className="text-2xl font-extrabold text-white block">18°C</span>
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block mt-1">
                  Paris &bull; Clear Skies
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0 relative z-10">
                <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
              </div>
            </article>

          </div>

        </div>

      </div>

      <AIPulseModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        spaceData={spaceData}
        stats={{
          daysTogether: firestoreStats.daysShared,
          streak: firestoreStats.memoryCount,
          adventures: Math.floor(firestoreStats.memoryCount / 3),
          milestones: Math.floor(firestoreStats.memoryCount / 5),
        }}
        activeTheme={activeTheme}
      />
    </div>
  )
}
