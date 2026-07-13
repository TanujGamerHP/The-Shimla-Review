import { PrismaClient } from '@prisma/client'
import { redirect } from 'next/navigation'
import Navbar from '@/components/Navbar'
import WorkDetailClient from '@/components/WorkDetailClient'

const prisma = new PrismaClient()

export default async function WorkPage({ params }: { params: Promise<{ type: string, slug: string }> }) {
  const { type, slug } = await params
  
  let item = null
  let recommendations: any[] = []
  let displayType = ''

  if (type === 'book') {
    item = await prisma.book.findUnique({ where: { slug }, include: { author: true } })
    if (item) recommendations = await prisma.book.findMany({ where: { id: { not: item.id }, status: 'PUBLISHED' }, take: 3, orderBy: { views: 'desc' } })
    displayType = 'Book'
  } else if (type === 'short-story') {
    item = await prisma.journal.findUnique({ where: { slug } })
    if (item) recommendations = await prisma.journal.findMany({ where: { id: { not: item.id }, status: 'PUBLISHED' }, take: 3, orderBy: { views: 'desc' } })
    displayType = 'Short Story'
  } else if (type === 'research-paper') {
    item = await prisma.researchPaper.findUnique({ where: { slug }, include: { author: true } })
    if (item) recommendations = await prisma.researchPaper.findMany({ where: { id: { not: item.id }, status: 'PUBLISHED' }, take: 3, orderBy: { views: 'desc' } })
    displayType = 'Research Paper'
  } else if (type === 'poetry') {
    item = await prisma.poem.findUnique({ where: { slug }, include: { author: true } })
    if (item) recommendations = await prisma.poem.findMany({ where: { id: { not: item.id }, status: 'PUBLISHED' }, take: 3, orderBy: { views: 'desc' } })
    displayType = 'Poetry'
  }

  if (!item) {
    redirect('/')
  }

  // Author info (Journals don't have author relation in schema, so we default to super admin)
  let author = (item as any).author
  if (!author) {
    author = await prisma.user.findUnique({ where: { email: 'theshimlareview@gmail.com' } })
  }

  // Normalize item data for the client component
  const normalizedItem = {
    id: item.id,
    type: displayType,
    title: item.title,
    abstract: (item as any).abstract || (item as any).synopsis || (item as any).content || (item as any).editorialBoard,
    meta: (item as any).doi || (item as any).publisher || (item as any).language || ((item as any).volume ? `Vol ${(item as any).volume}, Issue ${(item as any).issue}` : null),
    views: item.views,
    thumbnailUrl: item.coverImageUrl || (item as any).previewUrl || null,
    downloadUrl: item.downloadUrl || null,
    createdAt: item.createdAt,
    price: (item as any).price
  }

  const normalizedRecommendations = recommendations.map(r => ({
    title: r.title,
    slug: r.slug,
    type: displayType.toLowerCase().replace(' ', '-'),
    thumbnailUrl: r.coverImageUrl || r.previewUrl || null
  }))

  const authorInfo = {
    name: author?.name || 'Sandeep Sharma',
    avatarUrl: author?.avatarUrl || null,
    bio: author?.bio || 'Associate Editor of the journals in Translation...',
    followers: author?.followers ?? 0,
    following: author?.following ?? 0,
    views: author?.views ?? 0,
    papers: 48
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <WorkDetailClient 
          item={normalizedItem} 
          author={authorInfo} 
          recommendations={normalizedRecommendations} 
        />
      </main>
      
      <footer className="mt-20 py-8 border-t border-gray-100 text-center text-sm text-gray-400">
        <p>&copy; {new Date().getFullYear()} The Shimla Review. All rights reserved.</p>
      </footer>
    </div>
  )
}
