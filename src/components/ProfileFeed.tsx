'use client'

import { useState } from 'react'
import PaperItem from '@/components/PaperItem'

export type ProfileFeedItem = {
  id: string
  type: string
  title: string
  abstract: string | null
  institution: string | null
  views: number
  thumbnailUrl: string | null
  createdAt: Date
  slug: string
  downloadUrl?: string | null
  price?: number | null
  purchaseUrl?: string | null
}

export default function ProfileFeed({ items, authorName }: { items: ProfileFeedItem[], authorName: string }) {
  const [activeTab, setActiveTab] = useState('All')
  const [sortBy, setSortBy] = useState('views') // 'views', 'newest', 'oldest'

  // Get unique types
  const types = Array.from(new Set(items.map(item => item.type)))
  const tabs = ['All', ...types]

  const filteredItems = activeTab === 'All' 
    ? items 
    : items.filter(item => item.type === activeTab)

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === 'views') return b.views - a.views
    if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    return 0
  })

  return (
    <div className="flex flex-col">
      
      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-3 mb-10 pb-4 border-b border-gray-100">
        {tabs.map(tab => {
          const isActive = tab === activeTab
          const count = tab === 'All' ? items.length : items.filter(i => i.type === tab).length
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                isActive 
                  ? 'bg-blue-50 text-blue-700 border-blue-100' 
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {tab === 'All' ? 'All' : `${count} ${tab === 'Poetry' || tab === 'The Simla Review' ? tab : tab + 's'}`}
            </button>
          )
        })}
      </div>

      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-gray-500 text-sm font-medium tracking-wide uppercase">
          {activeTab === 'All' ? 'Works' : activeTab === 'Poetry' || activeTab === 'The Simla Review' ? activeTab : `${activeTab}s`} by {authorName}
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
          <p className="text-gray-500 py-8">No uploads in this category.</p>
        ) : (
          sortedItems.map((item) => (
            <PaperItem key={`${item.type}-${item.id}`} paper={item} />
          ))
        )}
      </div>
    </div>
  )
}
