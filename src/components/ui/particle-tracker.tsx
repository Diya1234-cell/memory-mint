'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  alpha: number
  decay: number
}

export function ParticleTracker() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false })

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const handleResize = () => {
      canvas.width = container.clientWidth
      canvas.height = container.clientHeight
    }

    handleResize()
    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(container)

    const colors = [
      'rgba(255, 75, 145, ',  // Neon Pink
      'rgba(139, 92, 246, ',  // Cosmic Violet
      'rgba(236, 72, 153, ',  // Nebula Pink
      'rgba(255, 255, 255, ', // White Star
    ]

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current.x = e.clientX - rect.left
      mouseRef.current.y = e.clientY - rect.top
      mouseRef.current.active = true

      // Spawn particles on move
      if (Math.random() < 0.4) {
        const color = colors[Math.floor(Math.random() * colors.length)]
        particlesRef.current.push({
          x: mouseRef.current.x,
          y: mouseRef.current.y,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5 - 0.5, // Drift slightly up
          size: Math.random() * 2 + 1,
          color,
          alpha: 1.0,
          decay: Math.random() * 0.02 + 0.015,
        })
      }
    }

    const handleMouseLeave = () => {
      mouseRef.current.active = false
    }

    container.addEventListener('mousemove', handleMouseMove)
    container.addEventListener('mouseleave', handleMouseLeave)

    let animationId: number

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Maybe spawn some ambient stars drifting slowly when mouse is inactive
      if (!mouseRef.current.active && Math.random() < 0.05) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: -Math.random() * 0.8 - 0.2,
          size: Math.random() * 1.5 + 0.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 0.8,
          decay: 0.005,
        })
      }

      particlesRef.current.forEach((p, idx) => {
        p.x += p.vx
        p.y += p.vy
        p.alpha -= p.decay

        // Draw particle as a soft glowing circle or star
        ctx.save()
        ctx.globalAlpha = p.alpha
        ctx.fillStyle = p.color + '1)'
        ctx.shadowBlur = 8
        ctx.shadowColor = p.color.includes('255, 75, 145') ? '#ff4b91' : '#8b5cf6'

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })

      // Clean up dead particles
      particlesRef.current = particlesRef.current.filter((p) => p.alpha > 0)

      animationId = requestAnimationFrame(render)
    }

    render()

    return () => {
      resizeObserver.disconnect()
      container.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('mouseleave', handleMouseLeave)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <div ref={containerRef} className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
      <canvas ref={canvasRef} className="block w-full h-full opacity-70" />
    </div>
  )
}
