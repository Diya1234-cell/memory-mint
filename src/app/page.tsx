'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Heart, 
  Sparkles, 
  BookOpen, 
  Lock,
  ArrowRight,
  Camera,
  Globe,
  Activity,
  Mail,
  Hourglass,
  Layout,
  UserPlus,
  Image as ImageIcon,
  Video,
  Mic,
  MessageSquare
} from 'lucide-react'
import { NebulaShader } from '@/components/ui/spiral-animation'

function CosmicCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    let starArray: any[] = []
    let mouseTracker = { x: null as number | null, y: null as number | null }

    const setCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener('resize', setCanvasSize)
    setCanvasSize()

    class CosmicStar {
      x: number; y: number; radius: number; baseSpeedY: number; driftX: number; alphaBase: number; currentAlpha: number;

      constructor() {
        this.x = Math.random() * canvas!.width
        this.y = Math.random() * canvas!.height
        this.radius = Math.random() * 1.8 + 0.4
        this.baseSpeedY = Math.random() * 0.15 + 0.05
        this.driftX = Math.random() * 0.1 - 0.05
        this.alphaBase = Math.random() * 0.4 + 0.2
        this.currentAlpha = this.alphaBase
      }
      refresh() {
        this.y += this.baseSpeedY - (window.scrollY * 0.012)
        this.x += this.driftX

        if (this.y < 0) this.y = canvas!.height
        if (this.y > canvas!.height) this.y = 0
        if (this.x < 0) this.x = canvas!.width
        if (this.x > canvas!.width) this.x = 0

        if (mouseTracker.x !== null && mouseTracker.y !== null) {
          let distanceX = mouseTracker.x - this.x
          let distanceY = mouseTracker.y - this.y
          let calculatedDist = Math.sqrt(distanceX * distanceX + distanceY * distanceY)
          if (calculatedDist < 110) {
            this.currentAlpha = 0.95
          } else if (this.currentAlpha > this.alphaBase) {
            this.currentAlpha -= 0.015
          }
        }
      }
      render() {
        ctx!.fillStyle = `rgba(255, 75, 145, ${this.currentAlpha})`
        ctx!.beginPath()
        ctx!.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx!.fill()
      }
    }

    for(let i=0; i<70; i++) { starArray.push(new CosmicStar()) }

    const handleMouseMove = (e: MouseEvent) => { 
      mouseTracker.x = e.clientX; 
      mouseTracker.y = e.clientY; 
    }
    const handleMouseLeave = () => { 
      mouseTracker.x = null; 
      mouseTracker.y = null; 
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)

    let animationId: number
    const drawLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      starArray.forEach(star => { star.refresh(); star.render(); })
      animationId = requestAnimationFrame(drawLoop)
    }
    drawLoop()

    return () => {
      window.removeEventListener('resize', setCanvasSize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-0" />
  )
}

function DynamicCounter({ targetValue }: { targetValue: number }) {
  const [value, setValue] = useState(0)
  const elementRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        const ceiling = targetValue
        let current = 0
        const velocity = Math.ceil(ceiling / 50)
        
        const counterRunner = setInterval(() => {
          current += velocity
          if(current >= ceiling) {
            setValue(ceiling)
            clearInterval(counterRunner)
          } else {
            setValue(current)
          }
        }, 30)
        observer.disconnect()
      }
    })
    
    if (elementRef.current) observer.observe(elementRef.current)
    return () => observer.disconnect()
  }, [targetValue])

  return <span ref={elementRef} className="text-sm font-extrabold text-white">{value}</span>
}

