import { PrismaClient } from '@prisma/client'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { GraduationCap, FileText, Download } from 'lucide-react'

const prisma = new PrismaClient()

export default async function ResearchPage() {
  const papers = await prisma.researchPaper.findMany({
    where: { status: 'PUBLISHED' },
    include: { author: true },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-200 pb-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4 text-accent">
              <GraduationCap size={28} />
              <span className="font-semibold tracking-widest uppercase text-sm">Academic</span>
            </div>
            <h1 className="text-5xl font-bold font-cormorant text-primary mb-4">Research & Journals</h1>
            <p className="text-gray-600 text-lg">Peer-reviewed papers, translation studies, and academic journals.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <select className="border border-gray-200 bg-white rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20">
              <option>All Topics</option>
              <option>Translation Studies</option>
              <option>Sociolinguistics</option>
              <option>Himalayan Culture</option>
            </select>
            <select className="border border-gray-200 bg-white rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20">
              <option>Latest</option>
              <option>Most Cited</option>
              <option>Most Downloaded</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {papers.map((paper) => (
            <article key={paper.id} className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-gray-100 hover:border-accent/30 transition-colors flex flex-col md:flex-row gap-8">
              <div className="flex-1">
                <Link href={`/research/${paper.slug}`}>
                  <h2 className="text-2xl font-bold font-cormorant text-primary mb-3 hover:text-accent transition-colors">
                    {paper.title}
                  </h2>
                </Link>
                
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500 mb-6">
                  <span className="font-medium text-gray-900">{paper.author.name}</span>
                  <span>Published {new Date(paper.createdAt).toLocaleDateString()}</span>
                  {paper.doi && <span>DOI: {paper.doi}</span>}
                </div>

                <div className="mb-6">
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Abstract</h4>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                    {paper.abstract}
                  </p>
                </div>
                
                <div className="flex flex-wrap items-center gap-4">
                  <button className="flex items-center gap-2 bg-primary hover:bg-black text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                    <FileText size={16} /> Read Online
                  </button>
                  <button className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                    <Download size={16} /> Download PDF
                  </button>
                </div>
              </div>
              
              <div className="hidden lg:flex flex-col items-end justify-between border-l border-gray-100 pl-8 w-48 shrink-0">
                <div className="text-right">
                  <p className="text-3xl font-bold text-gray-900 mb-1">{paper.views}</p>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Views</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-gray-900 mb-1">0</p>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Citations</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  )
}
