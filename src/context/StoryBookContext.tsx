'use client'

import { createContext, useContext, useState, useCallback, useMemo, useEffect, ReactNode } from 'react'

export interface StoryBookChapter {
  id: string
  chapter: string
  title: string
  emoji: string
  date: string
  place: string
  mood: string
  caption: string
  story: string
  color: string
  colorDark: string
  images: { src: string; rot: number; w: number; h: number }[]
  collage: 'polaroid-stack' | 'scattered-hearts' | 'film-strip' | 'constellation-grid'
  favorite: boolean
  category: string
  tags: string[]
  visibility: 'Private' | 'Shared' | 'Public'
  people: string[]
  weather: string
  memoryType: 'photos' | 'videos' | 'voice' | 'journal' | 'location'
  description: string
  uploadedFileName: string | null
}

const STORAGE_KEY = 'memoryverse-storybook-v1'

const MOOD_LABELS = ['Happy', 'Loved', 'Emotional', 'Rainy', 'Magical', 'Peaceful', 'Funny', 'Nostalgic']
const MOOD_EMOJIS = ['😊', '❤️', '🥹', '🌧️', '✨', '🌊', '😆', '🌅']
const WEATHER_LABELS = ['Sunny', 'Rain', 'Snow', 'Storm', 'Night']
const WEATHER_EMOJIS = ['☀️', '🌧️', '❄️', '⛈️', '🌙']

const COLLAGE_TYPES: StoryBookChapter['collage'][] = ['polaroid-stack', 'scattered-hearts', 'film-strip', 'constellation-grid']
const CHAPTER_COLORS = [
  { color: '#f4ae61', colorDark: '#b8833a' },
  { color: '#ff719f', colorDark: '#cc3d6e' },
  { color: '#66b8ff', colorDark: '#3a8acc' },
  { color: '#b985ff', colorDark: '#7a4fcc' },
  { color: '#7dd3fc', colorDark: '#4a9bc7' },
  { color: '#fb923c', colorDark: '#c46a20' },
  { color: '#a78bfa', colorDark: '#7c5cc4' },
  { color: '#e879f9', colorDark: '#b84ac9' },
  { color: '#f472b6', colorDark: '#db2777' },
  { color: '#34d399', colorDark: '#059669' },
]

const CATEGORY_EMOJIS: Record<string, string> = {
  'First Date': '❤️',
  'Vacation': '✈️',
  'Anniversary': '💍',
  'Birthday': '🎂',
  'Everyday Moment': '🌟',
  'Family': '👨‍👩‍👧‍👦',
  'Adventure': '🏔️',
  'Festival': '🎉',
  'Custom': '📝',
}

const SAMPLE_IMAGES = [
  'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1470071459604-7b8ec44ffd6c?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=400&q=80',
]

function generateStory(title: string, mood: string, category: string, place: string, date: string): string {
  const moodLower = mood.toLowerCase()
  const categoryLower = category.toLowerCase()

  const moodStories: Record<string, string[]> = {
    happy: [
      `Every corner of this moment was lit by laughter. ${title} wasn't just a memory — it was a reminder that joy hides in the smallest details, waiting to be noticed.`,
      `Happiness isn't always loud. Sometimes it's the quiet warmth of ${place}, the way the light fell just right, and the feeling that everything was exactly as it should be.`,
    ],
    loved: [
      `There are moments when love speaks louder than words. ${title} was one of those — a chapter written in glances, touches, and the kind of silence that says everything.`,
      `In the warmth of ${place}, we discovered that love isn't just a feeling. It's a place you return to, again and again, in the gallery of your heart.`,
    ],
    emotional: [
      `Some memories carry a weight that makes them beautiful. ${title} reminds us that the deepest feelings are born from the most genuine connections.`,
      `With tears of joy and hearts full of wonder, ${place} became the canvas for an emotion too large for words.`,
    ],
    rainy: [
      `The rain painted ${place} in shades of silver and reflection. ${title} was born in that gentle downpour, when the world slowed down enough for us to truly see each other.`,
      `Every raindrop at ${place} seemed to whisper a secret. ${title} is that secret — preserved in droplets and memory alike.`,
    ],
    magical: [
      `The universe conspired to create ${title}. In ${place}, reality bent just enough to let magic seep through, turning an ordinary day into something extraordinary.`,
      `Some places shimmer with an otherworldly light. ${place} was one of them, and ${title} is the proof that magic is real when you believe in it.`,
    ],
    peaceful: [
      `Stillness has its own language. In ${place}, ${title} spoke it fluently — a moment where time paused, the world exhaled, and everything felt perfectly at peace.`,
      `Not every memory needs to be loud. ${title} is a gentle breath of calm, a reminder that the most profound moments are often the quietest.`,
    ],
    funny: [
      `Laughter echoed through ${place} that day. ${title} is proof that the best memories are the ones that make you smile every time you think of them.`,
      `We didn't plan for ${title} to become the funniest story we'd ever tell. But that's the beauty of ${place} — it always surprises you.`,
    ],
    nostalgic: [
      `Time has a way of gilding our memories. ${title} glows brighter with each passing year, a golden thread woven into the tapestry of our story.`,
      `Looking back at ${place}, we see not just what was, but what it made us become. ${title} is a bridge between then and now.`,
    ],
  }

  const storyPool = moodStories[moodLower] || moodStories.happy
  const baseStory = storyPool[Math.floor(title.length % storyPool.length)]

  const categoryPrefix: Record<string, string> = {
    'first date': 'It all started with a nervous smile and a heart full of hope. ',
    vacation: 'The adventure began the moment we decided to say yes to the unknown. ',
    anniversary: 'Another year, another chapter of a story that keeps getting better. ',
    birthday: 'The candles flickered like tiny stars, each one a wish waiting to be whispered. ',
    'everyday moment': 'Sometimes the most extraordinary memories hide inside ordinary days. ',
    family: 'Home isn\'t a place — it\'s the people who make your heart feel full. ',
    adventure: 'We chased the horizon until it chased us back, and somewhere in between, we found ourselves. ',
    festival: 'The world was alive with color, music, and the kind of energy that makes your soul dance. ',
  }

  const prefix = categoryPrefix[categoryLower] || ''
  return prefix + baseStory
}

