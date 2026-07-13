'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

export async function incrementView(paperId: string) {
  try {
    // Try all models since we don't pass the type
    let updated = false
    
    try {
      await prisma.book.update({ where: { id: paperId }, data: { views: { increment: 1 } } })
      updated = true
    } catch (e) {}

    if (!updated) {
      try {
        await prisma.researchPaper.update({ where: { id: paperId }, data: { views: { increment: 1 } } })
        updated = true
      } catch (e) {}
    }

    if (!updated) {
      try {
        await prisma.poem.update({ where: { id: paperId }, data: { views: { increment: 1 } } })
        updated = true
      } catch (e) {}
    }

    if (!updated) {
      try {
        await prisma.journal.update({ where: { id: paperId }, data: { views: { increment: 1 } } })
        updated = true
      } catch (e) {}
    }
    
    // Increment the total user views (assuming only 1 user for the clone)
    const user = await prisma.user.findFirst()
    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          views: {
            increment: 1,
          },
        },
      })
    }

    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error("Failed to increment view", error)
    return { success: false }
  }
}
