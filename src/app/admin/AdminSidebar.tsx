'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Library, FileText, Settings, Users, LogOut, FileCheck, Menu, X, Power } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export default function AdminSidebar({ user }: { user: any }) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    router.push('/auth/login')
  }

  const closeSidebar = () => setIsOpen(false)

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-3 left-4 z-50 p-2 bg-white text-gray-800 rounded-md shadow-sm border border-gray-200"
      >
        <Menu size={24} />
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white min-h-screen flex flex-col transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800 shrink-0">
          <Link href="/admin" onClick={closeSidebar} className="font-cormorant font-bold text-xl tracking-wide text-white">
            Admin Panel
          </Link>
          <button onClick={closeSidebar} className="md:hidden text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          {[
            { href: '/admin/home-profile', icon: Settings, label: 'Home Profile' },
            { href: '/admin/content', icon: Library, label: 'Upload Content' },
            { href: '/admin/manage-content', icon: FileText, label: 'Manage Content' },
          ].map((item) => (
            <Link 
              key={item.href}
              href={item.href} 
              onClick={closeSidebar}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${pathname === item.href ? 'bg-slate-800 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}
            >
              <item.icon size={18} /> {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 shrink-0">
          <div className="flex items-center gap-3 px-3 py-3 rounded-lg bg-slate-800">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold shrink-0">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name || 'Admin User'}</p>
              <p className="text-xs text-slate-400 truncate">Super Admin</p>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <Link href="/" className="flex items-center justify-center gap-2 w-full px-3 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors hover:bg-slate-800 rounded-lg">
              <LogOut size={16} /> Exit to Site
            </Link>
            <button 
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 w-full px-3 py-2 text-sm font-medium text-red-400 hover:text-red-300 transition-colors hover:bg-red-400/10 rounded-lg"
            >
              <Power size={16} /> Log Out
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
