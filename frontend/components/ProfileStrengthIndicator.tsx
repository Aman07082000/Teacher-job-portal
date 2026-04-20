'use client'

import { useState, useEffect } from 'react'
import { FiAlertCircle, FiCheckCircle } from 'react-icons/fi'
import { featuresAPI } from '@/lib/api'

interface ProfileStrengthIndicatorProps {
  teacherId: number
  showDetails?: boolean
}

export default function ProfileStrengthIndicator({ teacherId, showDetails = true }: ProfileStrengthIndicatorProps) {
  const [strength, setStrength] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProfileStrength()
  }, [teacherId])

  const fetchProfileStrength = async () => {
    try {
      const response = await featuresAPI.getProfileStrength(teacherId)
      setStrength(response.data)
    } catch (error) {
      console.error('Failed to fetch profile strength:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="animate-pulse bg-gray-200 h-8 rounded-lg w-full"></div>
  }

  if (!strength) return null

  const percentage = strength.strength_percentage || 0
  const getColor = () => {
    if (percentage >= 80) return 'bg-green-500'
    if (percentage >= 60) return 'bg-yellow-500'
    if (percentage >= 40) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const getLabel = () => {
    if (percentage >= 80) return 'Excellent'
    if (percentage >= 60) return 'Good'
    if (percentage >= 40) return 'Fair'
    return 'Need to improve'
  }

  const getMissing = () => {
    const missing = []
    if (!strength.has_photo) missing.push('Add a profile photo')
    if (!strength.has_resume) missing.push('Upload your resume')
    if (!strength.has_bio) missing.push('Write your bio')
    if (!strength.has_experience_years) missing.push('Add your experience')
    if (!strength.has_certifications) missing.push('Add certifications')
    return missing
  }

  const missing = getMissing()

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Profile Strength</h3>
        <span className={`text-sm font-bold px-3 py-1 rounded-full text-white ${getColor()}`}>
          {getLabel()}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-3 overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${getColor()}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>

      <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        {percentage}% Complete
      </div>

      {/* Details */}
      {showDetails && missing.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start gap-2 mb-2">
            <FiAlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-blue-900 dark:text-blue-300 mb-2">Complete your profile to:</p>
              <ul className="space-y-1">
                {missing.map((item, idx) => (
                  <li key={idx} className="text-sm text-blue-800 dark:text-blue-300 flex items-center gap-2">
                    <span className="text-lg">•</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Completed Items */}
      {showDetails && percentage >= 40 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Completed</p>
          <div className="space-y-1 text-sm">
            {strength.has_photo && (
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <FiCheckCircle className="w-4 h-4" />
                Profile photo
              </div>
            )}
            {strength.has_resume && (
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <FiCheckCircle className="w-4 h-4" />
                Resume uploaded
              </div>
            )}
            {strength.has_bio && (
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <FiCheckCircle className="w-4 h-4" />
                Bio completed
              </div>
            )}
            {strength.has_experience_years && (
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <FiCheckCircle className="w-4 h-4" />
                Experience added
              </div>
            )}
            {strength.has_certifications && (
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <FiCheckCircle className="w-4 h-4" />
                Certifications added
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
