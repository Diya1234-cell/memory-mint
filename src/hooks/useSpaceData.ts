import { useState, useEffect } from 'react'

export interface SpaceData {
  spaceName: string
  themeColor: string
  specialDate: string
  relationshipEmoji: string
  description: string
  category: string
  isPrivate: boolean
  coverPhoto: string
  selectedRelation: string
  invites: Array<{ email: string; avatar?: string; status: string; time?: string }>
}

const DEFAULT_SPACE_DATA: SpaceData = {
  spaceName: 'Our Little Universe',
  relationshipEmoji: '❤️',
  selectedRelation: 'couple',
  isPrivate: true,
  specialDate: '2024-05-12',
  description: 'A place where our memories live forever.',
  category: 'Our Journey',
  coverPhoto: 'https://images.unsplash.com/photo-1501908731398-23b3efd7ccab?auto=format&fit=crop&w=600&q=80',
  themeColor: 'pink',
  invites: [
    { email: 'rahul@foreverremembered.com', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80', status: 'Accepted', time: 'Joined 2 days ago' },
    { email: 'aanya.sharma@example.com', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80', status: 'Pending', time: 'Invited 5 mins ago' }
  ]
}

export function useSpaceData() {
  const [spaceData, setSpaceData] = useState<SpaceData>(DEFAULT_SPACE_DATA)
  const [loading, setLoading] = useState(true)

  const reloadData = () => {
    const saved = localStorage.getItem('memory-universe-setup')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setSpaceData(prev => ({ ...prev, ...parsed }))
      } catch (e) {
        console.error('Error parsing space data:', e)
      }
    }
  };

  useEffect(() => {
    reloadData()
    setLoading(false)

    // Listen to storage changes to keep sidebar & dashboard components synchronized
    const handleStorageChange = () => {
      reloadData()
    }
    window.addEventListener('storage', handleStorageChange)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const updateSpaceData = (newData: Partial<SpaceData>) => {
    const updated = { ...spaceData, ...newData }
    setSpaceData(updated)
    localStorage.setItem('memory-universe-setup', JSON.stringify(updated))
    window.dispatchEvent(new Event('storage'))
  }

  return { spaceData, updateSpaceData, loading }
}