function generateCaption(title: string, mood: string): string {
  const captions: Record<string, string[]> = {
    happy: [
      `A day that reminded us what pure joy feels like.`,
      `Happiness wasn't a destination — it was the journey we took together.`,
    ],
    loved: [
      `In your eyes, I found my forever.`,
      `Some love stories begin with a single glance.`,
    ],
    emotional: [
      `Feelings too deep for words, captured in a single frame.`,
      `The moment our hearts spoke louder than our voices.`,
    ],
    rainy: [
      `The rain couldn't dampen what our hearts were feeling.`,
      `Every raindrop was a note in our love song.`,
    ],
    magical: [
      `The universe had a plan, and it was beautiful.`,
      `Magic isn't something you find — it's something you create together.`,
    ],
    peaceful: [
      `A moment of perfect stillness in a world that never stops spinning.`,
      `Peace found us in the most unexpected place.`,
    ],
    funny: [
      `The day everything went wonderfully wrong.`,
      `Laughter is the soundtrack of our love story.`,
    ],
    nostalgic: [
      `Some moments are worth revisiting, again and again.`,
      `The past has a way of making the present more beautiful.`,
    ],
  }

  const pool = captions[mood.toLowerCase()] || captions.happy
  return pool[Math.floor(title.length % pool.length)]
}

function createChapterFromDraft(draft: {
  title: string
  description: string
  memoryType: 'photos' | 'videos' | 'voice' | 'journal' | 'location'
  uploadedFileName: string | null
  date: string
  location: string
  mood: number | null
  weather: number | null
  people: string[]
  category: string
  tags: string[]
  visibility: 'Private' | 'Shared' | 'Public'
  favorite: boolean
}, chapterIndex: number): StoryBookChapter {
  const moodLabel = draft.mood !== null ? MOOD_LABELS[draft.mood % MOOD_LABELS.length] : 'Magical'
  const moodEmoji = draft.mood !== null ? MOOD_EMOJIS[draft.mood % MOOD_EMOJIS.length] : '✨'
  const weatherLabel = draft.weather !== null ? WEATHER_LABELS[draft.weather % WEATHER_LABELS.length] : 'Clear Night'
  const weatherEmoji = draft.weather !== null ? WEATHER_EMOJIS[draft.weather % WEATHER_EMOJIS.length] : '🌙'
  const colorScheme = CHAPTER_COLORS[chapterIndex % CHAPTER_COLORS.length]
  const collageType = COLLAGE_TYPES[chapterIndex % COLLAGE_TYPES.length]
  const categoryEmoji = CATEGORY_EMOJIS[draft.category] || '📝'
  const title = draft.title || `Memory ${chapterIndex + 1}`
  const place = draft.location || 'Somewhere Beautiful'

  const displayDate = draft.date
    ? new Date(draft.date + 'T12:00:00').toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })

  const images = SAMPLE_IMAGES.slice(chapterIndex * 3 % SAMPLE_IMAGES.length, chapterIndex * 3 % SAMPLE_IMAGES.length + 3)
    .map((src, i) => ({
      src,
      rot: -5 + (i * 3) + (chapterIndex % 3),
      w: 110 + (i * 10),
      h: 140 - (i * 5),
    }))

  const story = generateStory(title, moodLabel, draft.category, place, displayDate)
  const caption = generateCaption(title, moodLabel)

  return {
    id: `chapter-${Date.now()}-${chapterIndex}`,
    chapter: `Chapter ${toRoman(chapterIndex + 1)}`,
    title,
    emoji: categoryEmoji,
    date: displayDate,
    place,
    mood: `${moodLabel} & ${weatherLabel}`,
    caption,
    story,
    color: colorScheme.color,
    colorDark: colorScheme.colorDark,
    images,
    collage: collageType,
    favorite: draft.favorite,
    category: draft.category || 'Custom',
    tags: draft.tags,
    visibility: draft.visibility,
    people: draft.people,
    weather: `${weatherEmoji} ${weatherLabel}`,
    memoryType: draft.memoryType,
    description: draft.description,
    uploadedFileName: draft.uploadedFileName,
  }
}

