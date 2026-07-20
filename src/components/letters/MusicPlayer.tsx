'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Music2, Play, Pause, SkipForward, SkipBack, X } from 'lucide-react'
import { DUMMY_SONGS } from './types'

interface Props {
  enabled: boolean
  onToggle: () => void
}

function Equalizer({ isPlaying }: { isPlaying: boolean }) {
  const bars = useMemo(() => [0.8, 1.2, 0.6, 1.0, 0.7], [])
  return (
    <div className="flex items-end gap-0.5 h-4">
      {bars.map((h, i) => (
        <motion.div
          key={i}
          className="w-[3px] rounded-full bg-amber-400"
          animate={isPlaying ? { height: [4, 4 * h * 3, 4] } : { height: 4 }}
          transition={isPlaying ? { duration: 0.6 + i * 0.15, repeat: Infinity, ease: 'easeInOut' } : {}}
        />
      ))}
    </div>
  )
}

function FloatingNotes({ isPlaying }: { isPlaying: boolean }) {
  const notes = useMemo(() => ['♪', '♫', '♬', '♩'], [])
  return (
    <AnimatePresence>
      {isPlaying && notes.map((note, i) => (
        <motion.span
          key={`note-${i}`}
          className="absolute text-amber-300/40 text-sm pointer-events-none"
          style={{ left: `${20 + i * 20}%`, bottom: '100%' }}
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: [0, 0.5, 0], y: -30, x: [0, (i % 2 ? 10 : -10)] }}
          transition={{ duration: 2, delay: i * 0.7, repeat: Infinity }}
        >
          {note}
        </motion.span>
      ))}
    </AnimatePresence>
  )
}

export default function MusicPlayer({ enabled, onToggle }: Props) {
  const [isPlaying, setIsPlaying] = useState(true)
  const [currentSong, setCurrentSong] = useState(0)
  const [showPlaylist, setShowPlaylist] = useState(false)

  const song = DUMMY_SONGS[currentSong]

  const nextSong = () => setCurrentSong(p => (p + 1) % DUMMY_SONGS.length)
  const prevSong = () => setCurrentSong(p => (p - 1 + DUMMY_SONGS.length) % DUMMY_SONGS.length)

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => { onToggle(); if (!enabled) setShowPlaylist(true) }}
        className={`rounded-full p-2.5 border transition-all duration-300 ${enabled ? 'border-amber-300/30 bg-amber-400/15 shadow-[0_0_12px_rgba(251,191,36,.2)]' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
      >
        <Music2 className={`w-4 ${enabled ? 'text-amber-300' : 'text-white/60'}`} />
      </motion.button>

      <AnimatePresence>
        {enabled && showPlaylist && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-6 left-6 z-50 w-72 rounded-2xl border border-white/10 bg-[#1a0e35]/95 backdrop-blur-xl shadow-[0_16px_48px_rgba(0,0,0,.5)] overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Equalizer isPlaying={isPlaying} />
                <span className="text-xs font-bold text-white/90">Now Playing</span>
              </div>
              <motion.button whileHover={{ scale: 1.1 }} onClick={() => setShowPlaylist(false)}>
                <X className="w-3.5 text-white/50" />
              </motion.button>
            </div>

            <div className="p-4 text-center">
              <motion.div
                key={currentSong}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-14 h-14 mx-auto rounded-xl bg-gradient-to-br from-amber-400/20 to-fuchsia-400/20 border border-white/10 flex items-center justify-center text-2xl mb-3 relative"
              >
                🎵
                <FloatingNotes isPlaying={isPlaying} />
              </motion.div>
              <motion.p key={`title-${currentSong}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-bold text-white/90 truncate">
                {song.title}
              </motion.p>
              <p className="text-[10px] text-white/50 mt-0.5">{song.artist}</p>

              <div className="flex items-center justify-center gap-4 mt-4">
                <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} onClick={prevSong}>
                  <SkipBack className="w-4 text-white/60" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-9 h-9 rounded-full bg-amber-400/20 border border-amber-300/30 flex items-center justify-center"
                >
                  {isPlaying ? <Pause className="w-4 text-amber-300" /> : <Play className="w-4 text-amber-300 ml-0.5" />}
                </motion.button>
                <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} onClick={nextSong}>
                  <SkipForward className="w-4 text-white/60" />
                </motion.button>
              </div>
            </div>

            <div className="border-t border-white/10 max-h-40 overflow-y-auto">
              {DUMMY_SONGS.map((s, i) => (
                <motion.button
                  key={i}
                  whileHover={{ x: 3, backgroundColor: 'rgba(255,255,255,0.05)' }}
                  onClick={() => { setCurrentSong(i); setIsPlaying(true) }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${i === currentSong ? 'bg-amber-400/10 border-l-2 border-amber-400' : ''}`}
                >
                  <span className="text-xs w-4 text-white/30">{i === currentSong && isPlaying ? '▶' : ''}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs truncate ${i === currentSong ? 'text-amber-300' : 'text-white/70'}`}>{s.title}</p>
                    <p className="text-[9px] text-white/35 truncate">{s.artist}</p>
                  </div>
                  <span className="text-[9px] text-white/30">{s.duration}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
