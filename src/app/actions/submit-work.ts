'use server'

import { PrismaClient } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'

const prisma = new PrismaClient()

function generateTrackingId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let id = 'TSR-'
  for (let i = 0; i < 8; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return id
}

export async function submitWork(formData: any) {
  try {
    const trackingId = generateTrackingId()
    
    // Simulate email confirmation (this would normally send a real email using SendGrid/Resend)
    console.log(`Sending confirmation email to ${formData.email} for submission ${trackingId}`)

    const submission = await prisma.submission.create({
      data: {
        trackingId,
        fullName: formData.fullName,
        authorBio: formData.authorBio,
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
        city: formData.city,
        submissionType: formData.submissionType,
        category: formData.category,
        language: formData.language,
        title: formData.title,
        subtitle: formData.subtitle,
        description: formData.description,
        keywords: formData.keywords,
        wordCount: parseInt(formData.wordCount) || null,
        readingTime: parseInt(formData.readingTime) || null,
        consentGiven: formData.consentGiven,
        copyrightDeclared: formData.copyrightDeclared,
        originalWork: formData.originalWork,
        // Optional file URL mappings from Supabase would go here
      }
    })

    return { success: true, trackingId: submission.trackingId }
  } catch (error) {
    console.error("Submission error:", error)
    return { success: false, error: "Failed to submit your work." }
  }
}
