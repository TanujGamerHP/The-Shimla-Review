'use client'

import { useState } from 'react'
import { Search, User as UserIcon, Download, ShoppingBag, ShieldCheck, Trash2, Loader2 } from 'lucide-react'
import { deleteUser } from '@/actions/admin'
import { useRouter } from 'next/navigation'

export type UserItem = {
  id: string
  name: string
  email: string
  avatarUrl: string | null
  role: string
  createdAt: Date
  downloads: number
  bookBuys: number
}

export default function UserManagementClient({ initialUsers }: { initialUsers: UserItem[] }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const router = useRouter()

  const roles = ['All', ...Array.from(new Set(initialUsers.map(u => u.role)))]

  const filteredUsers = initialUsers.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === 'All' || user.role === roleFilter

    return matchesSearch && matchesRole
  })

  const handleDelete = async (userId: string, role: string) => {
    if (role === 'SUPER_ADMIN') {
      alert('Action denied: Cannot delete a Super Admin.')
      return
    }
    
    if (!confirm('Are you sure you want to permanently delete this user? This will also wipe their reading history, bookmarks, and comments. This action cannot be undone.')) return
    
    setDeletingId(userId)
    try {
      const res = await deleteUser(userId)
      if (res?.error) {
        alert(res.error)
      } else {
        router.refresh()
      }
    } catch (error) {
      alert('Failed to delete user.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {roles.map(role => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all whitespace-nowrap ${
                roleFilter === role ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              {role === 'All' ? 'All Roles' : role.replace('_', ' ')}
            </button>
          ))}
        </div>
        
        <div className="relative w-full sm:w-64">
          <input 
            type="text" 
            placeholder="Search users..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all text-sm"
          />
          <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Downloads</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Book Buys</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No users found matching your search.
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {user.avatarUrl ? (
                          <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full object-cover bg-gray-100 border border-gray-200" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                            <UserIcon size={20} />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        user.role === 'SUPER_ADMIN' 
                          ? 'bg-purple-50 text-purple-700 border border-purple-100' 
                          : user.role === 'AUTHOR'
                          ? 'bg-blue-50 text-blue-700 border border-blue-100'
                          : 'bg-gray-100 text-gray-600 border border-gray-200'
                      }`}>
                        {user.role === 'SUPER_ADMIN' && <ShieldCheck size={14} />}
                        {user.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center justify-center gap-1.5 text-gray-600">
                        <Download size={16} className="text-gray-400" />
                        <span className="font-medium tabular-nums">{user.downloads}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center justify-center gap-1.5 text-gray-600">
                        <ShoppingBag size={16} className="text-gray-400" />
                        <span className="font-medium tabular-nums">{user.bookBuys}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {new Date(user.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric', month: 'short', day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {user.role !== 'SUPER_ADMIN' && (
                        <button 
                          onClick={() => handleDelete(user.id, user.role)}
                          disabled={deletingId === user.id}
                          className="inline-flex items-center justify-center p-2 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Delete User"
                        >
                          {deletingId === user.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
