'use client'

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from 'react'
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth'

type AuthUser = {
  uid: string
  email: string
  name?: string
}

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message?: string }>
  signup: (
    email: string,
    password: string,
    confirmPassword: string,
    name: string
  ) => Promise<{ success: boolean; message?: string }>
  logout: () => Promise<void> | void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function toAuthUser(
  firebaseUser: import('firebase/auth').User | null
): AuthUser | null {
  if (!firebaseUser) return null

  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email ?? '',
    name: firebaseUser.displayName ?? undefined,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const {
    user: fbUser,
    loading,
    login: fbLogin,
    signup: fbSignup,
    logout: fbLogout,
  } = useFirebaseAuth()

  const user = toAuthUser(fbUser)

  const login = async (email: string, password: string) => {
    if (!email || !password) {
      return {
        success: false,
        message: 'Please enter email and password.',
      }
    }

    const result = await fbLogin(email, password)

    if (result.error) {
      return {
        success: false,
        message: result.error,
      }
    }

    return { success: true }
  }

  const signup = async (
    email: string,
    password: string,
    confirmPassword: string,
    name: string,
  ) => {
    if (!email || !password || !confirmPassword || !name) {
      return {
        success: false,
        message: 'Please fill out all signup fields.',
      }
    }

    if (password !== confirmPassword) {
      return {
        success: false,
        message: 'Passwords do not match.',
      }
    }

    if (password.length < 6) {
      return {
        success: false,
        message: 'Use a password with at least 6 characters.',
      }
    }

    const result = await fbSignup(email, password)

    if (result.error) {
      return {
        success: false,
        message: result.error,
      }
    }

    return { success: true }
  }

  const logout = async () => {
    await fbLogout()
  }

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      signup,
      logout,
    }),
    [user, loading]
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}