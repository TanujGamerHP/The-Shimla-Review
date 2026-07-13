'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@/lib/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { Mail, Lock, Loader2 } from 'lucide-react'
import GoogleLoginButton from '@/components/GoogleLoginButton'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsPending(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const idToken = await userCredential.user.getIdToken()
      
      // Sync session immediately before redirecting to prevent race conditions
      const res = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      })
      
      const data = await res.json()
      
      if (data.role === 'SUPER_ADMIN') {
        router.push('/admin')
      } else {
        router.push('/')
      }
      router.refresh()
    } catch (err: any) {
      console.error(err)
      setError('Invalid email or password.')
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
          <h2 className="text-xl font-semibold text-gray-800 mt-4">Welcome back</h2>
          <p className="text-sm text-gray-500 mt-1.5">Please enter your details to sign in.</p>
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
              {error.includes('sign up') && (
                <Link href="/auth/signup" className="text-red-700 font-semibold hover:underline flex items-center gap-1 w-fit">
                  Create an account &rarr;
                </Link>
              )}
            </div>
          )}

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
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <Link href="#" className="text-xs font-medium text-accent hover:text-blue-800 transition-colors">Forgot password?</Link>
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-accent transition-colors">
                <Lock size={18} />
              </div>
              <input 
                type="password" 
                name="password"
                required 
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition-all text-sm"
                placeholder="••••••••"
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
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="text-accent font-semibold hover:text-blue-800 transition-colors">
            Sign up now
          </Link>
        </div>
      </div>
    </div>
  )
}
