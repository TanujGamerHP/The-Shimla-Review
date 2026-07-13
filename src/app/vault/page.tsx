'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { unlockVault } from '@/actions/vault'
import { Lock, Loader2, ShieldAlert } from 'lucide-react'
import Link from 'next/link'

export default function AdminUnlockPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsPending(true)
    setError(null)
    
    const result = await unlockVault(password)
    
    if (result.error) {
      setError(result.error)
      setIsPending(false)
    } else {
      router.push('/admin')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4 selection:bg-accent selection:text-white">
      <div className="w-full max-w-md bg-[#111] rounded-2xl border border-gray-800 p-8 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-accent/20 blur-[60px] pointer-events-none rounded-full"></div>

        <div className="text-center mb-8 relative z-10">
          <div className="mx-auto w-16 h-16 bg-accent/10 border border-accent/20 rounded-full flex items-center justify-center mb-6">
            <Lock className="w-7 h-7 text-accent" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Restricted Area</h1>
          <p className="text-sm text-gray-400">
            Please enter the vault password to access the CMS.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          {error && (
            <div className="p-4 rounded-lg bg-red-900/30 text-red-400 text-sm border border-red-900/50 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-accent transition-colors">
                <Lock size={18} />
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                className="w-full pl-11 pr-4 py-3.5 bg-[#1a1a1a] border border-gray-800 rounded-xl focus:bg-[#222] focus:ring-2 focus:ring-accent/50 focus:border-accent outline-none transition-all text-sm text-white placeholder-gray-600"
                placeholder="Vault Password"
                autoFocus
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isPending || !password}
            className="relative w-full bg-accent hover:bg-blue-600 text-white font-semibold py-3.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_30px_rgba(37,99,235,0.4)]"
          >
            {isPending ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Unlocking...
              </>
            ) : (
              'Unlock Vault'
            )}
          </button>
        </form>

        <div className="mt-8 text-center relative z-10">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
            &larr; Return to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
