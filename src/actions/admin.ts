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
    const subtitle = formData.get('subtitle') as string
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
        subtitle,
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

export async function createResearchPaper(formData: FormData) {
  try {
    const admin = await requireSuperAdmin()
    
    const title = formData.get('title') as string
    const subtitle = formData.get('subtitle') as string
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
        subtitle,
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

export async function createStudentNote(formData: FormData) {
  try {
    const admin = await requireSuperAdmin()
    
    const title = formData.get('title') as string
    const subtitle = formData.get('subtitle') as string
    const description = formData.get('description') as string
    const subject = formData.get('subject') as string
    
    const imageFile = formData.get('coverImage') as File
    const pdfFile = formData.get('pdfDocument') as File
    
    const coverImageUrl = await uploadFile(imageFile, 'student-notes', 'note-cover')
    const downloadUrl = await uploadFile(pdfFile, 'pdfs', 'note-doc')

    const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}-${Math.random().toString(36).substring(2, 8)}`

    await prisma.studentNote.create({
      data: {
        title,
        subtitle,
        description,
        subject,
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
    return { error: error.message || 'Failed to create student note' }
  }
}

export async function createMiscWork(formData: FormData) {
  try {
    const admin = await requireSuperAdmin()
    
    const title = formData.get('title') as string
    const subtitle = formData.get('subtitle') as string
    const description = formData.get('description') as string
    const subject = formData.get('subject') as string
    
    const imageFile = formData.get('coverImage') as File
    const pdfFile = formData.get('pdfDocument') as File
    
    const coverImageUrl = await uploadFile(imageFile, 'misc-works', 'misc-cover')
    const downloadUrl = await uploadFile(pdfFile, 'pdfs', 'misc-doc')

    const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}-${Math.random().toString(36).substring(2, 8)}`

    await prisma.miscWork.create({
      data: {
        title,
        subtitle,
        description,
        subject,
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
    return { error: error.message || 'Failed to create misc work' }
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

export async function deleteStudentNote(id: string) {
  try {
    await requireSuperAdmin()
    await prisma.studentNote.delete({ where: { id } })
    revalidatePath('/')
    revalidatePath('/admin/manage-content')
    return { success: true }
  } catch (error: any) {
    return { error: error.message || 'Failed to delete student note' }
  }
}

export async function deleteMiscWork(id: string) {
  try {
    await requireSuperAdmin()
    await prisma.miscWork.delete({ where: { id } })
    revalidatePath('/')
    revalidatePath('/admin/manage-content')
    return { success: true }
  } catch (error: any) {
    return { error: error.message || 'Failed to delete misc work' }
  }
}

export async function updateBook(id: string, formData: FormData) {
  try {
    await requireSuperAdmin()
    
    const title = formData.get('title') as string
    const subtitle = formData.get('subtitle') as string
    const synopsis = formData.get('synopsis') as string
    const priceStr = formData.get('price') as string
    const price = priceStr ? parseFloat(priceStr) : null
    const purchaseUrl = formData.get('purchaseUrl') as string | null
    
    const imageFile = formData.get('coverImage') as File | null
    const pdfFile = formData.get('pdfDocument') as File | null
    
    const data: any = { title, subtitle, synopsis, price, purchaseUrl }
    
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

export async function updateResearchPaper(id: string, formData: FormData) {
  try {
    await requireSuperAdmin()
    
    const title = formData.get('title') as string
    const subtitle = formData.get('subtitle') as string
    const abstract = formData.get('abstract') as string
    const doi = formData.get('doi') as string
    
    const imageFile = formData.get('coverImage') as File | null
    const pdfFile = formData.get('pdfDocument') as File | null
    
    const data: any = { title, subtitle, abstract, doi }
    
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

export async function updateStudentNote(id: string, formData: FormData) {
  try {
    await requireSuperAdmin()
    
    const title = formData.get('title') as string
    const subtitle = formData.get('subtitle') as string
    const description = formData.get('description') as string
    const subject = formData.get('subject') as string
    
    const imageFile = formData.get('coverImage') as File | null
    const pdfFile = formData.get('pdfDocument') as File | null
    
    const data: any = { title, subtitle, description, subject }
    
    if (imageFile && imageFile.size > 0) {
      data.coverImageUrl = await uploadFile(imageFile, 'student-notes', 'note-cover')
    }
    if (pdfFile && pdfFile.size > 0) {
      data.downloadUrl = await uploadFile(pdfFile, 'pdfs', 'note-doc')
    }

    await prisma.studentNote.update({ where: { id }, data })
    revalidatePath('/')
    revalidatePath('/admin/manage-content')
    return { success: true }
  } catch (error: any) {
    return { error: error.message || 'Failed to update student note' }
  }
}

export async function updateMiscWork(id: string, formData: FormData) {
  try {
    await requireSuperAdmin()
    
    const title = formData.get('title') as string
    const subtitle = formData.get('subtitle') as string
    const description = formData.get('description') as string
    const subject = formData.get('subject') as string
    
    const imageFile = formData.get('coverImage') as File | null
    const pdfFile = formData.get('pdfDocument') as File | null
    
    const data: any = { title, subtitle, description, subject }
    
    if (imageFile && imageFile.size > 0) {
      data.coverImageUrl = await uploadFile(imageFile, 'misc-works', 'misc-cover')
    }
    if (pdfFile && pdfFile.size > 0) {
      data.downloadUrl = await uploadFile(pdfFile, 'pdfs', 'misc-doc')
    }

    await prisma.miscWork.update({ where: { id }, data })
    revalidatePath('/')
    revalidatePath('/admin/manage-content')
    return { success: true }
  } catch (error: any) {
    return { error: error.message || 'Failed to update misc work' }
  }
}

export async function incrementDownloads(id: string, type: 'book' | 'paper' | 'studentNote' | 'miscWork') {
  try {
    if (type === 'book') {
      await prisma.book.update({
        where: { id },
        data: { downloads: { increment: 1 } }
      })
    } else if (type === 'paper') {
      await prisma.researchPaper.update({
        where: { id },
        data: { downloads: { increment: 1 } }
      })
    } else if (type === 'studentNote') {
      await prisma.studentNote.update({
        where: { id },
        data: { downloads: { increment: 1 } }
      })
    } else if (type === 'miscWork') {
      await prisma.miscWork.update({
        where: { id },
        data: { downloads: { increment: 1 } }
      })
    }
    return { success: true }
  } catch (error: any) {
    console.error('Failed to increment downloads:', error)
    return { error: 'Failed to track download' }
  }
}
