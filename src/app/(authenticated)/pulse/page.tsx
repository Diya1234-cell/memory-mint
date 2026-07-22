 'use client'

import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Heart,
  RefreshCw,
  FileText,
  TrendingUp,
  TrendingDown,
  MessageCircle,
  Target,
  Zap,
  ShieldCheck,
} from 'lucide-react'

import { useSpaceData } from '@/hooks/useSpaceData'

type Metric = { id: string; label: string; score: number; trend: number; spark: number[] }

const mockMetrics: Metric[] = [
  { id: 'comm', label: 'Communication', score: 88, trend: 4, spark: [72, 75, 80, 82, 85, 88] },
  { id: 'trust', label: 'Trust', score: 81, trend: 2, spark: [70, 74, 76, 78, 80, 81] },
  { id: 'emotion', label: 'Emotional Connection', score: 86, trend: 3, spark: [60, 68, 72, 80, 84, 86] },
  { id: 'cons', label: 'Consistency', score: 79, trend: -1, spark: [82, 80, 78, 79, 78, 79] },
]

const radarMetrics = [
  { key: 'Communication', v: 0.88 },
  { key: 'Trust', v: 0.81 },
  { key: 'Affection', v: 0.86 },
  { key: 'Conflict Resolution', v: 0.72 },
  { key: 'Quality Time', v: 0.79 },
  { key: 'Support', v: 0.83 },
]

const timeline = [
  { date: '2026-07-15', emoji: '❤️', title: 'Anniversary Dinner', desc: 'A candlelit dinner celebrating your 4th anniversary.' },
  { date: '2026-07-12', emoji: '😊', title: 'Great Conversation', desc: 'A long evening talk sharing future plans.' },
  { date: '2026-07-05', emoji: '🎉', title: 'Weekend Trip', desc: 'Two-day getaway by the coast.' },
  { date: '2026-06-28', emoji: '🤝', title: 'Solved a Conflict', desc: 'Constructive resolution after a disagreement.' },
  { date: '2026-06-20', emoji: '💬', title: 'Deep Conversation', desc: 'Shared feelings and reflections.' },
]

const moodHistory = Array.from({ length: 30 }).map((_, i) => ({
  day: i + 1,
  mood: ['😊', '❤️', '😌', '😕', '😢'][Math.floor(Math.random() * 5)],
  note: 'Sample note for day ' + (i + 1),
}))

function CircularProgress({ percent, size = 120 }: { percent: number; size?: number }) {
  const radius = 48
  const stroke = 10
  const normalizedRadius = radius - stroke / 2
  const circumference = normalizedRadius * 2 * Math.PI
  const dash = (percent / 100) * circumference
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className="transform -rotate-90">
      <circle cx="50" cy="50" r={normalizedRadius} stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} fill="transparent" />
      <motion.circle
        cx="50"
        cy="50"
        r={normalizedRadius}
        stroke="url(#gp)"
        strokeWidth={stroke}
        strokeLinecap="round"
        fill="transparent"
        strokeDasharray={`${dash} ${circumference - dash}`}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: 0 }}
        transition={{ duration: 1.2 }}
      />
      <defs>
        <linearGradient id="gp" x1="0%" x2="100%">
          <stop offset="0%" stopColor="#ff6aa1" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>
      <foreignObject x="0" y="0" width="100" height="100">
        <div className="flex h-full w-full items-center justify-center">
          <div className="text-center">
            <div className="text-3xl font-extrabold text-white">{Math.round(percent)}%</div>
            <div className="text-[11px] text-slate-300 mt-1">Score</div>
          </div>
        </div>
      </foreignObject>
    </svg>
  )
}

