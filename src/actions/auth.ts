'use server'

import { cookies } from 'next/headers'
import { PrismaClient } from '@prisma/client'
import { adminAuth } from '@/lib/firebase-admin'

const prisma = new PrismaClient()

/**
 * Validates the Next.js session cookie against Firebase Admin and retrieves the Prisma user
 */
export async function getSessionUser() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('session')?.value

  if (!sessionCookie) return null

  try {
    const decodedToken = await adminAuth.verifyIdToken(sessionCookie)
    
    // We use email as the ultimate truth since Google Auth might lack uid initially
    const user = await prisma.user.findUnique({
      where: { email: decodedToken.email }
    })
    
    return user
  } catch (error: any) {
    // If it's an expired token, just fail silently and return null.
    // We don't want to console.error it because Next.js dev server 
    // will aggressively pop up a fatal error overlay for any SSR console.error.
    if (error?.code !== 'auth/id-token-expired' && error?.code !== 'auth/argument-error') {
      console.error('Failed to verify session:', error)
    }
    return null
  }
}

// Kept for backward compatibility if any old components call it, 
// but AuthContext now handles this natively via Firebase signOut
export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
}
