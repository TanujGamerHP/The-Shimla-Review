export const dynamic = 'force-dynamic';
import { PrismaClient } from '@prisma/client'
import ManageContentClient, { ManageContentItem } from '@/components/ManageContentClient'
import MigrationButton from '@/components/MigrationButton'

const prisma = new PrismaClient()

export default async function ManageContentPage() {
  // Fetch all content concurrently
  const [books, papers, studentNotes, miscWorks] = await Promise.all([
    prisma.book.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.researchPaper.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.studentNote.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.miscWork.findMany({ orderBy: { createdAt: 'desc' } }),
  ])

  // Map into unified array
  const allContent: ManageContentItem[] = [
    ...books.map(b => ({
      id: b.id,
      type: 'Book' as const,
      title: b.title,
      views: b.views,
      downloads: b.downloads,
      slug: b.slug,
      createdAt: b.createdAt
    })),
    ...papers.map(p => ({
      id: p.id,
      type: 'Research Paper' as const,
      title: p.title,
      views: p.views,
      downloads: p.downloads,
      slug: p.slug,
      createdAt: p.createdAt
    })),
    ...studentNotes.map(sn => ({
      id: sn.id,
      type: 'Student Note' as const,
      title: sn.title,
      views: sn.views,
      downloads: sn.downloads,
      slug: sn.slug,
      createdAt: sn.createdAt
    })),
    ...miscWorks.map(mw => ({
      id: mw.id,
      type: 'Misc Work' as const,
      title: mw.title,
      views: mw.views,
      downloads: mw.downloads,
      slug: mw.slug,
      createdAt: mw.createdAt
    }))
  ]

  // Sort unified array globally by date
  allContent.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Manage Published Content</h1>
        <p className="text-gray-500 mt-1">View all published books, research papers, and student notes across the site. You can edit or delete items here.</p>
        <MigrationButton />
      </div>

      <ManageContentClient items={allContent} />
    </div>
  )
}
