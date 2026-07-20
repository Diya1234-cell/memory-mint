'use client'

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

type AuthUser = {
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
  logout: () => void
}

const AUTH_STORAGE_KEY = 'memory-mint-auth'
const CURRENT_USER_KEY = 'memory-mint-user'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem(CURRENT_USER_KEY)
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        setUser(null)
      }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    if (!email || !password) {
      return { success: false, message: 'Please enter email and password.' }
    }

    const rawAuth = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!rawAuth) {
      return { success: false, message: 'No account found. Please sign up first.' }
    }

    try {
      const authData = JSON.parse(rawAuth) as {
        email: string
        password: string
        name: string
      }

      if (authData.email.toLowerCase() !== email.toLowerCase() || authData.password !== password) {
        return { success: false, message: 'Invalid email or password.' }
      }

      const currentUser = { email: authData.email, name: authData.name }
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser))
      setUser(currentUser)
      return { success: true }
    } catch {
      return { success: false, message: 'Unable to read saved credentials.' }
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

    const authData = {
      email: email.toLowerCase(),
      password,
      name,
    }

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData))
    const currentUser = { email: authData.email, name: authData.name }
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser))
    setUser(currentUser)

    return { success: true }
  }

  const logout = () => {
    localStorage.removeItem(CURRENT_USER_KEY)
    setUser(null)
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
