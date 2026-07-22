'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/navigation/Sidebar'
import { useAuth } from '@/providers/AuthProvider'
import { hasUserSpace } from '@/services/firestoreService'

export default function AuthenticatedLayout({
  children,
}: {
  children: ReactNode
}) {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [checkingSpace, setCheckingSpace] = useState(true)
  const [hasSpace, setHasSpace] = useState(false)

  useEffect(() => {
    if (loading) return

    if (!user) {
      router.replace('/login')
      return
    }

    setCheckingSpace(true)
    hasUserSpace(user.uid)
      .then((exists) => {
        setHasSpace(exists)
        setCheckingSpace(false)
        if (!exists) {
          router.replace('/create-space')
        }
      })
      .catch(() => {
        setHasSpace(false)
        setCheckingSpace(false)
        router.replace('/create-space')
      })
  }, [loading, user, router])

  if (loading || checkingSpace) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">{loading ? 'Loading...' : 'Checking space...'}</p>
      </div>
    )
  }

  if (!user || !hasSpace) {
    return null
  }

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 md:pl-72 min-h-screen relative z-10 w-full flex flex-col">
        {children}
      </div>
    </div>
  )
}
