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
  const [books, researchPapers, studentNotes] = await Promise.all([
    prisma.book.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.researchPaper.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.studentNote.findMany({ orderBy: { createdAt: 'desc' } })
  ])

  const allItems: ProfileFeedItem[] = [
    ...books.map(b => ({
      id: b.id, type: 'Book', title: b.title, subtitle: b.subtitle, abstract: b.synopsis,
      institution: b.publisher, views: b.views, downloads: b.downloads, thumbnailUrl: b.coverImageUrl,
      createdAt: b.createdAt, slug: b.slug, downloadUrl: b.downloadUrl,
      price: b.price, purchaseUrl: b.purchaseUrl
    })),
    ...researchPapers.map(r => ({
      id: r.id, type: 'Research Paper', title: r.title, subtitle: r.subtitle, abstract: r.abstract,
      institution: r.doi, views: r.views, downloads: r.downloads, thumbnailUrl: r.coverImageUrl || r.previewUrl,
      createdAt: r.createdAt, slug: r.slug, downloadUrl: r.downloadUrl
    })),
    ...studentNotes.map(sn => ({
      id: sn.id, type: 'Student Note', title: sn.title, subtitle: sn.subtitle, abstract: sn.description,
      institution: sn.subject, views: sn.views, downloads: sn.downloads, thumbnailUrl: sn.coverImageUrl,
      createdAt: sn.createdAt, slug: sn.slug, downloadUrl: sn.downloadUrl
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

  return (
    <div className="min-h-screen">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6 md:py-12 grid grid-cols-1 md:grid-cols-[1fr_250px] lg:grid-cols-[1fr_300px] gap-8 md:gap-12 lg:gap-20">
        
        {/* Feed Area */}
        <div className="order-2 md:order-1">
          <ProfileFeed items={allItems} authorName={adminData.name} />
        </div>

        {/* Sidebar */}
        <div className="order-1 md:order-2">
          <HomeProfileClient adminData={adminData} />
        </div>

      </main>

      {/* Footer */}
      <footer className="mt-20 py-8 border-t border-gray-100 text-center text-sm text-gray-400 flex flex-col items-center justify-center gap-2">
        <p>&copy; {new Date().getFullYear()} The Shimla Review. All rights reserved.</p>
        <Link href="/auth/login" className="text-gray-300 hover:text-gray-500 transition-colors text-xs font-medium">
          Admin Login
        </Link>
      </footer>
    </div>
  )
}
