import { PrismaClient } from '@prisma/client'
import { BookOpen, GraduationCap, Feather, FileText } from 'lucide-react'

const prisma = new PrismaClient()

export default async function AdminDashboard() {
  // Fetch real-time total view counts for all content types
  const bookViews = await prisma.book.aggregate({ _sum: { views: true } })
  const paperViews = await prisma.researchPaper.aggregate({ _sum: { views: true } })
  const poemViews = await prisma.poem.aggregate({ _sum: { views: true } })
  const articleViews = await prisma.article.aggregate({ _sum: { views: true } })
  const adminProfile = await prisma.user.findUnique({ where: { email: 'theshimlareview@gmail.com' } })
  const totalFollowers = adminProfile?.followers || 0

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">Welcome to The Shimla Review CMS. Here are the real-time total view counts for all your published content.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {/* Followers */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-500 whitespace-nowrap truncate">Total Followers</p>
            <p className="text-2xl xl:text-3xl font-bold text-gray-900 truncate">{totalFollowers.toLocaleString()}</p>
          </div>
        </div>
        {/* Book Views */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <BookOpen size={24} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-500 whitespace-nowrap truncate">Total Book Views</p>
            <p className="text-2xl xl:text-3xl font-bold text-gray-900 truncate">{bookViews._sum.views?.toLocaleString() || 0}</p>
          </div>
        </div>
        
        {/* Research Paper Views */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
            <GraduationCap size={24} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-500 whitespace-nowrap truncate">Total Paper Views</p>
            <p className="text-2xl xl:text-3xl font-bold text-gray-900 truncate">{paperViews._sum.views?.toLocaleString() || 0}</p>
          </div>
        </div>

        {/* Poetry Views */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <Feather size={24} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-500 whitespace-nowrap truncate">Total Poetry Views</p>
            <p className="text-2xl xl:text-3xl font-bold text-gray-900 truncate">{poemViews._sum.views?.toLocaleString() || 0}</p>
          </div>
        </div>

        {/* Article Views */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
            <FileText size={24} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-500 whitespace-nowrap truncate">Total Article Views</p>
            <p className="text-2xl xl:text-3xl font-bold text-gray-900 truncate">{articleViews._sum.views?.toLocaleString() || 0}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
