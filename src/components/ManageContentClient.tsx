'use client'

import { useState } from 'react'
import { Trash2, ExternalLink, FileText, Loader2, Search, Edit } from 'lucide-react'
import Link from 'next/link'
import { deleteBook, deleteResearchPaper, deleteStudentNote, deleteMiscWork } from '@/actions/admin'

export type ManageContentItem = {
  id: string
  type: 'Book' | 'Research Paper' | 'Student Note' | 'Misc Work'
  title: string
  views: number
  downloads: number
  slug: string
  createdAt: Date
}

export default function ManageContentClient({ items }: { items: ManageContentItem[] }) {
  const [activeTab, setActiveTab] = useState<'All' | 'Book' | 'Research Paper' | 'Student Note' | 'Misc Work'>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const tabs = ['All', 'Book', 'Research Paper', 'Student Note', 'Misc Work']

  const filteredItems = items.filter(item => {
    const matchesTab = activeTab === 'All' || item.type === activeTab
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTab && matchesSearch
  })

  const handleDelete = async (id: string, type: string) => {
    if (!confirm('Are you sure you want to permanently delete this content? This action cannot be undone.')) return
    
    setDeletingId(id)
    try {
      if (type === 'Book') await deleteBook(id)
      else if (type === 'Research Paper') await deleteResearchPaper(id)
      else if (type === 'Student Note') await deleteStudentNote(id)
      else if (type === 'Misc Work') await deleteMiscWork(id)
    } catch (error) {
      alert('Failed to delete content.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all whitespace-nowrap ${
                activeTab === tab ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              {tab === 'Student Note' ? 'Notes For Students' : (tab === 'Book' ? 'Books' : tab === 'Research Paper' ? 'Research Papers' : tab)}
            </button>
          ))}
        </div>
        
        <div className="relative w-full sm:w-64">
          <input 
            type="text" 
            placeholder="Search by title..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all text-sm"
          />
          <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
        </div>
      </div>

      {/* Content List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center text-gray-500 flex flex-col items-center">
            <FileText size={32} className="mb-3 text-gray-300" />
            <p>No content found matching your filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Views</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Downloaders</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredItems.map(item => (
                  <tr key={`${item.type}-${item.id}`} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900 line-clamp-1">{item.title}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full whitespace-nowrap">
                        {item.type === 'Student Note' ? 'Notes For Students' : item.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {item.views}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {item.downloads}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right space-x-3 whitespace-nowrap">
                      <Link 
                        href={`/work/${item.type.toLowerCase().replace(' ', '-')}/${item.slug}`} 
                        target="_blank"
                        className="inline-flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
                        title="View on site"
                      >
                        <ExternalLink size={18} />
                      </Link>
                      <Link 
                        href={`/admin/manage-content/edit/${item.type.toLowerCase().replace(' ', '-')}/${item.id}`} 
                        className="inline-flex items-center text-emerald-600 hover:text-emerald-800 transition-colors"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </Link>
                      <button 
                        onClick={() => handleDelete(item.id, item.type)}
                        disabled={deletingId === item.id}
                        className="inline-flex items-center text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        {deletingId === item.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
