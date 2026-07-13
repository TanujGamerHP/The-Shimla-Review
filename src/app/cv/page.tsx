export const dynamic = 'force-dynamic';
import Link from 'next/link'
import { Download, ArrowLeft } from 'lucide-react'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const metadata = {
  title: 'Curriculum Vitae - Sandeep Sharma',
}

export default async function CVPage() {
  const adminUser = await prisma.user.findUnique({
    where: { email: 'theshimlareview@gmail.com' }
  })
  
  const avatarUrl = adminUser?.avatarUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"

  return (
    <div className="min-h-screen bg-[#f3f3f3] flex flex-col font-sans">
      
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 md:px-6 sticky top-0 z-10">
        
        {/* Left: Avatar & Info */}
        <div className="flex items-center gap-3 w-1/3">
          <Link href="/" className="mr-2 text-gray-400 hover:text-gray-700 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-gray-100 hidden sm:block">
            <img 
              src={avatarUrl} 
              alt="Sandeep Sharma" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="hidden md:block leading-tight">
            <h2 className="text-sm font-semibold text-gray-900">Sandeep Sharma</h2>
            <p className="text-[11px] text-gray-500">Semiotics, Education, and Social Sciences</p>
          </div>
        </div>

        {/* Center: Title */}
        <div className="flex-1 text-center truncate px-4">
          <h1 className="text-sm font-semibold text-gray-800">Sandeep Sharma - Curriculum Vitae</h1>
        </div>

        {/* Right: Download Button */}
        <div className="w-1/3 flex justify-end">
          <a 
            href="/uploads/cv.pdf" 
            download="Sandeep_Sharma_CV.pdf"
            className="bg-[#228b22] hover:bg-[#1a6b1a] text-white text-xs font-bold px-4 py-2 rounded flex items-center gap-2 transition-colors uppercase tracking-wider"
          >
            <Download size={14} strokeWidth={3} />
            Download
          </a>
        </div>
      </header>

      {/* PDF Viewer Area */}
      <main className="flex-1 w-full max-w-5xl mx-auto p-4 md:p-8 flex flex-col shadow-2xl">
        <object 
          data="/uploads/cv.pdf" 
          type="application/pdf" 
          className="w-full h-[85vh] rounded-md bg-white"
        >
          <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-4 bg-white rounded-md">
            <p>Your browser does not support PDF viewing.</p>
            <a href="/uploads/cv.pdf" download className="text-blue-600 hover:underline">Click here to download the PDF instead.</a>
          </div>
        </object>
      </main>

    </div>
  )
}
