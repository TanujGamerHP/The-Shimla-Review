'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { submitWork } from '@/app/actions/submit-work'
import { Check, ChevronRight, UploadCloud } from 'lucide-react'

const steps = ['Author Details', 'Submission Details', 'Review & Consent']

export default function SubmitPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [trackingId, setTrackingId] = useState('')

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    authorBio: '',
    submissionType: 'Poetry',
    title: '',
    subtitle: '',
    description: '',
    consentGiven: false,
    copyrightDeclared: false,
    originalWork: false
  })

  const handleNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep(curr => curr + 1)
  }
  
  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(curr => curr - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const result = await submitWork(formData)
    
    setIsSubmitting(false)
    if (result.success && result.trackingId) {
      setTrackingId(result.trackingId)
      setSuccess(true)
    } else {
      alert(result.error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-xl shadow-sm border border-gray-100 p-10 text-center"
        >
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6 text-success">
            <Check size={32} />
          </div>
          <h2 className="text-3xl font-semibold mb-4">Submission Received</h2>
          <p className="text-gray-600 mb-8">
            Thank you for your submission. We have sent a confirmation email to <span className="font-medium text-gray-900">{formData.email}</span>.
          </p>
          <div className="bg-gray-50 rounded-md p-4 mb-8">
            <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">Tracking ID</p>
            <p className="text-xl font-medium tracking-wider">{trackingId}</p>
          </div>
          <button 
            onClick={() => window.location.href = '/'}
            className="w-full bg-primary hover:bg-black text-white font-medium py-3 rounded-md transition-colors"
          >
            Return Home
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl sm:text-5xl font-semibold mb-4">Submit Your Work</h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Publish your poetry with The Shimla Review.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-between mb-12 relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-gray-200 -z-10"></div>
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-accent -z-10 transition-all duration-500"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          ></div>
          
          {steps.map((step, idx) => (
            <div key={step} className="flex flex-col items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${currentStep >= idx ? 'bg-accent text-white' : 'bg-white border border-gray-300 text-gray-400'}`}>
                {currentStep > idx ? <Check size={16} /> : idx + 1}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${currentStep >= idx ? 'text-gray-900' : 'text-gray-400'}`}>{step}</span>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 sm:p-12">
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {currentStep === 0 && (
                <motion.div
                  key="step0"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-2xl font-semibold mb-6">Author Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full border border-gray-200 rounded-md px-4 py-2.5 focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border border-gray-200 rounded-md px-4 py-2.5 focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                      <input type="text" name="country" value={formData.country} onChange={handleChange} className="w-full border border-gray-200 rounded-md px-4 py-2.5 focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                      <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full border border-gray-200 rounded-md px-4 py-2.5 focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Author Bio</label>
                    <textarea required name="authorBio" value={formData.authorBio} onChange={handleChange} rows={4} className="w-full border border-gray-200 rounded-md px-4 py-3 focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all resize-none"></textarea>
                  </div>
                </motion.div>
              )}

              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-2xl font-semibold mb-6">Submission Details</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Submission Type</label>
                    <select name="submissionType" value={formData.submissionType} onChange={handleChange} className="w-full border border-gray-200 rounded-md px-4 py-3 focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all bg-gray-50 text-gray-700 cursor-not-allowed">
                      <option value="Poetry">Poetry</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full border border-gray-200 rounded-md px-4 py-2.5 focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                    <input type="text" name="subtitle" value={formData.subtitle} onChange={handleChange} className="w-full border border-gray-200 rounded-md px-4 py-2.5 focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description / Abstract</label>
                    <textarea required name="description" value={formData.description} onChange={handleChange} rows={5} className="w-full border border-gray-200 rounded-md px-4 py-3 focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all resize-none"></textarea>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload Document (PDF, DOCX)</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-10 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer">
                      <UploadCloud className="text-gray-400 mb-4" size={32} />
                      <p className="text-sm font-medium text-gray-700 mb-1">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500">PDF, DOCX, RTF up to 10MB</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <h3 className="text-2xl font-semibold mb-2">Review & Consent</h3>
                  <p className="text-gray-600 text-sm mb-8">Please confirm the following declarations before submitting.</p>
                  
                  <div className="space-y-4">
                    <label className="flex items-start gap-4 p-4 border border-gray-100 rounded-lg bg-gray-50/50 cursor-pointer hover:bg-gray-50 transition-colors">
                      <div className="pt-0.5">
                        <input required type="checkbox" name="originalWork" checked={formData.originalWork} onChange={handleChange} className="w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent" />
                      </div>
                      <div className="text-sm">
                        <span className="font-medium text-gray-900 block mb-1">Original Work Declaration</span>
                        <span className="text-gray-600">I declare that this submission is my original work and has not been published elsewhere.</span>
                      </div>
                    </label>

                    <label className="flex items-start gap-4 p-4 border border-gray-100 rounded-lg bg-gray-50/50 cursor-pointer hover:bg-gray-50 transition-colors">
                      <div className="pt-0.5">
                        <input required type="checkbox" name="copyrightDeclared" checked={formData.copyrightDeclared} onChange={handleChange} className="w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent" />
                      </div>
                      <div className="text-sm">
                        <span className="font-medium text-gray-900 block mb-1">Copyright Declaration</span>
                        <span className="text-gray-600">I hold the copyright to this material and grant The Shimla Review permission to publish it.</span>
                      </div>
                    </label>

                    <label className="flex items-start gap-4 p-4 border border-gray-100 rounded-lg bg-gray-50/50 cursor-pointer hover:bg-gray-50 transition-colors">
                      <div className="pt-0.5">
                        <input required type="checkbox" name="consentGiven" checked={formData.consentGiven} onChange={handleChange} className="w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent" />
                      </div>
                      <div className="text-sm">
                        <span className="font-medium text-gray-900 block mb-1">Terms and Consent</span>
                        <span className="text-gray-600">I agree to the submission guidelines and terms of service.</span>
                      </div>
                    </label>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-between">
              <button 
                type="button" 
                onClick={handleBack}
                className={`px-6 py-2.5 rounded-md font-medium text-sm transition-colors ${currentStep === 0 ? 'invisible' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                Back
              </button>
              
              {currentStep < steps.length - 1 ? (
                <button 
                  type="button" 
                  onClick={handleNext}
                  className="bg-primary hover:bg-black text-white px-8 py-2.5 rounded-md font-medium text-sm transition-all flex items-center gap-2"
                >
                  Continue <ChevronRight size={16} />
                </button>
              ) : (
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-accent hover:bg-accent/90 text-white px-10 py-2.5 rounded-md font-medium text-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Work'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
