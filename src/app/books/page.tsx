import { PrismaClient } from '@prisma/client'
import Navbar from '@/components/Navbar'
import Image from 'next/image'
import Link from 'next/link'
import { BookOpen } from 'lucide-react'

const prisma = new PrismaClient()

export default async function BooksPage() {
  const books = await prisma.book.findMany({
    where: { status: 'PUBLISHED' },
    include: { author: true },
    orderBy: { publicationDate: 'desc' }
  })

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="mb-16 text-center max-w-2xl mx-auto">
          <h1 className="text-5xl font-bold font-cormorant text-primary mb-6">Library & Books</h1>
          <p className="text-gray-600 leading-relaxed text-lg">
            Discover a curated collection of literature, research texts, and novels published by our community of authors and researchers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {books.map((book) => (
            <Link key={book.id} href={`/books/${book.slug}`} className="group flex flex-col bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
              <div className="relative h-[400px] w-full bg-gray-100 overflow-hidden">
                {book.coverImageUrl ? (
                  <Image 
                    src={book.coverImageUrl} 
                    alt={book.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-accent/5 text-accent">
                    <BookOpen size={64} opacity={0.2} />
                  </div>
                )}
              </div>
              
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 text-xs text-gray-500 font-medium mb-3 uppercase tracking-wider">
                  <span>{book.publisher || 'Independent'}</span>
                  {book.publicationDate && (
                    <>
                      <span>•</span>
                      <span>{new Date(book.publicationDate).getFullYear()}</span>
                    </>
                  )}
                </div>
                
                <h2 className="text-2xl font-bold font-cormorant text-primary mb-2 group-hover:text-accent transition-colors line-clamp-2">
                  {book.title}
                </h2>
                
                <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed flex-1">
                  {book.synopsis}
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-accent text-xs font-bold">
                      {book.author.name.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{book.author.name}</span>
                  </div>
                  <span className="text-xs text-gray-500">{book.views} views</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
