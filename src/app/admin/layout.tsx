import { redirect } from 'next/navigation'
import { getSessionUser } from '@/actions/auth'
import Link from 'next/link'
import { LayoutDashboard, Library, FileText, Settings, Users, LogOut, FileCheck } from 'lucide-react'
import { cookies } from 'next/headers'
import AdminSidebar from './AdminSidebar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getSessionUser()

  if (!user || user.email !== 'theshimlareview@gmail.com' || user.role !== 'SUPER_ADMIN') {
    redirect('/')
  }

  // Vault Check
  const cookieStore = await cookies()
  const isUnlocked = cookieStore.get('admin_unlocked')?.value === 'true'

  if (!isUnlocked) {
    redirect('/vault')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Admin Sidebar */}
      <AdminSidebar user={user} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-16 md:px-8 shrink-0">
          <h2 className="text-lg font-semibold text-gray-800">CMS Control Center</h2>
        </header>
        
        <div className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
