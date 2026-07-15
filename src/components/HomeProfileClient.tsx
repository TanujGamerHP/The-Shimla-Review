'use client'

import { useState } from 'react'
import { Plus, Mail } from 'lucide-react'
import Link from 'next/link'
import BioSection from './BioSection'
import { followAdmin } from '@/app/actions/admin-profile'

interface AdminData {
  name: string
  avatarUrl: string | null
  bio: string | null
  followersDisplay: string
  viewsDisplay: string
}

export default function HomeProfileClient({ adminData }: { adminData: AdminData }) {
  const [followers, setFollowers] = useState(adminData.followersDisplay)
  const [isFollowing, setIsFollowing] = useState(false)

  const handleFollow = async () => {
    if (isFollowing) return // Prevent multiple clicks for now
    
    // Optimistic UI update for numbers if possible
    setFollowers(prev => {
      const num = parseInt(prev.replace(/,/g, ''))
      return isNaN(num) ? prev : (num + 1).toString()
    })
    setIsFollowing(true)

    // Call server action
    await followAdmin()
  }

  return (
    <aside className="flex flex-col w-full text-sm">
      {/* Profile Header */}
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="w-[90px] h-[90px] md:w-[120px] md:h-[120px] rounded-full mb-3 md:mb-4 overflow-hidden border border-gray-100 relative">
          <img 
            src={adminData.avatarUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"} 
            alt="Avatar" 
            className="w-full h-full object-cover" 
          />
        </div>
        <h2 className="text-[18px] md:text-[20px] font-normal text-gray-800 mb-3 md:mb-4">
          {adminData.name}
        </h2>
        


        <div className="flex flex-col w-full text-[13px] mb-6">

          <div className="flex items-center justify-between py-1.5">
            <span className="text-gray-800">Public Views</span>
            <span className="text-[#185ADB] font-medium hover:underline cursor-pointer">
              {adminData.viewsDisplay}
            </span>
          </div>
        </div>

        {/* Bio */}
        <BioSection bio={adminData.bio} />



        {/* Social Links */}
        <div className="w-full flex items-center justify-center gap-6 pt-4 border-t border-gray-100">
          <Link href="/cv" className="flex items-center justify-center w-10 h-10 rounded-full bg-[#185ADB] hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all hover:scale-105 hover:shadow-lg">
            CV
          </Link>
          
          <div className="relative flex items-center group">
            <a href="mailto:profsandeepsharma@gmail.com" className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-md transition-all hover:scale-105 hover:shadow-lg">
              <Mail size={20} strokeWidth={2.5} />
            </a>
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-10 pointer-events-none shadow-xl">
              profsandeepsharma@gmail.com
              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>

          <a href="#" className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1877F2] hover:bg-[#166fe5] text-white shadow-md transition-all hover:scale-105 hover:shadow-lg">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
            </svg>
          </a>
        </div>

      </div>
    </aside>
  )
}
