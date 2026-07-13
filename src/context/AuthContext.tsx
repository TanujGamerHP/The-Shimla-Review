'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { getSessionUser } from '@/actions/auth'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { onIdTokenChanged, signOut } from 'firebase/auth'

export type Role = 'SUPER_ADMIN' | 'EDITOR' | 'REVIEWER' | 'AUTHOR' | 'CONTRIBUTOR' | 'READER'

interface User {
  id: string
  name: string
  email: string
  role: Role
  avatarUrl?: string
}

interface AuthContextType {
  user: User | null
  logout: () => Promise<void>
  isLoading: boolean
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const refreshSession = async () => {
    try {
      const sessionUser = await getSessionUser()
      setUser(sessionUser as User | null)
    } catch (error) {
      console.error('Failed to get session:', error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Listen for Firebase token changes (login, logout, token refresh)
    const unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const idToken = await firebaseUser.getIdToken()
        // Sync token to Next.js cookie
        await fetch('/api/auth/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken }),
        })
      } else {
        // Clear Next.js cookie
        await fetch('/api/auth/session', { method: 'DELETE' })
      }
      
      // After syncing, fetch the Prisma user data
      await refreshSession()
    })

    return () => unsubscribe()
  }, [])

  const logout = async () => {
    await signOut(auth) // This triggers onIdTokenChanged which handles cookie clearing
    setUser(null)
    router.push('/')
    router.refresh()
  }

  return (
    <AuthContext.Provider value={{ user, logout, isLoading, refreshSession }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
