'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import GoogleLoginButton from '@/components/GoogleLoginButton'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)


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

        <div className="mt-8 text-center text-sm text-gray-500">
          Admin access only. Regular users cannot sign in.
        </div>
      </div>
    </div>
  )
}
