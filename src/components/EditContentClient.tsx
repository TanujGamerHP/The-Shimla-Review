'use client'

import { useState } from 'react'
import { updateBook, updateJournal, updateResearchPaper, updatePoem } from '@/actions/admin'
import { Save, CheckCircle2, Loader2, Image as ImageIcon, FileText, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function EditContentClient({ type, data }: { type: string, data: any }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    const formData = new FormData(e.currentTarget)
    
    let result;
    if (type === 'book') result = await updateBook(data.id, formData)
    else if (type === 'short-story') result = await updateJournal(data.id, formData)
    else if (type === 'research-paper') result = await updateResearchPaper(data.id, formData)
    else if (type === 'poetry') result = await updatePoem(data.id, formData)
    
    if (result?.error) {
      setMessage({ type: 'error', text: result.error })
    } else {
      setMessage({ type: 'success', text: 'Content updated successfully!' })
      router.refresh()
    }
    
    setIsSubmitting(false)
  }

  const renderUploads = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">Update Cover Image</label>
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
          <input type="file" name="coverImage" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
          <ImageIcon className="mx-auto text-gray-400 mb-2" size={24} />
          <p className="text-sm text-gray-600 font-medium">Click to change Image</p>
          <p className="text-xs text-gray-400 mt-1">Leave blank to keep existing image</p>
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">Update PDF Document</label>
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
          <input type="file" name="pdfDocument" accept="application/pdf" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
          <FileText className="mx-auto text-gray-400 mb-2" size={24} />
          <p className="text-sm text-gray-600 font-medium">Click to change PDF</p>
          <p className="text-xs text-gray-400 mt-1">Leave blank to keep existing PDF</p>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <Link href="/admin/manage-content" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-4 transition-colors">
        <ArrowLeft size={16} className="mr-2" /> Back to Manage Content
      </Link>

      {message && (
        <div className={`p-4 rounded-xl text-sm font-medium flex items-center gap-3 mb-6 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.type === 'success' && <CheckCircle2 size={18} />}
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-5 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
        
        {type === 'book' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Book Title</label>
                <input type="text" name="title" required defaultValue={data.title} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all text-gray-900" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Subtitle</label>
                <input type="text" name="subtitle" defaultValue={data.subtitle} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all text-gray-900" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Price (₹)</label>
                <input type="number" name="price" step="0.01" min="0" defaultValue={data.price} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all text-gray-900" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Purchase / Amazon URL (Optional)</label>
              <input type="url" name="purchaseUrl" defaultValue={data.purchaseUrl} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all text-gray-900" placeholder="https://amazon.in/book-link" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Synopsis</label>
              <textarea name="synopsis" required rows={4} defaultValue={data.synopsis} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all text-gray-900 resize-none" />
            </div>
          </>
        )}

        {type === 'short-story' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Short Story Title</label>
                <input type="text" name="title" required defaultValue={data.title} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all text-gray-900" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Subtitle</label>
                <input type="text" name="subtitle" defaultValue={data.subtitle} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all text-gray-900" />
              </div>
            </div>
            <div className="space-y-2 mt-6">
              <label className="text-sm font-semibold text-gray-700">Volume & Issue</label>
              <div className="flex gap-4">
                <input type="text" name="volume" required defaultValue={data.volume} className="w-1/2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all text-gray-900" />
                <input type="text" name="issue" required defaultValue={data.issue} className="w-1/2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all text-gray-900" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Author/Contributor Notes</label>
              <textarea name="editorialBoard" rows={3} defaultValue={data.editorialBoard} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all text-gray-900 resize-none" />
            </div>
          </>
        )}

        {type === 'research-paper' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Research Paper Title</label>
                <input type="text" name="title" required defaultValue={data.title} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all text-gray-900" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Subtitle</label>
                <input type="text" name="subtitle" defaultValue={data.subtitle} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all text-gray-900" />
              </div>
            </div>
            <div className="space-y-2 mt-6">
              <label className="text-sm font-semibold text-gray-700">DOI (Optional)</label>
              <input type="text" name="doi" defaultValue={data.doi} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all text-gray-900" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Abstract</label>
              <textarea name="abstract" required rows={4} defaultValue={data.abstract} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all text-gray-900 resize-none" />
            </div>
          </>
        )}

        {type === 'poetry' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Poem Title</label>
                <input type="text" name="title" required defaultValue={data.title} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all text-gray-900" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Subtitle</label>
                <input type="text" name="subtitle" defaultValue={data.subtitle} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all text-gray-900" />
              </div>
            </div>
            <div className="space-y-2 mt-6">
              <label className="text-sm font-semibold text-gray-700">Language</label>
              <input type="text" name="language" defaultValue={data.language} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all text-gray-900" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Poem Content</label>
              <textarea name="content" rows={6} defaultValue={data.content} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all text-gray-900 resize-none" />
            </div>
          </>
        )}

        {/* Universal Uploads (Cover Image & PDF) */}
        {renderUploads()}

        <div className="pt-6 border-t border-gray-100 flex justify-end">
          <button 
            type="submit"
            disabled={isSubmitting}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-200 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </>
  )
}
