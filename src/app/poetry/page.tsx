export const dynamic = 'force-dynamic';
import { PrismaClient } from '@prisma/client'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { Feather, PlayCircle } from 'lucide-react'

const prisma = new PrismaClient()

export default async function PoetryPage() {
  const poems = await prisma.poem.findMany({
    where: { status: 'PUBLISHED' },
    include: { author: true },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar />
      
      <main className="max-w-5xl mx-auto px-4 py-16">
        <div className="mb-16 text-center max-w-2xl mx-auto">
          <Feather className="mx-auto mb-6 text-accent" size={32} />
          <h1 className="text-5xl font-bold font-cormorant text-primary mb-6">Poetry Collection</h1>
          <p className="text-gray-600 leading-relaxed text-lg">
            Verses from the valleys. Explore our curated selection of poems, ghazals, and spoken word pieces.
          </p>
        </div>

        <div className="space-y-8">
          {poems.map((poem) => (
            <article key={poem.id} className="bg-white rounded-xl p-8 md:p-12 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-accent/5 text-accent text-xs font-semibold uppercase tracking-wider rounded-full">
                      {poem.language || 'English'}
                    </span>
                    {poem.audioUrl && (
                      <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full">
                        <PlayCircle size={14} /> Audio Available
                      </span>
                    )}
                  </div>
                  
                  <Link href={`/poetry/${poem.slug}`}>
                    <h2 className="text-3xl font-bold font-cormorant text-primary mb-6 hover:text-accent transition-colors">
                      {poem.title}
                    </h2>
                  </Link>

                  <div className="prose prose-sm prose-gray max-w-none font-cormorant text-xl leading-loose italic text-gray-700 whitespace-pre-wrap line-clamp-[6]">
                    {poem.content}
                  </div>
                  
                  <div className="mt-8 flex items-center justify-between pt-6 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold">
                        {poem.author.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{poem.author.name}</p>
                        <p className="text-xs text-gray-500">{new Date(poem.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <Link href={`/poetry/${poem.slug}`} className="text-sm font-medium text-accent hover:underline">
                      Read full poem
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  )
}
