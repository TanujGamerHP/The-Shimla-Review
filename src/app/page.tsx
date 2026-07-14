export const dynamic = 'force-dynamic';
import { PrismaClient } from '@prisma/client'
import Navbar from '@/components/Navbar'
import HomeProfileClient from '@/components/HomeProfileClient'
import BioSection from '@/components/BioSection'
import ProfileFeed, { ProfileFeedItem } from '@/components/ProfileFeed'
import { Bell, MapPin, Mail, Link as LinkIcon, Plus } from 'lucide-react'
import Link from 'next/link'

const prisma = new PrismaClient()

export default async function Home() {
  const user = await prisma.user.findFirst()
  
  if (!user) return <div className="p-10">Database not seeded. Run seed script.</div>

  // Fetch all content types across the site
  const [books, poems, researchPapers, articles] = await Promise.all([
    prisma.book.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.poem.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.researchPaper.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.article.findMany({ orderBy: { createdAt: 'desc' } })
  ])

  const allItems: ProfileFeedItem[] = [
    ...books.map(b => ({
      id: b.id, type: 'Book', title: b.title, abstract: b.synopsis,
      institution: b.publisher, views: b.views, thumbnailUrl: b.coverImageUrl,
      createdAt: b.createdAt, slug: b.slug, downloadUrl: b.downloadUrl,
      price: b.price, purchaseUrl: b.purchaseUrl
    })),
    ...poems.map(p => ({
      id: p.id, type: 'Poetry', title: p.title, abstract: p.content,
      institution: p.language, views: p.views, thumbnailUrl: p.coverImageUrl,
      createdAt: p.createdAt, slug: p.slug, downloadUrl: p.downloadUrl
    })),
    ...researchPapers.map(r => ({
      id: r.id, type: 'Research Paper', title: r.title, abstract: r.abstract,
      institution: r.doi, views: r.views, thumbnailUrl: r.coverImageUrl || r.previewUrl,
      createdAt: r.createdAt, slug: r.slug, downloadUrl: r.downloadUrl
    })),
    ...articles.map(a => ({
      id: a.id, type: 'The Simla Review', title: a.title, abstract: a.subtitle,
      institution: 'Editorial', views: a.views, thumbnailUrl: a.coverImageUrl,
      createdAt: a.createdAt, slug: a.slug, downloadUrl: null
    }))
  ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())


  const adminUser = await prisma.user.findUnique({
    where: { email: 'theshimlareview@gmail.com' }
  })

  const settings = await prisma.settings.findMany({
    where: { key: { in: ['home_followers_display', 'home_views_display'] } }
  })
  const getSetting = (key: string, def: string) => settings.find(s => s.key === key)?.value || def

  const adminData = {
    name: adminUser?.name || 'Sandeep Sharma',
    avatarUrl: adminUser?.avatarUrl || null,
    bio: adminUser?.bio || null,
    followersDisplay: getSetting('home_followers_display', adminUser?.followers?.toString() || '0'),
    viewsDisplay: getSetting('home_views_display', adminUser?.views?.toString() || '0')
  }

  if (!user) return <div className="p-10">Database not seeded. Run seed script.</div>

  return (
    <div className="min-h-screen">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6 md:py-12 grid grid-cols-1 md:grid-cols-[250px_1fr] lg:grid-cols-[300px_1fr] gap-8 md:gap-12 lg:gap-20">
        
        {/* Sidebar */}
        <HomeProfileClient adminData={adminData} />

        {/* Feed Area */}
        <ProfileFeed items={allItems} authorName={adminData.name} />

      </main>

      {/* Footer */}
      <footer className="mt-20 py-8 border-t border-gray-100 text-center text-sm text-gray-400">
        <p>&copy; {new Date().getFullYear()} The Shimla Review. All rights reserved.</p>
      </footer>
    </div>
  )
}