function Sparkline({ values = [] }: { values: number[] }) {
  const w = 100
  const h = 36
  const max = Math.max(...values, 1)
  const min = Math.min(...values, 0)
  const points = values.map((v, i) => `${(i / (values.length - 1)) * w},${h - ((v - min) / (max - min || 1)) * h}`).join(' ')
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline points={points} fill="none" stroke="#a855f7" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function PulsePage(): JSX.Element {
  const { spaceData } = useSpaceData()
  const [filter, setFilter] = useState('Last Month')
  const [exportOpen, setExportOpen] = useState(false)
  const [timelineEvents, setTimelineEvents] = useState(timeline)
  const [creating, setCreating] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newDate, setNewDate] = useState('')
  const [newEmoji, setNewEmoji] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const overallScore = useMemo(() => {
    return Math.round((mockMetrics.reduce((s, m) => s + m.score, 0) / mockMetrics.length))
  }, [])

  const scoreLabel = overallScore > 85 ? 'Excellent' : overallScore > 75 ? 'Healthy' : overallScore > 60 ? 'Growing' : 'Needs Attention'

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-screen-xl">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white flex items-center gap-4">Relationship Pulse <span className="text-pink-400 text-2xl">❤️</span></h1>
            <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-xl">Understand the health and evolution of your relationship through concise, AI-powered insights and actionable recommendations.</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => window.location.reload()} className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm text-white/90 hover:bg-white/7 transition">
              <RefreshCw className="w-4 h-4" /> Refresh Analysis
            </button>
            <button onClick={() => setExportOpen(true)} className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 px-4 py-2 text-sm text-white shadow-lg hover:opacity-95 transition">
              <FileText className="w-4 h-4" /> Export Report
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <section className="lg:col-span-7 rounded-2xl border border-white/6 bg-white/3 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.35)]">
            {/* HERO */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-4">
                <div className="w-[144px] h-[144px] flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#2b0136]/28 to-[#12091b]/24 p-3">
                  <CircularProgress percent={overallScore} size={144} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Relationship Score</h3>
                  <div className="mt-2 flex items-center gap-3">
                    <span className="inline-flex items-center rounded-full bg-white/5 px-3 py-1 text-sm font-semibold text-white/90">{scoreLabel}</span>
                    <div className="text-sm text-slate-400">Last updated: 2 hours ago</div>
                  </div>
                  <div className="mt-3 text-sm sm:text-base text-slate-300">Trend vs previous week <span className="ml-2 inline-flex items-center text-sm font-semibold text-green-300"><TrendingUp className="w-4 h-4" /> +3%</span></div>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <button className="rounded-md bg-white/5 px-3 py-2 text-sm text-white/90 hover:bg-white/7">Share</button>
                <button className="rounded-md bg-white/5 px-3 py-2 text-sm text-white/90 hover:bg-white/7">Save Snapshot</button>
              </div>
            </div>

            {/* Summary Metrics */}
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {mockMetrics.map((m) => (
                <motion.div key={m.id} whileHover={{ y: -6 }} className="rounded-xl border border-white/6 bg-white/2 p-4 min-h-[110px]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-md bg-white/5 p-2">
                        <MessageCircle className="w-5 h-5 text-pink-300" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-400">{m.label}</div>
                        <div className="mt-1 text-lg sm:text-xl font-bold text-white">{m.score}%</div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="text-sm font-semibold text-white">{m.trend > 0 ? <span className="text-green-300">+{m.trend}%</span> : <span className="text-rose-400">{m.trend}%</span>}</div>
                      <div className="mt-2"><Sparkline values={m.spark} /></div>
                    </div>
                  </div>
                  <div className="mt-3 h-2 w-full rounded-full bg-white/6">
                    <div className="h-2 rounded-full bg-gradient-to-r from-pink-500 to-violet-500" style={{ width: `${m.score}%` }} />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Radar + Timeline */}
            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 rounded-xl border border-white/6 bg-white/2 p-5">
                <h4 className="text-sm font-semibold text-white">Relationship Radar</h4>
                <div className="mt-3 flex items-center justify-center">
                  <RadarChart data={radarMetrics} size={300} />
                </div>
              </div>

              <div className="rounded-xl border border-white/6 bg-white/2 p-4">
                <h4 className="text-sm font-semibold text-white">Recent Timeline</h4>
                <div className="mt-3">
                  {!creating ? (
                    <div className="flex flex-col gap-3">
                      <div className="text-sm text-slate-400">Create timeline events to pin important moments.</div>
                      <div className="flex items-center gap-3">
                        <button onClick={() => setCreating(true)} className="rounded-md bg-gradient-to-r from-pink-500 to-violet-500 px-4 py-2 text-sm text-white">Create Event</button>
                        <button onClick={() => { setTimelineEvents([]) }} className="rounded-md bg-white/5 px-4 py-2 text-sm text-white/90">Clear All</button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={(e) => {
                      e.preventDefault()
                      const d = newDate || new Date().toISOString().slice(0, 10)
                      const event = { date: d, emoji: newEmoji || '✨', title: newTitle || 'New Event', desc: newDesc || '' }
                      setTimelineEvents((s) => [event, ...s])
                      setNewTitle('')
                      setNewDate('')
                      setNewEmoji('')
                      setNewDesc('')
                      setCreating(false)
                    }} className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Title" className="w-full rounded-md bg-white/5 px-3 py-2 text-sm text-white/90" />
                        <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} className="w-full rounded-md bg-white/5 px-3 py-2 text-sm text-white/90" />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input value={newEmoji} onChange={(e) => setNewEmoji(e.target.value)} placeholder="Emoji (e.g. ❤️)" className="w-full rounded-md bg-white/5 px-3 py-2 text-sm text-white/90" />
                        <input value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Short description" className="w-full rounded-md bg-white/5 px-3 py-2 text-sm text-white/90" />
                      </div>
                      <div className="flex gap-2">
                        <button type="submit" className="rounded-md bg-emerald-500 px-4 py-2 text-sm text-white">Add</button>
                        <button type="button" onClick={() => setCreating(false)} className="rounded-md bg-white/5 px-4 py-2 text-sm text-white/90">Cancel</button>
                      </div>
                    </form>
                  )}

                  {timelineEvents.length > 0 && (
                    <div className="mt-4 space-y-3">
                      {timelineEvents.map((t, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className="text-2xl">{t.emoji}</div>
                          <div>
                            <div className="text-sm font-semibold text-white">{t.title} <span className="text-xs text-slate-400">• {t.date}</span></div>
                            <div className="text-xs text-slate-300">{t.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Right Column */}
          <aside className="lg:col-span-5 space-y-6">
            <div className="rounded-xl border border-white/6 bg-white/2 p-4">
              <h4 className="text-sm font-semibold text-white">Mood History (30 days)</h4>
              <div className="mt-3 grid grid-cols-4 gap-2 max-h-40 overflow-auto">
                {moodHistory.map((m, i) => (
                  <div key={i} title={m.note} className="rounded-full bg-white/6 px-3 py-2 text-sm text-white/90 flex items-center justify-center">{m.mood} <span className="ml-2 text-xs text-slate-300">Day {m.day}</span></div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-white/6 bg-white/2 p-4">
              <h4 className="text-sm font-semibold text-white">Conversation Trend</h4>
              <div className="mt-3 h-36">
                <MiniLineChart />
              </div>
            </div>

            <div className="rounded-xl border border-white/6 bg-white/2 p-4">
              <h4 className="text-sm font-semibold text-white">Sentiment Distribution</h4>
              <div className="mt-3 flex items-center gap-4">
                <MiniPieChart />
                <div>
                  <div className="text-sm text-white font-semibold">Positive <span className="text-green-300">68%</span></div>
                  <div className="text-sm text-white font-semibold">Neutral <span className="text-slate-300">18%</span></div>
                  <div className="text-sm text-white font-semibold">Negative <span className="text-rose-400">14%</span></div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-white/6 bg-white/2 p-4">
              <h4 className="text-sm font-semibold text-white">AI Insights</h4>
              <div className="mt-3 space-y-3">
                <div className="rounded-md bg-gradient-to-r from-emerald-600/10 to-emerald-400/6 p-3">
                  <div className="flex items-start gap-3">
                    <Zap className="w-6 h-6 text-emerald-300" />
                    <div>
                      <div className="text-sm font-semibold text-white">Communication has improved by 18%</div>
                      <div className="text-xs text-slate-300">Recent check-ins show better listening and active curiosity.</div>
                    </div>
                  </div>
                </div>
                <div className="rounded-md bg-gradient-to-r from-amber-600/8 to-amber-400/6 p-3">
                  <div className="flex items-start gap-3">
                    <Target className="w-6 h-6 text-amber-300" />
                    <div>
                      <div className="text-sm font-semibold text-white">Weekend interactions are strongest</div>
                      <div className="text-xs text-slate-300">Plan small weekend rituals to maintain momentum.</div>
                    </div>
                  </div>
                </div>
                <div className="rounded-md bg-gradient-to-r from-sky-600/6 to-sky-400/5 p-3">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-6 h-6 text-sky-300" />
                    <div>
                      <div className="text-sm font-semibold text-white">Trust score continues to rise</div>
                      <div className="text-xs text-slate-300">Consistent small commitments are building reliability.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Export dialog */}
      <AnimatePresence>
        {exportOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60" onClick={() => setExportOpen(false)} />
            <motion.div initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: 20 }} className="relative z-10 w-full max-w-md rounded-xl bg-slate-900/95 border border-white/6 p-6">
              <h3 className="text-lg font-bold text-white">Export Report</h3>
              <p className="text-sm text-slate-400 mt-2">Choose an export format for your relationship report.</p>
              <div className="mt-4 flex gap-2">
                <button className="flex-1 rounded-md bg-gradient-to-r from-pink-500 to-violet-500 px-3 py-2 text-white">PDF</button>
                <button className="flex-1 rounded-md bg-white/5 px-3 py-2 text-white">CSV</button>
                <button className="flex-1 rounded-md bg-white/5 px-3 py-2 text-white">JSON</button>
              </div>
              <div className="mt-4 text-right">
                <button onClick={() => setExportOpen(false)} className="rounded-md bg-white/5 px-3 py-2 text-white">Close</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}

function RadarChart({ data, size = 220 }: { data: { key: string; v: number }[]; size?: number }) {
  const cx = size / 2
  const cy = size / 2
  const levels = 4
  const angle = (Math.PI * 2) / data.length
  const points = data.map((d, i) => {
    const r = d.v * (size / 2 - 20)
    const x = cx + Math.cos(-Math.PI / 2 + i * angle) * r
    const y = cy + Math.sin(-Math.PI / 2 + i * angle) * r
    return `${x},${y}`
  }).join(' ')
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {[...Array(levels)].map((_, l) => {
        const r = ((l + 1) / levels) * (size / 2 - 20)
        const poly = data.map((_, i) => {
          const x = cx + Math.cos(-Math.PI / 2 + i * angle) * r
          const y = cy + Math.sin(-Math.PI / 2 + i * angle) * r
          return `${x},${y}`
        }).join(' ')
        return <polygon key={l} points={poly} fill="none" stroke="rgba(255,255,255,0.03)" />
      })}
      <polygon points={points} fill="rgba(168,85,247,0.12)" stroke="#a855f7" strokeWidth={1.5} />
      {data.map((d, i) => {
        const r = d.v * (size / 2 - 20)
        const x = cx + Math.cos(-Math.PI / 2 + i * angle) * r
        const y = cy + Math.sin(-Math.PI / 2 + i * angle) * r
        return <circle key={d.key} cx={x} cy={y} r={3} fill="#ff4b91" />
      })}
    </svg>
  )
}

function MiniLineChart() {
  const values = [72, 74, 76, 78, 80, 82, 84, 86, 87, 88]
  const w = 280
  const h = 84
  const max = Math.max(...values)
  const min = Math.min(...values)
  const points = values.map((v, i) => `${(i / (values.length - 1)) * w},${h - ((v - min) / (max - min)) * h}`).join(' ')
  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <polyline points={points} fill="none" stroke="#a855f7" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function MiniPieChart() {
  const data = [68, 18, 14]
  const total = data.reduce((s, v) => s + v, 0)
  let angle = -90
  const radius = 36
  const cx = 48
  const cy = 48
  const arcs = data.map((d) => {
    const a = (d / total) * 360
    const start = angle
    const end = angle + a
    const large = a > 180 ? 1 : 0
    const sx = cx + radius * Math.cos((Math.PI * start) / 180)
    const sy = cy + radius * Math.sin((Math.PI * start) / 180)
    const ex = cx + radius * Math.cos((Math.PI * end) / 180)
    const ey = cy + radius * Math.sin((Math.PI * end) / 180)
    angle += a
    return `M ${cx} ${cy} L ${sx} ${sy} A ${radius} ${radius} 0 ${large} 1 ${ex} ${ey} Z`
  })
  const colors = ['#10b981', '#94a3b8', '#fb7185']
  return (
    <svg width={96} height={96} viewBox="0 0 96 96">
      {arcs.map((d, i) => <path key={i} d={d} fill={colors[i]} opacity={0.95} />)}
    </svg>
  )
}

