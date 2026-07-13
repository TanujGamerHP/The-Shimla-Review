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
  followers: number
  following: number
  views: number
}

export default function HomeProfileClient({ adminData }: { adminData: AdminData }) {
  const [followers, setFollowers] = useState(adminData.followers)
  const [isFollowing, setIsFollowing] = useState(false)

  const handleFollow = async () => {
    if (isFollowing) return // Prevent multiple clicks for now
    
    // Optimistic UI update
    setFollowers(prev => prev + 1)
    setIsFollowing(true)

    // Call server action
    await followAdmin()
  }

  return (
    <aside className="flex flex-col w-full text-sm">
      {/* Profile Header */}
      <div className="mb-6 flex flex-col items-center md:items-start text-center md:text-left">
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
        
        <button 
          onClick={handleFollow}
          disabled={isFollowing}
          className={`w-full font-bold py-2 rounded-lg flex items-center justify-center gap-2 transition-colors mb-6
            ${isFollowing 
              ? 'bg-gray-100 text-gray-600 cursor-default' 
              : 'bg-[#185ADB] hover:bg-blue-700 text-white'
            }`}
        >
          {!isFollowing && <Plus size={16} strokeWidth={3} />}
          {isFollowing ? 'Following' : 'Follow'}
        </button>

        <div className="flex flex-col w-full text-[13px] mb-6">
          <div className="flex items-center justify-between py-1.5">
            <span className="text-gray-800">Followers</span>
            <span className="text-[#185ADB] font-medium hover:underline cursor-pointer">{followers.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between py-1.5">
            <span className="text-gray-800">Public Views</span>
            <span className="text-[#185ADB] font-medium hover:underline cursor-pointer">
              {adminData.views.toLocaleString()} <span className="ml-1 text-[#185ADB]">Top 4%</span>
            </span>
          </div>
        </div>

        {/* Bio */}
        <BioSection bio={adminData.bio} />



        {/* Interests */}
        <div className="w-full mb-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[13px] font-medium text-gray-800">Interests</h3>
            <span className="text-[11px] text-gray-500 cursor-pointer hover:underline">View All (33)</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {['Semiotics', 'Education', 'Social Sciences', 'English Literature', 'Philosophy of Mind'].map(tag => (
              <span key={tag} className="px-3 py-1 border border-gray-300 rounded-full text-[12px] text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Social Links */}
        <div className="w-full flex items-center gap-5 text-[#185ADB]">
          <Link href="/cv" className="text-[15px] font-bold cursor-pointer hover:underline tracking-wide">CV</Link>
          
          <div className="relative flex items-center group">
            <a href="mailto:profsandeepsharma@gmail.com" className="flex items-center">
              <Mail size={18} className="cursor-pointer text-gray-600 group-hover:text-[#185ADB] transition-colors" />
            </a>
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-10 pointer-events-none shadow-lg">
              profsandeepsharma@gmail.com
              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
          <svg className="w-4 h-4 cursor-pointer text-gray-600 hover:text-gray-900" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
          </svg>
        </div>

      </div>
    </aside>
  )
}
