'use client'

import { useState, useEffect } from 'react'
import { updateHomeProfile } from '@/app/actions/admin-profile'
import { Save, User as UserIcon } from 'lucide-react'

export default function HomeProfilePage() {
  const [formData, setFormData] = useState({
    name: '',
    avatarUrl: '',
    bio: '',
    followers: '0',
    views: '0'
  })
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')

  // In a real app we'd fetch the existing data from a server component or API
  // but for simplicity we'll just let the admin set it from here. 
  // We can fetch the current SUPER_ADMIN via an API or just let them input new values.
  
  useEffect(() => {
    // Fetch initial profile data
    fetch('/api/admin/profile')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setFormData({
            name: data.user.name || '',
            avatarUrl: data.user.avatarUrl || '',
            bio: data.user.bio || '',
            followers: data.user.followersDisplay || '0',
            views: data.user.viewsDisplay || '0'
          })
        }
      })
      .catch(err => console.error(err))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage('')
    
    const result = await updateHomeProfile(formData)
    
    setIsSaving(false)
    if (result.success) {
      setMessage('Profile updated successfully! Check the home page.')
    } else {
      setMessage('Failed to update profile.')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold mb-2">Home Profile Management</h1>
        <p className="text-gray-500">Update the main author profile details displayed on the Home Page.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
        
        {message && (
          <div className={`p-4 rounded-md ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
          <input 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            className="w-full border border-gray-200 rounded-md px-4 py-2.5 focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all"
            placeholder="e.g. Sandeep Sharma"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Avatar URL</label>
          <input 
            type="text" 
            name="avatarUrl" 
            value={formData.avatarUrl} 
            onChange={handleChange} 
            className="w-full border border-gray-200 rounded-md px-4 py-2.5 focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all"
            placeholder="https://..."
          />
          {formData.avatarUrl && (
            <div className="mt-4 flex items-center gap-4">
              <span className="text-sm text-gray-500">Preview:</span>
              <img src={formData.avatarUrl} alt="Preview" className="w-16 h-16 rounded-full object-cover border" />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Short Bio / Description</label>
          <textarea 
            name="bio" 
            value={formData.bio} 
            onChange={handleChange} 
            rows={4}
            className="w-full border border-gray-200 rounded-md px-4 py-3 focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all resize-y"
            placeholder="A short introduction..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Followers</label>
            <input 
              type="text" 
              name="followers" 
              value={formData.followers} 
              onChange={handleChange} 
              className="w-full border border-gray-200 rounded-md px-4 py-2.5 focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all"
              placeholder="e.g. 4337 or 4.3k"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Public Views</label>
            <input 
              type="text" 
              name="views" 
              value={formData.views} 
              onChange={handleChange} 
              className="w-full border border-gray-200 rounded-md px-4 py-2.5 focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all"
              placeholder="e.g. 2 Top 4%"
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isSaving}
          className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-6 py-2.5 rounded-md font-medium transition-all disabled:opacity-70"
        >
          <Save size={18} />
          {isSaving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  )
}
