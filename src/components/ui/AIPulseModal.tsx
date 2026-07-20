'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Sparkles, 
  Activity, 
  Send, 
  RefreshCw, 
  Compass, 
  MessageSquare, 
  Heart, 
  CheckCircle2,
  Lock,
  ArrowRight
} from 'lucide-react'
import { 
  generatePulseInsight, 
  generateQuest, 
  askAiAdvisor, 
  PulseInsight, 
  DailyQuest 
} from '@/lib/ai-engine'

interface AIPulseModalProps {
  isOpen: boolean
  onClose: () => void
  spaceData: any
  stats: {
    daysTogether: number
    streak: number
    adventures: number
    milestones: number
  }
  activeTheme: {
    color: string
    text: string
    bg: string
    glow: string
    border: string
    glowHeart: string
    btn: string
  }
}

export default function AIPulseModal({ 
  isOpen, 
  onClose, 
  spaceData, 
  stats, 
  activeTheme 
}: AIPulseModalProps) {
  const [activeTab, setActiveTab] = useState<'insight' | 'quest' | 'advisor'>('insight')
  const [loading, setLoading] = useState(false)
  const [scanStep, setScanStep] = useState(0)
  
  // AI States
  const [insight, setInsight] = useState<PulseInsight | null>(null)
  const [quest, setQuest] = useState<DailyQuest | null>(null)
  const [questCompleted, setQuestCompleted] = useState(false)
  
  // Chat States
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([])
  const [inputVal, setInputVal] = useState('')
  const [advisorTyping, setAdvisorTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Trigger Scanner Sequence
  useEffect(() => {
    if (isOpen) {
      setLoading(true)
      setScanStep(0)
      
      const steps = [
        'Connecting heartbeat sensors...',
        'Mapping shared memory nodes...',
        'Analyzing adventure vectors...',
        'Sync Complete!'
      ]

      let currentStep = 0
      const timer = setInterval(() => {
        currentStep++
        if (currentStep < steps.length) {
          setScanStep(currentStep)
        } else {
          clearInterval(timer)
          // Fetch initial data
          Promise.all([
            generatePulseInsight(spaceData, stats),
            generateQuest(spaceData)
          ]).then(([newInsight, newQuest]) => {
            setInsight(newInsight)
            setQuest(newQuest)
            setLoading(false)
            // Add initial greeting from advisor
            setMessages([
              { 
                sender: 'ai', 
                text: `Welcome to the Cosmic Pulse Command, traveler! I've analyzed your connection in "${spaceData?.spaceName || 'Our Little Universe'}". Ask me anything about planning dates, growing your streak, celebrating milestones, or keeping the sparks flying!` 
              }
            ])
          })
        }
      }, 900)

      return () => clearInterval(timer)
    }
  }, [isOpen])

  // Scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, advisorTyping])

  if (!isOpen) return null

  const scanStepsText = [
    'Connecting heartbeat sensors...',
    'Mapping shared memory nodes...',
    'Analyzing adventure vectors...',
    'Sync Complete!'
  ]

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || advisorTyping) return
    
    // Add user message
    setMessages(prev => [...prev, { sender: 'user', text: textToSend }])
    setInputVal('')
    setAdvisorTyping(true)

    // Run Advisor advice
    try {
      const response = await askAiAdvisor(textToSend, spaceData)
      setMessages(prev => [...prev, { sender: 'ai', text: response }])
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'ai', text: 'Error syncing with the wisdom matrix. Please try again.' }])
    } finally {
      setAdvisorTyping(false)
    }
  }

  const handleRegenerateInsight = async () => {
    setLoading(true)
    setScanStep(2) // Jump to processing
    const newInsight = await generatePulseInsight(spaceData, stats)
    setInsight(newInsight)
    setLoading(false)
  }

  const handleRegenerateQuest = async () => {
    setLoading(true)
    setScanStep(1)
    const newQuest = await generateQuest(spaceData)
    setQuest(newQuest)
    setQuestCompleted(false)
    setLoading(false)
  }

  // Pre-configured questions for the quick chip bar
  const quickQuestions = [
    { label: '🗺️ Date Night Plan', text: 'Suggest a unique, cozy date night plan based on our theme.' },
    { label: '🔥 Grow Our Streak', text: 'What are some daily check-in habits to maintain our streak?' },
    { label: '💖 Celebrate Anniversary', text: 'How should we celebrate our special together-since anniversary date?' },
    { label: '🕊️ Resolve Dispute', text: 'What is a positive rule to settle a small disagreement peacefully?' }
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#05020c]/80 backdrop-blur-md">
      
      {/* Glow Backdrops */}
      <div className={`absolute top-1/4 left-1/4 w-[350px] h-[350px] rounded-full blur-[120px] opacity-15 pointer-events-none ${activeTheme.bg}`} />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full blur-[120px] opacity-15 pointer-events-none bg-purple-600" />

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="relative w-full max-w-2xl max-h-[85vh] flex flex-col glass-panel rounded-3xl border border-white/10 bg-[#100720]/80 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden"
      >
        
        {/* Header Area */}
        <div className="flex justify-between items-center px-6 py-4.5 border-b border-white/5 relative z-10 bg-white/2">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 ${activeTheme.glow}`}>
              <Sparkles className={`w-4.5 h-4.5 ${activeTheme.text}`} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-extrabold text-white tracking-wider uppercase">Cosmic Pulse AI</h3>
                <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase tracking-wider">
                  Sync Mode
                </span>
              </div>
              <p className="text-[10px] text-gray-500 font-semibold uppercase mt-0.5 tracking-wide">
                Heartbeat Resonance Advisor
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* LOADING/SCANNING OVERLAY */}
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center p-8 min-h-[400px] relative z-20"
            >
              {/* Spinning scanning elements */}
              <div className="relative w-40 h-40 flex items-center justify-center">
                {/* Outermost scan ring */}
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-white/5 animate-[spin_20s_linear_infinite]" />
                
                {/* Mid theme ring */}
                <div className={`absolute inset-4 rounded-full border border-dashed opacity-40 animate-[spin_10s_linear_infinite_reverse]`} style={{ borderColor: activeTheme.color }} />

                {/* Laser scan swipe */}
                <motion.div 
                  animate={{ y: [-50, 50, -50] }}
                  transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                  className={`absolute w-32 h-0.5 bg-gradient-to-r from-transparent via-current to-transparent blur-[1px] opacity-80 ${activeTheme.text}`}
                />

                {/* Pulsing heart inside */}
                <div className="relative">
                  <Heart className={`w-10 h-10 fill-current animate-ping opacity-60 absolute ${activeTheme.text}`} />
                  <Heart className={`w-10 h-10 fill-current relative z-10 ${activeTheme.text} ${activeTheme.glowHeart}`} />
                </div>
              </div>

              {/* Status Message */}
              <div className="text-center mt-8 space-y-2">
                <p className={`text-xs font-extrabold uppercase tracking-widest ${activeTheme.text}`}>
                  {scanStepsText[scanStep]}
                </p>
                <div className="flex items-center justify-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/20 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-white/20 animate-bounce" style={{ animationDelay: '200ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-white/20 animate-bounce" style={{ animationDelay: '400ms' }} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MAIN INTERACTIVE AREA */}
        {!loading && (
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Tab Bar */}
            <div className="flex border-b border-white/5 bg-[#140b28]/40 px-4">
              <button
                onClick={() => setActiveTab('insight')}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-bold transition-all relative border-b-2 cursor-pointer ${
                  activeTab === 'insight' 
                    ? `text-white border-current ${activeTheme.text}` 
                    : 'text-gray-500 border-transparent hover:text-gray-300'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                Connection Pulse
              </button>
              <button
                onClick={() => setActiveTab('quest')}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-bold transition-all relative border-b-2 cursor-pointer ${
                  activeTab === 'quest' 
                    ? `text-white border-current ${activeTheme.text}` 
                    : 'text-gray-500 border-transparent hover:text-gray-300'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                AI Daily Quest
              </button>
              <button
                onClick={() => setActiveTab('advisor')}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-bold transition-all relative border-b-2 cursor-pointer ${
                  activeTab === 'advisor' 
                    ? `text-white border-current ${activeTheme.text}` 
                    : 'text-gray-500 border-transparent hover:text-gray-300'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Ask Advisor
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* TAB 1: INSIGHTS */}
              {activeTab === 'insight' && insight && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Stats Summary Panel */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    {/* Harmony Meter */}
                    <div className="glass-panel p-4.5 rounded-2xl border border-white/5 bg-[#120a22]/20 flex flex-col justify-between items-center text-center">
                      <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Harmony Factor</span>
                      <div className="relative my-3 flex items-center justify-center">
                        <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="40" className="stroke-white/5" strokeWidth="6" fill="transparent" />
                          <circle 
                            cx="50" 
                            cy="50" 
                            r="40" 
                            stroke={activeTheme.color} 
                            strokeWidth="6" 
                            fill="transparent" 
                            strokeDasharray="251.3" 
                            strokeDashoffset={251.3 - (251.3 * parseFloat(insight.harmonyIndex)) / 100}
                            strokeLinecap="round"
                          />
                        </svg>
                        <span className="absolute text-lg font-black text-white">{insight.harmonyIndex}</span>
                      </div>
                      <span className="text-[8px] text-emerald-400 font-bold tracking-widest uppercase">High Affinity</span>
                    </div>

                    {/* Resonance Level */}
                    <div className="glass-panel p-4.5 rounded-2xl border border-white/5 bg-[#120a22]/20 flex flex-col justify-between items-center text-center">
                      <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Pulse State</span>
                      <div className="my-4.5 flex flex-col items-center gap-1.5">
                        <div className="flex gap-0.5 items-end h-8">
                          {/* Animated sound equalizer */}
                          {[0.7, 1.4, 0.9, 1.8, 1.2, 0.5, 1.5, 0.8].map((delay, i) => (
                            <motion.div 
                              key={i}
                              animate={{ height: ['15%', '100%', '15%'] }}
                              transition={{ repeat: Infinity, duration: 1.2, delay: delay * 0.5 }}
                              className="w-1 rounded-full"
                              style={{ backgroundColor: activeTheme.color }}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-black text-white leading-none mt-1">{insight.solfeggioFreq}</span>
                      </div>
                      <span className="text-[8px] text-gray-400 font-bold uppercase tracking-wider">Love Tuning</span>
                    </div>

                    {/* Resonance description */}
                    <div className="glass-panel p-4.5 rounded-2xl border border-white/5 bg-[#120a22]/20 flex flex-col justify-between">
                      <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Orbital Tier</span>
                      <div className="my-auto py-3">
                        <span className={`text-[13px] font-black block tracking-tight ${activeTheme.text}`}>
                          {insight.resonanceLevel}
                        </span>
                        <span className="text-[9px] text-gray-400 block mt-1 leading-snug">
                          Heartwaves locked in stable planetary path.
                        </span>
                      </div>
                      <span className="text-[8px] text-gray-500 font-bold uppercase tracking-wider">Vector Check OK</span>
                    </div>

                  </div>

                  {/* Written Insight */}
                  <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-[#130722]/30 relative overflow-hidden">
                    <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-10 pointer-events-none ${activeTheme.bg}`} />
                    
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className={`w-4 h-4 ${activeTheme.text}`} />
                      <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest">
                        AI Pulse Synthesis Reading
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-white tracking-wide leading-relaxed">
                      &ldquo;{insight.insight}&rdquo;
                    </p>
                  </div>

                  {/* Regenerate Action */}
                  <div className="flex justify-between items-center pt-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[9px] text-gray-500 font-extrabold uppercase tracking-wider">
                        Insights refreshed automatically
                      </span>
                    </div>
                    <button 
                      onClick={handleRegenerateInsight}
                      className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-gray-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Recalibrate Sync
                    </button>
                  </div>

                </motion.div>
              )}

              {/* TAB 2: DAILY QUESTS */}
              {activeTab === 'quest' && quest && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="text-center max-w-md mx-auto space-y-2 mb-2">
                    <span className="text-[9px] text-gray-500 font-extrabold uppercase tracking-widest block">
                      Daily Micro-Quest
                    </span>
                    <h4 className="text-base font-extrabold text-white">Boost Your Connection Score</h4>
                    <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                      AI builds specialized daily exercises designed to increase compatibility, share laughs, and document memories.
                    </p>
                  </div>

                  {/* Quest Card */}
                  <div className={`glass-panel p-6 rounded-2xl border transition-all duration-300 bg-[#120a22]/30 relative overflow-hidden group ${
                    questCompleted ? 'border-emerald-500/20 shadow-[0_0_25px_rgba(16,185,129,0.1)]' : 'border-white/5 hover:border-white/10 shadow-lg'
                  }`}>
                    
                    {/* Corner gradient */}
                    <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-10 transition-opacity duration-300 pointer-events-none ${
                      questCompleted ? 'bg-emerald-500' : activeTheme.bg
                    }`} />

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full text-[8px] font-extrabold uppercase tracking-wider ${
                            questCompleted ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-white/5 text-gray-400 border border-white/5'
                          }`}>
                            {questCompleted ? '🎉 Completed' : '⚡ Micro-Challenge'}
                          </span>
                          <span className="text-[9px] text-gray-500 font-bold">{quest.duration} to complete</span>
                        </div>
                        
                        <h5 className={`text-sm font-extrabold tracking-wide ${questCompleted ? 'text-gray-400 line-through' : 'text-white'}`}>
                          {quest.title}
                        </h5>
                        <p className={`text-xs leading-relaxed font-semibold ${questCompleted ? 'text-gray-500' : 'text-gray-300'}`}>
                          {quest.description}
                        </p>
                      </div>

                      <div className="flex flex-row sm:flex-col items-center gap-2 flex-shrink-0 self-stretch sm:self-auto justify-between">
                        <div className="text-right">
                          <span className="text-[9px] text-gray-500 font-bold uppercase block">Reward</span>
                          <span className={`text-[11px] font-extrabold ${questCompleted ? 'text-emerald-400' : activeTheme.text}`}>
                            {quest.reward}
                          </span>
                        </div>
                        
                        <button 
                          onClick={() => setQuestCompleted(!questCompleted)}
                          className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                            questCompleted 
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 hover:bg-emerald-500/25' 
                              : activeTheme.btn
                          }`}
                        >
                          {questCompleted ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Undo
                            </>
                          ) : (
                            <>
                              Claim
                              <ArrowRight className="w-3.5 h-3.5" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-[9px] text-gray-500 font-extrabold uppercase tracking-wider">
                      Next quest unlocks in 18 hours
                    </span>
                    <button 
                      onClick={handleRegenerateQuest}
                      className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-gray-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Reroll Quest
                    </button>
                  </div>

                </motion.div>
              )}

              {/* TAB 3: ADVISOR CHAT */}
              {activeTab === 'advisor' && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col h-[400px]"
                >
                  
                  {/* Messages Area */}
                  <div className="flex-1 overflow-y-auto pr-1 space-y-4 mb-4 scrollbar-thin">
                    {messages.map((msg, idx) => (
                      <div 
                        key={idx} 
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[80%] p-3.5 rounded-2xl text-xs font-semibold leading-relaxed tracking-wide ${
                          msg.sender === 'user'
                            ? `bg-gradient-to-r ${activeTheme.bg === 'bg-neonPink' ? 'from-neonPink to-neonPurple' : activeTheme.bg === 'bg-neonPurple' ? 'from-neonPurple to-indigo-500' : 'from-blue-500 to-indigo-600'} text-white shadow-md rounded-br-none`
                            : 'bg-white/5 text-gray-200 border border-white/5 rounded-bl-none'
                        }`}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                    
                    {/* Advisor Typing state */}
                    {advisorTyping && (
                      <div className="flex justify-start">
                        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 rounded-bl-none text-xs flex items-center gap-1.5 text-gray-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                          <span className="ml-1 text-[9px] font-extrabold uppercase tracking-wider">Syncing answers...</span>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Suggestion Chips */}
                  <div className="mb-4">
                    <span className="text-[8px] text-gray-500 font-extrabold uppercase tracking-widest block mb-2">
                      Suggested Sparks
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {quickQuestions.map((q, idx) => (
                        <button
                          key={idx}
                          disabled={advisorTyping}
                          onClick={() => handleSendMessage(q.text)}
                          className="px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-[10px] text-gray-300 hover:text-white hover:bg-white/10 hover:border-white/10 transition-all cursor-pointer font-bold"
                        >
                          {q.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Input Box */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputVal}
                      disabled={advisorTyping}
                      onChange={(e) => setInputVal(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputVal)}
                      placeholder="Ask the AI Pulse Advisor about your connection..."
                      className="flex-1 bg-black/45 border border-white/10 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none focus:border-white/20 transition-all placeholder-gray-500"
                    />
                    <button
                      onClick={() => handleSendMessage(inputVal)}
                      disabled={!inputVal.trim() || advisorTyping}
                      className={`p-2.5 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                        inputVal.trim() && !advisorTyping
                          ? `${activeTheme.bg} ${activeTheme.glow} text-white hover:scale-105 active:scale-95`
                          : 'bg-white/5 text-gray-500 border border-white/5 cursor-not-allowed'
                      }`}
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>

                </motion.div>
              )}

            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
