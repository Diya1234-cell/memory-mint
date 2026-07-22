import { useState, useEffect } from 'react'
import { useAuth } from '@/providers/AuthProvider'
import { useSpaceData } from '@/hooks/useSpaceData'
import { getMemories, getSpace } from '@/services/firestoreService'

export interface DashboardStats {
  memoryCount: number
  daysShared: number
  memberCount: number
  recentMemories: Array<{
    id: string
    title: string
    description?: string
    createdAt: string
    mediaUrl?: string
    type?: string
  }>
  spaceCreatedAt: string | null
  relationship: string
}

const SAMPLE_MEMORIES: DashboardStats['recentMemories'] = [
  {
    id: 'sample-sunset-walk',
    title: 'Sunset Walk Together',
    description: 'A golden evening by the sea, with nowhere else to be.',
    createdAt: '2026-07-18T18:30:00.000Z',
    mediaUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    type: 'photo',
  },
  {
    id: 'sample-sunday-brunch',
    title: 'Sunday Brunch',
    description: 'Pancakes, laughter, and a very slow morning.',
    createdAt: '2026-07-12T10:15:00.000Z',
    mediaUrl: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=600&q=80',
    type: 'photo',
  },
  {
    id: 'sample-little-note',
    title: 'A Little Note',
    description: 'A reminder that ordinary days become the ones we treasure.',
    createdAt: '2026-07-05T08:00:00.000Z',
    mediaUrl: 'https://images.unsplash.com/photo-1516383607781-913a19294fd1?auto=format&fit=crop&w=600&q=80',
    type: 'journal',
  },
  {
    id: 'sample-road-trip',
    title: 'The Long Way Home',
    description: 'Windows down, favourite songs on, and one more stop for chai.',
    createdAt: '2026-06-28T16:45:00.000Z',
    mediaUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80',
    type: 'photo',
  },
  {
    id: 'sample-movie-night',
    title: 'Movie Night',
    description: 'Blankets, popcorn, and laughing at all the wrong moments.',
    createdAt: '2026-06-21T20:00:00.000Z',
    mediaUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80',
    type: 'video',
  },
  {
    id: 'sample-first-rain',
    title: 'First Rain of Summer',
    description: 'We stayed outside until every streetlight looked like a star.',
    createdAt: '2026-06-14T19:10:00.000Z',
    mediaUrl: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80',
    type: 'photo',
  },
]

export function useDashboardData() {
  const { user } = useAuth()
  const { spaceData } = useSpaceData()
  const [stats, setStats] = useState<DashboardStats>({
    memoryCount: 0,
    daysShared: 0,
    memberCount: 1,
    recentMemories: [],
    spaceCreatedAt: null,
    relationship: spaceData.selectedRelation,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || !spaceData.spaceId) {
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)

    Promise.all([
      getMemories(spaceData.spaceId),
      getSpace(spaceData.spaceId),
    ]).then(([memoriesResult, spaceResult]) => {
      if (cancelled) return

      const memories = memoriesResult.success ? memoriesResult.data : []
      const space = spaceResult.success ? (spaceResult.data as any) : null

      const realDaysShared = space?.createdAt
        ? Math.floor(
            (Date.now() -
              (space.createdAt.toDate?.()?.getTime() ?? Date.now())) /
              (1000 * 60 * 60 * 24)
          )
        : 0

      const sortedMemories = [...memories]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 10)
        .map((m) => ({
          id: m.id,
          title: m.title,
          description: m.description,
          createdAt: m.createdAt,
          mediaUrl: m.mediaUrl,
          type: (m as any).type,
        }))

      const hasMemories = memories.length > 0

      setStats({
        memoryCount: hasMemories ? memories.length : SAMPLE_MEMORIES.length,
        daysShared: hasMemories ? realDaysShared : Math.max(realDaysShared, 143),
        memberCount: (space as any)?.members?.length ?? (hasMemories ? 1 : 4),
        recentMemories: hasMemories ? sortedMemories : SAMPLE_MEMORIES,
        spaceCreatedAt: space?.createdAt?.toDate?.()?.toISOString() ?? null,
        relationship: spaceData.selectedRelation,
      })
      setLoading(false)
    }).catch(() => {
      if (cancelled) return
      setLoading(false)
    })

    return () => { cancelled = true }
  }, [user, spaceData.spaceId, spaceData.selectedRelation])

  return { stats, loading }
}
