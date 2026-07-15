'use client'

import { useState } from 'react'
import { createBook, createResearchPaper, createStudentNote } from '@/actions/admin'
import { BookPlus, CheckCircle2, Loader2, Image as ImageIcon, FileText } from 'lucide-react'

export default function ContentManager() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null)
  const [activeTab, setActiveTab] = useState<'book' | 'paper' | 'studentNote'>('book')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    setIsSubmitting(true)
    setMessage(null)

    const formData = new FormData(form)
    
    let result;
    if (activeTab === 'book') result = await createBook(formData)
    else if (activeTab === 'paper') result = await createResearchPaper(formData)
    else if (activeTab === 'studentNote') result = await createStudentNote(formData)
    
    if (result?.error) {
      setMessage({ type: 'error', text: result.error })
    } else {
      setMessage({ type: 'success', text: 'Content published successfully to the live site!' })
      form.reset()
    }
    
    setIsSubmitting(false)
  }

  const renderUploads = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">Cover Image</label>
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
          <input type="file" name="coverImage" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
          <ImageIcon className="mx-auto text-gray-400 mb-2" size={24} />
          <p className="text-sm text-gray-600 font-medium">Upload Cover Art</p>
          <p className="text-xs text-gray-400 mt-1">JPEG, PNG (Max 5MB)</p>
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">PDF Document</label>
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
          <input type="file" name="pdfDocument" accept="application/pdf" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
          <FileText className="mx-auto text-gray-400 mb-2" size={24} />
          <p className="text-sm text-gray-600 font-medium">Upload PDF File</p>
          <p className="text-xs text-gray-400 mt-1">PDF only (Max 20MB)</p>
        </div>
      </div>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Upload Content</h1>
        <p className="text-gray-500 mt-1">Directly publish books, research papers, and student notes.</p>
      </div>

      <div className="flex gap-4 border-b border-gray-200 pb-4 overflow-x-auto">
        {['book', 'paper', 'studentNote'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-6 py-3 font-medium text-sm rounded-full transition-all whitespace-nowrap ${
              activeTab === tab 
                ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-700/10' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            {tab === 'book' && 'Publish Book'}
            {tab === 'paper' && 'Publish Paper'}
            {tab === 'studentNote' && 'Publish Student Note'}
          </button>
        ))}
      </div>

      {message && (
        <div className={`p-4 rounded-xl text-sm font-medium flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.type === 'success' && <CheckCircle2 size={18} />}
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-5 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
        
        {/* Dynamic Form Fields based on Active Tab */}
        {activeTab === 'book' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Book Title</label>
                <input type="text" name="title" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all text-gray-900" placeholder="The Great Shimla Anthology" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Subtitle</label>
                <input type="text" name="subtitle" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all text-gray-900" placeholder="A collection of short stories" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Price (₹)</label>
                <input type="number" name="price" step="0.01" min="0" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all text-gray-900" placeholder="499.00" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Purchase / Amazon URL (Optional)</label>
                <input type="url" name="purchaseUrl" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all text-gray-900" placeholder="https://amazon.in/book-link" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Synopsis</label>
              <textarea name="synopsis" required rows={4} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all text-gray-900 resize-none" placeholder="A brief overview of the book..." />
            </div>
          </>
        )}

        {activeTab === 'paper' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Research Paper Title</label>
                <input type="text" name="title" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all text-gray-900" placeholder="Semiotics of Himalayan Architecture" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Subtitle</label>
                <input type="text" name="subtitle" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all text-gray-900" placeholder="A comprehensive study" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">DOI (Optional)</label>
              <input type="text" name="doi" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all text-gray-900" placeholder="10.1000/xyz123" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Abstract</label>
              <textarea name="abstract" required rows={4} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all text-gray-900 resize-none" placeholder="A summary of the research methodology and findings..." />
            </div>
          </>
        )}

        {activeTab === 'studentNote' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Student Note Title</label>
                <input type="text" name="title" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all text-gray-900" placeholder="English Literature Notes" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Subtitle</label>
                <input type="text" name="subtitle" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all text-gray-900" placeholder="Chapter 1-3 Summary" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Subject / Category (Optional)</label>
              <input type="text" name="subject" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all text-gray-900" placeholder="e.g. History, Literature" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Description</label>
              <textarea name="description" required rows={4} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all text-gray-900 resize-none" placeholder="A summary of what these notes cover..." />
            </div>
          </>
        )}

        {/* Universal Uploads (Cover Image & PDF) */}
        {renderUploads()}

        <div className="pt-6 border-t border-gray-100 flex justify-end">
          <button 
            type="submit"
            disabled={isSubmitting}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-200 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <BookPlus size={18} />}
            {isSubmitting ? 'Publishing...' : 'Publish Content'}
          </button>
        </div>
      </form>
    </div>
  )
}
