'use client'

import { useState } from 'react'
import { Eye, Check, X, FileText, X as CloseIcon } from 'lucide-react'
import { updateSubmissionStatus } from '@/actions/admin'

type Submission = {
  id: string
  trackingId: string
  fullName: string
  email: string
  title: string
  subtitle: string | null
  description: string | null
  submissionType: string
  createdAt: Date
  status: string
  authorBio: string | null
  phone: string | null
  country: string | null
  city: string | null
}

export default function SubmissionsClient({ initialSubmissions }: { initialSubmissions: Submission[] }) {
  const [filter, setFilter] = useState('ALL')
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  const filteredSubmissions = filter === 'ALL' 
    ? initialSubmissions 
    : initialSubmissions.filter(s => s.status === filter)

  const handleStatusChange = async (id: string, newStatus: string) => {
    if (isUpdating) return
    setIsUpdating(true)
    const result = await updateSubmissionStatus(id, newStatus)
    if (result.error) {
      alert(result.error)
    }
    setIsUpdating(false)
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">All Submissions</h3>
          <div className="flex gap-2">
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="text-sm border border-gray-200 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tracking ID</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Title & Author</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Submitted</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <FileText size={48} className="text-gray-300 mb-4" />
                      <p>No submissions found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {sub.trackingId}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 truncate max-w-[300px]" title={sub.title}>
                        {sub.title}
                      </div>
                      <div className="text-xs text-gray-500">{sub.fullName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {sub.submissionType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(sub.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium 
                        ${sub.status === 'PENDING' ? 'bg-amber-100 text-amber-800' : 
                          sub.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 
                          sub.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'}`}>
                        {sub.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => setSelectedSubmission(sub)}
                          className="text-gray-400 hover:text-accent transition-colors" 
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          disabled={isUpdating}
                          onClick={() => handleStatusChange(sub.id, 'APPROVED')}
                          className="text-gray-400 hover:text-emerald-600 transition-colors disabled:opacity-50" 
                          title="Approve"
                        >
                          <Check size={18} />
                        </button>
                        <button 
                          disabled={isUpdating}
                          onClick={() => handleStatusChange(sub.id, 'REJECTED')}
                          className="text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50" 
                          title="Reject"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Submission Details</h2>
              <button 
                onClick={() => setSelectedSubmission(null)}
                className="text-gray-400 hover:text-gray-700 transition-colors p-1"
              >
                <CloseIcon size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Tracking ID</h4>
                  <p className="text-sm font-medium text-gray-900">{selectedSubmission.trackingId}</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Status</h4>
                  <p className="text-sm font-medium text-gray-900">{selectedSubmission.status}</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Submission Type</h4>
                  <p className="text-sm font-medium text-gray-900">{selectedSubmission.submissionType}</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Date Submitted</h4>
                  <p className="text-sm font-medium text-gray-900">{new Date(selectedSubmission.createdAt).toLocaleString()}</p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Work Information</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Title</h4>
                    <p className="text-sm font-medium text-gray-900">{selectedSubmission.title}</p>
                  </div>
                  {selectedSubmission.subtitle && (
                    <div>
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Subtitle</h4>
                      <p className="text-sm font-medium text-gray-900">{selectedSubmission.subtitle}</p>
                    </div>
                  )}
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Description / Abstract</h4>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg mt-2">
                      {selectedSubmission.description || 'No description provided.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Author Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Full Name</h4>
                    <p className="text-sm font-medium text-gray-900">{selectedSubmission.fullName}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Email</h4>
                    <a href={`mailto:${selectedSubmission.email}`} className="text-sm font-medium text-accent hover:underline">
                      {selectedSubmission.email}
                    </a>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Location</h4>
                    <p className="text-sm font-medium text-gray-900">
                      {[selectedSubmission.city, selectedSubmission.country].filter(Boolean).join(', ') || 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Phone</h4>
                    <p className="text-sm font-medium text-gray-900">{selectedSubmission.phone || 'Not specified'}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Author Bio</h4>
                  <p className="text-sm text-gray-700 mt-1">{selectedSubmission.authorBio || 'Not specified'}</p>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-100 px-6 py-4 bg-gray-50 flex justify-end">
              <button 
                onClick={() => setSelectedSubmission(null)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
