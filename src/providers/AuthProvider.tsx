'use client'

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'

type AuthUser = {
  uid: string
  email: string
  name?: string
}

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>
  signup: (
    email: string,
    password: string,
    confirmPassword: string,
    name: string,
  ) => Promise<{ success: boolean; message?: string }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    return onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser ? {
        uid: firebaseUser.uid,
        email: firebaseUser.email ?? '',
        name: firebaseUser.displayName ?? undefined,
      } : null)
      setLoading(false)
    })
  }, [])

  const login = async (email: string, password: string) => {
    if (!email || !password) {
      return { success: false, message: 'Please enter email and password.' }
    }

    try {
      await signInWithEmailAndPassword(auth, email, password)
      return { success: true }
    } catch (error: unknown) {
      const code = (error as { code?: string }).code
      return {
        success: false,
        message: code === 'auth/invalid-credential' ? 'Invalid email or password.' : 'Unable to sign in. Please try again.',
      }
    }
  }

  const signup = async (
    email: string,
    password: string,
    confirmPassword: string,
    name: string,
  ) => {
    if (!email || !password || !confirmPassword || !name) {
      return { success: false, message: 'Please fill out all signup fields.' }
    }

    if (password !== confirmPassword) {
      return { success: false, message: 'Passwords do not match.' }
    }

    if (password.length < 6) {
      return { success: false, message: 'Use a password with at least 6 characters.' }
    }

    try {
      const credential = await createUserWithEmailAndPassword(auth, email.toLowerCase(), password)
      await updateProfile(credential.user, { displayName: name })
      await setDoc(doc(db, 'users', credential.user.uid), {
        email: credential.user.email,
        displayName: name,
        createdAt: serverTimestamp(),
        lastActiveAt: serverTimestamp(),
      }, { merge: true })
      return { success: true }
    } catch (error: unknown) {
      const code = (error as { code?: string }).code
      return {
        success: false,
        message: code === 'auth/email-already-in-use' ? 'An account already exists with this email.' : 'Unable to create your account. Please try again.',
      }
    }
  }

  const logout = async () => {
    await signOut(auth)
  }

  const value = useMemo(
    () => ({ user, loading, login, signup, logout }),
    [user, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
