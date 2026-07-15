'use client'

import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { usePathname, useSearchParams } from 'next/navigation'
import Image from 'next/image'

export default function Navbar() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const currentTab = searchParams.get('tab') || 'Book'

  const navLinks = [
    { name: 'Books', tabValue: 'Book' },
    { name: 'Notes For Students', tabValue: 'Student Note' },
    { name: 'Research Papers', tabValue: 'Research Paper' },
  ]

  return (
    <nav className="border-b border-gray-100 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Logo */}
        <div className="flex items-center gap-8 shrink-0">
          <Link href="/" className="flex items-center gap-3 group">
            <h1 className="text-2xl font-bold tracking-tight text-primary transition-transform group-hover:scale-105" style={{ fontFamily: 'var(--font-cormorant)', textShadow: '0 0 1px currentColor' }}>
              Sandeep Sharma
            </h1>
          </Link>
        </div>

        {/* Center/Right: Navigation Tabs & Profile */}
        <div className="flex items-center gap-6 shrink-0 ml-auto overflow-x-auto">
          
          <div className="flex items-center gap-4 text-sm font-medium">
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                href={`/?tab=${link.tabValue}`} 
                className={`transition-colors whitespace-nowrap px-2 py-1 border-b-2 ${currentTab === link.tabValue ? 'border-accent text-accent' : 'border-transparent text-gray-600 hover:text-accent'}`}
              >
                {link.name}
              </Link>
            ))}
            
            {/* Emphasized external link */}
            <a 
              href="https://theshimlareview.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="ml-2 whitespace-nowrap px-4 py-1.5 bg-[#185ADB] text-white rounded font-semibold hover:bg-blue-700 transition-colors shadow-sm"
            >
              The Simla Review
            </a>
          </div>

          {user && (
            <>
              <div className="h-6 w-px bg-gray-200 hidden sm:block mx-1"></div>
              <div className="flex items-center gap-3 shrink-0">
                {user.role === 'SUPER_ADMIN' && (
                  <span className="hidden sm:inline-block bg-primary text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide">
                    Super Admin
                  </span>
                )}
                <Link href={user.role === 'SUPER_ADMIN' ? "/admin" : "/profile"} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  <div className="w-10 h-10 rounded-full border-2 border-accent overflow-hidden relative shadow-sm">
                    <Image 
                      src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                      alt={user.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
