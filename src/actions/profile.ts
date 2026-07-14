'use server'

import { PrismaClient } from '@prisma/client'
import { getSessionUser } from './auth'
import { put } from '@vercel/blob'

const prisma = new PrismaClient()

export async function updateProfile(formData: FormData) {
  const sessionUser = await getSessionUser()
  if (!sessionUser) {
    return { error: 'Unauthorized. Please log in.' }
  }

  const name = formData.get('name') as string
  const bio = formData.get('bio') as string
  const profilePhoto = formData.get('profilePhoto') as File | null

  if (!name || name.trim() === '') {
    return { error: 'Name cannot be empty.' }
  }

  let avatarUrl = undefined

  try {
    // Handle file upload if a new photo is provided
    if (profilePhoto && profilePhoto.size > 0) {
      // Validate file type
      if (!profilePhoto.type.startsWith('image/')) {
        return { error: 'Please upload a valid image file.' }
      }

      // 5MB limit
      if (profilePhoto.size > 5 * 1024 * 1024) {
        return { error: 'Image size must be less than 5MB.' }
      }

      const filename = `profiles/${sessionUser.id}-${Date.now()}-${profilePhoto.name.replace(/[^a-zA-Z0-9.-]/g, '')}`
      
      const blob = await put(filename, profilePhoto, {
        access: 'public',
      })
      
      avatarUrl = blob.url
    }

    // Update the database
    const updatedUser = await prisma.user.update({
      where: { id: sessionUser.id },
      data: {
        name,
        ...(bio !== undefined && { bio }),
        ...(avatarUrl && { avatarUrl }),
      },
    })

    return { 
      success: true, 
      user: {
        name: updatedUser.name,
        bio: updatedUser.bio,
        avatarUrl: updatedUser.avatarUrl
      } 
    }
  } catch (error) {
    console.error('Profile update error:', error)
    return { error: 'Failed to update profile.' }
  }
}
