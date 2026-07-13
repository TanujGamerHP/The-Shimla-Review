'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@/lib/firebase'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { Mail, Lock, User, Loader2 } from 'lucide-react'
import GoogleLoginButton from '@/components/GoogleLoginButton'

export default function SignUpPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsPending(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const name = formData.get('name') as string
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(userCredential.user, { displayName: name })
      
      const idToken = await userCredential.user.getIdToken()
      await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      })
      
      setSuccess(true)
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'An error occurred during registration.')
    }
    
    setIsPending(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-blue-900/5 border border-gray-100 p-8 sm:p-10 transform transition-all">
        <div className="text-center mb-10">
          <Link href="/" className="inline-block hover:opacity-90 transition-opacity">
            <h1 className="text-3xl font-black font-cormorant tracking-tight text-primary mb-2">The Shimla Review</h1>
          </Link>
          <h2 className="text-xl font-semibold text-gray-800 mt-4">Create an account</h2>
          <p className="text-sm text-gray-500 mt-1.5">Enter your details to create your account.</p>
        </div>

        <GoogleLoginButton />

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500 font-medium">Or continue with email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100 flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
              <span className="font-medium">{error}</span>
              {error.includes('already exists') && (
                <Link href="/auth/login" className="text-red-700 font-semibold hover:underline flex items-center gap-1 w-fit">
                  Go to Log In &rarr;
                </Link>
              )}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-accent transition-colors">
                <User size={18} />
              </div>
              <input 
                type="text" 
                name="name"
                required 
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all text-sm"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Email address</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-accent transition-colors">
                <Mail size={18} />
              </div>
              <input 
                type="email" 
                name="email"
                required 
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all text-sm"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-accent transition-colors">
                <Lock size={18} />
              </div>
              <input 
                type="password" 
                name="password"
                required 
                minLength={8}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all text-sm"
                placeholder="Min 8 characters"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isPending}
            className="relative w-full bg-accent hover:bg-blue-700 hover:shadow-lg hover:shadow-accent/20 hover:-translate-y-0.5 text-white font-medium py-3 rounded-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Creating account...
              </>
            ) : (
              'Sign Up'
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-primary font-semibold hover:text-blue-900 transition-colors">
            Log in now
          </Link>
        </div>
      </div>
    </div>
  )
}
