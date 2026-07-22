export type Mood = 'Romantic ❤️' | 'Happy 😊' | 'Grateful 🙏' | 'Excited ✨' | 'Nostalgic 🌙' | 'Hopeful 🌸' | 'Emotional 🥹' | 'Calm ☁️'

export interface Letter {
  id: string
  collection: string
  title: string
  recipient: string
  body: string
  mood: Mood
  date: string
  timeline: string
  favorited?: boolean
  archived?: boolean
}

export interface Settings {
  releaseDate: string
  locked: boolean
  reminder: boolean
  ai: boolean
  music: boolean
  privacy: string
  reminderDate: string
}

export interface Toast {
  id: string
  message: string
  type: 'success' | 'info' | 'warning'
}

export const MOODS: Mood[] = ['Romantic ❤️', 'Happy 😊', 'Grateful 🙏', 'Excited ✨', 'Nostalgic 🌙', 'Hopeful 🌸', 'Emotional 🥹', 'Calm ☁️']

export const COLLECTIONS = [
  { name: 'Love Letters', icon: '💌', count: 12 },
  { name: 'Birthday Wishes', icon: '🎂', count: 8 },
  { name: 'Travel Memories', icon: '🌍', count: 15 },
  { name: 'Dreams', icon: '✨', count: 9 },
  { name: 'Festivals', icon: '🎄', count: 11 },
  { name: 'Anniversary', icon: '💍', count: 7 },
  { name: 'Graduation', icon: '🎓', count: 6 },
  { name: 'Random Notes', icon: '🌸', count: 10 },
] as const

export const TIMELINE_MILESTONES = [
  { year: '2026', icon: '💗', label: 'This Year' },
  { year: '2030', icon: '🌸', label: 'New Chapter' },
  { year: 'Wedding', icon: '💍', label: 'A New Beginning' },
  { year: 'Graduation', icon: '🎓', label: 'Proud Moment' },
  { year: 'First Home', icon: '🏡', label: 'Our Place' },
  { year: 'Vacation', icon: '🌍', label: 'Adventure' },
  { year: 'New Year', icon: '✨', label: 'Fresh Start' },
  { year: 'Baby Steps', icon: '🧸', label: 'Little Joy' },
  { year: 'Garden', icon: '🌿', label: 'Growing Together' },
  { year: 'Paris', icon: '🗼', label: 'A Promise' },
  { year: 'Sunset', icon: '🌅', label: 'Golden Hour' },
  { year: 'Reunion', icon: '🤍', label: 'Close Again' },
  { year: 'Launch', icon: '🚀', label: 'Big Dream' },
  { year: 'Retreat', icon: '🏔️', label: 'Quiet Days' },
  { year: 'Milestone', icon: '🎉', label: 'Celebrate' },
  { year: 'Homecoming', icon: '🗝️', label: 'Belonging' },
  { year: 'Legacy', icon: '📖', label: 'Our Story' },
  { year: 'Forever', icon: '∞', label: 'Always' },
  { year: 'Letters', icon: '💌', label: 'Words Kept' },
  { year: 'Stargazing', icon: '🌙', label: 'Look Up' },
]

export const AI_TEMPLATES: Record<string, Pick<Letter, 'title' | 'recipient' | 'body' | 'mood'>> = {
  '❤️ Romantic': {
    title: 'A Love That Stays',
    recipient: 'My Love',
    mood: 'Romantic ❤️',
    body: 'My love,\n\nIn every version of tomorrow, I hope I find you. You make ordinary days feel handwritten in starlight.\n\nForever yours.',
  },
  '😊 Gratitude': {
    title: 'Thank You For This Life',
    recipient: 'Future Me',
    mood: 'Grateful 🙏',
    body: 'Dear Future Me,\n\nThank you for carrying us this far. Notice how much beauty has grown from the smallest brave choices.\n\nWith gratitude.',
  },
  '🥹 Apology': {
    title: 'What I Wish I Had Said',
    recipient: 'Dear You',
    mood: 'Emotional 🥹',
    body: 'Dear You,\n\nI am sorry for the moments I did not understand. I hope gentleness finds its way back to us.\n\nWith love and regret.',
  },
  '🎉 Celebration': {
    title: 'A Moment Worth Keeping',
    recipient: 'My Favorite People',
    mood: 'Excited ✨',
    body: 'Tonight was bright, loud, and full of love. I want to remember the way joy filled every corner of the room.\n\nWith celebration.',
  },
  '🌌 Future Self': {
    title: 'A Letter To My Future Self ✨',
    recipient: 'My Future Self',
    mood: 'Hopeful 🌸',
    body: 'Dear Future Me,\n\nI hope you\'re proud of how far you\'ve come. Keep dreaming, keep choosing kindness, and remember this feeling.\n\nWith hope.',
  },
  '👨‍👩‍👧 Family': {
    title: 'Our Little Universe',
    recipient: 'My Family',
    mood: 'Grateful 🙏',
    body: 'To my family,\n\nThank you for being my soft place to land. Our shared stories are the truest kind of treasure.\n\nWith all my heart.',
  },
  '✨ Friendship': {
    title: 'For The Friend Who Knows',
    recipient: 'My Best Friend',
    mood: 'Happy 😊',
    body: 'Dear friend,\n\nThank you for every laugh, every late-night truth, and every reminder that I never have to walk alone.\n\nWith friendship.',
  },
}

export const PRIVACY_OPTIONS = ['Private', 'Friends', 'Family', 'Public'] as const

export const DUMMY_SONGS = [
  { title: 'Cosmic Whispers', artist: 'Stardust Harmony', duration: '4:32' },
  { title: 'Nebula Dreams', artist: 'Astral Waves', duration: '3:48' },
  { title: 'Moonlit Serenade', artist: 'Lunar Echo', duration: '5:15' },
  { title: 'Stellar Hearts', artist: 'Cosmos Beat', duration: '4:07' },
  { title: 'Celestial Flow', artist: 'Starfall Symphony', duration: '3:56' },
  { title: 'Twilight Waltz', artist: 'Aurora Nights', duration: '4:44' },
]

export const EMOJIS = ['😊', '❤️', '🌹', '✨', '🌸', '💫', '🌙', '☀️', '🎉', '🥰', '😍', '🤗', '😘', '💕', '🎀', '🦋', '🌺', '🕊️', '💌', '💍', '🌈', '⭐', '🔥', '💎', '🧸', '🌿', '🍃', '🍂', '❄️', '🌊', '🏖️', '🎆', '🎇', '💐', '🎵', '📖', '🗝️', '🏡', '👩‍❤️‍👨', '👨‍👩‍👧', '🎂']
