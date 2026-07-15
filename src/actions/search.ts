'use server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export type SearchResult = {
  id: string
  title: string
  type: string
  slug: string
  url: string
}

export async function searchGlobal(query: string): Promise<SearchResult[]> {
  if (!query || query.trim().length < 1) return []

  const search = query.trim()

  const [books, researchPapers, studentNotes] = await Promise.all([
    prisma.book.findMany({
      where: { title: { contains: search } },
      take: 5
    }),
    prisma.researchPaper.findMany({
      where: { title: { contains: search } },
      take: 5
    }),
    prisma.studentNote.findMany({
      where: { title: { contains: search } },
      take: 5
    })
  ])

  const results: SearchResult[] = [
    ...books.map(b => ({ id: b.id, title: b.title, type: 'Book', slug: b.slug, url: `/work/book/${b.slug}` })),
    ...researchPapers.map(r => ({ id: r.id, title: r.title, type: 'Research Paper', slug: r.slug, url: `/work/research-paper/${r.slug}` })),
    ...studentNotes.map(sn => ({ id: sn.id, title: sn.title, type: 'Student Note', slug: sn.slug, url: `/work/student-note/${sn.slug}` }))
  ]

  // Sort logic: "starts with" matches appear first, followed by "contains" matches.
  const lowerSearch = search.toLowerCase()
  const startsWithMatches = results.filter(r => r.title.toLowerCase().startsWith(lowerSearch))
  const containsMatches = results.filter(r => !r.title.toLowerCase().startsWith(lowerSearch))

  const sortedResults = [...startsWithMatches, ...containsMatches]

  return sortedResults.slice(0, 15)
}
