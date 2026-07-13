'use server'

import { cookies } from 'next/headers'

export async function unlockVault(password: string) {
  const secret = process.env.ADMIN_VAULT_PASSWORD

  if (!secret) {
    return { error: 'Vault password is not configured on the server.' }
  }

  if (password !== secret) {
    return { error: 'Incorrect vault password.' }
  }

  const cookieStore = await cookies()
  
  // Set a secure vault session cookie that expires in 24 hours
  cookieStore.set('admin_unlocked', 'true', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24,
    path: '/admin',
  })

  return { success: true }
}

export async function lockVault() {
  const cookieStore = await cookies()
  cookieStore.delete('admin_unlocked')
}
