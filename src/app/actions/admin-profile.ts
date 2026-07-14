'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

export async function updateHomeProfile(data: { name: string; avatarUrl: string; bio: string; followers: number; views: number }) {
  try {
    const adminEmail = 'theshimlareview@gmail.com'
    
    await prisma.user.updateMany({
      where: { email: adminEmail },
      data: {
        name: data.name,
        avatarUrl: data.avatarUrl,
        bio: data.bio,
        followers: data.followers,
        views: data.views
      }
    })

    revalidatePath('/')
    revalidatePath('/admin/home-profile')
    return { success: true }
  } catch (error: any) {
    console.error('Failed to update admin profile:', error)
    return { success: false, error: 'Failed to update profile' }
  }
}

export async function followAdmin() {
  try {
    const adminEmail = 'theshimlareview@gmail.com'
    
    // In a real app we'd link to the logged-in user, but for now we just increment
    await prisma.user.updateMany({
      where: { email: adminEmail },
      data: {
        followers: { increment: 1 }
      }
    })

    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    console.error('Failed to follow admin:', error)
    return { success: false, error: 'Failed to follow' }
  }
}