function toRoman(num: number): string {
  const romanNumerals: [number, string][] = [
    [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
    [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
    [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
  ]
  let result = ''
  for (const [value, numeral] of romanNumerals) {
    while (num >= value) { result += numeral; num -= value }
  }
  return result
}

interface StoryBookContextType {
  chapters: StoryBookChapter[]
  addChapter: (draft: Parameters<typeof createChapterFromDraft>[0]) => StoryBookChapter
  updateChapterStory: (id: string, storyHtml: string) => void
  updateChapterCaption: (id: string, caption: string) => void
  updateChapterMeta: (id: string, updates: Partial<Pick<StoryBookChapter, 'title' | 'date' | 'place' | 'mood' | 'favorite' | 'tags' | 'images'>>) => void
  deleteChapter: (id: string) => void
  duplicateChapter: (id: string) => void
  reorderChapters: (fromIndex: number, toIndex: number) => void
  getChapterById: (id: string) => StoryBookChapter | undefined
}

const StoryBookContext = createContext<StoryBookContextType | null>(null)

function loadChapters(): StoryBookChapter[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return []
}

function saveChapters(chapters: StoryBookChapter[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chapters))
  } catch {}
}

export function StoryBookProvider({ children }: { children: ReactNode }) {
  const [chapters, setChapters] = useState<StoryBookChapter[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setChapters(loadChapters())
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (loaded) saveChapters(chapters)
  }, [chapters, loaded])

  const addChapter = useCallback((draft: Parameters<typeof createChapterFromDraft>[0]) => {
    let newChapter: StoryBookChapter | null = null
    setChapters(prev => {
      newChapter = createChapterFromDraft(draft, prev.length)
      return [...prev, newChapter]
    })
    return newChapter!
  }, [])

  const updateChapterStory = useCallback((id: string, storyHtml: string) => {
    setChapters(prev => prev.map(ch => ch.id === id ? { ...ch, story: storyHtml } : ch))
  }, [])

  const updateChapterCaption = useCallback((id: string, caption: string) => {
    setChapters(prev => prev.map(ch => ch.id === id ? { ...ch, caption } : ch))
  }, [])

  const updateChapterMeta = useCallback((id: string, updates: Partial<Pick<StoryBookChapter, 'title' | 'date' | 'place' | 'mood' | 'favorite' | 'tags' | 'images'>>) => {
    setChapters(prev => prev.map(ch => ch.id === id ? { ...ch, ...updates } : ch))
  }, [])

  const deleteChapter = useCallback((id: string) => {
    setChapters(prev => {
      const filtered = prev.filter(ch => ch.id !== id)
      return filtered.map((ch, i) => ({ ...ch, chapter: `Chapter ${toRoman(i + 1)}` }))
    })
  }, [])

  const duplicateChapter = useCallback((id: string) => {
    setChapters(prev => {
      const idx = prev.findIndex(ch => ch.id === id)
      if (idx === -1) return prev
      const original = prev[idx]
      const dup: StoryBookChapter = {
        ...original,
        id: `chapter-${Date.now()}-dup`,
        title: `${original.title} (Copy)`,
      }
      const next = [...prev]
      next.splice(idx + 1, 0, dup)
      return next.map((ch, i) => ({ ...ch, chapter: `Chapter ${toRoman(i + 1)}` }))
    })
  }, [])

  const reorderChapters = useCallback((fromIndex: number, toIndex: number) => {
    setChapters(prev => {
      const next = [...prev]
      const [moved] = next.splice(fromIndex, 1)
      next.splice(toIndex, 0, moved)
      return next.map((ch, i) => ({ ...ch, chapter: `Chapter ${toRoman(i + 1)}` }))
    })
  }, [])

  const getChapterById = useCallback((id: string) => {
    return chapters.find(ch => ch.id === id)
  }, [chapters])

  const value = useMemo(() => ({
    chapters,
    addChapter,
    updateChapterStory,
    updateChapterCaption,
    updateChapterMeta,
    deleteChapter,
    duplicateChapter,
    reorderChapters,
    getChapterById,
  }), [chapters, addChapter, updateChapterStory, updateChapterCaption, updateChapterMeta, deleteChapter, duplicateChapter, reorderChapters, getChapterById])

  return <StoryBookContext.Provider value={value}>{children}</StoryBookContext.Provider>
}

export function useStoryBook() {
  const ctx = useContext(StoryBookContext)
  if (!ctx) throw new Error('useStoryBook must be used within StoryBookProvider')
  return ctx
}
