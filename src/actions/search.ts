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

  const [books, poems, researchPapers, articles] = await Promise.all([
    prisma.book.findMany({
      where: { title: { contains: search } },
      take: 5
    }),
    prisma.poem.findMany({
      where: { title: { contains: search } },
      take: 5
    }),
    prisma.researchPaper.findMany({
      where: { title: { contains: search } },
      take: 5
    }),
    prisma.article.findMany({
      where: { title: { contains: search } },
      take: 5
    })
  ])

  const results: SearchResult[] = [
    ...books.map(b => ({ id: b.id, title: b.title, type: 'Book', slug: b.slug, url: `/work/book/${b.slug}` })),
    ...poems.map(p => ({ id: p.id, title: p.title, type: 'Poetry', slug: p.slug, url: `/work/poetry/${p.slug}` })),
    ...researchPapers.map(r => ({ id: r.id, title: r.title, type: 'Research Paper', slug: r.slug, url: `/work/research-paper/${r.slug}` })),
    ...articles.map(a => ({ id: a.id, title: a.title, type: 'Article', slug: a.slug, url: `/work/article/${a.slug}` }))
  ]

  // Sort logic: "starts with" matches appear first, followed by "contains" matches.
  const lowerSearch = search.toLowerCase()
  const startsWithMatches = results.filter(r => r.title.toLowerCase().startsWith(lowerSearch))
  const containsMatches = results.filter(r => !r.title.toLowerCase().startsWith(lowerSearch))

  const sortedResults = [...startsWithMatches, ...containsMatches]

  return sortedResults.slice(0, 15)
}
