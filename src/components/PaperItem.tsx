'use client'

import { useState } from 'react'
import { incrementView } from '@/app/actions/increment-view'
import { Download, Eye } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

import { ProfileFeedItem } from '@/components/ProfileFeed'

interface PaperProps {
  paper: ProfileFeedItem
}

export default function PaperItem({ paper }: PaperProps) {
  const [views, setViews] = useState(paper.views)
  const [isClicking, setIsClicking] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const handleDownloadClick = async () => {
    if (isClicking) return
    setIsClicking(true)
    
    setViews((prev) => prev + 1)
    await incrementView(paper.id)
    
    if (paper.downloadUrl) {
      window.open(paper.downloadUrl, '_blank')
    }
    
    setIsClicking(false)
  }

  // Helper to convert plain URLs in text into clickable <a> tags
  const renderTextWithLinks = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, i) => {
      if (part.match(urlRegex)) {
        return (
          <a 
            key={i} 
            href={part} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-indigo-600 hover:text-indigo-800 hover:underline break-all"
            onClick={(e) => e.stopPropagation()}
          >
            {part}
          </a>
        )
      }
      return part;
    });
  }

  if (paper.type === 'Book') {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row gap-6 py-8 border-b border-gray-100 last:border-0 group transition-all duration-500 ease-out hover:bg-white hover:shadow-premium hover:-translate-y-1 hover:rounded-2xl p-4 sm:p-6 -mx-4 sm:-mx-6"
      >
        <div 
          className="w-full sm:w-40 h-64 sm:h-56 flex-shrink-0 bg-gray-50 border border-gray-200 rounded-lg overflow-hidden flex items-center justify-center text-gray-300 group-hover:shadow-premium-hover transition-all duration-500 transform"
        >
          {paper.thumbnailUrl ? (
            <img src={paper.thumbnailUrl} alt={paper.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-16 h-20 border-2 border-gray-200 rounded flex flex-col gap-2 p-2" />
          )}
        </div>

        <div className="flex flex-col justify-start">
          <div className="mb-2 flex items-center justify-between">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100">
              BOOK
            </span>
          </div>
          
          <h3 className="text-2xl sm:text-3xl font-bold mb-2 leading-tight transition-colors group-hover:text-emerald-700">
            {paper.title}
          </h3>
          
          <p className="text-xl font-semibold text-gray-900 mb-4">
            {paper.price ? `₹${paper.price}` : 'Price on Request'}
          </p>
          
          {paper.abstract && (
            <div className="mb-6 max-w-2xl">
              <p className={`text-gray-600 text-sm leading-relaxed whitespace-pre-wrap ${!isExpanded ? 'line-clamp-2 overflow-hidden' : ''}`}>
                {renderTextWithLinks(paper.abstract)}
              </p>
              <button 
                onClick={(e) => { e.preventDefault(); setIsExpanded(!isExpanded); }}
                className="text-emerald-600 hover:underline font-bold text-sm mt-1"
              >
                {isExpanded ? 'Read less ▴' : 'Read more ▾'}
              </button>
            </div>
          )}

          <div className="mt-auto flex items-center gap-4">
            <button 
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-6 rounded-full shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-sm flex items-center justify-center gap-2"
            >
              Buy Now
            </button>
            
            <div className="flex items-center gap-1.5 text-sm text-gray-500 font-medium ml-4">
              <Eye size={16} className="text-gray-400" />
              <span className="tabular-nums">{views.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="flex flex-col sm:flex-row gap-6 py-8 border-b border-gray-100 last:border-0 group transition-all duration-500 ease-out hover:bg-white hover:shadow-premium hover:-translate-y-1 hover:rounded-2xl p-4 sm:p-6 -mx-4 sm:-mx-6"
    >
      <Link href={`/work/${paper.type.toLowerCase().replace(' ', '-')}/${paper.slug}`} className="w-full sm:w-32 h-64 sm:h-44 flex-shrink-0 bg-gray-50 border border-gray-200 rounded-lg overflow-hidden flex items-center justify-center text-gray-300 group-hover:shadow-premium-hover transition-all duration-500">
        {paper.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={paper.thumbnailUrl} alt={paper.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="w-16 h-20 border-2 border-gray-200 rounded flex flex-col gap-2 p-2">
            <div className="h-1 bg-gray-200 rounded w-full"></div>
            <div className="h-1 bg-gray-200 rounded w-4/5"></div>
            <div className="h-1 bg-gray-200 rounded w-full"></div>
            <div className="h-1 bg-gray-200 rounded w-2/3"></div>
          </div>
        )}
      </Link>

      <div className="flex flex-col justify-start">
        <div className="mb-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-gray-100 text-gray-600 border border-gray-200">
            {paper.type}
          </span>
        </div>
        <Link href={`/work/${paper.type.toLowerCase().replace(' ', '-')}/${paper.slug}`}>
          <h3 className="text-xl sm:text-2xl font-semibold mb-2 leading-tight transition-colors group-hover:text-accent cursor-pointer">
            {paper.title}
          </h3>
        </Link>
        
        {paper.institution && (
          <p className="text-sm text-gray-600 mb-4">{paper.institution}</p>
        )}
        
        {paper.abstract && (
          <div className="mb-6 max-w-3xl">
            <p className={`text-gray-700 text-sm leading-relaxed whitespace-pre-wrap ${!isExpanded ? 'line-clamp-1 overflow-hidden' : ''}`}>
              {renderTextWithLinks(paper.abstract)}
            </p>
            <button 
              onClick={(e) => { e.preventDefault(); setIsExpanded(!isExpanded); }}
              className="text-accent hover:underline font-bold text-sm mt-1"
            >
              {isExpanded ? 'less ▴' : 'more ▾'}
            </button>
          </div>
        )}

        <div className="mt-auto flex items-center gap-6">
          {paper.downloadUrl ? (
            <button 
              onClick={handleDownloadClick}
              className="flex items-center gap-2 text-sm font-semibold text-accent hover:text-primary transition-colors"
            >
              <Download size={16} />
              <span>Download PDF</span>
            </button>
          ) : (
            <button 
              onClick={handleDownloadClick}
              className="flex items-center gap-2 text-sm font-semibold text-gray-400 cursor-not-allowed"
              title="No document attached"
            >
              <Download size={16} />
              <span>No PDF</span>
            </button>
          )}
          
          <div className="flex items-center gap-1.5 text-sm text-gray-500 font-medium">
            <Eye size={16} className="text-gray-400" />
            <span className="tabular-nums">{views.toLocaleString()}</span>
            <span>Views</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
