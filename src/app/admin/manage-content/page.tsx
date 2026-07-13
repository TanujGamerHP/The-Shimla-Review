export const dynamic = 'force-dynamic';
import { PrismaClient } from '@prisma/client'
import ManageContentClient, { ManageContentItem } from '@/components/ManageContentClient'

const prisma = new PrismaClient()

export default async function ManageContentPage() {
  // Fetch all content concurrently
  const [books, papers, poems, journals, articles] = await Promise.all([
    prisma.book.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.researchPaper.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.poem.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.journal.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.article.findMany({ orderBy: { createdAt: 'desc' } })
  ])

  // Map into unified array
  const allContent: ManageContentItem[] = [
    ...books.map(b => ({
      id: b.id,
      type: 'Book' as const,
      title: b.title,
      views: b.views,
      slug: b.slug,
      createdAt: b.createdAt
    })),
    ...papers.map(p => ({
      id: p.id,
      type: 'Research Paper' as const,
      title: p.title,
      views: p.views,
      slug: p.slug,
      createdAt: p.createdAt
    })),
    ...poems.map(p => ({
      id: p.id,
      type: 'Poetry' as const,
      title: p.title,
      views: p.views,
      slug: p.slug,
      createdAt: p.createdAt
    })),
    ...journals.map(j => ({
      id: j.id,
      type: 'Short Story' as const,
      title: j.title,
      views: j.views,
      slug: j.slug,
      createdAt: j.createdAt
    })),
    ...articles.map(a => ({
      id: a.id,
      type: 'The Simla Review' as const,
      title: a.title,
      views: a.views,
      slug: a.slug,
      createdAt: a.createdAt
    }))
  ]

  // Sort unified array globally by date
  allContent.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Manage Published Content</h1>
        <p className="text-gray-500 mt-1">View all published books, research papers, poetry, short stories, and articles across the site. You can edit or delete items here.</p>
      </div>

      <ManageContentClient items={allContent} />
    </div>
  )
}
