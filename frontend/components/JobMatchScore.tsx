'use client'

import { useState, useEffect } from 'react'
import { FiTarget } from 'react-icons/fi'
import { featuresAPI } from '@/lib/api'

interface JobMatchScoreProps {
  jobId: number
  showLabel?: boolean
  size?: 'small' | 'medium' | 'large'
}

export default function JobMatchScore({ jobId, showLabel = true, size = 'medium' }: JobMatchScoreProps) {
  const [score, setScore] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMatchScore()
  }, [jobId])

  const fetchMatchScore = async () => {
    try {
      const response = await featuresAPI.getJobMatchScore(jobId)
      setScore(response.data.match_score)
    } catch (error) {
      console.error('Failed to fetch match score:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="animate-pulse bg-gray-200 h-10 rounded-lg w-16"></div>
  }

  if (score === null) return null

  const getScoreColor = () => {
    if (score >= 80) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    if (score >= 60) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    if (score >= 40) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }

  const getScoreLabel = () => {
    if (score >= 80) return 'Perfect Match'
    if (score >= 60) return 'Good Match'
    if (score >= 40) return 'Fair Match'
    return 'Low Match'
  }

  const sizeClasses = {
    small: 'h-8 w-8 text-sm',
    medium: 'h-12 w-12 text-base',
    large: 'h-16 w-16 text-xl',
  }

  return (
    <div className="flex items-center gap-3">
      <div className={`flex items-center justify-center rounded-full font-bold ${getScoreColor()} ${sizeClasses[size]}`}>
        {score}%
      </div>
      {showLabel && (
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{getScoreLabel()}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Match Score</p>
        </div>
      )}
    </div>
  )
}