export default function HomePage() {
  const router = useRouter()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [typedText, setTypedText] = useState('')
  const [timelineHeight, setTimelineHeight] = useState(0)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  const handleStartJourney = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsTransitioning(true)
    setTimeout(() => {
      router.push('/create-space')
    }, 500)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - (rect.left + rect.width / 2)) / 15
    const y = (e.clientY - (rect.top + rect.height / 2)) / 15
    setTilt({ x: -y, y: x })
  }

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
  }
  
  useEffect(() => {
    const scrollElements = document.querySelectorAll('.reveal-on-scroll')
    const layoutObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if(entry.isIntersecting) {
          entry.target.classList.add('active')
          const activeDot = entry.target.querySelector('.timeline-dot')
          if (activeDot) {
            activeDot.classList.remove('border-white/20')
            activeDot.classList.add('border-neonPink', 'shadow-glow-pink')
          }
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' })
    
    scrollElements.forEach(el => layoutObserver.observe(el))
    return () => layoutObserver.disconnect()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const currentPosition = window.scrollY
      const featuresEl = document.getElementById('features')
      const roadmapEl = document.getElementById('roadmap')
      if (!featuresEl || !roadmapEl) return
      
      const featuresTop = featuresEl.offsetTop
      const roadmapTop = roadmapEl.offsetTop
      const totalTrackableHeight = roadmapTop - featuresTop

      let percentage = ((currentPosition - featuresTop) / totalTrackableHeight) * 100
      percentage = Math.min(Math.max(percentage, 0), 100)
      setTimelineHeight(percentage)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const promptString = "Searching 2024 trip database... Found 3 video logs matching 'Hilarious'."
    let index = 0
    let timerId: NodeJS.Timeout

    const runTypewriter = () => {
      if (index < promptString.length) {
        setTypedText(prev => prev + promptString.charAt(index))
        index++
        timerId = setTimeout(runTypewriter, 45)
      } else {
        timerId = setTimeout(() => {
          setTypedText('')
          index = 0
          runTypewriter()
        }, 4000)
      }
    }
    runTypewriter()
    return () => clearTimeout(timerId)
  }, [])

  return (
    <main className="relative min-h-screen text-slate-100 font-sans overflow-x-hidden" style={{ backgroundColor: '#05020a' }}>
      
      {/* Backgrounds */}
      <NebulaShader />
      <CosmicCanvas />
      
      <div className="fixed top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-neonPurple/10 blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-neonPink/5 blur-[100px] pointer-events-none z-0" />

      <div className={`transition-opacity duration-500 ease-in-out ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
      {/* STICKY HEADER */}
      <header className="sticky top-0 z-50 w-full bg-spaceBg/70 backdrop-blur-xl border-b border-white/5 py-4 px-6 md:px-12 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-neonPink to-neonPurple flex items-center justify-center shadow-glow-pink">
              <Heart className="w-4.5 h-4.5 text-white fill-current" />
            </div>
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white to-pink-100 bg-clip-text text-transparent">Forever Remembered</span>
          </a>
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">Home</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#ai-features" className="hover:text-white transition-colors">AI Features</a>
            <a href="#roadmap" className="hover:text-white transition-colors">Roadmap</a>
            <a href="#about" className="hover:text-white transition-colors">About</a>
          </nav>
          <button onClick={handleStartJourney} className="px-5 py-2.5 bg-gradient-to-r from-neonPink to-neonPurple text-white text-xs font-bold rounded-full shadow-glow-pink hover:scale-105 active:scale-95 transition-all duration-300">
            Start Your Journey
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-12 pb-24 grid md:grid-cols-2 gap-12 items-center min-h-[calc(100vh-80px)]">
        
        {/* Hero Information Left */}
        <div className="reveal-on-scroll active">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-neonPink animate-ping"></span>
            <span className="text-[10px] font-bold tracking-widest uppercase text-neonPink">#1 AI-Powered Memory Platform</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.08] mb-6 text-white">
            Remember <br />
            <span className="bg-gradient-to-r from-neonPink via-purple-400 to-indigo-300 bg-clip-text text-transparent">Forever.</span>
          </h1>
          <p className="text-base text-gray-400 max-w-md mb-8 leading-relaxed">
            Capture every moment. Relive every memory. Strengthen every bond with emotional intelligence built directly into your digital archive.
          </p>

          <div className="flex flex-wrap gap-2.5 mb-8">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 text-[11px] border border-white/10 text-gray-300">
              <Sparkles className="w-3 h-3 text-neonPink" /> AI-Powered
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 text-[11px] border border-white/10 text-gray-300">
              <Lock className="w-3 h-3 text-neonPurple" /> Private & Secure
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 text-[11px] border border-white/10 text-gray-300">
              <Heart className="w-3 h-3 text-rose-400 fill-current" /> Made for Love
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-5">
            <button onClick={handleStartJourney} className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-neonPink to-neonPurple text-white font-bold text-sm rounded-xl shadow-glow-pink flex items-center justify-center gap-2 group hover:scale-105 transition-all">
              Start Your Journey <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2.5">
                <div className="w-8 h-8 rounded-full border-2 border-spaceBg bg-gray-700 overflow-hidden"><img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80" className="object-cover w-full h-full" alt="" /></div>
                <div className="w-8 h-8 rounded-full border-2 border-spaceBg bg-gray-600 overflow-hidden"><img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80" className="object-cover w-full h-full" alt="" /></div>
                <div className="w-8 h-8 rounded-full border-2 border-spaceBg bg-gray-500 overflow-hidden"><img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80" className="object-cover w-full h-full" alt="" /></div>
              </div>
              <p className="text-[11px] text-gray-400">Loved by <span className="text-white font-bold">10,000+ couples</span> worldwide</p>
            </div>
          </div>
        </div>

        <div 
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative flex items-center justify-center min-h-[400px] reveal-on-scroll cube-scene" 
          style={{ 
            transitionDelay: '150ms',
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transition: 'transform 0.15s ease-out'
          }}
        >
          {/* Holographic Spinning Cube */}
          <div className="cube-container relative flex items-center justify-center">
            <div className="cube-face cube-face-front"></div>
            <div className="cube-face cube-face-back"></div>
            <div className="cube-face cube-face-right"></div>
            <div className="cube-face cube-face-left"></div>
            <div className="cube-face cube-face-top"></div>
            <div className="cube-face cube-face-bottom"></div>

            {/* Glowing Heart inside the cube (stays flat facing the viewer) */}
            <div className="absolute z-10 animate-cosmic-heart pointer-events-none">
              <Heart className="w-12 h-12 text-neonPink fill-current drop-shadow-[0_0_15px_rgba(255,75,145,0.85)]" />
            </div>
          </div>

          {/* Orbiting Floating Nodes (5 badges) */}
          <div className="orbit-node w-10 h-10 rounded-full glass-panel flex items-center justify-center" style={{ animationDelay: '0s' }}><Camera className="w-4 h-4 text-neonPink" /></div>
          <div className="orbit-node w-10 h-10 rounded-full glass-panel flex items-center justify-center" style={{ animationDelay: '-5s' }}><MessageSquare className="w-4 h-4 text-neonPurple" /></div>
          <div className="orbit-node w-10 h-10 rounded-full glass-panel flex items-center justify-center" style={{ animationDelay: '-10s' }}><Video className="w-4 h-4 text-indigo-400" /></div>
          <div className="orbit-node w-10 h-10 rounded-full glass-panel flex items-center justify-center" style={{ animationDelay: '-15s' }}><Heart className="w-4 h-4 text-pink-400 fill-current" /></div>
          <div className="orbit-node w-10 h-10 rounded-full glass-panel flex items-center justify-center" style={{ animationDelay: '-20s' }}><BookOpen className="w-4 h-4 text-purple-400" /></div>
        </div>
      </section>

      {/* FEATURES BLOCK */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-20">
        <div className="text-center max-w-xl mx-auto mb-16 reveal-on-scroll">
          <span className="text-[10px] font-bold tracking-widest uppercase text-neonPink bg-white/5 px-3 py-1 rounded-full border border-white/10">Features</span>
          <h2 className="text-3xl md:text-4xl font-extrabold mt-4 mb-3">
            Features designed to <span className="bg-gradient-to-r from-neonPink to-neonPurple bg-clip-text text-transparent">preserve your relationship</span> forever.
          </h2>
          <p className="text-xs text-gray-400">Every feature is thoughtfully designed to help people capture, revisit, and strengthen meaningful relationships.</p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
          <div className="glass-panel p-6 rounded-2xl interactive-card reveal-on-scroll" style={{ transitionDelay: '50ms' }}>
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mb-5"><Camera className="w-5 h-5 text-neonPink" /></div>
            <h3 className="font-bold text-base mb-2">Save Every Memory</h3>
            <p className="text-xs text-gray-400 leading-relaxed">Upload photos, videos, voice notes, journals, and milestones completely secure.</p>
          </div>
          <div className="glass-panel p-6 rounded-2xl interactive-card reveal-on-scroll" style={{ transitionDelay: '100ms' }}>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-5"><Sparkles className="w-5 h-5 text-neonPurple" /></div>
            <h3 className="font-bold text-base mb-2">AI Memory Journal</h3>
            <p className="text-xs text-gray-400 leading-relaxed">AI automatically builds comprehensive, beautifully organized monthly journals.</p>
          </div>
          <div className="glass-panel p-6 rounded-2xl interactive-card reveal-on-scroll" style={{ transitionDelay: '150ms' }}>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-5"><Globe className="w-5 h-5 text-indigo-400" /></div>
            <h3 className="font-bold text-base mb-2">Memory Galaxy</h3>
            <p className="text-xs text-gray-400 leading-relaxed">Explore memories mapped out uniquely as stars in a personalized constellation web.</p>
          </div>
          <div className="glass-panel p-6 rounded-2xl interactive-card reveal-on-scroll" style={{ transitionDelay: '50ms' }}>
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-5"><Activity className="w-5 h-5 text-rose-400" /></div>
            <h3 className="font-bold text-base mb-2">Time Machine</h3>
            <p className="text-xs text-gray-400 leading-relaxed">Ask anything natively: "Show us our funniest day" or "Show our first trip context."</p>
          </div>
          <div className="glass-panel p-6 rounded-2xl interactive-card reveal-on-scroll" style={{ transitionDelay: '100ms' }}>
            <div className="w-10 h-10 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center mb-5"><Mail className="w-5 h-5 text-fuchsia-400" /></div>
            <h3 className="font-bold text-base mb-2">AI Letters</h3>
            <p className="text-xs text-gray-400 leading-relaxed">Receive deeply meaningful prompts and surprise correspondence based on shared files.</p>
          </div>
          <div className="glass-panel p-6 rounded-2xl interactive-card reveal-on-scroll" style={{ transitionDelay: '150ms' }}>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-5"><Hourglass className="w-5 h-5 text-amber-400" /></div>
            <h3 className="font-bold text-base mb-2">Future Time Capsules</h3>
            <p className="text-xs text-gray-400 leading-relaxed">Schedule digital footprints to unlock cleanly on key anniversaries years down the road.</p>
          </div>
        </div>
      </section>

      {/* TIMELINE SECTION */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-16 reveal-on-scroll">
          <span className="text-[10px] font-bold tracking-widest uppercase text-neonPink bg-white/5 px-3 py-1 rounded-full border border-white/10">How It Works</span>
          <h2 className="text-3xl font-extrabold mt-3">Simple steps to connection logs.</h2>
        </div>

        <div className="relative">
          {/* Center Vertical Path Line */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[3px] h-full bg-white/10 rounded-full overflow-hidden">
            <div className="w-full bg-gradient-to-b from-neonPink to-neonPurple transition-all duration-150" style={{ height: `${timelineHeight}%` }}></div>
          </div>

          <div className="relative grid grid-cols-2 gap-8 mb-12 items-center reveal-on-scroll">
            <div className="text-right pr-10">
              <h4 className="font-bold text-base text-white">Create Your Memory Space</h4>
              <p className="text-xs text-gray-400 mt-1">Build a secure, private room configured uniquely for your dynamic.</p>
            </div>
            <div className="relative pl-10">
              <div className="timeline-dot absolute left-0 -translate-x-1/2 w-7 h-7 rounded-full bg-spaceBg border-4 border-white/20 z-10 flex items-center justify-center text-[10px] font-bold text-white transition-colors duration-300">1</div>
              <div className="glass-panel p-4 rounded-xl max-w-xs"><Layout className="w-5 h-5 text-neonPink" /></div>
            </div>
          </div>

          <div className="relative grid grid-cols-2 gap-8 mb-12 items-center reveal-on-scroll">
            <div className="relative text-right pr-10 flex justify-end">
              <div className="glass-panel p-4 rounded-xl max-w-xs mr-0"><UserPlus className="w-5 h-5 text-neonPurple" /></div>
              <div className="timeline-dot absolute right-0 translate-x-1/2 w-7 h-7 rounded-full bg-spaceBg border-4 border-white/20 z-10 flex items-center justify-center text-[10px] font-bold text-white transition-colors duration-300">2</div>
            </div>
            <div className="pl-10">
              <h4 className="font-bold text-base text-white">Invite Someone You Love</h4>
              <p className="text-xs text-gray-400 mt-1">Bring your partner into your encrypted collaborative archive space seamlessly.</p>
            </div>
          </div>

          <div className="relative grid grid-cols-2 gap-8 mb-12 items-center reveal-on-scroll">
            <div className="text-right pr-10">
              <h4 className="font-bold text-base text-white">Save Moments Together</h4>
              <p className="text-xs text-gray-400 mt-1">Simultaneously post entries, images, and audio syncs effortlessly.</p>
            </div>
            <div className="relative pl-10">
              <div className="timeline-dot absolute left-0 -translate-x-1/2 w-7 h-7 rounded-full bg-spaceBg border-4 border-white/20 z-10 flex items-center justify-center text-[10px] font-bold text-white transition-colors duration-300">3</div>
              <div className="glass-panel p-4 rounded-xl max-w-xs"><ImageIcon className="w-5 h-5 text-cosmicBlue" /></div>
            </div>
          </div>

          <div className="relative grid grid-cols-2 gap-8 items-center reveal-on-scroll">
            <div className="relative text-right pr-10 flex justify-end">
              <div className="glass-panel p-4 rounded-xl max-w-xs mr-0"><Heart className="w-5 h-5 text-pink-400" /></div>
              <div className="timeline-dot absolute right-0 translate-x-1/2 w-7 h-7 rounded-full bg-spaceBg border-4 border-white/20 z-10 flex items-center justify-center text-[10px] font-bold text-white transition-colors duration-300">4</div>
            </div>
            <div className="pl-10">
              <h4 className="font-bold text-base text-white">Relive Them Forever</h4>
              <p className="text-xs text-gray-400 mt-1">Let AI process regular highlight reels to bring memory data clusters back alive.</p>
            </div>
          </div>
        </div>
      </section>

      {/* MOCKUPS BLOCK */}
      <section id="ai-features" className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center max-w-xl mx-auto mb-16 reveal-on-scroll">
          <span className="text-[10px] font-bold tracking-widest uppercase text-neonPink bg-white/5 px-3 py-1 rounded-full border border-white/10">AI Features</span>
          <h2 className="text-3xl font-extrabold mt-3">Powerful AI that understands your love.</h2>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
          <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between reveal-on-scroll">
            <div>
              <h4 className="font-bold text-sm mb-1">Memory Galaxy</h4>
              <p className="text-[11px] text-gray-400 mb-4">Constellation mapping mechanics.</p>
            </div>
            <div className="h-40 bg-black/40 rounded-xl relative overflow-hidden border border-white/5 flex items-center justify-center">
              <div className="absolute w-2 h-2 rounded-full bg-neonPink top-10 left-12 animate-pulse shadow-glow-pink"></div>
              <div className="absolute w-2 h-2 rounded-full bg-neonPurple bottom-8 right-16 shadow-glow-purple"></div>
              <div className="absolute w-1.5 h-1.5 rounded-full bg-cosmicBlue top-20 right-8"></div>
              <svg className="w-full h-full opacity-30"><line x1="48" y1="40" x2="160" y2="100" stroke="white"/><line x1="160" y1="100" x2="200" y2="50" stroke="white"/></svg>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between reveal-on-scroll" style={{ transitionDelay: '50ms' }}>
            <div>
              <h4 className="font-bold text-sm mb-1">AI Memory Journal</h4>
              <p className="text-[11px] text-gray-400 mb-4">Auto compilation generation.</p>
            </div>
            <div className="h-40 bg-black/30 rounded-xl border border-white/5 p-3 flex flex-col justify-between">
              <div className="flex items-center gap-1.5 text-[10px] text-amber-400 font-semibold"><BookOpen className="w-3.5 h-3.5" /> Entry #84</div>
              <p className="text-[10px] text-gray-400 italic">"The weather cleared as you stepped onto the pier..."</p>
              <span className="text-[9px] text-gray-500">Auto-logged 2026</span>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between reveal-on-scroll" style={{ transitionDelay: '100ms' }}>
            <div>
              <h4 className="font-bold text-sm mb-1">Time Machine</h4>
              <p className="text-[11px] text-gray-400 mb-4">Instant natural prompt searches.</p>
            </div>
            <div className="h-40 bg-black/40 rounded-xl border border-white/5 p-3 flex flex-col justify-between">
              <div className="text-[9px] text-right bg-white/5 px-2 py-1 rounded-md max-w-[85%] ml-auto text-gray-300">"Show our funniest day."</div>
              <div className="bg-neonPurple/10 border border-neonPurple/20 p-2 rounded-md">
                <p className="text-[9px] text-purple-300 font-mono">{typedText}</p>
              </div>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between reveal-on-scroll" style={{ transitionDelay: '150ms' }}>
            <div>
              <h4 className="font-bold text-sm mb-1">Relationship DNA</h4>
              <p className="text-[11px] text-gray-400 mb-4">Deep telemetry data streams.</p>
            </div>
            <div className="h-40 bg-black/40 rounded-xl border border-white/5 p-3 flex flex-col justify-between">
              <div className="flex justify-between items-center"><span className="text-[10px] text-gray-400">Total Safes</span><DynamicCounter targetValue={942} /></div>
              <div className="flex justify-between items-center"><span className="text-[10px] text-gray-400">Sync Index</span><DynamicCounter targetValue={98} /></div>
              <svg viewBox="0 0 100 25" className="w-full h-8 opacity-70"><path d="M0,20 Q20,5 40,15 T80,5 T100,18" fill="none" stroke="#ff4b91" strokeWidth="2"/></svg>
            </div>
          </div>
        </div>
      </section>

      {/* ROADMAP BLOCK */}
      <section id="roadmap" className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-white/5">
        <div className="text-center max-w-xl mx-auto mb-16 reveal-on-scroll">
          <span className="text-[10px] font-bold tracking-widest uppercase text-neonPink bg-white/5 px-3 py-1 rounded-full border border-white/10">Roadmap</span>
          <h2 className="text-3xl font-extrabold mt-3">Our journey to build the future of memories.</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="glass-panel p-5 rounded-2xl border-t-4 border-t-emerald-500 reveal-on-scroll">
            <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">Phase 1</span>
            <h4 className="font-bold text-sm text-white mb-2">Shared Spaces</h4>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-[9px] font-medium text-emerald-400">Completed</span>
          </div>
          <div className="glass-panel p-5 rounded-2xl border-t-4 border-t-cosmicBlue reveal-on-scroll" style={{ transitionDelay: '50ms' }}>
            <span className="text-[9px] font-bold text-cosmicBlue uppercase tracking-wider block mb-1">Phase 2</span>
            <h4 className="font-bold text-sm text-white mb-2">AI Memory Journal</h4>
            <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-[9px] font-medium text-cosmicBlue">In Progress</span>
          </div>
          <div className="glass-panel p-5 rounded-2xl border-t-4 border-t-neonPurple reveal-on-scroll" style={{ transitionDelay: '100ms' }}>
            <span className="text-[9px] font-bold text-neonPurple uppercase tracking-wider block mb-1">Phase 3</span>
            <h4 className="font-bold text-sm text-white mb-2">Memory Galaxy</h4>
            <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-[9px] font-medium text-neonPurple">Coming Soon</span>
          </div>
          <div className="glass-panel p-5 rounded-2xl border-t-4 border-t-neonPink reveal-on-scroll" style={{ transitionDelay: '150ms' }}>
            <span className="text-[9px] font-bold text-neonPink uppercase tracking-wider block mb-1">Phase 4</span>
            <h4 className="font-bold text-sm text-white mb-2">Time Machine</h4>
            <span className="px-2 py-0.5 rounded-full bg-pink-500/10 text-[9px] font-medium text-neonPink">Coming Soon</span>
          </div>
          <div className="glass-panel p-5 rounded-2xl border-t-4 border-t-gray-600 reveal-on-scroll" style={{ transitionDelay: '200ms' }}>
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Phase 5</span>
            <h4 className="font-bold text-sm text-white mb-2">Highlight Reels</h4>
            <span className="px-2 py-0.5 rounded-full bg-white/5 text-[9px] font-medium text-gray-400">Future</span>
          </div>
        </div>
      </section>

      {/* FOOTER HERO CTA AREA */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-28 text-center overflow-hidden">
        <div className="absolute top-10 left-5 md:left-20 w-24 h-28 bg-white/5 border border-white/10 p-1.5 rounded-md shadow-lg rotate-[-12deg] polaroid-float pointer-events-none hidden sm:block">
          <div className="w-full h-20 bg-gray-800 rounded mb-1 overflow-hidden"><img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80" className="object-cover w-full h-full" alt="" /></div>
        </div>
        <div className="absolute bottom-10 right-5 md:right-20 w-24 h-28 bg-white/5 border border-white/10 p-1.5 rounded-md shadow-lg rotate-[8deg] polaroid-float pointer-events-none hidden sm:block" style={{ animationDelay: '-3s' }}>
          <div className="w-full h-20 bg-gray-800 rounded mb-1 overflow-hidden"><img src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=100&q=80" className="object-cover w-full h-full" alt="" /></div>
        </div>

        <div className="max-w-2xl mx-auto reveal-on-scroll">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-6">Every Relationship Deserves <br />to Be Remembered.</h2>
          <p className="text-sm text-gray-400 max-w-md mx-auto mb-8">Start preserving your shared digital legacy today and let intelligence organize tomorrow.</p>
          <button onClick={handleStartJourney} className="px-8 py-4 bg-gradient-to-r from-neonPink to-neonPurple text-white font-bold rounded-xl shadow-glow-pink hover:scale-105 transition-all mx-auto flex items-center gap-2">
            Begin Your Journey <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/5 bg-black/30 backdrop-blur-md pt-16 pb-8 text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-5 h-5 rounded bg-gradient-to-tr from-neonPink to-neonPurple flex items-center justify-center shadow-glow-pink"><Heart className="w-3 h-3 text-white fill-current" /></div>
              <span className="font-bold text-white text-sm">Forever Remembered</span>
            </div>
            <p className="max-w-xs leading-relaxed mb-4">AI-Powered Platform optimized securely for relationships.</p>
            <div className="flex gap-3 text-gray-400">
              <a href="#" className="hover:text-white"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg></a>
              <a href="#" className="hover:text-white"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg></a>
              <a href="#" className="hover:text-white"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg></a>
            </div>
          </div>
          <div>
            <h5 className="text-white font-bold uppercase tracking-wider text-[10px] mb-3">Product</h5>
            <ul className="space-y-1.5"><li className="hover:text-white"><a href="#">Features</a></li><li className="hover:text-white"><a href="#">AI Engine</a></li></ul>
          </div>
          <div>
            <h5 className="text-white font-bold uppercase tracking-wider text-[10px] mb-3">Company</h5>
            <ul className="space-y-1.5"><li className="hover:text-white"><a href="#">About</a></li><li className="hover:text-white"><a href="#">Contact</a></li></ul>
          </div>
          <div>
            <h5 className="text-white font-bold uppercase tracking-wider text-[10px] mb-3">Resources</h5>
            <ul className="space-y-1.5"><li className="hover:text-white"><a href="#">Privacy</a></li><li className="hover:text-white"><a href="#">Terms</a></li></ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 md:px-12 border-t border-white/5 pt-6 flex justify-between items-center text-[10px]">
          <p>&copy; 2026 Forever Remembered. All rights reserved.</p>
        </div>
      </footer>
      </div>
    </main>
  )
}
