export interface PulseInsight {
  harmonyIndex: string;
  solfeggioFreq: string;
  resonanceLevel: string;
  insight: string;
}

export interface DailyQuest {
  title: string;
  description: string;
  reward: string;
  duration: string;
}

/**
 * Utility to check if a Gemini API key is available.
 */
function getApiKey(): string | null {
  if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
    return process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  }
  return null;
}

/**
 * Calls the real Gemini API if available, otherwise returns null.
 */
async function callGemini(systemPrompt: string, userPrompt: string): Promise<string | null> {
  const apiKey = getApiKey();
  if (!apiKey) return null;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              { text: `${systemPrompt}\n\nUser request: ${userPrompt}` }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        }
      })
    });

    if (!response.ok) {
      console.warn('Gemini API request failed:', response.statusText);
      return null;
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return text || null;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return null;
  }
}

/**
 * Generates an insight based on space data and current stats.
 */
export async function generatePulseInsight(spaceData: any, stats: { daysTogether: number, streak: number, adventures: number, milestones: number }): Promise<PulseInsight> {
  const relation = spaceData?.selectedRelation || 'couple';
  const name = spaceData?.spaceName || 'Our Little Universe';
  const emoji = spaceData?.relationshipEmoji || '❤️';

  const systemPrompt = `You are a relationship counselor and cosmic sync analyzer. Provide a short, beautiful, poetic 2-3 sentence relationship connection reading based on: Space name: "${name}" (${relation}), Days together: ${stats.daysTogether}, Streak: ${stats.streak}, Adventures: ${stats.adventures}, Milestones: ${stats.milestones}. Keep it positive, sparkling, and encouraging. Return ONLY the insight paragraph.`;
  const userPrompt = `Analyze the pulse for "${name}" with ${stats.daysTogether} days together and a ${stats.streak} day streak.`;

  const geminiText = await callGemini(systemPrompt, userPrompt);
  if (geminiText) {
    return {
      harmonyIndex: `${Math.min(99, 90 + Math.floor(stats.streak / 10))}%`,
      solfeggioFreq: stats.streak > 100 ? '528Hz' : '639Hz',
      resonanceLevel: stats.streak > 100 ? 'Cosmic Supernova Resonance' : 'Harmonized Planetary Orbit',
      insight: geminiText.trim(),
    };
  }

  // Local simulator fallback
  const harmony = Math.min(99, 90 + Math.floor(stats.streak / 15) + Math.min(5, Math.floor(stats.adventures / 5)));
  let freq = '639Hz'; // Solar Plexus (Harmonious connections)
  let resonance = 'Planetary Orbit Alignment';
  let insight = '';

  if (harmony >= 95) {
    freq = '528Hz'; // Heart/Transformation frequency
    resonance = 'Celestial Supernova Resonance';
  } else if (harmony >= 92) {
    freq = '432Hz'; // Natural cosmic tuning
    resonance = 'Stardust Harmony Resonance';
  }

  if (relation === 'couple') {
    insight = `Your connection in "${name}" is vibrating at a pristine ${freq} frequency. With ${stats.daysTogether} days together and an active ${stats.streak}-day streak, your hearts are orbiting in perfect sync. The alignment suggests an exceptionally strong romantic bond, nourished by your ${stats.adventures} shared adventures.`;
  } else if (relation === 'family') {
    insight = `The family anchor in "${name}" is exceptionally solid. Your family pulse shows deep-rooted cosmic harmony, built over ${stats.daysTogether} days. The current ${stats.streak}-day streak reveals constant communication, keeping your constellation of hearts closely knit.`;
  } else {
    insight = `The friendly bond in "${name}" is shining bright! Having shared ${stats.daysTogether} days and ${stats.adventures} adventures together, you have built a solar system of trust and shared laughs. Your ${stats.streak}-day streak is proof of a friendship that stands the test of distance and time.`;
  }

  return {
    harmonyIndex: `${harmony}%`,
    solfeggioFreq: freq,
    resonanceLevel: resonance,
    insight
  };
}

/**
 * Generates a Quest based on space data.
 */
