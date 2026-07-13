'use client'

import { useState, useEffect, useRef } from 'react'
import { incrementView } from '@/app/actions/increment-view'
import { Download, FileText, Quote, Sparkles, Bookmark, Share2, Eye, FileOutput, UserPlus, MessageCircle } from 'lucide-react'
import Link from 'next/link'

interface WorkDetailProps {
  item: {
    id: string
    type: string
    title: string
    abstract: string | null
    meta: string | null
    views: number
    thumbnailUrl: string | null
    downloadUrl: string | null
    createdAt: Date
    price?: number
  }
  author: {
    name: string
    avatarUrl: string | null
    bio: string
    followers: number
    papers: number
  }
  recommendations: {
    title: string
    slug: string
    type: string
    thumbnailUrl: string | null
  }[]
}

export default function WorkDetailClient({ item, author, recommendations }: WorkDetailProps) {
  const [views, setViews] = useState(item.views)
  const [isClicking, setIsClicking] = useState(false)
  const lastIncrementedId = useRef<string | null>(null)

  useEffect(() => {
    // Record a view automatically when someone visits the page
    if (lastIncrementedId.current === item.id) return
    lastIncrementedId.current = item.id
    incrementView(item.id)
    // We intentionally don't update local state here because the 
    // server might have already counted it in the initial render, 
    // but this ensures the DB gets ticked up for the next visitor.
  }, [item.id])

  const handleDownloadClick = async (forceDownload: boolean) => {
    if (isClicking || !item.downloadUrl) return
    setIsClicking(true)
    
    setViews(prev => prev + 1)
    await incrementView(item.id)
    
    if (forceDownload) {
      // Force download logic via anchor tag
      const link = document.createElement('a')
      link.href = item.downloadUrl
      link.download = `${item.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else {
      // Just open in new tab
      window.open(item.downloadUrl, '_blank')
    }
    
    setIsClicking(false)
  }

  // Auto-link utility
  const renderTextWithLinks = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, i) => {
      if (part.match(urlRegex)) {
        return (
          <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
            {part}
          </a>
        )
      }
      return part;
    });
  }

  return (
    <div className="flex flex-col lg:flex-row gap-12 animate-in fade-in duration-500 relative">
      
      {/* Left / Main Column */}
      <div className="flex-1 w-full max-w-4xl">
        
        {/* Breadcrumbs */}
        <div className="text-sm text-gray-500 mb-4 flex items-center gap-2">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span>›</span>
          <span>{item.type}</span>
          {item.meta && (
            <>
              <span>›</span>
              <span className="truncate max-w-[200px]">{item.meta}</span>
            </>
          )}
        </div>

        {/* Title & Meta */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">{item.title}</h1>
        
        <div className="flex items-center gap-6 text-sm text-gray-600 mb-10 font-medium">
          {item.meta && <span>{item.meta}</span>}
          <div className="flex items-center gap-1.5">
            <Eye size={16} />
            <span>{views.toLocaleString()} views</span>
          </div>
          {item.price && <span>₹{item.price}</span>}
        </div>

        {/* Mobile floating cover image (shows only on small screens) */}
        <div className="lg:hidden w-full max-w-xs mx-auto mb-8 bg-white p-2 rounded-xl shadow-lg border border-gray-100">
          {item.thumbnailUrl ? (
            <img src={item.thumbnailUrl} alt="Cover" className="w-full h-auto object-cover rounded-lg" />
          ) : (
            <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">No Cover</div>
          )}
        </div>

        {/* Action Buttons Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-6 border-y border-gray-200 mb-12">
          <div className="flex flex-wrap items-center gap-3">
            <button 
              onClick={() => handleDownloadClick(false)}
              disabled={!item.downloadUrl}
              className="bg-[#0f3b8e] hover:bg-[#0a2863] text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileText size={16} />
              See full PDF
            </button>
            <button 
              onClick={() => handleDownloadClick(true)}
              disabled={!item.downloadUrl}
              className="border border-[#0f3b8e] text-[#0f3b8e] hover:bg-blue-50 px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download size={16} />
              Download PDF
            </button>
            <button className="border border-[#0f3b8e] text-[#0f3b8e] hover:bg-blue-50 px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2">
              <Quote size={16} />
              Cite
            </button>
            <button className="border border-[#0f3b8e] text-[#0f3b8e] hover:bg-blue-50 px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2">
              <Sparkles size={16} />
              Summarize
            </button>
          </div>
          
          <div className="flex items-center gap-4 text-sm font-medium text-[#0f3b8e]">
            <button className="flex items-center gap-1.5 hover:text-[#0a2863] transition-colors">
              <Bookmark size={16} />
              Save to Library
            </button>
            <button className="flex items-center gap-1.5 hover:text-[#0a2863] transition-colors">
              <Share2 size={16} />
              Share
            </button>
          </div>
        </div>

        {/* Abstract */}
        <div className="mb-16">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Abstract</h2>
          {item.abstract ? (
            <div className="text-gray-800 leading-relaxed space-y-4 whitespace-pre-wrap">
              {renderTextWithLinks(item.abstract)}
            </div>
          ) : (
            <p className="text-gray-500 italic">No abstract available.</p>
          )}
        </div>

        {/* Related Papers (Main Column) */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Related {item.type}s</h2>
          <div className="space-y-6">
            {recommendations.length > 0 ? recommendations.map(rec => (
              <div key={rec.slug} className="flex gap-4 group">
                <Link href={`/work/${rec.type}/${rec.slug}`} className="w-16 h-20 flex-shrink-0 bg-gray-100 rounded border border-gray-200 overflow-hidden">
                  {rec.thumbnailUrl && <img src={rec.thumbnailUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />}
                </Link>
                <div>
                  <Link href={`/work/${rec.type}/${rec.slug}`} className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {rec.title}
                  </Link>
                  <p className="text-xs text-gray-500 mt-1 capitalize">{rec.type.replace('-', ' ')}</p>
                  <Link href={`/work/${rec.type}/${rec.slug}`} className="text-sm text-blue-600 hover:underline mt-2 inline-block font-medium flex items-center gap-1">
                    <Download size={14} /> Download free PDF
                  </Link>
                </div>
              </div>
            )) : (
              <p className="text-gray-500 text-sm">No related content found.</p>
            )}
          </div>
        </div>

      </div>

      {/* Right Sidebar */}
      <div className="hidden lg:block w-80 flex-shrink-0 relative">
        
        {/* Floating Cover Image Container */}
        <div className="w-full bg-white p-2 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 mb-10 relative group">
          {item.thumbnailUrl ? (
            <img src={item.thumbnailUrl} alt="Cover" className="w-full h-auto object-cover rounded-lg" />
          ) : (
            <div className="w-full h-80 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">No Cover image</div>
          )}
          {item.downloadUrl && (
            <button 
              onClick={() => handleDownloadClick(true)}
              className="absolute top-4 right-[-10px] bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 shadow-md flex items-center gap-1 transition-colors"
            >
              Download Free PDF
            </button>
          )}
        </div>

        {/* Author Section */}
        <div className="border-t-4 border-gray-900 pt-4">
          <h3 className="font-bold text-gray-900 mb-4">About the author</h3>
          
          <div className="flex gap-3 mb-4">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
              {author.avatarUrl ? (
                <img src={author.avatarUrl} alt={author.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-xl">{author.name.charAt(0)}</div>
              )}
            </div>
            <div>
              <h4 className="font-bold text-gray-900 leading-tight">{author.name}</h4>
              <div className="flex items-center gap-3 mt-1.5 text-xs font-semibold text-[#0f3b8e]">
                <button className="flex items-center gap-1 hover:text-[#0a2863] transition-colors"><UserPlus size={14}/> Follow</button>
                <button className="flex items-center gap-1 hover:text-[#0a2863] transition-colors"><MessageCircle size={14}/> Message</button>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-700 leading-relaxed mb-6 line-clamp-4">
            {author.bio}
          </p>

          <div className="flex justify-between text-center mb-6 px-4">
            <div>
              <div className="text-xs text-gray-500 font-bold tracking-wider mb-1 uppercase">Papers</div>
              <div className="text-xl font-light">{author.papers}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 font-bold tracking-wider mb-1 uppercase">Followers</div>
              <div className="text-xl font-light">{author.followers.toLocaleString()}</div>
            </div>
          </div>

          <Link href="/" className="text-sm font-semibold text-[#0f3b8e] hover:text-[#0a2863] flex items-center gap-1 transition-colors">
            View all papers from {author.name.split(' ')[0]} <FileOutput size={14} className="ml-1" />
          </Link>
        </div>

      </div>

    </div>
  )
}
