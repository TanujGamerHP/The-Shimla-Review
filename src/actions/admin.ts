'use server'

import { PrismaClient } from '@prisma/client'
import { getSessionUser } from './auth'
import { revalidatePath } from 'next/cache'
import { put } from '@vercel/blob'

const prisma = new PrismaClient()

// Secure wrapper to ensure only super admins can run these actions
async function requireSuperAdmin() {
  const user = await getSessionUser()
  if (!user || user.role !== 'SUPER_ADMIN') {
    throw new Error('Unauthorized: Super Admin access required')
  }
  return user
}

// Universal file uploader helper using Vercel Blob
async function uploadFile(file: File, folder: string, prefix: string) {
  if (!file || file.size === 0) return null
  
  const filename = `${folder}/${prefix}-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`
  
  const blob = await put(filename, file, {
    access: 'public',
  })
  
  return blob.url
}

export async function createBook(formData: FormData) {
  try {
    const admin = await requireSuperAdmin()
    
    const title = formData.get('title') as string
    const synopsis = formData.get('synopsis') as string
    const priceStr = formData.get('price') as string
    const price = priceStr ? parseFloat(priceStr) : null
    const purchaseUrl = formData.get('purchaseUrl') as string | null
    
    const imageFile = formData.get('coverImage') as File
    const pdfFile = formData.get('pdfDocument') as File
    
    const coverImageUrl = await uploadFile(imageFile, 'books', 'book-cover')
    const downloadUrl = await uploadFile(pdfFile, 'pdfs', 'book-doc')

    const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}-${Math.random().toString(36).substring(2, 8)}`

    await prisma.book.create({
      data: {
        title,
        synopsis,
        slug,
        price,
        purchaseUrl,
        coverImageUrl,
        downloadUrl,
        authorId: admin.id,
        status: 'PUBLISHED'
      }
    })

    revalidatePath('/')
    revalidatePath('/admin/content')
    return { success: true }
  } catch (error: any) {
    return { error: error.message || 'Failed to create book' }
  }
}

export async function createJournal(formData: FormData) {
  try {
    await requireSuperAdmin()
    
    const title = formData.get('title') as string
    const volume = formData.get('volume') as string
    const issue = formData.get('issue') as string
    const editorialBoard = formData.get('editorialBoard') as string
    
    const imageFile = formData.get('coverImage') as File
    const pdfFile = formData.get('pdfDocument') as File
    
    const coverImageUrl = await uploadFile(imageFile, 'journals', 'journal-cover')
    const downloadUrl = await uploadFile(pdfFile, 'pdfs', 'journal-doc')

    const slug = `${title}-${volume}-${issue}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + `-${Math.random().toString(36).substring(2, 8)}`

    await prisma.journal.create({
      data: {
        title,
        volume,
        issue,
        editorialBoard,
        slug,
        coverImageUrl,
        downloadUrl,
        status: 'PUBLISHED'
      }
    })

    revalidatePath('/')
    revalidatePath('/admin/content')
    return { success: true }
  } catch (error: any) {
    return { error: error.message || 'Failed to create journal' }
  }
}

export async function createResearchPaper(formData: FormData) {
  try {
    const admin = await requireSuperAdmin()
    
    const title = formData.get('title') as string
    const abstract = formData.get('abstract') as string
    const doi = formData.get('doi') as string
    
    const imageFile = formData.get('coverImage') as File
    const pdfFile = formData.get('pdfDocument') as File
    
    const coverImageUrl = await uploadFile(imageFile, 'papers', 'paper-cover')
    const downloadUrl = await uploadFile(pdfFile, 'pdfs', 'paper-doc')

    const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}-${Math.random().toString(36).substring(2, 8)}`

    await prisma.researchPaper.create({
      data: {
        title,
        abstract,
        doi,
        slug,
        coverImageUrl,
        downloadUrl,
        authorId: admin.id,
        status: 'PUBLISHED'
      }
    })

    revalidatePath('/')
    revalidatePath('/admin/content')
    return { success: true }
  } catch (error: any) {
    return { error: error.message || 'Failed to create paper' }
  }
}

export async function createPoem(formData: FormData) {
  try {
    const admin = await requireSuperAdmin()
    
    const title = formData.get('title') as string
    const content = formData.get('content') as string
    const language = formData.get('language') as string
    
    const imageFile = formData.get('coverImage') as File
    const pdfFile = formData.get('pdfDocument') as File
    
    const coverImageUrl = await uploadFile(imageFile, 'poetry', 'poem-cover')
    const downloadUrl = await uploadFile(pdfFile, 'pdfs', 'poem-doc')

    const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}-${Math.random().toString(36).substring(2, 8)}`

    await prisma.poem.create({
      data: {
        title,
        content,
        language,
        slug,
        coverImageUrl,
        downloadUrl,
        authorId: admin.id,
        status: 'PUBLISHED'
      }
    })

    revalidatePath('/')
    revalidatePath('/admin/content')
    return { success: true }
  } catch (error: any) {
    return { error: error.message || 'Failed to create poem' }
  }
}

