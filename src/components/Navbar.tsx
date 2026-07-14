'use client'

import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { usePathname } from 'next/navigation'
import { BookOpen, Feather, GraduationCap, LayoutDashboard, LogOut, User } from 'lucide-react'
import Image from 'next/image'
import SearchBox from '@/components/SearchBox'

export default function Navbar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  const navLinks = [
    { name: 'Books', href: '/books', icon: BookOpen },
    { name: 'Poetry', href: '/poetry', icon: Feather },
    { name: 'Research', href: '/research', icon: GraduationCap },
  ]

  return (
    <nav className="border-b border-gray-100 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Logo */}
        <div className="flex items-center gap-8 shrink-0">
          <Link href="/" className="flex items-center gap-3 group">
            <h1 className="text-2xl font-bold font-sans tracking-tight text-primary transition-transform group-hover:scale-105" style={{ textShadow: '0 0 1px currentColor' }}>
              Prof. Sandeep Sharma
            </h1>
          </Link>
        </div>

        {/* Center: Search */}
        <div className="flex-1 flex justify-center px-4">
          <SearchBox />
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4 shrink-0">
          
          <Link href="/submit" className="hidden sm:block text-gray-600 hover:text-primary font-medium text-sm px-3 py-2 transition-colors">
            Submit Poetry
          </Link>

          <div className="h-6 w-px bg-gray-200 hidden sm:block mx-1"></div>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
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
            ) : (
              <>
                <Link 
                  href="/auth/login" 
                  className="text-gray-600 hover:text-accent font-medium text-xs sm:text-sm px-2 sm:px-4 py-2 transition-all"
                >
                  Log In
                </Link>
                <Link 
                  href="/auth/signup" 
                  className="bg-accent hover:bg-blue-700 text-white font-medium text-xs sm:text-sm px-4 sm:px-5 py-1.5 sm:py-2 rounded-full shadow-sm transition-all hover:shadow hover:scale-105"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
