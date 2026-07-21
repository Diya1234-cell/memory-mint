'use client'

import { ReactNode } from 'react'
import { StoryBookProvider } from '@/context/StoryBookContext'
import { AuthProvider } from '@/providers/AuthProvider'

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <StoryBookProvider>{children}</StoryBookProvider>
    </AuthProvider>
  )
}
