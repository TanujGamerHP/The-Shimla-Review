'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { updateProfile } from '@/actions/profile'
import { User, Book, Settings, Camera, Loader2, LogOut, CheckCircle2, UploadCloud, ArrowLeft, LayoutDashboard } from 'lucide-react'
import Link from 'next/link'
import ProfileFeed, { ProfileFeedItem } from '@/components/ProfileFeed'

export default function ProfilePage() {
  const { user, logout, refreshSession, isLoading } = useAuth()
  const router = useRouter()
  
  const [activeTab, setActiveTab] = useState('details')
  const [isUpdating, setIsUpdating] = useState(false)
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Wait for loading to finish, redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login')
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <Loader2 className="animate-spin text-accent w-10 h-10" />
      </div>
    )
  }

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setPreviewImage(url)
    }
  }

  const handleSubmit = async (formData: FormData) => {
    setIsUpdating(true)
    setMessage(null)
    
    const result = await updateProfile(formData)
    
    if (result.error) {
      setMessage({ type: 'error', text: result.error })
    } else if (result.success) {
      setMessage({ type: 'success', text: 'Profile updated successfully!' })
      // Refresh session context to grab the new photo/name globally
      await refreshSession()
      
      // Auto dismiss success message after 3 seconds
      setTimeout(() => setMessage(null), 3000)
    }
    
    setIsUpdating(false)
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-24">
      {/* Premium Gradient Header */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-accent h-56 w-full relative shadow-sm">
        <div className="absolute inset-0 bg-white/10 mix-blend-overlay pattern-diagonal-lines-sm opacity-20" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
        
        {/* Back Button */}
        <div className="mb-4">
          <Link href="/" className="inline-flex items-center gap-2 text-white/90 hover:text-white font-medium text-sm transition-colors drop-shadow-md bg-black/10 hover:bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>

        {/* Profile Card Header */}
        <div className="bg-white rounded-2xl shadow-xl shadow-blue-900/5 p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-end gap-6 mb-8 border border-gray-100">
          <div className="relative group cursor-pointer shrink-0" onClick={handleImageClick}>
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-white bg-white shadow-lg relative transition-transform group-hover:scale-[1.02]">
              {/* Using standard img tag to bypass Next Image strict domain issues if user didn't restart server */}
              <img 
                src={previewImage || user.avatarUrl || `https://ui-avatars.com/api/?name=${user.name}&background=1d4ed8&color=fff&size=200`} 
                alt={user.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Camera className="text-white mb-1.5 drop-shadow-sm" size={26} />
                <span className="text-white text-xs font-semibold tracking-wide drop-shadow-sm">UPLOAD</span>
              </div>
            </div>
          </div>
          
          <div className="flex-1 text-center sm:text-left pb-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">{user.name}</h1>
            <div className="flex items-center justify-center sm:justify-start gap-3 mt-2.5">
              <span className="text-xs font-bold tracking-widest text-accent bg-blue-50 px-3 py-1 rounded-full uppercase border border-blue-100">
                {user.role}
              </span>
              <span className="text-sm text-gray-500 font-medium">{user.email}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Professional Sidebar */}
          <div className="lg:col-span-3 space-y-2">
            <div className="bg-white rounded-2xl shadow-xl shadow-blue-900/5 border border-gray-100 p-3">
              <button 
                onClick={() => setActiveTab('details')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${activeTab === 'details' ? 'bg-blue-50 text-accent shadow-sm border border-blue-100/50' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
              >
                <User size={18} className={activeTab === 'details' ? 'text-accent' : 'text-gray-400'} /> 
                Personal Details
              </button>
              
              <button 
                onClick={() => setActiveTab('books')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 mt-1 ${activeTab === 'books' ? 'bg-blue-50 text-accent shadow-sm border border-blue-100/50' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
              >
                <Book size={18} className={activeTab === 'books' ? 'text-accent' : 'text-gray-400'} /> 
                My Library
              </button>
              
              <button 
                onClick={() => setActiveTab('uploads')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 mt-1 ${activeTab === 'uploads' ? 'bg-blue-50 text-accent shadow-sm border border-blue-100/50' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
              >
                <UploadCloud size={18} className={activeTab === 'uploads' ? 'text-accent' : 'text-gray-400'} /> 
                Uploads
              </button>
              
              <button 
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 mt-1 ${activeTab === 'settings' ? 'bg-blue-50 text-accent shadow-sm border border-blue-100/50' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
              >
                <Settings size={18} className={activeTab === 'settings' ? 'text-accent' : 'text-gray-400'} /> 
                Account Settings
              </button>
              
              {user.email === 'gameralipmk@gmail.com' && (
                <>
                  <hr className="my-3 border-gray-100 mx-2" />
                  <Link 
                    href="/admin"
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors mt-1 border border-indigo-100"
                  >
                    <LayoutDashboard size={18} className="text-indigo-600" /> 
                    Go to Admin Panel
                  </Link>
                </>
              )}
              
              <hr className="my-3 border-gray-100 mx-2" />
              
              <button 
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors mt-1"
              >
                <LogOut size={18} className="text-red-400" /> 
                Log Out
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9">
            {activeTab === 'details' && (
              <div className="bg-white rounded-2xl shadow-xl shadow-blue-900/5 border border-gray-100 p-8 sm:p-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900">Personal Details</h2>
                  <p className="text-sm text-gray-500 mt-1">Manage your public profile and personal information.</p>
                </div>
                
                {message && (
                  <div className={`mb-8 p-4 rounded-xl text-sm font-medium flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200/50' : 'bg-red-50 text-red-700 border border-red-200/50'}`}>
                    {message.type === 'success' && <CheckCircle2 size={18} className="text-green-600" />}
                    {message.text}
                  </div>
                )}

                <form action={handleSubmit} className="space-y-8">
                  <input 
                    type="file" 
                    name="profilePhoto" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageChange}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Full Name</label>
                      <input 
                        type="text" 
                        name="name"
                        defaultValue={user.name}
                        required
                        className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-accent/10 focus:border-accent outline-none transition-all text-gray-900 font-medium"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Email Address (Read Only)</label>
                      <input 
                        type="email" 
                        value={user.email}
                        disabled
                        className="w-full px-4 py-3 bg-gray-100/80 text-gray-500 border border-gray-200 rounded-xl cursor-not-allowed font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Biography</label>
                    <textarea 
                      name="bio"
                      // @ts-ignore
                      defaultValue={user.bio || ''}
                      rows={5}
                      placeholder="Tell the community about yourself, your writing, or your reading interests..."
                      className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-accent/10 focus:border-accent outline-none transition-all resize-none text-gray-900 font-medium leading-relaxed"
                    />
                  </div>

                  <div className="pt-6 border-t border-gray-100 flex justify-end">
                    <button 
                      type="submit"
                      disabled={isUpdating}
                      className="bg-accent hover:bg-blue-700 hover:shadow-lg hover:shadow-accent/20 hover:-translate-y-0.5 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-200 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
                    >
                      {isUpdating ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'books' && (
              <div className="bg-white rounded-2xl shadow-xl shadow-blue-900/5 border border-gray-100 p-8 sm:p-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">My Library</h2>
                    <p className="text-sm text-gray-500 mt-1">Books you have purchased or bookmarked.</p>
                  </div>
                  <Link href="/books" className="text-accent text-sm font-semibold hover:text-blue-800 transition-colors hover:underline">
                    Browse Books &rarr;
                  </Link>
                </div>
                
                <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mb-4">
                    <Book size={32} className="text-gray-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Your library is empty</h3>
                  <p className="text-gray-500 text-sm max-w-sm mx-auto text-center leading-relaxed">
                    When you purchase or bookmark books on The Shimla Review, they will appear here in your personal collection.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'uploads' && (
              <div className="bg-white rounded-2xl shadow-xl shadow-blue-900/5 border border-gray-100 p-8 sm:p-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <ProfileFeed items={[]} authorName={user.name} />
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white rounded-2xl shadow-xl shadow-blue-900/5 border border-gray-100 p-8 sm:p-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Account Settings</h2>
                
                <div className="space-y-6">
                  <div className="p-6 border border-red-100 bg-red-50/30 rounded-2xl">
                    <h3 className="text-red-700 font-bold mb-2">Danger Zone</h3>
                    <p className="text-sm text-red-600/80 mb-6 max-w-md">
                      Deleting your account is permanent and cannot be undone. All your data, submissions, and history will be erased.
                    </p>
                    <button className="text-sm font-semibold text-red-600 bg-white border border-red-200 px-5 py-2.5 rounded-xl hover:bg-red-50 hover:border-red-300 transition-all shadow-sm">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
