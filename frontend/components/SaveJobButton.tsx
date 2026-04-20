'use client'

import { useState, useEffect } from 'react'
import { FiBookmark } from 'react-icons/fi'
import { featuresAPI } from '@/lib/api'

interface SaveJobButtonProps {
  jobId: number
  onToggle?: (isSaved: boolean) => void
}

export default function SaveJobButton({ jobId, onToggle }: SaveJobButtonProps) {
  const [isSaved, setIsSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkIfSaved()
  }, [jobId])

  const checkIfSaved = async () => {
    try {
      const response = await featuresAPI.checkSavedJob(jobId)
      setIsSaved(response.data.isSaved)
    } catch (error) {
      console.error('Failed to check saved status:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggle = async () => {
    try {
      setLoading(true)
      if (isSaved) {
        await featuresAPI.removeSavedJob(jobId)
        setIsSaved(false)
      } else {
        await featuresAPI.saveJob(jobId)
        setIsSaved(true)
      }
      onToggle?.(!isSaved)
    } catch (error) {
      console.error('Failed to toggle saved status:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
        isSaved
          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200'
          : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
      } hover:shadow-md disabled:opacity-50`}
    >
      <FiBookmark className="w-5 h-5" fill={isSaved ? 'currentColor' : 'none'} />
      {isSaved ? 'Saved' : 'Save Job'}
    </button>
  )
}
