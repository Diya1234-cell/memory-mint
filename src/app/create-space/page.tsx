'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { uploadImage } from '@/services/storageService'
import { QRCodeSVG } from '@/components/ui/QRCode'
import { 
  Heart, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft,
  Upload,
  Settings,
  Check,
  Mail,
  Link as LinkIcon,
  QrCode,
  Copy
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { createSpace } from '@/services/spaceServices'
import { useAuth } from '@/providers/AuthProvider'
import { createInvite } from '@/services/firestoreService'

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 49267
  return x - Math.floor(x)
}

// Google Fonts for cursive preview text
const fontLink = "https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&display=swap"

export default function CreateSpacePage() {
  const router = useRouter()
  // Onboarding Wizard States
  const [step, setStep] = useState(1) // 1, 2, 3, or 4
  const [direction, setDirection] = useState(1) // for transition direction
  const [selectedRelation, setSelectedRelation] = useState<'couple' | 'family' | 'friends' | null>(null)
  
  // Form details for Step 2
  const [spaceName, setSpaceName] = useState('Our Little Universe')
  const [themeColor, setThemeColor] = useState('pink') // pink, purple, blue, green, orange, gold
  const [specialDate, setSpecialDate] = useState('2024-12-05')
  const [relationshipEmoji, setRelationshipEmoji] = useState('💖')
  const [description, setDescription] = useState('A place where our memories live forever and our story continues.')
  const [category, setCategory] = useState('Our Journey')
  const [isPrivate, setIsPrivate] = useState(true)
  const [coverPhoto, setCoverPhoto] = useState('https://images.unsplash.com/photo-1501908731398-23b3efd7ccab?auto=format&fit=crop&w=350&q=80')
  const [inviteUrl, setInviteUrl] = useState('https://foreverremebered.com/join?invite=8xK')
  
  // Invite States for Step 3
  const [emailInput, setEmailInput] = useState('')
  const [copied, setCopied] = useState(false)
  const [invites, setInvites] = useState([
    { email: 'alex@example.com', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80', time: 'Invited 2m ago', status: 'Pending' },
    { email: 'jordan@example.com', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80', time: 'Invited 1h ago', status: 'Pending' },
    { email: 'taylor@example.com', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80', time: 'Invited 1d ago', status: 'Accepted' },
  ])

  // Mouse coordinates for spot glow & parallax
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 })
  
  const { user, loading } = useAuth()

  const [spaceId, setSpaceId] = useState<string | null>(null)
  const [inviteLoading, setInviteLoading] = useState(false)
  const [inviteError, setInviteError] = useState('')

  // Step 4 Success States
  const [isCtaHovered, setIsCtaHovered] = useState(false)
  const [isEnding, setIsEnding] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [createError, setCreateError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const objectUrlRef = useRef<string | null>(null)
  const uploadVersionRef = useRef(0)

  // Floating Cosmic Particles State
  const [particles] = useState(() => 
    Array.from({ length: 22 }).map((_, i) => ({
      id: i,
      x: seededRandom(i * 5) * 100,
      y: seededRandom(i * 5 + 1) * 100,
      size: seededRandom(i * 5 + 2) * 2 + 0.8,
      delay: seededRandom(i * 5 + 3) * 4,
      duration: seededRandom(i * 5 + 4) * 12 + 12
    }))
  )

  // Tracker cursor updates
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
      setParallaxOffset({
        x: (e.clientX - window.innerWidth / 2) * 0.016,
        y: (e.clientY - window.innerHeight / 2) * 0.016
      })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Load cursive fonts inside head
  useEffect(() => {
    const link = document.createElement('link')
    link.href = fontLink
    link.rel = 'stylesheet'
    document.head.appendChild(link)
    return () => {
      document.head.removeChild(link)
    }
  }, [])

  useEffect(() => {
    setInviteUrl(`${window.location.origin}/join?invite=8xK`)
  }, [])

  useEffect(() => {
    return () => {
      uploadVersionRef.current += 1
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current)
      }
    }
  }, [])

  // Theme details configuration
  const themeDetails = {
    purple: { name: 'Nebula Purple', color: '#a855f7', glow: 'rgba(168,85,247,0.4)', shadow: 'shadow-[0_0_20px_rgba(168,85,247,0.4)]', border: 'border-neonPurple/40', text: 'text-neonPurple' },
    galaxy: { name: 'Midnight Galaxy', color: '#3b82f6', glow: 'rgba(59,130,246,0.4)', shadow: 'shadow-[0_0_20px_rgba(59,130,246,0.4)]', border: 'border-blue-500/40', text: 'text-blue-400' },
    pink: { name: 'Aurora Pink', color: '#ff4b91', glow: 'rgba(255,75,145,0.4)', shadow: 'shadow-[0_0_20px_rgba(255,75,145,0.4)]', border: 'border-neonPink/40', text: 'text-neonPink' },
    blue: { name: 'Ocean Blue', color: '#06b6d4', glow: 'rgba(6,182,212,0.4)', shadow: 'shadow-[0_0_20px_rgba(6,182,212,0.4)]', border: 'border-cyan-500/40', text: 'text-cyan-400' },
    green: { name: 'Emerald Forest', color: '#10b981', glow: 'rgba(16,185,129,0.4)', shadow: 'shadow-[0_0_20px_rgba(16,185,129,0.4)]', border: 'border-emerald-500/40', text: 'text-emerald-400' },
    gold: { name: 'Golden Sunset', color: '#f59e0b', glow: 'rgba(245,158,11,0.4)', shadow: 'shadow-[0_0_20px_rgba(245,158,11,0.4)]', border: 'border-amber-500/40', text: 'text-amber-400' },
  }

  const changeStep = (newStep: number) => {
    setDirection(newStep > step ? 1 : -1)
    setStep(newStep)
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleAddInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!emailInput || !user) return

    setInviteLoading(true)
    setInviteError('')

    try {
      let currentSpaceId = spaceId
      if (!currentSpaceId) {
        const result = await createSpace(
          spaceName,
          user.uid,
          selectedRelation ?? 'friends'
        )
        if (!result.success) {
          setInviteError('Failed to create space.')
          setInviteLoading(false)
          return
        }
        currentSpaceId = result.id!
        setSpaceId(currentSpaceId)
      }

      const inviteResult = await createInvite(
        currentSpaceId,
        user.uid,
        emailInput
      )
      if (!inviteResult.success) {
        setInviteError('Failed to create invite.')
        setInviteLoading(false)
        return
      }

      setInvites([
        {
          email: emailInput,
          avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 99999)}?auto=format&fit=crop&w=80&q=80`,
          time: 'Invited just now',
          status: 'Pending'
        },
        ...invites
      ])
      setEmailInput('')
    } catch {
      setInviteError('Something went wrong.')
    } finally {
      setInviteLoading(false)
    }
  }

  const handleFinalEnter = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (loading) {
      return
    }
    if (!user) {
      setCreateError('You must be logged in to create a space.')
      return
    }
    if (!selectedRelation) {
      setCreateError('Please select a relationship type.')
      return
    }
    setCreateError('')
    setIsLoading(true)

    let resultSpaceId = spaceId
    if (!resultSpaceId) {
      const result = await createSpace(spaceName, user.uid, selectedRelation)
      if (!result.success) {
        setCreateError(result.error?.message ?? 'Failed to create space.')
        setIsLoading(false)
        return
      }
      resultSpaceId = result.id!
    }

    const setupData = {
      spaceName,
      themeColor,
      specialDate,
      relationshipEmoji,
      description,
      category,
      isPrivate,
      coverPhoto,
      selectedRelation,
      invites,
      spaceId: resultSpaceId,
    }
    localStorage.setItem('memory-universe-setup', JSON.stringify(setupData))

    setIsEnding(true)
    setTimeout(() => {
      router.push('/dashboard')
    }, 1000)
  }

  const presetPhotos = [
    'https://images.unsplash.com/photo-1501908731398-23b3efd7ccab?auto=format&fit=crop&w=350&q=80',
    'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=350&q=80',
    'https://images.unsplash.com/photo-1494905998402-395d579af36f?auto=format&fit=crop&w=350&q=80'
  ]

  const saveCoverPhoto = (nextCoverPhoto: string, objectUrl?: string) => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current)
    }
    objectUrlRef.current = objectUrl ?? null
    setCoverPhoto(nextCoverPhoto)

    const setupData = {
      spaceName,
      themeColor,
      specialDate,
      relationshipEmoji,
      description,
      category,
      isPrivate,
      coverPhoto: nextCoverPhoto,
      selectedRelation,
      invites
    }
    localStorage.setItem('memory-universe-setup', JSON.stringify(setupData))
    window.dispatchEvent(new Event('storage'))
  }

  const handleCoverImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) return

    const supportedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/heic']
    const hasSupportedExtension = /\.(jpe?g|png|webp|gif|heic)$/i.test(file.name)
    if (!supportedImageTypes.includes(file.type) && !hasSupportedExtension) return

    const uploadVersion = ++uploadVersionRef.current
    const objectUrl = URL.createObjectURL(file)
    saveCoverPhoto(objectUrl, objectUrl)

    if (process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET) {
      const result = await uploadImage(file, 'pending-space')
      if (result.success && uploadVersion === uploadVersionRef.current) {
        saveCoverPhoto(result.url)
      }
    }
  }

  const handleCycleCover = () => {
    uploadVersionRef.current += 1
    const currentIndex = presetPhotos.indexOf(coverPhoto)
    const nextIndex = (currentIndex + 1) % presetPhotos.length
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current)
      objectUrlRef.current = null
    }
    setCoverPhoto(presetPhotos[nextIndex])
  }

  // Transitions
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 120 : -120,
      opacity: 0,
      filter: 'blur(4px)'
    }),
    center: {
      x: 0,
      opacity: 1,
      filter: 'blur(0px)',
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as any }
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 120 : -120,
      opacity: 0,
      filter: 'blur(4px)',
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as any }
    })
  }

  const currentTheme = themeDetails[themeColor as keyof typeof themeDetails] || themeDetails.pink

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login')
    }
  }, [loading, user, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className={`relative min-h-screen text-slate-100 font-sans overflow-x-hidden pb-12 flex flex-col justify-between transition-opacity duration-1000 ease-out ${
      isEnding ? 'opacity-0' : 'opacity-100'
    }`}>
      
      {/* CSS Styles for GPU-optimized animations and glare effects */}
      <style jsx global>{`
        @keyframes scan {
          0%, 100% { transform: translate3d(0, 0, 0); opacity: 0.8; }
          50% { transform: translate3d(0, 48px, 0); opacity: 0.8; }
        }
        .scan-line {
          position: absolute;
          top: 120px;
          left: 4%;
          right: 4%;
          height: 2px;
          background: #ff4b91;
          box-shadow: 0 0 8px #ff4b91, 0 0 12px #ff4b91;
          animation: scan 2.6s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          will-change: transform;
        }

        @keyframes particleEmit {
          0% { transform: translate3d(-50%, -50%, 0) scale(1); opacity: 1; }
          100% { transform: translate3d(calc(-50% + var(--mx)), calc(-50% + var(--my)), 0) scale(0); opacity: 0; }
        }
        .particle-point {
          animation: particleEmit 0.85s cubic-bezier(0.1, 0.8, 0.3, 1) infinite;
          will-change: transform, opacity;
        }

        @keyframes orbit-1 {
          0%, 100% { transform: translate3d(0px, 0px, 0) rotate(14deg); }
          50% { transform: translate3d(15px, -15px, 0) rotate(18deg); }
        }
        @keyframes orbit-2 {
          0%, 100% { transform: translate3d(0px, 0px, 0) rotate(-10deg); }
          50% { transform: translate3d(-20px, 15px, 0) rotate(-4deg); }
        }
        @keyframes orbit-3 {
          0%, 100% { transform: translate3d(0px, 0px, 0) rotate(6deg); }
          50% { transform: translate3d(15px, 20px, 0) rotate(2deg); }
        }
        .orbit-photo-1 { animation: orbit-1 7.5s ease-in-out infinite; will-change: transform; }
        .orbit-photo-2 { animation: orbit-2 8.5s ease-in-out infinite; will-change: transform; }
        .orbit-photo-3 { animation: orbit-3 9.5s ease-in-out infinite; will-change: transform; }

        @keyframes float-particle {
          0% { transform: translate3d(0, 0, 0); opacity: 0; }
          25% { opacity: 0.6; }
          75% { opacity: 0.6; }
          100% { transform: translate3d(20px, -45px, 0); opacity: 0; }
        }

        /* Constellation constellation line scaling pulse */
        @keyframes strokePulse {
          0%, 100% { stroke-dashoffset: 0; stroke-opacity: 0.35; }
          50% { stroke-dashoffset: 20; stroke-opacity: 0.7; }
        }
        .pulse-stroke {
          stroke-dasharray: 4 4;
          animation: strokePulse 5s linear infinite;
        }
      `}</style>

      {/* Floating Cosmic Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {particles.map((p) => (
          <div 
            key={p.id}
            className="absolute rounded-full bg-white/20"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animation: `float-particle ${p.duration}s linear infinite`,
              animationDelay: `${p.delay}s`,
              willChange: 'transform, opacity'
            }}
          />
        ))}
      </div>

      {/* Active Mouse Glow Spotlight overlay */}
      <div 
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300 opacity-60"
        style={{
          background: `radial-gradient(550px at ${mousePos.x}px ${mousePos.y}px, rgba(255, 75, 145, 0.08), rgba(168, 85, 247, 0.03), transparent 85%)`
        }}
      />

      {/* Background stardust glow effects - parallax offset active */}
      <div 
        className={`fixed top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-neonPurple/10 blur-[130px] pointer-events-none z-0 transition-all duration-1000 ${
          step === 4 ? 'opacity-100 scale-110' : 'opacity-80'
        }`}
        style={{
          transform: `translate3d(${parallaxOffset.x * 0.8}px, ${parallaxOffset.y * 0.8}px, 0)`,
          willChange: 'transform'
        }}
      />
      <div 
        className={`fixed bottom-[20%] right-[-10%] w-[550px] h-[550px] rounded-full bg-neonPink/5 blur-[120px] pointer-events-none z-0 transition-all duration-1000 ${
          step === 4 ? 'opacity-100 scale-110' : 'opacity-85'
        }`}
        style={{
          transform: `translate3d(${parallaxOffset.x * -0.6}px, ${parallaxOffset.y * -0.6}px, 0)`,
          willChange: 'transform'
        }}
      />

      {/* HEADER */}
      <header className="w-full flex items-center justify-between py-6 px-6 md:px-12 z-50 relative">
        <div className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-neonPink to-neonPurple flex items-center justify-center shadow-glow-pink">
            <Heart className="w-4.5 h-4.5 text-white fill-current animate-pulse" />
          </div>
          {/* Note exact brand spelling: Forever Remebered */}
          <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white to-pink-100 bg-clip-text text-transparent">
            Forever Remebered
          </span>
        </div>
        <button 
          onClick={() => router.push('/')}
          className="px-4 py-2 text-xs font-semibold text-gray-400 bg-white/5 border border-white/10 rounded-xl hover:text-white hover:bg-white/10 active:scale-95 transition-all duration-300 flex items-center gap-2"
        >
          Exit Setup <span className="font-sans text-xs">✕</span>
        </button>
      </header>

      {/* PROGRESS TRACKER */}
      <div className="w-full max-w-3xl mx-auto px-6 relative z-10 mt-4 mb-8">
        <div className="flex items-center justify-between">
          {[
            { id: 1, label: 'Choose Relationship' },
            { id: 2, label: 'Customize' },
            { id: 3, label: 'Invite' },
            { id: 4, label: 'Complete' },
          ].map((s, idx) => (
            <div key={s.id} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center relative">
                <button
                  disabled={s.id > step || isLoading}
                  onClick={() => changeStep(s.id)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-extrabold transition-all duration-500 z-10 border ${
                    step === s.id
                      ? 'bg-neonPink border-neonPink text-white shadow-[0_0_20px_#ff4b91]'
                      : step > s.id
                      ? 'bg-neonPink border-neonPink text-white shadow-[0_0_10px_#ff4b91]'
                      : 'bg-[#12082b]/60 border-white/10 text-gray-500'
                  }`}
                >
                  {step > s.id ? <Check className="w-4 h-4 text-white stroke-[3px]" /> : s.id}
                </button>
                <span className={`text-[9px] font-bold uppercase tracking-widest mt-2.5 absolute top-9 whitespace-nowrap transition-colors duration-300 ${
                  step >= s.id ? 'text-gray-200' : 'text-gray-500'
                }`}>
                  {s.label}
                </span>
              </div>
              
              {idx < 3 && (
                <div className="flex-1 h-[2px] bg-white/5 mx-3 relative overflow-hidden">
                  <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-neonPink to-neonPurple transition-all duration-500" 
                    style={{ 
                      width: step > s.id ? '100%' : step === 3 && s.id === 3 ? '0%' : step === 3 ? '100%' : step === 2 && s.id === 2 ? '0%' : step === 2 && s.id === 1 ? '100%' : '0%',
                      transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CENTRAL CONTENT CONTAINER */}
      <div className="w-full max-w-7xl mx-auto px-6 relative z-10 my-6 flex-1 flex flex-col justify-center">
        
        {/* Floating Heart Constellation Backdrop with parallax movement */}
        <div 
          className="absolute top-1/4 right-[15%] w-36 h-36 opacity-35 text-neonPink drop-shadow-[0_0_12px_rgba(255,75,145,0.7)] animate-pulse pointer-events-none hidden lg:block z-0"
          style={{
            transform: `translate3d(${parallaxOffset.x * 1.5}px, ${parallaxOffset.y * 1.5}px, 0)`,
            willChange: 'transform'
          }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-current" strokeWidth="1" strokeDasharray="3 3">
            <path d="M50 30 C40 10, 10 10, 10 35 C10 60, 50 85, 50 85 C50 85, 90 60, 90 35 C90 10, 60 10, 50 30 Z" className="pulse-stroke" />
            <circle cx="50" cy="30" r="1.5" fill="#fff" />
            <circle cx="10" cy="35" r="1.5" fill="#fff" />
            <circle cx="90" cy="35" r="1.5" fill="#fff" />
            <circle cx="50" cy="85" r="1.5" fill="#fff" />
          </svg>
        </div>

        {/* Decorative Saturn Planet Floating with parallax movement */}
        <div 
          className="absolute bottom-20 left-12 w-16 h-16 pointer-events-none opacity-40 animate-pulse hidden lg:block"
          style={{
            transform: `translate3d(${parallaxOffset.x * -1.8}px, ${parallaxOffset.y * -1.8}px, 0)`,
            willChange: 'transform'
          }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-neonPink" strokeWidth="1.5">
            <circle cx="50" cy="50" r="22" className="fill-[#0c071e]/70" />
            <ellipse cx="50" cy="50" rx="45" ry="12" transform="rotate(-25 50 50)" />
          </svg>
        </div>

        {/* Extra Animated Planet Bottom-Right */}
        <div 
          className="absolute bottom-24 right-16 w-14 h-14 pointer-events-none opacity-40 animate-pulse hidden lg:block"
          style={{
            transform: `translate3d(${parallaxOffset.x * 1.2}px, ${parallaxOffset.y * 1.2}px, 0)`,
            willChange: 'transform'
          }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-neonPurple" strokeWidth="1.5">
            <circle cx="50" cy="50" r="18" className="fill-[#0c071e]/70" />
            <ellipse cx="50" cy="50" rx="35" ry="9" transform="rotate(15 50 50)" />
          </svg>
        </div>

        {/* Extra Animated Moon Top-Left */}
        <div 
          className="absolute top-20 left-24 w-10 h-10 pointer-events-none opacity-30 animate-pulse hidden lg:block"
          style={{
            transform: `translate3d(${parallaxOffset.x * -1.5}px, ${parallaxOffset.y * -1.5}px, 0)`,
            willChange: 'transform'
          }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-indigo-400" strokeWidth="1.5">
            <circle cx="50" cy="50" r="15" className="fill-[#0c071e]/50" />
            <circle cx="35" cy="35" r="3" fill="currentColor" />
            <circle cx="65" cy="55" r="2.2" fill="currentColor" />
          </svg>
        </div>

        {/* Floating Heart Constellation Backdrop Left */}
        <div 
          className="absolute top-1/3 left-[15%] w-28 h-28 opacity-25 text-neonPurple drop-shadow-[0_0_10px_rgba(168,85,247,0.6)] animate-pulse pointer-events-none hidden lg:block z-0"
          style={{
            transform: `translate3d(${parallaxOffset.x * -1.2}px, ${parallaxOffset.y * -1.2}px, 0)`,
            willChange: 'transform'
          }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-current" strokeWidth="1" strokeDasharray="3 3">
            <path d="M50 30 C40 10, 10 10, 10 35 C10 60, 50 85, 50 85 C50 85, 90 60, 90 35 C90 10, 60 10, 50 30 Z" className="pulse-stroke" />
            <circle cx="50" cy="30" r="1.5" fill="#fff" />
            <circle cx="10" cy="35" r="1.5" fill="#fff" />
            <circle cx="90" cy="35" r="1.5" fill="#fff" />
            <circle cx="50" cy="85" r="1.5" fill="#fff" />
          </svg>
        </div>

        {/* Small floating hearts */}
        <div className="absolute top-[20%] right-[30%] opacity-20 text-neonPink animate-bounce pointer-events-none hidden lg:block">
          <Heart className="w-4 h-4 fill-current" />
        </div>
        <div className="absolute bottom-[30%] left-[25%] opacity-20 text-neonPurple animate-bounce pointer-events-none hidden lg:block" style={{ animationDelay: '1.5s' }}>
          <Heart className="w-3.5 h-3.5 fill-current" />
        </div>

        {/* Polaroid 1 (Left Column Top) */}
        <div 
          className={`absolute left-[6%] top-[25%] pointer-events-none hidden xl:block z-10 select-none ${
            step === 4 ? 'orbit-photo-1' : 'polaroid-float'
          }`}
          style={{
            transform: `translate3d(${parallaxOffset.x * -0.5}px, ${parallaxOffset.y * -0.5}px, 0)`,
            willChange: 'transform'
          }}
        >
          <div className="w-24 h-28 bg-[#180a32]/70 backdrop-blur-md border border-white/10 p-1.5 rounded-lg shadow-lg rotate-[-12deg]">
            <div className="w-full h-20 bg-cover bg-center rounded bg-white/5" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=200&q=80')" }}></div>
          </div>
        </div>

        {/* Polaroid 2 (Left Column Bottom) */}
        <div 
          className={`absolute left-[8%] top-[55%] pointer-events-none hidden xl:block z-10 select-none ${
            step === 4 ? 'orbit-photo-2' : 'polaroid-float'
          }`}
          style={{
            transform: `translate3d(${parallaxOffset.x * -0.3}px, ${parallaxOffset.y * -0.3}px, 0)`,
            willChange: 'transform',
            animationDelay: '-2.5s'
          }}
        >
          <div className="w-24 h-28 bg-[#180a32]/70 backdrop-blur-md border border-white/10 p-1.5 rounded-lg shadow-lg rotate-[10deg]">
            <div className="w-full h-20 bg-cover bg-center rounded bg-white/5" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=200&q=80')" }}></div>
          </div>
        </div>

        {/* Polaroid 3 (Right Column Flank) */}
        <div 
          className={`absolute right-[8%] top-[40%] pointer-events-none hidden xl:block z-10 select-none ${
            step === 4 ? 'orbit-photo-3' : 'polaroid-float'
          }`}
          style={{
            transform: `translate3d(${parallaxOffset.x * 0.4}px, ${parallaxOffset.y * 0.4}px, 0)`,
            willChange: 'transform',
            animationDelay: '-4.5s'
          }}
        >
          <div className="w-24 h-28 bg-[#180a32]/70 backdrop-blur-md border border-white/10 p-1.5 rounded-lg shadow-lg rotate-[14deg]">
            <div className="w-full h-20 bg-cover bg-center rounded bg-white/5" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1494905998402-395d579af36f?auto=format&fit=crop&w=200&q=80')" }}></div>
          </div>
        </div>

        {/* Animated steps */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full"
          >
            {step === 1 && (
              <div className="flex flex-col items-center">
                {/* Title & Subtitle */}
                <div className="text-center max-w-xl mx-auto mb-10">
                  <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight flex items-center justify-center gap-2">
                    Create Your <br className="xs:hidden" />
                    <span className="bg-gradient-to-r from-neonPink to-neonPurple bg-clip-text text-transparent animate-pulse">Memory Universe</span>
                    <Sparkles className="w-5 h-5 text-neonPink drop-shadow-[0_0_8px_rgba(255,75,145,0.8)]" />
                  </h2>
                  <p className="text-xs text-gray-400 mt-3 leading-relaxed">
                    Every meaningful relationship begins with a shared space.
                  </p>
                </div>

                {/* Cards Options Grid */}
                <div className="grid md:grid-cols-3 gap-6 max-w-5xl w-full px-4 mb-8">
                  {/* Card 1: Couple */}
                  <div 
                    onClick={() => setSelectedRelation('couple')}
                    className={`glass-panel rounded-3xl overflow-hidden cursor-pointer relative transition-all duration-500 border group ${
                      selectedRelation === 'couple'
                        ? 'border-neonPink shadow-[0_0_30px_rgba(255,75,145,0.45)] bg-[#120a22]/80 scale-[1.03]'
                        : 'border-white/5 bg-[#120a22]/30 hover:border-white/10 hover:bg-[#120a22]/50 hover:translate-y-[-6px] hover:shadow-[0_15px_30px_rgba(168,85,247,0.15)]'
                    }`}
                    style={{ willChange: 'transform, border-color, box-shadow' }}
                  >
                    <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none z-10" />

                    <AnimatePresence>
                      {selectedRelation === 'couple' && (
                        <motion.div 
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="absolute top-4 right-4 w-5 h-5 rounded-full bg-neonPink flex items-center justify-center z-20 shadow-glow-pink"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-white">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Illustration */}
                    <div className="relative w-full h-48 bg-gradient-to-b from-[#1a0832]/50 to-[#0c051a]/20 flex items-center justify-center border-b border-white/5 overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,75,145,0.22)_0%,transparent_60%)] animate-pulse" />
                      <div className="w-32 h-32 relative opacity-90">
                        <svg viewBox="0 0 100 100" className="w-full h-full fill-none">
                          <circle cx="50" cy="50" r="38" className="stroke-neonPink/25 stroke-dasharray-[3_3]" />
                          <path d="M50 15 C42 5, 20 5, 20 28 C20 48, 50 72, 50 72 C50 72, 80 48, 80 28 C80 5, 58 5, 50 15 Z" className="stroke-neonPink/30" strokeWidth="1" />
                          <path d="M26 95 C26 95 28 85 36 82 C44 79 43 72 43 68 C43 64 45 61 43 58 C41 55 42 52 44 50 C46 48 45 42 41 40 C37 38 35 41 34 45 C33 49 28 53 25 57 C22 61 20 75 20 95 Z" fill="#06030f" />
                          <path d="M74 95 C74 95 72 85 64 82 C56 79 57 72 57 68 C57 64 55 61 57 58 C59 55 58 52 56 50 C54 48 55 42 59 40 C63 38 65 41 66 45 C67 49 72 53 75 57 C78 61 80 75 80 95 Z" fill="#06030f" />
                        </svg>
                      </div>
                    </div>
                    {/* Info */}
                    <div className="p-6 flex flex-col items-center text-center">
                      <div className="w-10 h-10 rounded-full border border-neonPink/30 flex items-center justify-center mb-4 bg-neonPink/5">
                        <span className="text-lg">❤️</span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">Couple</h3>
                      <p className="text-xs text-gray-400 leading-relaxed max-w-[220px]">
                        Build a private universe for two.
                      </p>
                    </div>
                  </div>

                  {/* Card 2: Family */}
                  <div 
                    onClick={() => setSelectedRelation('family')}
                    className={`glass-panel rounded-3xl overflow-hidden cursor-pointer relative transition-all duration-500 border group ${
                      selectedRelation === 'family'
                        ? 'border-neonPink shadow-[0_0_30px_rgba(255,75,145,0.45)] bg-[#120a22]/80 scale-[1.03]'
                        : 'border-white/5 bg-[#120a22]/30 hover:border-white/10 hover:bg-[#120a22]/50 hover:translate-y-[-6px] hover:shadow-[0_15px_30px_rgba(168,85,247,0.15)]'
                    }`}
                    style={{ willChange: 'transform, border-color, box-shadow' }}
                  >
                    <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none z-10" />

                    <AnimatePresence>
                      {selectedRelation === 'family' && (
                        <motion.div 
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="absolute top-4 right-4 w-5 h-5 rounded-full bg-neonPink flex items-center justify-center z-20 shadow-glow-pink"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-white">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Illustration */}
                    <div className="relative w-full h-48 bg-gradient-to-b from-[#1a0832]/50 to-[#0c051a]/20 flex items-center justify-center border-b border-white/5 overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.18)_0%,transparent_60%)] animate-pulse" />
                      <div className="w-32 h-32 relative opacity-90">
                        <svg viewBox="0 0 100 100" className="w-full h-full fill-none">
                          <circle cx="50" cy="50" r="38" className="stroke-neonPurple/20" />
                          <line x1="28" y1="40" x2="50" y2="22" stroke="#a855f7" strokeWidth="1" strokeOpacity="0.4" strokeDasharray="2 2" />
                          <line x1="50" y1="22" x2="72" y2="40" stroke="#a855f7" strokeWidth="1" strokeOpacity="0.4" strokeDasharray="2 2" />
                          <path d="M35 95 C35 85 39 80 43 80 C47 80 48 76 48 73 C48 69 50 66 48 63 C46 60 47 57 49 55 C51 53 50 47 46 45 C42 43 40 46 39 50 C38 54 33 58 30 62 C27 66 25 78 25 95 Z" fill="#06030f" />
                          <path d="M65 95 C65 85 61 80 57 80 C53 80 52 76 52 73 C52 69 50 66 52 63 C54 60 53 57 51 55 C49 53 50 47 54 45 C58 43 60 46 61 50 C62 54 67 58 70 62 C73 66 75 78 75 95 Z" fill="#06030f" />
                          <path d="M50 95 C50 88 47 85 49 83 C51 81 50 78 48 76" fill="none" stroke="#06030f" strokeWidth="6" strokeLinecap="round" />
                          <path d="M10 95 Q50 88 90 95 L90 100 L10 100 Z" fill="#06030f" />
                        </svg>
                      </div>
                    </div>
                    {/* Info */}
                    <div className="p-6 flex flex-col items-center text-center">
                      <div className="w-10 h-10 rounded-full border border-neonPurple/30 flex items-center justify-center mb-4 bg-neonPurple/5">
                        <span className="text-lg">👨‍👩‍👧</span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">Family</h3>
                      <p className="text-xs text-gray-400 leading-relaxed max-w-[220px]">
                        Preserve every family memory across generations.
                      </p>
                    </div>
                  </div>

                  {/* Card 3: Friends */}
                  <div 
                    onClick={() => setSelectedRelation('friends')}
                    className={`glass-panel rounded-3xl overflow-hidden cursor-pointer relative transition-all duration-500 border group ${
                      selectedRelation === 'friends'
                        ? 'border-neonPink shadow-[0_0_30px_rgba(255,75,145,0.45)] bg-[#120a22]/80 scale-[1.03]'
                        : 'border-white/5 bg-[#120a22]/30 hover:border-white/10 hover:bg-[#120a22]/50 hover:translate-y-[-6px] hover:shadow-[0_15px_30px_rgba(168,85,247,0.15)]'
                    }`}
                    style={{ willChange: 'transform, border-color, box-shadow' }}
                  >
                    <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none z-10" />

                    <AnimatePresence>
                      {selectedRelation === 'friends' && (
                        <motion.div 
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="absolute top-4 right-4 w-5 h-5 rounded-full bg-neonPink flex items-center justify-center z-20 shadow-glow-pink"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-white">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Illustration */}
                    <div className="relative w-full h-48 bg-gradient-to-b from-[#1a0832]/50 to-[#0c051a]/20 flex items-center justify-center border-b border-white/5 overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.18)_0%,transparent_60%)] animate-pulse" />
                      <div className="w-32 h-32 relative opacity-90">
                        <svg viewBox="0 0 100 100" className="w-full h-full fill-none">
                          <circle cx="50" cy="50" r="38" className="stroke-indigo-500/25 stroke-dasharray-[3_3]" />
                          <circle cx="28" cy="35" r="1.5" fill="#fff" className="animate-pulse" />
                          <circle cx="72" cy="30" r="1.5" fill="#fff" />
                          <circle cx="48" cy="22" r="1.5" fill="#fff" />
                          <path d="M36 95 C36 82 42 76 45 76 C48 76 49 73 48 70 C47 67 44 67 43 70" fill="none" stroke="#06030f" strokeWidth="8" strokeLinecap="round" />
                          <path d="M50 95 C50 80 54 75 56 75 C58 75 59 72 58 69 C57 66 54 66 53 69" fill="none" stroke="#06030f" strokeWidth="9" strokeLinecap="round" />
                          <path d="M64 95 C64 82 70 76 73 76 C76 76 77 73 76 70 C75 67 72 67 71 70" fill="none" stroke="#06030f" strokeWidth="8" strokeLinecap="round" />
                          <path d="M10 88 L90 88 L90 100 L10 100 Z" fill="#06030f" />
                        </svg>
                      </div>
                    </div>
                    {/* Info */}
                    <div className="p-6 flex flex-col items-center text-center">
                      <div className="w-10 h-10 rounded-full border border-indigo-500/30 flex items-center justify-center mb-4 bg-indigo-500/5">
                        <span className="text-lg">🫂</span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">Friends</h3>
                      <p className="text-xs text-gray-400 leading-relaxed max-w-[220px]">
                        Capture adventures, laughter and unforgettable moments.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom settings pill */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 z-10">
                  <Sparkles className="w-3.5 h-3.5 text-neonPink animate-pulse" />
                  <span className="text-[10px] font-bold text-gray-400 tracking-wider">
                    You can always change this later in your space settings.
                  </span>
                </div>

                {/* Continue button Step 1 */}
                <div className="w-full max-w-5xl flex justify-end px-4 mt-2">
                  <button
                    onClick={() => changeStep(2)}
                    disabled={!selectedRelation}
                    className={`px-7 py-3 text-xs font-bold rounded-full flex items-center gap-2 transition-all duration-300 ${
                      selectedRelation
                        ? 'bg-gradient-to-r from-neonPink to-neonPurple text-white shadow-glow-pink hover:scale-105 active:scale-95 cursor-pointer'
                        : 'bg-white/5 border border-white/10 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="max-w-5xl mx-auto px-4">
                <h2 className="text-3xl font-extrabold text-white text-center tracking-tight mb-8">
                  Customize Your Universe
                </h2>

                <div className="grid lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Column: Preview Panel */}
                  <div className="lg:col-span-5 flex flex-col items-center">
                    <span className="text-[10px] font-extrabold tracking-widest text-gray-500 uppercase block mb-3.5">
                      Your Universe Preview
                    </span>

                    <div className={`w-full max-w-[330px] aspect-[3/4.4] glass-panel border rounded-[28px] overflow-hidden p-4 flex flex-col justify-between relative shadow-2xl transition-all duration-500 ${currentTheme.border} ${currentTheme.shadow}`}>
                      <div className="absolute inset-0 bg-gradient-to-b from-[#1b0a35] via-[#0d051a] to-[#040108] -z-10" />
                      <div 
                        className="absolute inset-0 transition-all duration-500" 
                        style={{ background: `radial-gradient(circle at center, ${currentTheme.glow} 0%, transparent 75%)` }}
                      />

                      {/* Cover Photo */}
                      <div className="flex-1 rounded-2xl relative overflow-hidden flex items-center justify-center bg-black/40 border border-white/5">
                        <div className="absolute inset-0 bg-cover bg-center opacity-85 transition-all duration-300" style={{ backgroundImage: `url('${coverPhoto}')` }}></div>
                        
                        {/* Glow Heart */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <Heart 
                            className={`w-20 h-20 fill-none drop-shadow-[0_0_15px_${currentTheme.color}] animate-pulse transition-all duration-500`} 
                            style={{ color: currentTheme.color }}
                          />
                        </div>
                      </div>

                      {/* Bottom Title on Preview */}
                      <div className="pt-4 px-2 pb-2">
                        <h4 
                          className="text-white text-2xl font-bold mb-2 tracking-wide transition-all duration-300"
                          style={{ fontFamily: "'Caveat', cursive", textShadow: `0 0 10px ${currentTheme.color}` }}
                        >
                          {spaceName || 'Our Little Universe'} {relationshipEmoji}
                        </h4>
                        
                        <div className="flex flex-wrap gap-2 mt-3">
                          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 text-[9px] border border-white/5 text-gray-300 font-bold uppercase tracking-wider">
                            👥 {selectedRelation === 'couple' ? 'Couple Space' : selectedRelation === 'family' ? 'Family Space' : 'Friends Space'}
                          </span>
                          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 text-[9px] border border-white/5 text-gray-300 font-bold uppercase tracking-wider">
                            {isPrivate ? '🔒 Private' : '🌐 Public'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Universe Details Form */}
                  <div className="lg:col-span-7">
                    <div className="glass-panel border border-white/5 rounded-3xl p-6 md:p-8 space-y-6">
                      <h3 className="text-lg font-bold text-white mb-2">Universe Details</h3>

                      {/* Space Name */}
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={spaceName}
                          onChange={(e) => setSpaceName(e.target.value)}
                          placeholder=" "
                          className={`peer w-full bg-black/35 border border-white/10 text-white placeholder-transparent rounded-xl pt-5 pb-2 px-4 focus:outline-none transition-all duration-300 text-sm focus:border-neonPink`}
                        />
                        <label className="absolute left-4 top-1 text-gray-500 text-[9px] font-bold uppercase tracking-widest transition-all duration-300 peer-placeholder-shown:text-xs peer-placeholder-shown:top-4 peer-placeholder-shown:font-semibold peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-[9px] peer-focus:text-neonPink peer-focus:font-bold">
                          Space Name
                        </label>
                        <Heart className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neonPink fill-current" />
                      </div>

                      {/* Theme Colors */}
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-3">
                          Theme Color
                        </label>
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                          {Object.entries(themeDetails).map(([key, t]) => (
                            <button
                              key={key}
                              type="button"
                              onClick={() => setThemeColor(key)}
                              className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all duration-300 ${
                                themeColor === key
                                  ? 'border-neonPink bg-white/5 shadow-glow-pink'
                                  : 'border-white/5 bg-black/20 hover:border-white/10'
                              }`}
                            >
                              <span 
                                className="w-5 h-5 rounded-full border border-white/10 shadow-lg"
                                style={{ backgroundColor: t.color }}
                              />
                              <span className="text-[8px] font-extrabold text-gray-400 text-center tracking-tight leading-none whitespace-nowrap">
                                {t.name.split(' ')[0]}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Cover Image */}
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-2.5">
                          Cover Image
                        </label>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div 
                            onClick={() => inputRef.current?.click()}
                            className="border border-dashed border-white/10 rounded-xl bg-black/20 p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-black/30 transition-all"
                          >
                            <Upload className="w-5 h-5 text-gray-400 mb-2" />
                            <span className="text-[10px] text-gray-400 font-bold leading-normal">
                              Drag & drop your image here or
                            </span>
                            <span className="text-[9px] text-neonPink font-bold underline mt-0.5">
                              Browse Files
                            </span>
                          </div>
                          <input
                            ref={inputRef}
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={handleCoverImageChange}
                          />

                          <div className="rounded-xl overflow-hidden relative aspect-[1.8] bg-black/40 border border-white/5">
                            <div className="absolute inset-0 bg-cover bg-center opacity-85 transition-all duration-300" style={{ backgroundImage: `url('${coverPhoto}')` }}></div>
                            <div 
                              onClick={handleCycleCover}
                              className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-white cursor-pointer hover:bg-black/80 transition-all"
                            >
                              <Settings className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Date & Emoji */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="relative">
                          <input
                            type="date"
                            value={specialDate}
                            onChange={(e) => setSpecialDate(e.target.value)}
                            placeholder=" "
                            className="peer w-full bg-black/35 border border-white/10 text-white placeholder-transparent rounded-xl pt-5 pb-2 px-4 focus:outline-none focus:border-neonPink transition-all duration-300 text-sm"
                          />
                          <label className="absolute left-4 top-1 text-gray-500 text-[9px] font-bold uppercase tracking-widest transition-all duration-300 peer-placeholder-shown:text-xs peer-placeholder-shown:top-4 peer-placeholder-shown:font-semibold peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-[9px] peer-focus:text-neonPink peer-focus:font-bold">
                            Special Date
                          </label>
                        </div>

                        <div className="relative">
                          <select
                            value={relationshipEmoji}
                            onChange={(e) => setRelationshipEmoji(e.target.value)}
                            className="peer w-full bg-black/35 border border-white/10 text-white rounded-xl pt-5 pb-2 px-4 focus:outline-none focus:border-neonPink transition-all duration-300 text-sm font-sans"
                          >
                            <option value="💖">💖 Heart Sparkle</option>
                            <option value="❤️">❤️ Red Heart</option>
                            <option value="🌹">🌹 Rose</option>
                            <option value="👩‍❤️‍👨">👩‍❤️‍👨 Couple</option>
                            <option value="✨">✨ Sparkles</option>
                          </select>
                          <label className="absolute left-4 top-1 text-gray-500 text-[9px] font-bold uppercase tracking-widest transition-all duration-300 top-1 text-[9px] text-neonPink font-bold">
                            Relationship Emoji
                          </label>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="relative">
                        <textarea
                          rows={2}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder=" "
                          className="peer w-full bg-black/35 border border-white/10 text-white placeholder-transparent rounded-xl pt-5 pb-2 px-4 focus:outline-none focus:border-neonPink transition-all duration-300 text-sm resize-none"
                        />
                        <label className="absolute left-4 top-1 text-gray-500 text-[9px] font-bold uppercase tracking-widest transition-all duration-300 peer-placeholder-shown:text-xs peer-placeholder-shown:top-4 peer-placeholder-shown:font-semibold peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-[9px] peer-focus:text-neonPink peer-focus:font-bold">
                          Description
                        </label>
                      </div>

                      {/* Category & Privacy */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="relative">
                          <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="peer w-full bg-black/35 border border-white/10 text-white rounded-xl pt-5 pb-2 px-4 focus:outline-none focus:border-neonPink transition-all duration-300 text-sm"
                          >
                            <option value="Our Journey">Our Journey</option>
                            <option value="Vacations">Vacations</option>
                            <option value="Anniversaries">Anniversaries</option>
                            <option value="Daily Snaps">Daily Snaps</option>
                          </select>
                          <label className="absolute left-4 top-1 text-gray-500 text-[9px] font-bold uppercase tracking-widest transition-all duration-300 top-1 text-[9px] text-neonPink font-bold">
                            Memory Category
                          </label>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block mb-2">
                            Privacy Toggle
                          </label>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => setIsPrivate(true)}
                              className={`flex-1 py-2.5 px-4 rounded-xl border text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 ${
                                isPrivate
                                  ? 'border-neonPink bg-neonPink/15 text-white shadow-glow-pink'
                                  : 'border-white/5 bg-black/20 text-gray-400 hover:border-white/10'
                              }`}
                            >
                              <span>Private</span>
                              <span>🔒</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setIsPrivate(false)}
                              className={`flex-1 py-2.5 px-4 rounded-xl border text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 ${
                                !isPrivate
                                  ? 'border-neonPink bg-neonPink/15 text-white shadow-glow-pink'
                                  : 'border-white/5 bg-black/20 text-gray-400 hover:border-white/10'
                              }`}
                            >
                              <span>Public</span>
                              <span>🌐</span>
                            </button>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                </div>

                {/* Footer Buttons Step 2 */}
                <div className="w-full flex justify-between px-4 mt-8">
                  <button
                    onClick={() => changeStep(1)}
                    className="px-6 py-3 rounded-full border border-white/10 text-gray-400 text-xs font-bold flex items-center gap-2 hover:text-white hover:bg-white/5 active:scale-95 transition-all duration-300"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    onClick={() => changeStep(3)}
                    className="px-7 py-3 bg-gradient-to-r from-neonPink to-neonPurple text-white text-xs font-bold rounded-full shadow-glow-pink hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="max-w-5xl mx-auto px-4 flex flex-col items-center">
                <h2 className="text-3xl font-extrabold text-white tracking-tight mb-8 text-center">
                  Invite Someone to Share This Universe
                </h2>

                {/* Invites Columns Grid */}
                <div className="grid md:grid-cols-3 gap-6 w-full mb-8">
                  
                  {/* Column 1: Via Email */}
                  <div className="glass-panel border border-white/5 rounded-3xl p-6 flex flex-col justify-between h-[180px] shadow-lg relative overflow-hidden">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-neonPink animate-pulse" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white">Via Email</h4>
                        <p className="text-[10px] text-gray-500 mt-0.5">Send a direct access code</p>
                      </div>
                    </div>

                    <form onSubmit={handleAddInvite} className="mt-4 flex gap-2">
                      <input
                        type="email"
                        required
                        placeholder="Enter email address"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        className="flex-1 bg-black/40 border border-white/10 text-white placeholder-gray-600 rounded-xl py-2.5 px-3 focus:outline-none focus:border-neonPink transition-all duration-300 text-xs"
                      />
                      <button
                        type="submit"
                        disabled={inviteLoading}
                        className="px-4 py-2.5 bg-gradient-to-r from-neonPink to-neonPurple text-white text-xs font-bold rounded-xl shadow-glow-pink hover:scale-105 active:scale-95 transition-all duration-300 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      >
                        {inviteLoading ? '...' : 'Invite'}
                      </button>
                    </form>
                    {inviteError ? <p className="text-xs text-rose-400 mt-2">{inviteError}</p> : null}
                  </div>

                  {/* Column 2: Share Link */}
                  <div className="glass-panel border border-white/5 rounded-3xl p-6 flex flex-col justify-between h-[180px] shadow-lg relative overflow-hidden">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
                        <LinkIcon className="w-5 h-5 text-neonPurple" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white">Via Link</h4>
                        <p className="text-[10px] text-gray-500 mt-0.5">Anyone with this link can join</p>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <input
                        type="text"
                        readOnly
                        value={inviteUrl.replace(/^https?:\/\//, '')}
                        className="flex-1 bg-black/40 border border-white/10 text-gray-400 rounded-xl py-2.5 px-3 focus:outline-none text-xs truncate"
                      />
                      <button
                        type="button"
                        onClick={handleCopyLink}
                        className="px-4 py-2.5 bg-white/5 border border-white/10 text-white text-xs font-bold rounded-xl hover:bg-white/10 active:scale-95 transition-all duration-300 flex-shrink-0 flex items-center gap-1.5"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3px]" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Column 3: QR Code */}
                  <div className="glass-panel border border-white/5 rounded-3xl p-6 flex flex-col justify-between h-[180px] shadow-lg relative overflow-hidden">
                    
                    {/* Glowing QR Scanner Lasers Line */}
                    <div className="scan-line" />

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                        <QrCode className="w-5 h-5 text-indigo-400" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white">QR Code</h4>
                        <p className="text-[10px] text-gray-500 mt-0.5">Scan to join this universe</p>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-center z-10">
                      <div className="p-1 rounded-xl bg-white border border-neonPink/30 shadow-[0_0_15px_rgba(255,75,145,0.25)]">
                        <QRCodeSVG
                          value={inviteUrl}
                          size={68}
                          level="M"
                          marginSize={2}
                          fgColor="#12071e"
                          bgColor="#ffffff"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pending Invites List Section */}
                <div className="w-full max-w-3xl glass-panel border border-white/5 rounded-3xl p-6 md:p-8">
                  <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">
                    Pending Invites
                  </h3>

                  <div className="space-y-4">
                    {invites.map((invite) => (
                      <div 
                        key={invite.email} 
                        className={`flex items-center justify-between py-3 px-4 rounded-2xl bg-black/20 border border-white/5 hover:border-white/10 transition-all duration-300 ${
                          invite.status === 'Accepted' ? 'border-emerald-500/20 bg-emerald-500/5' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <img 
                            src={invite.avatar} 
                            alt="" 
                            className="w-10 h-10 rounded-full object-cover border border-white/10"
                          />
                          <div>
                            <span className="text-xs font-bold text-white block">
                              {invite.email}
                            </span>
                            <span className="text-[9px] text-gray-500 mt-0.5 block">
                              {invite.time}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${
                            invite.status === 'Accepted'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}>
                            {invite.status}
                          </span>
                          <button className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-gray-400 hover:text-white transition-all">
                            {invite.status === 'Accepted' ? <Check className="w-3.5 h-3.5 animate-pulse" /> : <Settings className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Buttons Step 3 */}
                <div className="w-full max-w-3xl flex justify-between mt-8">
                  <button
                    onClick={() => changeStep(2)}
                    className="px-6 py-3 rounded-full border border-white/10 text-gray-400 text-xs font-bold flex items-center gap-2 hover:text-white hover:bg-white/5 active:scale-95 transition-all duration-300"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    onClick={() => changeStep(4)}
                    className="px-7 py-3 bg-gradient-to-r from-neonPink to-neonPurple text-white text-xs font-bold rounded-full shadow-glow-pink hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="max-w-5xl mx-auto px-4 relative">
                
                {/* Glowing Spinning Galaxy Background forms behind success card */}
                <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-neonPink/25 via-neonPurple/20 to-cosmicBlue/15 blur-[70px] animate-spin-slow opacity-85 pointer-events-none -z-10" style={{ animationDuration: '40s' }} />

                {/* Header */}
                <h2 className="text-3xl md:text-4xl font-extrabold text-white text-center tracking-tight mb-12">
                  Your Memory Universe is Ready!
                </h2>

                <div className="grid md:grid-cols-2 gap-12 items-center">
                  
                  {/* Left Column: Glowing double heart constellation */}
                  <div className="flex justify-center relative min-h-[300px]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,75,145,0.25)_0%,transparent_60%)] animate-pulse" />
                    
                    <div className="w-72 h-72 relative flex items-center justify-center">
                      <svg viewBox="0 0 100 100" className="w-full h-full text-neonPink drop-shadow-[0_0_25px_rgba(255,75,145,0.95)] animate-pulse">
                        <path 
                          d="M50 35 C42 15, 20 15, 20 40 C20 62, 50 85, 50 85 C50 85, 80 62, 80 40 C80 15, 58 15, 50 35 Z" 
                          fill="none" 
                          stroke="url(#gradient-heart-1)" 
                          strokeWidth="2.2"
                        />
                        <path 
                          d="M50 50 C45 35, 30 35, 30 52 C30 68, 50 85, 50 85 C50 85, 70 68, 70 52 C70 35, 55 35, 50 50 Z" 
                          fill="none" 
                          stroke="url(#gradient-heart-2)" 
                          strokeWidth="1.8"
                          opacity="0.8"
                        />
                        <defs>
                          <linearGradient id="gradient-heart-1" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#ff4b91" />
                            <stop offset="100%" stopColor="#a855f7" />
                          </linearGradient>
                          <linearGradient id="gradient-heart-2" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#a855f7" />
                            <stop offset="100%" stopColor="#6366f1" />
                          </linearGradient>
                        </defs>
                        <circle cx="50" cy="35" r="1.5" fill="#fff" />
                        <circle cx="20" cy="40" r="1.5" fill="#fff" />
                        <circle cx="80" cy="40" r="1.5" fill="#fff" />
                        <circle cx="50" cy="85" r="2.5" fill="#fff" className="shadow-glow-pink animate-pulse" />
                      </svg>

                      {/* Small Silhouette couple sitting looking up */}
                      <div className="absolute bottom-4 flex items-center justify-center opacity-95">
                        <svg viewBox="0 0 100 60" className="w-24 h-16 fill-[#06030f]">
                          <path d="M30 60 C30 45, 35 42, 38 42 C41 42, 43 38, 42 35 C40 31, 36 31, 35 35 Q30 38, 25 45 L25 60 Z" />
                          <path d="M50 60 C50 48, 53 45, 55 45 C57 45, 59 42, 58 38 C56 34, 52 34, 51 38 Q45 42, 40 50 L40 60 Z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Title, Subtitle, Emitter CTA */}
                  <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-6">
                    <div className="space-y-3">
                      <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2 justify-center md:justify-start">
                        ✨ Your Memory Universe has been created.
                      </h3>
                      <p className="text-sm text-gray-400 font-bold leading-normal tracking-wide animate-pulse">
                        Your journey together begins here.
                      </p>
                    </div>

                    {createError ? <p className="text-sm text-rose-400 text-center">{createError}</p> : null}

                    {/* Large CTA with emitter hover particles */}
                    <button
                      onMouseEnter={() => setIsCtaHovered(true)}
                      onMouseLeave={() => setIsCtaHovered(false)}
                      onClick={handleFinalEnter}
                      disabled={loading || isEnding || isLoading}
                      className="relative px-8 py-4.5 bg-gradient-to-r from-neonPink to-neonPurple text-white font-extrabold rounded-2xl shadow-glow-pink hover:scale-105 active:scale-95 hover:shadow-[0_0_35px_rgba(255,75,145,0.7)] active:shadow-glow-pink transition-all duration-300 flex items-center gap-3 w-full sm:w-auto text-center justify-center cursor-pointer text-sm z-10"
                    >
                      <span>Enter Memory Universe</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />

                      {/* Emitter Particles overlay */}
                      {isCtaHovered && Array.from({ length: 9 }).map((_, i) => (
                        <span 
                          key={i} 
                          className="absolute w-1.5 h-1.5 rounded-full bg-neonPink/90 pointer-events-none particle-point shadow-[0_0_5px_#ff4b91]" 
                          style={{
                            left: '50%',
                            top: '50%',
                            '--mx': `${(Math.random() - 0.5) * 190}px`,
                            '--my': `${(Math.random() - 0.5) * 110}px`,
                            animationDelay: `${i * 0.08}s`
                          } as any}
                        />
                      ))}
                    </button>

                    <p className="text-xs text-gray-500 font-bold tracking-wide flex items-center gap-2 justify-center md:justify-start">
                      💖 We can&apos;t wait to see the beautiful memories you&apos;ll create together.
                    </p>
                  </div>

                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer copyright */}
      <footer className="w-full text-center py-4 text-[10px] text-gray-600 relative z-10">
        &copy; 2026 Forever Remebered. All rights reserved.
      </footer>
    </div>
  )
}
