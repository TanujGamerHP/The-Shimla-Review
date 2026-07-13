import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Column: Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96 relative pb-12">
          
          <Link href="/" className="absolute -top-20 left-0 flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors">
            <ArrowLeft size={16} /> Back to home
          </Link>

          {children}

        </div>
      </div>

      {/* Right Column: Premium Image & Quote */}
      <div className="hidden lg:block relative w-0 flex-1 bg-primary">
        <Image
          className="absolute inset-0 h-full w-full object-cover opacity-80 mix-blend-overlay"
          src="https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&w=1600&q=80"
          alt="Shimla Mountains"
          fill
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-16 text-white">
          <blockquote className="space-y-6">
            <p className="text-2xl font-cormorant font-medium leading-relaxed max-w-2xl text-blue-50">
              "Literature is the safe and traditional vehicle through which we learn about the world and pass on values from one generation to the next. The mountains hold these stories."
            </p>
            <footer className="text-sm font-semibold tracking-wider uppercase text-blue-200">
              The Shimla Review
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
  )
}
