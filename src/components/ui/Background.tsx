'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'

export function GalaxyBackground() {
  const [mounted, setMounted] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 })

  useEffect(() => {
    setMounted(true)
  }, [])

  // Drive scroll with Framer Motion useScroll and smooth with useSpring
  const { scrollY } = useScroll()
  const smoothScrollY = useSpring(scrollY, {
    stiffness: 100,
    damping: 25,
    restDelta: 0.001
  })

  // Map scroll parallax to spring values for CSS divs
  // Layer 1: Very slow movement (0.15x)
  const y1 = useTransform(smoothScrollY, y => y * -0.15)
  // Layer 2: Medium movement (0.3x)
  const y2 = useTransform(smoothScrollY, y => y * -0.3)
  // Layer 3: Pink glow (0.45x)
  const y3 = useTransform(smoothScrollY, y => y * -0.45)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2)
      const y = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2)
      mouseRef.current.targetX = x * 25 // 25px max parallax
      mouseRef.current.targetY = y * 25
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener('resize', resizeCanvas)
    resizeCanvas()

    const stars: any[] = []
    const particles: any[] = []
    const dust: any[] = []

    // 150 twinkling stars (Layer 4)
    for (let i = 0; i < 150; i++) {
      stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 1.5 + 0.4,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        phase: Math.random() * Math.PI * 2,
        color: Math.random() > 0.4 ? '#ffffff' : Math.random() > 0.5 ? '#a855f7' : '#ff4b91'
      })
    }

    // 35 animated particles (Layer 5)
    for (let i = 0; i < 35; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 3 + 1,
        vx: (Math.random() - 0.5) * 0.12,
        vy: -Math.random() * 0.15 - 0.05,
        alpha: Math.random() * 0.35 + 0.15,
        phase: Math.random() * Math.PI * 2,
        color: Math.random() > 0.6 ? '#ff4b91' : Math.random() > 0.3 ? '#a855f7' : '#6366f1'
      })
    }

    // 25 space dust particles (larger, softer glowing blobs)
    for (let i = 0; i < 25; i++) {
      dust.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 20 + 8,
        vx: (Math.random() - 0.5) * 0.03,
        vy: (Math.random() - 0.5) * 0.03,
        alpha: Math.random() * 0.05 + 0.015,
        phase: Math.random() * Math.PI * 2,
        color: Math.random() > 0.5 ? '168, 85, 247' : '255, 75, 145'
      })
    }

    let animationFrameId: number

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Smooth mouse coordinates
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.06
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.06

      const px = mouseRef.current.x
      const py = mouseRef.current.y

      // Get latest spring-smoothed scroll value
      const currentScroll = smoothScrollY.get()

      // Layer 4: Stars (Parallax scroll factor 0.2x)
      stars.forEach(star => {
        star.phase += star.twinkleSpeed
        const alpha = Math.sin(star.phase) * 0.4 + 0.6
        ctx.fillStyle = star.color
        ctx.globalAlpha = alpha

        let sx = (star.x - px * 0.25) % canvas.width
        if (sx < 0) sx += canvas.width
        let sy = (star.y - py * 0.25 - currentScroll * 0.2) % canvas.height
        if (sy < 0) sy += canvas.height

        ctx.beginPath()
        ctx.arc(sx, sy, star.size, 0, Math.PI * 2)
        ctx.fill()
      })

      // Space Dust (Parallax scroll factor 0.4x)
      dust.forEach(d => {
        d.x += d.vx
        d.y += d.vy
        d.phase += 0.002

        if (d.x < -100) d.x = canvas.width + 100
        if (d.x > canvas.width + 100) d.x = -100
        if (d.y < -100) d.y = canvas.height + 100
        if (d.y > canvas.height + 100) d.y = -100

        let dx = (d.x - px * 0.45) % canvas.width
        if (dx < 0) dx += canvas.width
        let dy = (d.y - py * 0.45 - currentScroll * 0.4) % canvas.height
        if (dy < 0) dy += canvas.height

        ctx.beginPath()
        const gradient = ctx.createRadialGradient(dx, dy, 0, dx, dy, d.size)
        const currentAlpha = d.alpha * (Math.sin(d.phase) * 0.2 + 0.8)
        gradient.addColorStop(0, `rgba(${d.color}, ${currentAlpha})`)
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
        ctx.fillStyle = gradient
        ctx.globalAlpha = 1
        ctx.arc(dx, dy, d.size, 0, Math.PI * 2)
        ctx.fill()
      })

      // Layer 5: Small Particles (Parallax scroll factor 0.6x)
      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        p.phase += 0.006

        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        let lx = (p.x - px * 0.65) % canvas.width
        if (lx < 0) lx += canvas.width
        let ly = (p.y - py * 0.65 - currentScroll * 0.6) % canvas.height
        if (ly < 0) ly += canvas.height

        ctx.beginPath()
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.alpha * (Math.sin(p.phase) * 0.25 + 0.75)
        ctx.arc(lx, ly, p.size, 0, Math.PI * 2)
        ctx.fill()
      })

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [mounted])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 -z-50 bg-[#04020A] overflow-hidden pointer-events-none">
      {/* Layer 1: Purple nebula (Slow 0.15x parallax) */}
      <motion.div 
        className="absolute top-[-20%] left-[-20%] w-[140vw] h-[140vh] rounded-full animate-nebula-slow-1 opacity-70 will-change-transform"
        style={{ 
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, rgba(15, 8, 32, 0) 70%)',
          filter: 'blur(140px)',
          y: y1,
        }}
        transformTemplate={({ y }: any) => `translate3d(0, ${y}, 0)`}
      />

      {/* Layer 2: Cosmic haze (Medium 0.3x parallax) */}
      <motion.div 
        className="absolute top-[20%] left-[10%] w-[100vw] h-[100vh] rounded-full animate-nebula-slow-3 opacity-50 will-change-transform"
        style={{ 
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, rgba(15, 8, 32, 0) 70%)',
          filter: 'blur(130px)',
          y: y2,
        }}
        transformTemplate={({ y }: any) => `translate3d(0, ${y}, 0)`}
      />

      {/* Layer 3: Pink nebula glow (Fastest div 0.45x parallax with gentle breathing expansion/contraction) */}
      <motion.div 
        className="absolute bottom-[-20%] right-[-20%] w-[140vw] h-[140vh] rounded-full animate-nebula-slow-2 opacity-60 will-change-transform"
        style={{ 
          background: 'radial-gradient(circle, rgba(255, 75, 145, 0.08) 0%, rgba(15, 8, 32, 0) 70%)',
          filter: 'blur(150px)',
          y: y3,
        }}
        transformTemplate={({ y }: any) => `translate3d(0, ${y}, 0)`}
      />
      
      {/* Layer 8: Soft stationary radial section glows for ambient depth */}
      <div 
        className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[90vw] h-[75vh]"
        style={{ 
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.05) 0%, rgba(0, 0, 0, 0) 80%)',
          filter: 'blur(110px)'
        }}
      />
      <div 
        className="absolute top-[55%] left-1/2 -translate-x-1/2 w-[95vw] h-[85vh]"
        style={{ 
          background: 'radial-gradient(circle, rgba(255, 75, 145, 0.03) 0%, rgba(0, 0, 0, 0) 80%)',
          filter: 'blur(130px)'
        }}
      />

      {/* Canvas for Layer 4 (Stars) and Layer 5 (Small Particles) */}
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />
    </div>
  )
}
