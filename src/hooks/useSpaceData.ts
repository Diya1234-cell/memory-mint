import { useState, useEffect } from 'react'
import { useAuth } from '@/providers/AuthProvider'
import { getSpacesForUser } from '@/services/firestoreService'

export interface SpaceData {
  spaceId?: string
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
  invites: [],
}

function mapFirestoreSpace(doc: any): Partial<SpaceData> {
  const d = doc
  return {
    spaceId: doc.id,
    spaceName: d.spaceName || DEFAULT_SPACE_DATA.spaceName,
    themeColor: d.themeColor || d.themeColor || DEFAULT_SPACE_DATA.themeColor,
    specialDate: d.specialDate || DEFAULT_SPACE_DATA.specialDate,
    relationshipEmoji: d.relationshipEmoji || DEFAULT_SPACE_DATA.relationshipEmoji,
    description: d.description || DEFAULT_SPACE_DATA.description,
    category: d.category || DEFAULT_SPACE_DATA.category,
    isPrivate: d.isPrivate ?? DEFAULT_SPACE_DATA.isPrivate,
    coverPhoto: d.coverPhoto || d.coverPhoto || DEFAULT_SPACE_DATA.coverPhoto,
    selectedRelation: d.relationshipType || d.selectedRelation || DEFAULT_SPACE_DATA.selectedRelation,
    invites: d.invites || [],
  }
}

export function useSpaceData() {
  const { user } = useAuth()
  const [spaceData, setSpaceData] = useState<SpaceData>(DEFAULT_SPACE_DATA)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      const saved = localStorage.getItem('memory-universe-setup')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          setSpaceData(prev => ({ ...prev, ...parsed }))
        } catch { /* ignore */ }
      }
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)

    getSpacesForUser(user.uid).then((result) => {
      if (cancelled) return
      if (result.success && result.data.length > 0) {
        const space = result.data[0] as any
        setSpaceData(prev => ({ ...prev, ...mapFirestoreSpace(space) }))
      } else {
        const saved = localStorage.getItem('memory-universe-setup')
        if (saved) {
          try {
            const parsed = JSON.parse(saved)
            setSpaceData(prev => ({ ...prev, ...parsed }))
          } catch { /* ignore */ }
        }
      }
      setLoading(false)
    }).catch(() => {
      if (cancelled) return
      const saved = localStorage.getItem('memory-universe-setup')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          setSpaceData(prev => ({ ...prev, ...parsed }))
        } catch { /* ignore */ }
      }
      setLoading(false)
    })

    return () => { cancelled = true }
  }, [user])

  const updateSpaceData = (newData: Partial<SpaceData>) => {
    const updated = { ...spaceData, ...newData }
    setSpaceData(updated)
    localStorage.setItem('memory-universe-setup', JSON.stringify(updated))
    window.dispatchEvent(new Event('storage'))
  }

  return { spaceData, updateSpaceData, loading }
}
