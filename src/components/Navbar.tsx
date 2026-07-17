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
    { name: 'Research Papers', tabValue: 'Research Paper' },
    { name: 'Notes For Students', tabValue: 'Student Note' },
    { name: 'Misc Works', tabValue: 'Misc Work' },
  ]

  return (
    <nav className="border-b border-gray-100 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 min-h-16 h-auto flex flex-col md:flex-row items-center justify-between py-3 md:py-0 gap-4 md:gap-0">

        {/* Left: Logo */}
        <div className="flex items-center gap-8 shrink-0 w-full md:w-auto justify-center md:justify-start">
          <Link href="/" className="flex items-center gap-3 group">
            <h1 className="text-3xl font-extrabold tracking-tight text-blue-600 transition-transform group-hover:scale-105" style={{ fontFamily: 'var(--font-cormorant)' }}>
              Sandeep Sharma
            </h1>
          </Link>
        </div>

        {/* Center/Right: Navigation Tabs & Profile */}
        <div className="flex flex-wrap md:flex-nowrap items-center justify-center md:justify-end gap-4 md:gap-6 shrink-0 w-full md:w-auto md:ml-auto">

          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 text-sm font-medium w-full sm:w-auto">
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
              href="https://thesimlareview.com"
              target="_blank"
              rel="noopener noreferrer"
              className="whitespace-nowrap px-4 md:px-5 py-1.5 md:py-2 bg-[#185ADB] text-white rounded-md text-sm md:text-base font-bold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 tracking-wide mt-2 sm:mt-0"
            >
              The Simla Review
            </a>
          </div>

          {user && (
            <>
              <div className="h-6 w-px bg-gray-200 hidden md:block mx-1"></div>
              <div className="flex items-center gap-3 shrink-0 absolute top-4 right-4 md:static">
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
