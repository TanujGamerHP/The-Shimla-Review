'use client'

import { useState } from 'react'
import { runContentMigration } from '@/actions/migrate'

export default function MigrationButton() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success?: boolean; movedCount?: number; createdCount?: number; error?: string } | null>(null)

  async function handleMigrate() {
    if (!confirm('Are you sure you want to run the database content reorganization?')) return
    setLoading(true)
    setResult(null)
    try {
      const res = await runContentMigration()
      setResult(res as any)
    } catch (e: any) {
      setResult({ error: e.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-4 p-4 border border-blue-200 bg-blue-50 rounded-lg">
      <h3 className="font-semibold text-blue-800">Admin Tool: Reorganize Database Content</h3>
      <p className="text-sm text-blue-700 mt-1 mb-3">
        Clicking this button will move all current posts into their exact correct categories based on the provided titles, and create missing ones.
      </p>
      <button 
        onClick={handleMigrate}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium px-4 py-2 rounded-md shadow-sm transition-colors text-sm"
      >
        {loading ? 'Running Migration...' : 'Run Content Reorganization'}
      </button>

      {result && (
        <div className={`mt-3 p-3 rounded text-sm ${result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {result.success ? (
            <p>✅ Success! Moved {result.movedCount} items and created {result.createdCount} placeholders.</p>
          ) : (
            <p>❌ Error: {result.error}</p>
          )}
        </div>
      )}
    </div>
  )
}
