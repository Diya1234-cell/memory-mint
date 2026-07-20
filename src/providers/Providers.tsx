'use client'

import { ReactNode } from 'react'
import { StoryBookProvider } from '@/context/StoryBookContext'

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <StoryBookProvider>
      {children}
    </StoryBookProvider>
  )
}
