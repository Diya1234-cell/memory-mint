import { useState, useEffect } from 'react'
import { useAuth } from '@/providers/AuthProvider'
import { useSpaceData } from '@/hooks/useSpaceData'
import { getSpacesForUser, getMemories, getSpace } from '@/services/firestoreService'

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

      const daysShared = space?.createdAt
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

      setStats({
        memoryCount: memories.length,
        daysShared,
        memberCount: (space as any)?.members?.length ?? 1,
        recentMemories: sortedMemories,
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