export async function createArticle(formData: FormData) {
  try {
    const admin = await requireSuperAdmin()
    
    const title = formData.get('title') as string
    const subtitle = formData.get('subtitle') as string
    const content = formData.get('content') as string
    
    const imageFile = formData.get('coverImage') as File
    
    const coverImageUrl = await uploadFile(imageFile, 'articles', 'article-cover')

    const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}-${Math.random().toString(36).substring(2, 8)}`

    await prisma.article.create({
      data: {
        title,
        subtitle,
        content,
        slug,
        coverImageUrl,
        authorId: admin.id,
        status: 'PUBLISHED'
      }
    })

    revalidatePath('/')
    revalidatePath('/admin/content')
    return { success: true }
  } catch (error: any) {
    return { error: error.message || 'Failed to create article' }
  }
}

export async function updateSubmissionStatus(submissionId: string, status: string) {
  try {
    await requireSuperAdmin()
    
    await prisma.submission.update({
      where: { id: submissionId },
      data: { status }
    })

    revalidatePath('/admin/submissions')
    return { success: true }
  } catch (error: any) {
    console.error('Failed to update submission:', error)
    return { error: error.message || 'Failed to update submission' }
  }
}

export async function deleteBook(id: string) {
  try {
    await requireSuperAdmin()
    await prisma.book.delete({ where: { id } })
    revalidatePath('/')
    revalidatePath('/admin/manage-content')
    return { success: true }
  } catch (error: any) {
    return { error: error.message || 'Failed to delete book' }
  }
}

export async function deleteJournal(id: string) {
  try {
    await requireSuperAdmin()
    await prisma.journal.delete({ where: { id } })
    revalidatePath('/')
    revalidatePath('/admin/manage-content')
    return { success: true }
  } catch (error: any) {
    return { error: error.message || 'Failed to delete short story' }
  }
}

export async function deleteResearchPaper(id: string) {
  try {
    await requireSuperAdmin()
    await prisma.researchPaper.delete({ where: { id } })
    revalidatePath('/')
    revalidatePath('/admin/manage-content')
    return { success: true }
  } catch (error: any) {
    return { error: error.message || 'Failed to delete research paper' }
  }
}

export async function deletePoem(id: string) {
  try {
    await requireSuperAdmin()
    await prisma.poem.delete({ where: { id } })
    revalidatePath('/')
    revalidatePath('/admin/manage-content')
    return { success: true }
  } catch (error: any) {
    return { error: error.message || 'Failed to delete poem' }
  }
}

export async function deleteArticle(id: string) {
  try {
    await requireSuperAdmin()
    await prisma.article.delete({ where: { id } })
    revalidatePath('/')
    revalidatePath('/admin/manage-content')
    return { success: true }
  } catch (error: any) {
    return { error: error.message || 'Failed to delete article' }
  }
}

export async function updateBook(id: string, formData: FormData) {
  try {
    await requireSuperAdmin()
    
    const title = formData.get('title') as string
    const synopsis = formData.get('synopsis') as string
    const priceStr = formData.get('price') as string
    const price = priceStr ? parseFloat(priceStr) : null
    const purchaseUrl = formData.get('purchaseUrl') as string | null
    
    const imageFile = formData.get('coverImage') as File | null
    const pdfFile = formData.get('pdfDocument') as File | null
    
    const data: any = { title, synopsis, price, purchaseUrl }
    
    if (imageFile && imageFile.size > 0) {
      data.coverImageUrl = await uploadFile(imageFile, 'books', 'book-cover')
    }
    if (pdfFile && pdfFile.size > 0) {
      data.downloadUrl = await uploadFile(pdfFile, 'pdfs', 'book-doc')
    }

    await prisma.book.update({ where: { id }, data })
    revalidatePath('/')
    revalidatePath('/admin/manage-content')
    return { success: true }
  } catch (error: any) {
    return { error: error.message || 'Failed to update book' }
  }
}

export async function updateJournal(id: string, formData: FormData) {
  try {
    await requireSuperAdmin()
    
    const title = formData.get('title') as string
    const volume = formData.get('volume') as string
    const issue = formData.get('issue') as string
    const editorialBoard = formData.get('editorialBoard') as string
    
    const imageFile = formData.get('coverImage') as File | null
    const pdfFile = formData.get('pdfDocument') as File | null
    
    const data: any = { title, volume, issue, editorialBoard }
    
    if (imageFile && imageFile.size > 0) {
      data.coverImageUrl = await uploadFile(imageFile, 'journals', 'journal-cover')
    }
    if (pdfFile && pdfFile.size > 0) {
      data.downloadUrl = await uploadFile(pdfFile, 'pdfs', 'journal-doc')
    }

    await prisma.journal.update({ where: { id }, data })
    revalidatePath('/')
    revalidatePath('/admin/manage-content')
    return { success: true }
  } catch (error: any) {
    return { error: error.message || 'Failed to update short story' }
  }
}

export async function updateResearchPaper(id: string, formData: FormData) {
  try {
    await requireSuperAdmin()
    
    const title = formData.get('title') as string
    const abstract = formData.get('abstract') as string
    const doi = formData.get('doi') as string
    
    const imageFile = formData.get('coverImage') as File | null
    const pdfFile = formData.get('pdfDocument') as File | null
    
    const data: any = { title, abstract, doi }
    
    if (imageFile && imageFile.size > 0) {
      data.coverImageUrl = await uploadFile(imageFile, 'papers', 'paper-cover')
    }
    if (pdfFile && pdfFile.size > 0) {
      data.downloadUrl = await uploadFile(pdfFile, 'pdfs', 'paper-doc')
    }

    await prisma.researchPaper.update({ where: { id }, data })
    revalidatePath('/')
    revalidatePath('/admin/manage-content')
    return { success: true }
  } catch (error: any) {
    return { error: error.message || 'Failed to update research paper' }
  }
}

export async function updatePoem(id: string, formData: FormData) {
  try {
    await requireSuperAdmin()
    
    const title = formData.get('title') as string
    const content = formData.get('content') as string
    const language = formData.get('language') as string
    
    const imageFile = formData.get('coverImage') as File | null
    const pdfFile = formData.get('pdfDocument') as File | null
    
    const data: any = { title, content, language }
    
    if (imageFile && imageFile.size > 0) {
      data.coverImageUrl = await uploadFile(imageFile, 'poetry', 'poem-cover')
    }
    if (pdfFile && pdfFile.size > 0) {
      data.downloadUrl = await uploadFile(pdfFile, 'pdfs', 'poem-doc')
    }

    await prisma.poem.update({ where: { id }, data })
    revalidatePath('/')
    revalidatePath('/admin/manage-content')
    return { success: true }
  } catch (error: any) {
    return { error: error.message || 'Failed to update poem' }
  }
}

export async function updateArticle(id: string, formData: FormData) {
  try {
    await requireSuperAdmin()
    
    const title = formData.get('title') as string
    const subtitle = formData.get('subtitle') as string
    const content = formData.get('content') as string
    
    const imageFile = formData.get('coverImage') as File | null
    
    const data: any = { title, subtitle, content }
    
    if (imageFile && imageFile.size > 0) {
      data.coverImageUrl = await uploadFile(imageFile, 'articles', 'article-cover')
    }

    await prisma.article.update({ where: { id }, data })
    revalidatePath('/')
    revalidatePath('/admin/manage-content')
    return { success: true }
  } catch (error: any) {
    return { error: error.message || 'Failed to update article' }
  }
}

// USER MANAGEMENT

export async function deleteUser(userId: string) {
  try {
    const admin = await getSessionUser()
    if (!admin || admin.role !== 'SUPER_ADMIN') {
      return { error: 'Unauthorized' }
    }

    // Safety check: Prevent deleting SUPER_ADMIN
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        articles: true,
        books: true,
        poems: true,
        researchPapers: true
      }
    })

    if (!targetUser) return { error: 'User not found' }
    if (targetUser.role === 'SUPER_ADMIN') {
      return { error: 'Action denied: Cannot delete a Super Admin.' }
    }

    // Check if user has published content
    const hasContent = targetUser.articles.length > 0 || targetUser.books.length > 0 || targetUser.poems.length > 0 || targetUser.researchPapers.length > 0
    if (hasContent) {
      return { error: 'Cannot delete user: They have published content (Books, Articles, etc.). Please reassign or delete their content first.' }
    }

    // Cascade delete their personal data in a transaction
    await prisma.$transaction([
      prisma.bookmark.deleteMany({ where: { userId } }),
      prisma.readingHistory.deleteMany({ where: { userId } }),
      prisma.comment.deleteMany({ where: { authorId: userId } }),
      prisma.notification.deleteMany({ where: { userId } }),
      prisma.submission.deleteMany({ where: { userId } }),
      prisma.user.delete({ where: { id: userId } })
    ])

    return { success: true }
  } catch (error) {
    console.error('Error deleting user:', error)
    return { error: 'Internal server error while deleting user' }
  }
}
