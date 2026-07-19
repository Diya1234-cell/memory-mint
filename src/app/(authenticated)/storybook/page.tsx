'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import {
  Bookmark, ChevronLeft, ChevronRight, Download, Heart, Moon, Play, Pause, Share2, Sparkles, Telescope,
  Pencil, Check, X, Bold, Italic, Underline, Highlighter, AlignLeft, AlignCenter, AlignRight,
  List, ListOrdered, Quote, Undo2, Redo2, Link2, Smile,
} from 'lucide-react'
import TopNav from '@/components/upload/TopNav'
import { useStoryBook } from '@/context/StoryBookContext'
import type { StoryBookChapter } from '@/context/StoryBookContext'

/* ─── Data ─── */

const DEFAULT_CHAPTERS: StoryBookChapter[] = [
  {
    id: 'default-0', chapter: 'Chapter One', title: 'The Beginning', emoji: '🌅',
    date: '15 March 2024', place: 'Goa, India',
    mood: 'Golden & Grateful',
    caption: 'Some stories begin quietly — with one sunset, two hearts, and a feeling that this moment should last forever.',
    color: '#f4ae61', colorDark: '#b8833a',
    images: [
      { src: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80', rot: -2, w: 130, h: 160 },
      { src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80', rot: 4, w: 110, h: 140 },
      { src: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=400&q=80', rot: -5, w: 100, h: 130 },
      { src: 'https://images.unsplash.com/photo-1470071459604-7b8ec44ffd6c?auto=format&fit=crop&w=400&q=80', rot: 3, w: 90, h: 120 },
      { src: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=400&q=80', rot: -1, w: 120, h: 90 },
    ],
    collage: 'polaroid-stack',
    story: 'The first time we met, the sun was setting over the Arabian Sea. The waves seemed to know something we didn\'t — that this was the beginning of our forever. We walked along the shoreline, collecting shells and laughter, neither of us wanting the day to end. In the amber glow of twilight, we made a silent promise to return to this moment, again and again, for the rest of our lives.',
    favorite: false, category: 'First Date', tags: [], visibility: 'Private', people: [], weather: '☀️ Sunny', memoryType: 'photos', description: '', uploadedFileName: null,
  },
  {
    id: 'default-1', chapter: 'Chapter Two', title: 'Our First Date', emoji: '❤️',
    date: '12 January 2025', place: 'Varkala, India',
    mood: 'Nervous & Perfect',
    caption: 'Every love story begins with a single step — ours started with a clumsy handshake and a smile that felt like home.',
    color: '#ff719f', colorDark: '#cc3d6e',
    images: [
      { src: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=400&q=80', rot: 3, w: 120, h: 150 },
      { src: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=400&q=80', rot: -4, w: 100, h: 130 },
      { src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', rot: 2, w: 130, h: 100 },
      { src: 'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?auto=format&fit=crop&w=400&q=80', rot: -6, w: 90, h: 120 },
      { src: 'https://images.unsplash.com/photo-1470071459604-7b8ec44ffd6c?auto=format&fit=crop&w=400&q=80', rot: 5, w: 110, h: 140 },
    ],
    collage: 'scattered-hearts',
    story: 'You were waiting by the cliffside café, hands in your pockets, glancing at the waves. I almost tripped walking up to you. You laughed — that warm, easy laugh — and suddenly everything felt right. We shared a plate of something unpronounceable and talked until the moon replaced the sun. That night, I knew that the universe had conspired to bring us together, and I never wanted to leave the orbit of your smile.',
    favorite: false, category: 'First Date', tags: [], visibility: 'Private', people: [], weather: '🌙 Night', memoryType: 'photos', description: '', uploadedFileName: null,
  },
  {
    id: 'default-2', chapter: 'Chapter Three', title: 'Adventures Together', emoji: '🌊',
    date: '20 September 2025', place: 'Mumbai, India',
    mood: 'Wild & Free',
    caption: 'We followed the coastline until the sky turned into a thousand shades of blue. Every detour became a memory.',
    color: '#66b8ff', colorDark: '#3a8acc',
    images: [
      { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=400&q=80', rot: -2, w: 140, h: 100 },
      { src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=400&q=80', rot: 5, w: 110, h: 140 },
      { src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=400&q=80', rot: -4, w: 120, h: 90 },
      { src: 'https://images.unsplash.com/photo-1465056508446-4e76cb3d4715?auto=format&fit=crop&w=400&q=80', rot: 3, w: 100, h: 130 },
      { src: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80', rot: -1, w: 130, h: 110 },
    ],
    collage: 'film-strip',
    story: 'We drove without a destination, windows down, music loud. The road took us through fishing villages, past coconut groves, and up a hillside where the entire coastline unfolded like a painting. You pointed at the horizon and said, "Let\'s see what\'s beyond that." So we went. We discovered hidden beaches, ate from roadside stalls, and fell asleep under a canopy of stars. The world felt endless, and we felt invincible.',
    favorite: false, category: 'Adventure', tags: [], visibility: 'Private', people: [], weather: '☀️ Sunny', memoryType: 'photos', description: '', uploadedFileName: null,
  },
  {
    id: 'default-3', chapter: 'Chapter Four', title: 'Under The Same Stars', emoji: '🌌',
    date: '04 June 2026', place: 'Jaisalmer, India',
    mood: 'Magical & Infinite',
    caption: 'Even in the widest night, the universe had a way of making us feel wonderfully close.',
    color: '#b985ff', colorDark: '#7a4fcc',
    images: [
      { src: 'https://images.unsplash.com/photo-1519608487953-e999c86e7450?auto=format&fit=crop&w=400&q=80', rot: 1, w: 130, h: 160 },
      { src: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=400&q=80', rot: -4, w: 110, h: 140 },
      { src: 'https://images.unsplash.com/photo-1518173946687-a36f968f7cfa?auto=format&fit=crop&w=400&q=80', rot: 3, w: 120, h: 100 },
      { src: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=400&q=80', rot: -2, w: 90, h: 130 },
      { src: 'https://images.unsplash.com/photo-1504333638930-c8787321eee0?auto=format&fit=crop&w=400&q=80', rot: 5, w: 100, h: 120 },
    ],
    collage: 'constellation-grid',
    story: 'We lay on the cold desert sand, staring up at a sky so full of stars it felt like we were floating. You traced constellations with your finger, naming them wrong on purpose just to make me laugh. Somewhere between Orion and your made-up "Cuddly Bear" cluster, I knew — this was home. The universe stretched on forever above us, but in that moment, everything I needed was right there beside me.',
    favorite: false, category: 'Vacation', tags: [], visibility: 'Private', people: [], weather: '🌙 Night', memoryType: 'photos', description: '', uploadedFileName: null,
  },
]

const glassCard = {
  background: 'linear-gradient(135deg, rgba(255,255,255,0.075), rgba(24,16,38,0.45) 42%, rgba(18,7,31,0.56))',
  backdropFilter: 'blur(30px) saturate(145%)',
  WebkitBackdropFilter: 'blur(30px) saturate(145%)',
  border: '1px solid rgba(255,255,255,0.08)',
  boxShadow: '0 18px 52px rgba(0,0,0,0.34), 0 0 30px rgba(139,92,246,0.10), inset 0 1px rgba(255,255,255,0.12), inset 0 0 28px rgba(255,95,210,0.045)',
}

/* ─── Background Components ─── */

function StarField() {
  const stars = useMemo(() =>
    Array.from({ length: 200 }, (_, i) => ({
      x: (i * 31) % 100, y: (i * 47) % 100,
      size: i % 5 === 0 ? 2.5 : i % 3 === 0 ? 1.5 : i % 7 === 0 ? 1 : 0.8,
      delay: i * 0.13, duration: 2 + (i % 6) * 0.6,
      color: i % 7 === 0 ? '#d885ff' : i % 11 === 0 ? '#ffb0cd' : i % 13 === 0 ? '#ffd700' : '#ffffff',
      glow: i % 7 === 0 || i % 11 === 0 || i % 13 === 0,
    })), [])
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      {stars.map((s, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${s.x}%`, top: `${s.y}%`,
            width: s.size, height: s.size,
            backgroundColor: s.color,
            boxShadow: s.glow ? `0 0 ${s.size * 6}px ${s.color}` : undefined,
          }}
          animate={{ opacity: [0.08, 0.85, 0.08], scale: [1, s.glow ? 2.5 : 1.3, 1] }}
          transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

function NebulaClouds() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      <motion.div
        className="absolute w-[1100px] h-[600px] -top-32 left-1/4 rounded-full"
        style={{
          background: 'radial-gradient(ellipse, rgba(168,85,247,0.18), rgba(76,48,193,0.08) 40%, transparent 65%)',
          filter: 'blur(70px)',
        }}
        animate={{ x: [-40, 40, -40], y: [0, 30, 0], scale: [1, 1.06, 1] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute w-[800px] h-[500px] top-1/4 -right-16 rounded-full"
        style={{
          background: 'radial-gradient(ellipse, rgba(255,75,145,0.12), rgba(139,92,246,0.06) 35%, transparent 60%)',
          filter: 'blur(55px)',
        }}
        animate={{ x: [25, -25, 25], y: [15, -20, 15], scale: [1.06, 0.94, 1.06] }}
        transition={{ duration: 32, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute w-[700px] h-[400px] bottom-16 left-1/3 rounded-full"
        style={{
          background: 'radial-gradient(ellipse, rgba(99,102,241,0.1), rgba(59,48,193,0.05) 35%, transparent 60%)',
          filter: 'blur(60px)',
        }}
        animate={{ x: [-20, 30, -20], y: [-15, 15, -15], scale: [0.94, 1.07, 0.94] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}

function ShootingStars() {
  const [showers, setShowers] = useState<{ id: number; x: number; y: number; angle: number; delay: number }[]>([])
  useEffect(() => {
    const spawn = () => setShowers(prev => [...prev.slice(-2), {
      id: Date.now() + Math.random(),
      x: Math.random() * 80 + 5,
      y: Math.random() * 40 + 5,
      angle: -20 - Math.random() * 20,
      delay: Math.random() * 2,
    }])
    spawn()
    const interval = setInterval(spawn, 6000 + Math.random() * 4000)
    return () => clearInterval(interval)
  }, [])
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }}>
      <AnimatePresence>
        {showers.map(s => (
          <motion.div
            key={s.id}
            className="absolute"
            style={{ left: `${s.x}%`, top: `${s.y}%` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.8, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, delay: s.delay, ease: 'easeOut' }}
          >
            <div
              className="h-px"
              style={{
                width: 140,
                background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.8), rgba(255,255,255,0.3))',
                transform: `rotate(${s.angle}deg)`,
                filter: 'blur(0.5px)',
                boxShadow: '0 0 4px rgba(255,255,255,0.4)',
              }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

function AuroraRibbons() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      <motion.div
        className="absolute top-[3%] left-0 w-[350%] h-[140px] opacity-[0.035]"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, #a855f7 15%, #ff4b91 30%, #6366f1 45%, #d885ff 60%, transparent 75%)',
          filter: 'blur(45px)',
        }}
        animate={{ x: ['-35%', '0%', '-35%'] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-[10%] left-0 w-[300%] h-[100px] opacity-[0.02]"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, #ffb0cd 15%, #d885ff 35%, #7dd3fc 55%, transparent 70%)',
          filter: 'blur(40px)',
        }}
        animate={{ x: ['-15%', '-45%', '-15%'] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}

function FloatingPlanets() {
  const planets = useMemo(() => [
    { left: '3%', top: '50%', size: 60, dur: 16, color: ['#f1d5ff', '#7e45dc', '#281051'], shadow: '#9a5cf5', ring: true },
    { left: '93%', top: '20%', size: 36, dur: 20, color: ['#e9d5ff', '#8b5cf6'], shadow: '#8b5cf666', ring: false },
    { left: '7%', top: '18%', size: 24, dur: 22, color: ['#d5f5ff', '#63b3ed', '#1a365d'], shadow: '#63b3ed66', ring: false },
    { left: '88%', top: '65%', size: 16, dur: 14, color: ['#ffe0f0', '#f472b6'], shadow: '#f472b644', ring: false },
    { left: '50%', top: '8%', size: 14, dur: 18, color: ['#e9d5ff', '#a855f7'], shadow: '#a855f733', ring: false },
  ], [])
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }}>
      {planets.map((p, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: p.left, top: p.top }}
          animate={{ y: [0, -18 + i * 3, 0], rotate: [0, i % 2 === 0 ? 10 : -10, 0] }}
          transition={{ duration: p.dur, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="relative" style={{ width: p.size, height: p.size }}>
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `radial-gradient(circle at 35% 30%, ${p.color.join(', ')})`,
                boxShadow: `0 0 ${p.size * 0.5}px ${p.shadow}`,
              }}
            />
            {p.ring && (
              <div
                className="absolute"
                style={{
                  width: p.size * 1.4,
                  height: p.size * 0.35,
                  top: '50%', left: '50%',
                  transform: 'translate(-50%, -50%) rotateX(65deg) rotateZ(-15deg)',
                  borderRadius: '50%',
                  border: `2px solid rgba(200, 180, 255, 0.25)`,
                  boxShadow: '0 0 12px rgba(168,85,247,0.15)',
                }}
              />
            )}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function Fireflies() {
  const fireflies = useMemo(() =>
    Array.from({ length: 15 }, (_, i) => ({
      left: (i * 37 + 11) % 100,
      top: 20 + ((i * 23 + 7) % 60),
      size: 2 + (i % 3) * 0.75,
      dur: 5 + (i % 8),
      delay: (i * 0.43) % 5,
      xDrift: -30 + ((i * 17) % 60),
      yDrift: -40 + ((i * 11) % 30),
    })), [])
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }}>
      {fireflies.map((f, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${f.left}%`, top: `${f.top}%`,
            width: f.size, height: f.size,
            backgroundColor: 'rgba(168,85,247,0.35)',
            boxShadow: '0 0 6px rgba(168,85,247,0.25), 0 0 12px rgba(139,92,246,0.08)',
          }}
          animate={{
            x: [0, f.xDrift * 0.5, f.xDrift, f.xDrift * 0.5, 0],
            y: [0, f.yDrift * 0.3, f.yDrift * 0.7, f.yDrift, 0],
            opacity: [0, 0.6, 0.8, 0.4, 0],
            scale: [0.5, 1, 1.2, 0.8, 0.5],
          }}
          transition={{ duration: f.dur, delay: f.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

/* ─── Collage Components ─── */

type CollageProps = { images: StoryBookChapter['images']; color: string; onPhotoClick: (image: StoryBookChapter['images'][number]) => void }

function PolaroidStack({ images, color, onPhotoClick }: CollageProps) {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {images.map((img, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            transform: `rotate(${img.rot}deg) translate(${(i - 2) * 12}px, ${(i - 2) * 14}px)`,
            zIndex: images.length - i,
          }}
          whileHover={{ scale: 1.08, zIndex: 20, rotate: 0, y: -4 }}
          transition={{ type: 'spring', stiffness: 180, damping: 14 }}
          onClick={() => onPhotoClick(img)}
        >
          <div className="relative bg-white/95 p-[5px] shadow-xl rounded-sm"
            style={{ boxShadow: `0 12px 34px rgba(0,0,0,0.5), 0 0 16px ${color}28` }}>
            <div className="overflow-hidden" style={{ width: Math.max(140, Math.min(180, img.w * 1.35)), height: img.h * 1.35, backgroundColor: '#0a0a0a' }}>
              <img src={img.src} alt="" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="h-[20px] flex items-center justify-center">
              <span className="text-[6px] text-gray-400 font-serif italic tracking-widest">✦ {new Date().getFullYear()} ✦</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function ScatteredHearts({ images, color, onPhotoClick }: CollageProps) {
  const positions = useMemo(() => {
    const spots = [
      { top: '4%', left: '5%', z: 2 },
      { top: '10%', left: '48%', z: 5 },
      { top: '42%', left: '16%', z: 4 },
      { top: '52%', left: '53%', z: 3 },
      { top: '26%', left: '1%', z: 1 },
    ]
    return images.map((img, i) => ({
      ...spots[i % spots.length],
      rot: img.rot,
      w: img.w,
      h: img.h,
    }))
  }, [images])
  return (
    <div className="relative w-full h-full">
      {images.map((img, i) => (
        <motion.div
          key={i}
          className="absolute glass-shimmer"
          style={{ top: positions[i].top, left: positions[i].left, transform: `rotate(${positions[i].rot}deg)`, zIndex: positions[i].z }}
          whileHover={{ scale: 1.1, zIndex: 20, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 180, damping: 14 }}
          onClick={() => onPhotoClick(img)}
        >
          <div className="relative rounded-sm overflow-hidden shadow-xl"
            style={{ width: Math.max(140, Math.min(180, positions[i].w * 1.35)), height: positions[i].h * 1.35, boxShadow: `0 12px 32px rgba(0,0,0,0.5), 0 0 14px ${color}28` }}>
            <img src={img.src} alt="" className="w-full h-full object-cover" loading="lazy" />
            <div className="absolute top-0 left-0 w-5 h-5" style={{
              background: 'linear-gradient(135deg, rgba(168,85,247,0.2) 0%, transparent 50%)',
            }} />
            <div className="absolute bottom-0 right-0 w-5 h-5" style={{
              background: 'linear-gradient(315deg, rgba(168,85,247,0.2) 0%, transparent 50%)',
            }} />
          </div>
        </motion.div>
      ))}
      <div className="absolute bottom-2 right-2 text-xs opacity-40">❤️</div>
      <div className="absolute top-1 left-1 text-[10px] opacity-30">✨</div>
    </div>
  )
}

function FilmStrip({ images, color, onPhotoClick }: CollageProps) {
  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col items-center justify-center gap-2">
      <div className="text-[7px] tracking-[0.35em] text-white/25 uppercase font-medium">— moments —</div>
      <div className="grid grid-cols-3 gap-2 max-w-full px-3 py-2.5 rounded-sm" style={{
        background: 'rgba(0,0,0,0.35)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}>
        {images.map((img, i) => (
          <motion.div
            key={i}
            className="relative min-w-0 glass-shimmer"
            style={{ transform: `rotate(${img.rot}deg)` }}
            whileHover={{ scale: 1.15, rotate: 0, zIndex: 20 }}
            transition={{ type: 'spring', stiffness: 180, damping: 14 }}
            onClick={() => onPhotoClick(img)}
          >
            <div className="relative overflow-hidden rounded-sm shadow-lg"
              style={{ width: '100%', maxWidth: 160, aspectRatio: `${img.w} / ${img.h}`, boxShadow: `0 10px 26px rgba(0,0,0,0.55), 0 0 12px ${color}24` }}>
              <img src={img.src} alt="" className="w-full h-full object-contain bg-black/20" loading="lazy" />
              <div className="absolute -top-[1px] left-0 right-0 h-[5px]" style={{ background: 'rgba(0,0,0,0.5)' }} />
              <div className="absolute -bottom-[1px] left-0 right-0 h-[5px]" style={{ background: 'rgba(0,0,0,0.5)' }} />
            </div>
          </motion.div>
        ))}
      </div>
      <div className="flex gap-2 text-[7px] text-white/20">
        <span>◉ 001</span>
        <span>◉ 002</span>
        <span>◉ 003</span>
        <span>◉ 004</span>
        <span>◉ 005</span>
      </div>
    </div>
  )
}

function ConstellationGrid({ images, color, onPhotoClick }: CollageProps) {
  const nodes = useMemo(() => [
    { cx: '50%', cy: '25%', r: 3 },
    { cx: '72%', cy: '40%', r: 2 },
    { cx: '28%', cy: '45%', r: 2.5 },
    { cx: '55%', cy: '65%', r: 2 },
    { cx: '40%', cy: '80%', r: 1.5 },
    { cx: '78%', cy: '72%', r: 1.8 },
  ], [])
  const edges = useMemo(() => [
    [0, 1], [1, 2], [2, 0], [0, 3], [1, 3], [2, 3], [3, 4], [1, 5], [3, 5],
  ], [])
  return (
    <div className="relative w-full h-full">
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
        {edges.map(([a, b], i) => (
          <line key={i} x1={nodes[a].cx} y1={nodes[a].cy} x2={nodes[b].cx} y2={nodes[b].cy}
            stroke={color} strokeWidth="0.4" opacity="0.25" strokeDasharray="3 4">
            <animate attributeName="stroke-dashoffset" values="0;-20" dur="3s" repeatCount="indefinite" />
          </line>
        ))}
        {nodes.map((n, i) => (
          <circle key={i} cx={n.cx} cy={n.cy} r={n.r} fill={color} opacity="0.5">
            <animate attributeName="opacity" values="0.3;0.8;0.3" dur={`${2 + i * 0.5}s`} repeatCount="indefinite" />
          </circle>
        ))}
      </svg>
      <div className="relative z-10 grid grid-cols-3 gap-2 p-3 h-full place-items-center content-center">
        {images.slice(0, 6).map((img, i) => (
          <motion.div
            key={i}
            className="glass-shimmer"
            style={{ transform: `rotate(${img.rot}deg)` }}
            whileHover={{ scale: 1.12, rotate: 0, zIndex: 20 }}
            transition={{ type: 'spring', stiffness: 180, damping: 14 }}
            onClick={() => onPhotoClick(img)}
          >
            <div className="relative rounded-sm overflow-hidden shadow-lg"
              style={{
                width: i === 0 ? 180 : i === 4 ? 160 : 140,
                height: i === 0 ? 150 : i === 4 ? 180 : 140,
                boxShadow: `0 10px 28px rgba(0,0,0,0.55), 0 0 12px ${color}28`,
                border: '1px solid rgba(168,85,247,0.06)',
              }}>
              <img src={img.src} alt="" className="w-full h-full object-cover" loading="lazy" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function getCollageLayout(chapter: typeof chapters[0]) {
  const layouts: Record<string, typeof PolaroidStack> = {
    'polaroid-stack': PolaroidStack,
    'scattered-hearts': ScatteredHearts,
    'film-strip': FilmStrip,
    'constellation-grid': ConstellationGrid,
  }
  return layouts[chapter.collage] || PolaroidStack
}

/* ─── Book Page Content ─── */

function BookContent({ chapter, side, editMode, onStoryEdit, onCaptionEdit }: {
  chapter: StoryBookChapter; side: 'left' | 'right';
  editMode?: boolean; onStoryEdit?: (html: string) => void; onCaptionEdit?: (text: string) => void;
}) {
  const Collage = getCollageLayout(chapter)
  const [selectedPhoto, setSelectedPhoto] = useState<typeof chapters[0]['images'][number] | null>(null)

  if (side === 'left') {
    return (
      <div className="relative h-full flex flex-col p-4 md:p-5 lg:p-6">
        <span className="text-[10px] md:text-[11px] tracking-[0.25em] uppercase font-semibold" style={{ color: '#D8B4FE' }}>
          {chapter.chapter}
        </span>
        <h2 className="font-serif text-[32px] md:text-[34px] lg:text-[36px] mt-1 text-white/95 leading-tight" style={{ textShadow: '0 2px 16px rgba(0,0,0,0.38)' }}>
          {chapter.emoji} {chapter.title}
        </h2>
        <div className="mt-1 mb-2 w-10 h-px" style={{ background: `linear-gradient(to right, ${chapter.color}, transparent)` }} />
        <div className="flex-1 min-h-0 relative">
          <Collage images={chapter.images} color={chapter.color} onPhotoClick={setSelectedPhoto} />
          <AnimatePresence>
            {selectedPhoto && (
              <motion.button
                type="button"
                aria-label="Close photo preview"
                className="absolute inset-0 z-50 flex items-center justify-center bg-[#10051d]/65 backdrop-blur-sm cursor-zoom-out"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedPhoto(null)}
              >
                <motion.div
                  className="relative bg-white p-2.5 pb-8 rounded-sm cursor-default"
                  style={{ boxShadow: `0 24px 56px rgba(0,0,0,0.7), 0 0 28px ${chapter.color}66` }}
                  initial={{ opacity: 0, scale: 0.55, rotate: selectedPhoto.rot }}
                  animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
                  exit={{ opacity: 0, scale: 0.7, rotate: selectedPhoto.rot }}
                  transition={{ type: 'spring', stiffness: 280, damping: 20 }}
                  onClick={(event) => event.stopPropagation()}
                >
                  <img
                    src={selectedPhoto.src}
                    alt="Expanded story memory"
                    className="block max-h-[320px] max-w-[78vw] object-contain bg-black/10"
                    style={{ width: Math.max(190, Math.min(300, selectedPhoto.w * 2)) }}
                  />
                  <span className="absolute bottom-2 left-0 right-0 text-center text-[9px] font-serif italic tracking-[0.18em] text-gray-400">A MEMORY TO HOLD ON TO</span>
                </motion.div>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
        <div className="mt-2 flex items-center gap-3 text-[10px] md:text-[11px] text-white/55">
          <span>✦ {chapter.date}</span>
          <span>⌖ {chapter.place}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-full flex flex-col p-4 md:p-5 lg:p-6">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[9px] text-white/35 uppercase tracking-wider">mood</span>
        <span className="inline-flex px-2.5 py-1 rounded-full text-[10px] font-medium"
          style={{
            background: `linear-gradient(135deg, ${chapter.color}22, transparent)`,
            border: `0.5px solid ${chapter.color}33`,
            color: chapter.color,
          }}>
          {chapter.mood}
        </span>
      </div>
      <div className="flex-1 relative overflow-hidden rounded-lg p-4 md:p-5" style={{
        background: `linear-gradient(135deg, rgba(255,255,255,0.055), ${chapter.color}10 48%, transparent)`,
        border: '0.5px solid rgba(255,255,255,0.08)',
        boxShadow: `inset 0 0 30px ${chapter.color}08`,
      }}>
        <div className="absolute top-3 left-3 h-5 w-14 -rotate-6 opacity-35" style={{ background: 'repeating-linear-gradient(45deg, rgba(221,185,120,0.45) 0 2px, rgba(255,255,255,0.12) 2px 5px)' }} />
        <div className="absolute bottom-5 left-4 text-base opacity-25">🌙 ✦</div>
        <div className="absolute right-4 bottom-7 rounded-full border border-amber-200/25 px-1.5 py-0.5 text-[7px] tracking-widest text-amber-100/50 -rotate-6">POSTED IN THE STARS</div>
        <div className="absolute top-2 right-2 text-[9px] opacity-15">✦</div>
        <p className="font-serif italic text-[22px] md:text-[23px] lg:text-[24px] leading-[1.45] text-white/90 drop-cap" style={{ textShadow: '0 1px 12px rgba(0,0,0,0.35)' }}>
          &ldquo;{chapter.caption}&rdquo;
        </p>
        <div className="mt-4 mb-4 h-px w-full" style={{ background: `linear-gradient(to right, ${chapter.color}44, transparent)` }} />
        {editMode ? (
          <div
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => onStoryEdit?.(e.currentTarget.innerHTML)}
            className="text-[18px] md:text-[19px] lg:text-[20px] leading-[1.8] text-white/80 font-light outline-none rounded-lg p-2 -m-2 border border-dashed border-white/10 hover:border-white/20 focus:border-pink-400/30 transition-colors min-h-[120px] cursor-text"
            style={{ textShadow: '0 1px 10px rgba(0,0,0,0.32)' }}
            dangerouslySetInnerHTML={{ __html: chapter.story }}
          />
        ) : (
          <p className="text-[18px] md:text-[19px] lg:text-[20px] leading-[1.8] text-white/80 font-light" style={{ textShadow: '0 1px 10px rgba(0,0,0,0.32)' }}>
            {chapter.story}
          </p>
        )}
        <div className="absolute bottom-2 right-2 text-[7px] text-white/15 tracking-widest">~ ∞ ~</div>
      </div>
      <div className="mt-auto flex justify-between items-center pt-2">
        <span className="text-[7px] text-white/15">✧ ☾ ✦</span>
        <span className="text-[7px] text-white/15">{chapter.date}</span>
      </div>
      {/* Tiny constellation decoration */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-[2px] opacity-20">
        {[2, 3, 2, 4, 2].map((s, i) => (
          <div key={i} className="rounded-full" style={{
            width: s, height: s,
            backgroundColor: chapter.color,
          }} />
        ))}
      </div>
    </div>
  )
}

/* ─── Chapter Carousel Card ─── */

function ChapterCard({ ch, active, onClick }: { ch: StoryBookChapter; active: boolean; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      className={`relative flex-shrink-0 rounded-xl overflow-hidden transition-all duration-500 glass-shimmer ${active ? 'ring-2 ring-pink-400/60' : 'ring-1 ring-white/10'}`}
      style={{
        width: 165,
        height: 118,
        background: active
          ? `linear-gradient(135deg, ${ch.color}3f, rgba(24,16,38,0.52))`
          : 'linear-gradient(135deg, rgba(255,255,255,0.055), rgba(24,16,38,0.45))',
        border: active ? `1px solid ${ch.color}88` : '1px solid rgba(255,255,255,0.08)',
        boxShadow: active ? `0 0 32px ${ch.color}55, 0 10px 28px rgba(0,0,0,0.42), inset 0 1px rgba(255,255,255,0.15)` : '0 6px 18px rgba(0,0,0,0.26), inset 0 1px rgba(255,255,255,0.08)',
      }}
      whileHover={{ scale: 1.05, y: -3 }}
      animate={{ y: active ? [0, -2, 0] : [0, -1, 0] }}
      transition={{ y: { duration: active ? 2.6 : 3.5, repeat: Infinity, ease: 'easeInOut' } }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.08]">
          <img src={ch.images[0]?.src} alt="" className="w-full h-full object-cover" />
        </div>
        {active && (
          <motion.div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${ch.color}11, transparent)`,
            }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
      </div>
      <div className="relative z-10 h-full flex flex-col justify-between p-3">
        <span className="text-[13px]">{ch.emoji}</span>
        <div>
          <p className={`text-[10px] font-medium leading-tight text-left ${active ? 'text-white/90' : 'text-white/50'}`}>
            {ch.title}
          </p>
          <p className="text-[8px] text-white/35 mt-1 text-left">{ch.date}</p>
        </div>
      </div>
      {active && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[2px]"
          style={{ background: `linear-gradient(to right, ${ch.color}, #ff4b91)` }}
          layoutId="activeChapterLine"
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        />
      )}
    </motion.button>
  )
}

/* ─── Right Panel ─── */

function RightPanel({ chapter, page, total, bookmarked, onBookmark, editMode, onToggleEdit }: {
  chapter: StoryBookChapter; page: number; total: number;
  bookmarked: boolean; onBookmark: () => void;
  editMode?: boolean; onToggleEdit?: () => void;
}) {
  return (
    <aside className="hidden 2xl:flex flex-col w-[250px] flex-shrink-0 gap-4">
      <motion.div
        className="rounded-2xl p-5 glass-shimmer"
        style={glassCard}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="text-[13px] font-semibold text-white/90 tracking-wide">Story Progress</p>
        <p className="text-[27px] font-bold mt-1 text-gradient-cosmic">
          {Math.round(((page + 1) / total) * 100)}<span className="text-base text-white/50">%</span>
        </p>
        <div className="mt-2 h-1.5 rounded-full bg-white/5 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(to right, #ff4b91, #a855f7)' }}
            initial={{ width: 0 }}
            animate={{ width: `${((page + 1) / total) * 100}%` }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
        <p className="text-[12px] text-white/45 mt-2.5">Chapter {page + 1} of {total}</p>
      </motion.div>

      <motion.div
        className="rounded-2xl p-5 glass-shimmer"
        style={glassCard}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="text-[13px] font-semibold text-white/90 tracking-wide">Current Mood</p>
        <p className="text-[17px] text-white/80 mt-2 font-serif italic">{chapter.mood}</p>
        <div className="mt-3 flex gap-2">
          {['💫', '✨', '🌙', '⭐', '🌸'].map((e, i) => (
            <motion.span
              key={i}
              className="text-base cursor-default"
              animate={{ y: [0, -4, 0], rotate: [0, 12, 0] }}
              transition={{ duration: 2.5 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.25 }}
            >{e}</motion.span>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="rounded-2xl p-5 glass-shimmer"
        style={glassCard}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="text-[13px] font-semibold text-white/90 tracking-wide">Actions</p>
        <div className="mt-3.5 flex flex-col gap-2.5">
          {[
            { icon: Pencil, label: editMode ? 'Done Editing' : 'Edit Story', active: editMode, onClick: onToggleEdit || (() => {}) },
            { icon: Bookmark, label: bookmarked ? 'Bookmarked' : 'Bookmark', active: bookmarked, onClick: onBookmark },
            { icon: Heart, label: 'Favorite Chapter', onClick: () => {} },
            { icon: Share2, label: 'Share Story', onClick: () => {} },
            { icon: Download, label: 'Export PDF', onClick: () => {} },
          ].map((item, i) => (
            <motion.button
              key={i}
              onClick={item.onClick}
              className="flex items-center gap-3 text-[14px] text-white/60 hover:text-pink-200 transition-all duration-300 group"
              whileHover={{ x: 3 }}
            >
              <item.icon className={`w-4 transition-all duration-300 ${item.active ? 'fill-pink-300 text-pink-300' : 'group-hover:text-pink-200'}`} />
              <span>{item.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </aside>
  )
}

/* ─── Main Component ─── */

export default function StoryBookPage() {
  const { chapters: uploadedChapters, updateChapterStory, updateChapterCaption } = useStoryBook()
  const allChapters = useMemo(() => {
    if (uploadedChapters.length > 0) return uploadedChapters
    return DEFAULT_CHAPTERS
  }, [uploadedChapters])

  const [page, setPage] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [magicMode, setMagicMode] = useState(false)
  const [constellationMode, setConstellationMode] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [isFlipping, setIsFlipping] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const carouselRef = useRef<HTMLDivElement>(null)
  const chapter = allChapters[page] || allChapters[0]

  const bookRotateY = useMotionValue(0)
  const bookRotateX = useMotionValue(0)
  const springRotateY = useSpring(bookRotateY, { stiffness: 50, damping: 18 })
  const springRotateX = useSpring(bookRotateX, { stiffness: 50, damping: 18 })

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect || isFlipping) return
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    bookRotateY.set((x - 0.5) * 5)
    bookRotateX.set((y - 0.5) * -2.5)
  }, [bookRotateX, bookRotateY, isFlipping])

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => move(1), 6000)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, page])

  const move = useCallback((delta: number) => {
    if (isFlipping) return
    setIsFlipping(true)
    setPage(p => {
      const next = Math.max(0, Math.min(allChapters.length - 1, p + delta))
      return next
    })
    setTimeout(() => setIsFlipping(false), 600)
  }, [isFlipping, allChapters.length])

  const scrollCarousel = useCallback((direction: number) => {
    carouselRef.current?.scrollBy({ left: direction * 360, behavior: 'smooth' })
  }, [])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') move(1)
    if (e.key === 'ArrowLeft') move(-1)
  }, [move])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  useEffect(() => {
    const el = carouselRef.current
    if (!el) return
    const cards = el.querySelectorAll('button')
    const target = cards[page]
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    }
  }, [page])

  const dustParticles = useMemo(() => Array.from({ length: 20 }, (_, i) => ({
    left: 5 + i * 4.5,
    size: 1 + (i % 3) * 0.8,
    color: i % 3 === 0 ? 'rgba(255,255,255,0.25)' : i % 3 === 1 ? 'rgba(168,85,247,0.18)' : 'rgba(139,92,246,0.1)',
    yDist: -50 - i * 8,
    xDist: (i % 3 - 1) * 18,
    dur: 7 + i * 1.2,
    delay: i * 0.6,
  })), [])

  return (
    <main
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="min-h-screen relative overflow-hidden text-white isolate select-none"
      style={{ background: 'radial-gradient(ellipse at 50% 46%, #1A0B2F 0%, #12071F 48%, #090312 100%)' }}
    >
      {/* ─── Background Layers ─── */}
      <div className="relative z-30">
        <TopNav />
      </div>
      <StarField />
      <NebulaClouds />
      <AuroraRibbons />
      <ShootingStars />
      <FloatingPlanets />
      <Fireflies />

      {/* Violet Light Rays */}
      <motion.div
        className="fixed top-[-8%] left-1/4 w-[500px] h-[200%] pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(168,85,247,0.05) 25%, rgba(139,92,246,0.025) 50%, transparent 100%)',
          transform: 'skewX(-12deg)',
          filter: 'blur(50px)',
          zIndex: 1,
          opacity: magicMode ? 0.06 : 0.03,
        }}
        animate={{ x: ['-25%', '25%', '-25%'] }}
        transition={{ duration: 35, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* ─── Hero ─── */}
      <div className="relative z-20 text-center pt-6 pb-1">
        <motion.h1
          className="font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl tracking-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="text-gradient-cosmic">✨ AI Memory StoryBook</span>
        </motion.h1>
        <motion.p
          className="text-xs md:text-sm text-white/75 mt-2 font-light tracking-wide max-w-xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          Every memory becomes a page. Every page becomes a constellation.
        </motion.p>
        <motion.div
          className="inline-flex mt-4 px-5 py-2 rounded-full text-xs"
          style={glassCard}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          ❤️ Our Little Universe
        </motion.div>
      </div>

      {/* ─── Main Content ─── */}
      <div className="relative z-20 flex justify-center px-3 md:px-6 pb-4 gap-5">
        {/* ─── The Book ─── */}
        <div className="flex-1 flex justify-center max-w-[1460px]" style={{ perspective: '1400px' }}>
          <motion.div
            className="relative w-full max-w-[1195px] min-h-[540px] md:min-h-[665px] book-float book-breathe"
            style={{
              rotateY: springRotateY,
              rotateX: springRotateX,
              transformStyle: 'preserve-3d',
              transformOrigin: 'center center',
            }}
          >
            {/* Book Shadow */}
            <motion.div
              className="absolute -bottom-8 left-[8%] right-[8%] h-14 rounded-full pointer-events-none"
              style={{
                background: `radial-gradient(ellipse, rgba(255,95,210,${magicMode ? 0.32 : 0.22}) 0%, rgba(139,92,246,${magicMode ? 0.36 : 0.24}) 42%, transparent 72%)`,
                filter: 'blur(28px)',
              }}
              animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.95, magicMode ? 1.12 : 1.08, 0.95] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Book Outer Frame */}
            <div className="absolute inset-0 rounded-[18px] book-violet-edge pointer-events-none" style={{ zIndex: 20 }} />

            {/* Book Body */}
            <div className="relative w-full h-full rounded-[16px] overflow-hidden border border-violet-200/10"
              style={{
                background: 'linear-gradient(145deg, rgba(41,20,65,0.96), rgba(18,7,31,0.98))',
                boxShadow: `
                  0 34px 110px rgba(0,0,0,0.62),
                  0 0 ${magicMode ? 90 : 62}px rgba(139,92,246,0.35),
                  0 0 45px rgba(255,95,210,0.20),
                  inset 0 0 70px rgba(139,92,246,0.12),
                  inset 0 1px 0 rgba(255,255,255,0.14)
                `,
              }}
            >
              {/* Left Page */}
              <div className="absolute inset-y-0 left-0 w-1/2 overflow-hidden border-r border-violet-200/8"
                style={{
                  background: 'linear-gradient(135deg, rgba(200,180,255,0.04), rgba(164,90,220,0.03))',
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`left-${page}`}
                    initial={{ opacity: 0, rotateY: -8, x: -15 }}
                    animate={{ opacity: 1, rotateY: 0, x: 0 }}
                    exit={{ opacity: 0, rotateY: 8, x: -15 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full"
                  >
                    <BookContent chapter={chapter} side="left" editMode={editMode} />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Right Page */}
              <div className="absolute inset-y-0 right-0 w-1/2"
                style={{
                  background: 'linear-gradient(135deg, rgba(164,90,220,0.03), rgba(200,180,255,0.02))',
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`right-${page}`}
                    initial={{ opacity: 0, rotateY: 8, x: 15 }}
                    animate={{ opacity: 1, rotateY: 0, x: 0 }}
                    exit={{ opacity: 0, rotateY: -8, x: 15 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full"
                  >
                    <BookContent
                      chapter={chapter}
                      side="right"
                      editMode={editMode}
                      onStoryEdit={(html) => updateChapterStory(chapter.id, html)}
                      onCaptionEdit={(text) => updateChapterCaption(chapter.id, text)}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Center Crease */}
              <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2"
                style={{
                  background: 'linear-gradient(to bottom, transparent 10%, rgba(139,92,246,0.08) 30%, rgba(139,92,246,0.04) 50%, rgba(139,92,246,0.08) 70%, transparent 90%)',
                }}
              />
              <div className="absolute inset-y-0 left-1/2 w-5 -translate-x-1/2"
                style={{
                  background: 'linear-gradient(to right, rgba(0,0,0,0.12), transparent 25%, transparent 75%, rgba(0,0,0,0.12))',
                }}
              />

              {/* Spine */}
              <div className="absolute left-0 top-0 bottom-0 w-[6px] rounded-l-[16px]"
                style={{
                  background: 'linear-gradient(to bottom, #f5d58c, #9a6727 30%, #f6d982 62%, #6e421a)',
                  boxShadow: 'inset -1px 0 rgba(255,248,204,0.5), 2px 0 8px rgba(221,173,73,0.25)',
                }}
              />
              <div className="absolute right-0 top-3 bottom-3 w-[4px] rounded-r-md pointer-events-none" style={{ background: 'linear-gradient(to bottom, #f7dd9a, #9d6825 35%, #f5d98d 68%, #7f4d1d)', boxShadow: 'inset 1px 0 rgba(255,250,210,0.55)' }} />

              {/* Page Edge Decorations */}
              <div className="absolute top-2 right-3 text-[7px] text-white/12">✧</div>
              <div className="absolute bottom-2 left-3 text-[7px] text-white/12">✦</div>
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-6 h-px" style={{
                background: 'linear-gradient(to right, transparent, rgba(168,85,247,0.08), transparent)',
              }} />

              {/* Bookmark Ribbon */}
              <motion.div
                className="absolute -right-[7px] top-[12%] w-[6px] h-[65px] rounded-r-sm pointer-events-none"
                style={{
                  background: `linear-gradient(to bottom, ${bookmarked ? '#ff4b91' : '#a855f7'}, ${bookmarked ? '#f472b6' : '#7c3aed'})`,
                  boxShadow: '2px 2px 6px rgba(0,0,0,0.3)',
                }}
                animate={{ y: [0, 3, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                className="absolute -right-[7px] top-[12%] w-[3px] h-[6px] rounded-br-sm pointer-events-none"
                style={{
                  background: bookmarked ? '#ff4b91' : '#a855f7',
                  marginTop: '65px',
                  clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                }}
              />

              {/* Constellation Mode Overlay */}
              {constellationMode && (
                <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 25 }}>
                  <svg className="w-full h-full">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <line key={i} x1={`${20 + Math.random() * 60}%`} y1={`${10 + Math.random() * 80}%`}
                        x2={`${20 + Math.random() * 60}%`} y2={`${10 + Math.random() * 80}%`}
                        stroke="#d885ff" strokeWidth="0.3" opacity="0.15" strokeDasharray="2 4">
                        <animate attributeName="stroke-dashoffset" values="0;-20" dur={`${3 + i * 0.5}s`} repeatCount="indefinite" />
                      </line>
                    ))}
                    {Array.from({ length: 8 }).map((_, i) => (
                      <circle key={i} cx={`${15 + Math.random() * 70}%`} cy={`${10 + Math.random() * 80}%`} r="1.5" fill="#d885ff" opacity="0.3">
                        <animate attributeName="opacity" values="0.1;0.6;0.1" dur={`${2 + i * 0.4}s`} repeatCount="indefinite" />
                      </circle>
                    ))}
                  </svg>
                </div>
              )}

              {/* Page Turn Particles */}
              {isFlipping && (
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{ zIndex: 30 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.3, 0] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {Array.from({ length: 8 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute rounded-full"
                      style={{
                        width: 2 + Math.random() * 3,
                        height: 2 + Math.random() * 3,
                backgroundColor: ['#ff4b91', '#a855f7', '#c084fc', '#ffffff'][i % 4],
                        top: `${20 + Math.random() * 60}%`,
                        left: `${40 + Math.random() * 20}%`,
                      }}
                      animate={{
                        x: [-10 + Math.random() * 20, -40 + Math.random() * 80],
                        y: [0, -30 - Math.random() * 40],
                        opacity: [0.6, 0],
                        scale: [1, 0.3],
                      }}
                      transition={{ duration: 0.4 + Math.random() * 0.3, ease: 'easeOut' }}
                    />
                  ))}
                </motion.div>
              )}
            </div>

            {/* Click zones for page turn */}
            <button
              onClick={() => move(-1)}
              disabled={page === 0 || isFlipping}
              className="absolute left-0 top-0 bottom-0 w-1/4 z-20 cursor-w-resize disabled:cursor-default"
              style={{ background: 'transparent' }}
              aria-label="Previous page"
            />
            <button
              onClick={() => move(1)}
            disabled={page === allChapters.length - 1 || isFlipping}
              className="absolute right-0 top-0 bottom-0 w-1/4 z-20 cursor-e-resize disabled:cursor-default"
              style={{ background: 'transparent' }}
              aria-label="Next page"
            />
          </motion.div>
        </div>

        {/* ─── Right Panel ─── */}
        <RightPanel
          chapter={chapter}
          page={page}
          total={allChapters.length}
          bookmarked={bookmarked}
          onBookmark={() => setBookmarked(v => !v)}
          editMode={editMode}
          onToggleEdit={() => setEditMode(v => !v)}
        />
      </div>

      {/* ─── Mode Toggles ─── */}
      <div className="relative z-20 flex justify-center gap-3 pb-1">
        {[
          { key: 'autoplay', icon: playing ? Pause : Play, label: playing ? 'Pause' : 'Auto Play', active: playing, onClick: () => setPlaying(v => !v) },
          { key: 'magic', icon: Sparkles, label: 'Magic', active: magicMode, onClick: () => setMagicMode(v => !v) },
          { key: 'constellation', icon: Telescope, label: 'Constellation', active: constellationMode, onClick: () => setConstellationMode(v => !v) },
        ].map(mode => (
          <motion.button
            key={mode.key}
            onClick={mode.onClick}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-medium transition-all duration-300"
            style={{
              background: mode.active
                ? 'linear-gradient(135deg, rgba(255,75,145,0.2), rgba(168,85,247,0.15))'
                : 'rgba(255,255,255,0.04)',
              border: mode.active
                ? '1px solid rgba(255,75,145,0.3)'
                : '1px solid rgba(255,255,255,0.06)',
              boxShadow: mode.active ? '0 0 15px rgba(255,75,145,0.15)' : 'none',
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <mode.icon className={`w-3 h-3 ${mode.active ? 'text-pink-200' : 'text-white/40'}`} />
            <span className={mode.active ? 'text-white/80' : 'text-white/40'}>{mode.label}</span>
          </motion.button>
        ))}
      </div>

      {/* ─── Bottom Chapter Carousel ─── */}
      <div className="relative z-20 pb-3 px-3 md:px-6">
        <div className="max-w-[1460px] mx-auto relative">
          <div className="pointer-events-none absolute z-10 left-0 top-0 bottom-2 w-16 bg-gradient-to-r from-[#12071F] via-[#12071F]/80 to-transparent" />
          <div className="pointer-events-none absolute z-10 right-0 top-0 bottom-2 w-20 bg-gradient-to-l from-[#12071F] via-[#12071F]/80 to-transparent" />
          <button aria-label="Scroll chapters left" onClick={() => scrollCarousel(-1)} className="absolute z-20 left-2 top-1/2 -translate-y-1/2 rounded-full p-2 text-white/80 transition hover:bg-white/10 hover:text-white" style={glassCard}>
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button aria-label="Scroll chapters right" onClick={() => scrollCarousel(1)} className="absolute z-20 right-2 top-1/2 -translate-y-1/2 rounded-full p-2 text-white/80 transition hover:bg-white/10 hover:text-white" style={glassCard}>
            <ChevronRight className="h-4 w-4" />
          </button>
          <motion.div
            ref={carouselRef}
            className="storybook-carousel flex items-center overflow-x-auto pb-2 scroll-smooth"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
              scrollSnapType: 'x mandatory',
            }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex gap-3 px-12 pr-12 md:px-16 md:pr-16">
              {allChapters.map((ch, i) => (
                <div key={ch.id} style={{ scrollSnapAlign: 'center' }}>
                  <ChapterCard
                    ch={ch}
                    active={i === page}
                    onClick={() => { if (!isFlipping) setPage(i) }}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ─── Controls ─── */}
      <div className="relative z-20 flex justify-center pb-8">
        <motion.div
          className="flex items-center rounded-full overflow-hidden"
          style={glassCard}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <button
            disabled={page === 0 || isFlipping}
            onClick={() => move(-1)}
            className="p-2.5 disabled:opacity-20 hover:bg-white/10 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="px-3 text-[10px] text-white/40 font-medium tracking-wider">
            {String(page + 1).padStart(2, '0')} / {String(allChapters.length).padStart(2, '0')}
          </div>
          <button
            onClick={() => setPlaying(v => !v)}
            className="p-2.5 border-x border-white/8 hover:bg-white/10 transition-all"
          >
            {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            disabled={page === allChapters.length - 1 || isFlipping}
            onClick={() => move(1)}
            className="p-2.5 disabled:opacity-20 hover:bg-white/10 transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button className="p-2.5 border-x border-white/8 hover:bg-white/10 transition-all">
            <Moon className="w-4 h-4" />
          </button>
          <button className="p-2.5 hover:bg-white/10 transition-all">
            <Sparkles className="w-4 h-4" />
          </button>
        </motion.div>
      </div>

      {/* ─── Dust Particles ─── */}
      {dustParticles.map((p, i) => (
        <motion.div
          key={i}
          className="fixed pointer-events-none rounded-full"
          style={{
            left: `${p.left}%`,
            width: p.size, height: p.size,
            backgroundColor: p.color,
            zIndex: 2,
            filter: 'blur(0.5px)',
          }}
          animate={{
            y: [0, p.yDist * (magicMode ? 1.5 : 1), 0],
            x: [0, p.xDist, 0],
            opacity: [0, magicMode ? 0.8 : 0.5, 0],
          }}
          transition={{
            duration: p.dur,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: p.delay,
          }}
        />
      ))}

      {/* ─── Ambient Glow ─── */}
      <motion.div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] pointer-events-none"
        style={{
          background: `radial-gradient(ellipse, ${chapter.color}${magicMode ? '25' : '12'} 0%, transparent 65%)`,
          filter: 'blur(60px)',
          zIndex: 0,
        }}
        animate={{ opacity: [0.25, 0.5, 0.25] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* ─── Magic Mode Extra Sparkles ─── */}
      {magicMode && (
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 2 }}>
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: 1.5, height: 1.5,
                        backgroundColor: ['#ff4b91', '#a855f7', '#c084fc', '#ffffff'][i % 4],
              }}
              animate={{
                opacity: [0, 0.7, 0],
                scale: [0.5, 1.5, 0.5],
                y: [0, -15 - Math.random() * 10],
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                delay: Math.random() * 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      )}
    </main>
  )
}
