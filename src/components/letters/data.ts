import { Letter, COLLECTIONS, TIMELINE_MILESTONES, AI_TEMPLATES, Mood } from './types'

const SAMPLE_BODIES: Record<string, string[]> = {
  'Love Letters': [
    'Love is still my favorite place to come home to. I hope every tomorrow keeps finding us hand in hand.\n\nYou are the poem I never knew how to write, and the story I always wanted to tell.',
    'Every love story is beautiful, but ours is my favorite. The way you look at me makes the whole world disappear.\n\nI fall in love with you a little bit more every single day.',
    'If I had a flower for every time you made me smile and laugh, I would have an endless garden.\n\nYou are my sun, my moon, and all my stars.',
  ],
  'Birthday Wishes': [
    'May this new year bring small miracles, loud laughter, and every beautiful thing you deserve.\n\nHere\'s to another year of making incredible memories together.',
    'Today is the day the world received its greatest gift — you. Happy Birthday to someone who makes every day brighter.',
    'Another year older, another year more amazing. May this birthday be as wonderful as you are.',
  ],
  'Travel Memories': [
    'The sea was impossibly blue, and I kept wishing you were here to see it with me.\n\nEvery sunset we watch together becomes a painting hung on the walls of my heart.',
    'We packed light and came home heavy — heavy with memories, with joy, with stories to tell.\n\nThe world is wide, but it feels smaller when we explore it together.',
    'I want to see every corner of this world, but only if you\'re walking beside me.',
  ],
  'Dreams': [
    'Keep making room for impossible ideas. The best chapters are waiting just beyond the horizon.\n\nDreams don\'t have expiration dates.',
    'One day you will tell your story of how you overcame what you went through and it will become part of someone else\'s survival guide.',
    'The future belongs to those who believe in the beauty of their dreams.',
  ],
  'Festivals': [
    'The house glowed, the table was full, and for one sweet evening everything felt exactly right.\n\nFestivals are love made visible through lights and laughter.',
    'There\'s something magical about celebrating together — the lights, the music, the shared joy.\n\nThese are the moments we\'ll treasure forever.',
  ],
  'Anniversary': [
    'Another year, another constellation of tiny moments I would choose all over again.\n\nYou are still my favorite adventure, and I\'d choose you in a hundred lifetimes.',
    'Three hundred and sixty-five more reasons to be grateful that I found you.\n\nHappy Anniversary to the one who holds my heart.',
  ],
  'Graduation': [
    'Pause here. You worked hard, you grew, and this bright moment belongs entirely to you.\n\nThe tassel was worth the hassle. Congratulations on this incredible achievement.',
    'This diploma is proof of dreams turned into dedication, and dedication turned into achievement.\n\nI am so incredibly proud of you.',
  ],
  'Random Notes': [
    'A small reminder: rest gently, speak kindly to yourself, and notice the beautiful ordinary things.\n\nYou are enough, exactly as you are.',
    'Just thinking of you and smiling. No reason needed.',
    'The world is a better place because you\'re in it. Never forget that.',
  ],
}

export function generateLetters(): Letter[] {
  const letters: Letter[] = []
  let id = 1

  for (const col of COLLECTIONS) {
    const bodies = SAMPLE_BODIES[col.name] || SAMPLE_BODIES['Random Notes']
    const letterCount = col.count

    for (let i = 0; i < letterCount; i++) {
      const body = bodies[i % bodies.length]
      const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i % 12]
      const day = ((i * 3 + 7) % 28) + 1
      const timelineIdx = i % TIMELINE_MILESTONES.length

      const moods: Mood[] = ['Romantic ❤️', 'Happy 😊', 'Grateful 🙏', 'Excited ✨', 'Nostalgic 🌙', 'Hopeful 🌸', 'Emotional 🥹', 'Calm ☁️']

      letters.push({
        id: `letter-${id}`,
        collection: col.name,
        title: i === 0 ? `A Letter To ${col.name === 'Love Letters' ? 'My Future Wife' : 'You'}` : `${col.name.slice(0, -1)} ${i > 2 ? `#${i + 1}` : ''}`,
        recipient: i === 0 ? 'My Future Self' : ['My Love', 'My Dearest Friend', 'My Adventure Partner', 'Future Me', 'My Family', 'My Brilliant Self', 'Dear You'][i % 7],
        body,
        mood: moods[i % moods.length] as Mood,
        date: `${String(day).padStart(2, '0')} ${month} 2026`,
        timeline: TIMELINE_MILESTONES[timelineIdx].year,
      })
      id++
    }
  }

  return letters
}