export async function generateQuest(spaceData: any): Promise<DailyQuest> {
  const relation = spaceData?.selectedRelation || 'couple';
  const name = spaceData?.spaceName || 'Our Little Universe';

  const systemPrompt = `You are a relationship bonding expert. Generate one sweet, interactive, actionable relationship micro-quest/challenge for a ${relation} space named "${name}". Keep it under 20 words. Provide a short description under 30 words. Return as JSON format like {"title": "...", "description": "...", "reward": "...", "duration": "..."}. Do not use markdown tags, just return the raw json.`;
  const userPrompt = `Give me a daily quest for ${relation} space.`;

  const geminiText = await callGemini(systemPrompt, userPrompt);
  if (geminiText) {
    try {
      const cleanJson = geminiText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      if (parsed.title && parsed.description) {
        return {
          title: parsed.title,
          description: parsed.description,
          reward: parsed.reward || '+15 Sync Points',
          duration: parsed.duration || '5 mins',
        };
      }
    } catch (e) {
      console.warn('Failed parsing Gemini quest JSON. Falling back to local quests.');
    }
  }

  // Local simulated fallback database
  const coupleQuests = [
    { title: 'Melody Memories', description: 'Share a song with your partner that reminds you of a special moment you spent together.', reward: '+15 Sync Points', duration: '3 mins' },
    { title: 'Gratitude Sparkle', description: 'Text them three tiny things you appreciate about them today, no matter how small.', reward: '+20 Sync Points', duration: '5 mins' },
    { title: 'Time Travel Note', description: 'Recall your very first date/meeting. Write down a 1-sentence detail you still remember vividly.', reward: '+15 Sync Points', duration: '4 mins' },
    { title: 'Cozy Brew Promise', description: 'Send a coffee emoji with a promise to have a warm drink together this week.', reward: '+10 Sync Points', duration: '2 mins' },
  ];

  const familyQuests = [
    { title: 'Family Recipe Recall', description: 'Share a favorite meal memory you all had together and say what made it so tasty.', reward: '+15 Sync Points', duration: '5 mins' },
    { title: 'Sticker Bomb', description: 'Send a funny sticker or GIF in the group chat to make everyone smile today.', reward: '+10 Sync Points', duration: '2 mins' },
    { title: 'Warm Check-in', description: 'Call or send a voice note to check how their week is shaping up.', reward: '+20 Sync Points', duration: '4 mins' },
  ];

  const defaultQuests = [
    { title: 'Secret Inside Joke', description: 'Remind your friend of an old inside joke or a funny photo from your memory archive.', reward: '+15 Sync Points', duration: '3 mins' },
    { title: 'Support Wave', description: 'Send a message telling them you have their back for whatever they are working on this week.', reward: '+20 Sync Points', duration: '2 mins' },
  ];

  const db = relation === 'couple' ? coupleQuests : relation === 'family' ? familyQuests : defaultQuests;
  const randomIndex = Math.floor(Math.random() * db.length);
  return db[randomIndex];
}

/**
 * Handles conversational advice.
 */
export async function askAiAdvisor(prompt: string, spaceData: any): Promise<string> {
  const relation = spaceData?.selectedRelation || 'couple';
  const name = spaceData?.spaceName || 'Our Little Universe';
  const specialDate = spaceData?.specialDate || '2024-05-12';

  const systemPrompt = `You are a wise relationship coach, cosmic advisor, and memory guide for a "${relation}" space called "${name}" (together since ${specialDate}). Answer the user's relationship question/request in a warm, encouraging, slightly cosmic or poetic tone. Focus on building connection, creating memories, or maintaining streaks. Keep response under 100 words.`;

  const geminiText = await callGemini(systemPrompt, prompt);
  if (geminiText) {
    return geminiText.trim();
  }

  // Local simulated chatbot logic
  const query = prompt.toLowerCase();

  if (query.includes('date') || query.includes('dinner') || query.includes('outdoor')) {
    if (relation === 'couple') {
      return `✨ **AI Advisor:** How about a "Retro Nostalgia Date"? Choose a local spot you visited during your first months together. Order the exact same food, recreate a picture from back then, and chat about how you've both grown since that day. Keep the spark alive!`;
    }
    return `✨ **AI Advisor:** For a memorable bonding activity, plan a "Mystery Destination Outing". One person picks a location (a scenic park, a board game café, or an art workshop) and keeps it a secret until you arrive. It adds a lovely sense of shared adventure!`;
  }

  if (query.includes('streak') || query.includes('daily') || query.includes('keep')) {
    return `✨ **AI Advisor:** Your streak is a glowing constellation of consistency. To keep it shining, try checking in at the same time each day (e.g. morning thoughts or bedtime wishes). Even a simple heart emoji on busy days preserves the bridge of connection!`;
  }

  if (query.includes('anniversary') || query.includes('special') || query.includes('gift') || query.includes('celebrate')) {
    return `✨ **AI Advisor:** Celebrating your special date (${specialDate}) is a milestone! I recommend a "Memory Scroll" gift: compile your top 10 photos from the past year, write a short caption for why each one matters, and lock them in a dedicated digital Time Capsule on your board.`;
  }

  if (query.includes('fight') || query.includes('conflict') || query.includes('argument') || query.includes('sorry')) {
    return `✨ **AI Advisor:** Every relationship encounters cosmic turbulent winds. When sync levels dip, try a "10-Minute Decompression Rule": sit side-by-side without discussing the issue, hold hands to sync physical heartbeats, and only speak when both pulses feel calm.`;
  }

  // Default fallback
  return `✨ **AI Advisor:** I'm tuned to your space, "${name}". Remember, strong relationships aren't built on monumental events, but on the tiny, consistent particles of care you exchange daily. Add a quick memory, complete today's quest, and watch your connection grow!`;
}
