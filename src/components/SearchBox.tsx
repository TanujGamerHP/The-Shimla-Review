'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, Loader2 } from 'lucide-react'
import { searchGlobal, SearchResult } from '@/actions/search'
import Link from 'next/link'

export default function SearchBox() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const fetchResults = async () => {
      if (query.trim().length < 1) {
        setResults([])
        return
      }
      setIsLoading(true)
      try {
        const data = await searchGlobal(query)
        setResults(data)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    const timer = setTimeout(fetchResults, 300)
    return () => clearTimeout(timer)
  }, [query])

  return (
    <div ref={wrapperRef} className="relative hidden sm:block">
      <div className="relative flex items-center">
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          className="w-48 lg:w-64 pl-10 pr-4 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all duration-300 placeholder-gray-400"
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {isLoading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <div className="p-0.5 border border-gray-400 rounded-full">
              <Search size={12} strokeWidth={2.5} />
            </div>
          )}
        </div>
      </div>

      {isOpen && query.trim().length >= 1 && (
        <div className="absolute top-full mt-2 left-0 w-[300px] bg-white border border-gray-100 shadow-xl rounded-xl overflow-hidden z-50 transform origin-top transition-all">
          <div className="max-h-[400px] overflow-y-auto p-2">
            {results.length === 0 && !isLoading ? (
              <div className="p-4 text-center text-sm text-gray-500">
                No results found for &quot;{query}&quot;
              </div>
            ) : (
              results.map((result) => (
                <Link
                  href={result.url}
                  key={`${result.type}-${result.id}`}
                  onClick={() => setIsOpen(false)}
                  className="flex flex-col p-3 hover:bg-gray-50 rounded-lg transition-colors group"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-accent mb-1">
                    {result.type}
                  </span>
                  <span className="text-sm font-medium text-gray-800 group-hover:text-primary leading-snug line-clamp-2">
                    {result.title}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
