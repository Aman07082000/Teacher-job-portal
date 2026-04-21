'use client'

import React, { useState } from 'react'
import { teacherAPI } from '@/lib/api'

interface OneClickApplyProps {
  jobId: number
  onSuccess?: () => void
}

export default function OneClickApply({ jobId, onSuccess }: OneClickApplyProps) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleQuickApply = async () => {
    setLoading(true)
    setMessage('')
    setError('')
    
    try {
      // Create a FormData object with just the job ID
      // This assumes the backend has user's resume on file
      await teacherAPI.applyJob(jobId, {
        resume_id: null, // Use default resume
        cover_letter: '', // Optional
      })
      
      setMessage('✅ Applied successfully!')
      if (onSuccess) {
        onSuccess()
      }
      
      setTimeout(() => {
        setMessage('')
      }, 3000)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to apply. Please try again.')
      setTimeout(() => {
        setError('')
      }, 3000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleQuickApply}
        disabled={loading}
        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <span className="inline-block animate-spin">⟳</span>
            Applying...
          </>
        ) : (
          <>⚡ One-Click Apply</>
        )}
      </button>
      
      {message && (
        <div className="px-3 py-2 bg-green-100 text-green-800 rounded-lg text-sm">
          {message}
        </div>
      )}
      
      {error && (
        <div className="px-3 py-2 bg-red-100 text-red-800 rounded-lg text-sm">
          {error}
        </div>
      )}
    </div>
  )
}
