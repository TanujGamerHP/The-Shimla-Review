'use client'

import { useSearchParams } from 'next/navigation'
import PaperItem from '@/components/PaperItem'
import { useState } from 'react'

export type ProfileFeedItem = {
  id: string
  type: string
  title: string
  subtitle?: string | null
  abstract: string | null
  institution: string | null
  views: number
  downloads?: number
  thumbnailUrl: string | null
  createdAt: Date
  slug: string
  downloadUrl?: string | null
  price?: number | null
  purchaseUrl?: string | null
}

export default function ProfileFeed({ items, authorName }: { items: ProfileFeedItem[], authorName: string }) {
  const searchParams = useSearchParams()
  const activeTab = searchParams.get('tab') || 'Book'
  const [sortBy, setSortBy] = useState('views') // 'views', 'newest', 'oldest'

  const filteredItems = items.filter(item => item.type === activeTab)

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === 'views') return b.views - a.views
    if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    return 0
  })

  return (
    <div className="flex flex-col">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-gray-500 text-sm font-medium tracking-wide uppercase">
          {activeTab}s by {authorName}
          <span className="text-gray-400 text-xs ml-2 normal-case">({sortedItems.length} items)</span>
        </h3>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="font-medium">Sort by:</span>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="border-gray-200 rounded-md text-sm py-1 pl-2 pr-8 focus:ring-accent focus:border-accent bg-white shadow-sm cursor-pointer outline-none"
          >
            <option value="views">Highest Views</option>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Item List */}
      <div className="flex flex-col">
        {sortedItems.length === 0 ? (
          <p className="text-gray-500 py-8">No uploads in this category yet.</p>
        ) : (
          sortedItems.map((item) => (
            <PaperItem key={`${item.type}-${item.id}`} paper={item} />
          ))
        )}
      </div>
    </div>
  )
}
