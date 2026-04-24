'use client'

import React, { useState, useEffect } from 'react'
import { advancedAPI } from '@/lib/api'
import { useAuthStore } from '@/lib/store'

interface InterviewExperience {
  id: number
  teacher_name: string
  rating: number
  experience_type: string
  difficulty_level: string
  experience_description: string
  questions_asked?: string
  tips_for_candidates?: string
  posted_at: string
}

interface ShareExperienceProps {
  schoolId?: number
  jobId?: number
  onSuccess?: () => void
}

export default function InterviewExperiences({
  schoolId,
  jobId,
  onSuccess
}: ShareExperienceProps) {
  const { user } = useAuthStore()
  const [experiences, setExperiences] = useState<InterviewExperience[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    rating: 5,
    experience_type: 'phone',
    difficulty_level: 'medium',
    experience_description: '',
    questions_asked: '',
    tips_for_candidates: ''
  })

  useEffect(() => {
    fetchExperiences()
  }, [schoolId, jobId])

  const fetchExperiences = async () => {
    setLoading(true)
    try {
      let response
      if (schoolId) {
        response = await advancedAPI.getSchoolInterviewExperiences(schoolId)
      } else if (jobId) {
        response = await advancedAPI.getJobInterviewExperiences(jobId)
      }
      if (response) {
        setExperiences(response.data)
      }
    } catch (error) {
      console.error('Error fetching interview experiences:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await advancedAPI.shareInterviewExperience({
        school_id: schoolId,
        job_id: jobId,
        ...formData
      })
      setFormData({
        rating: 5,
        experience_type: 'phone',
        difficulty_level: 'medium',
        experience_description: '',
        questions_asked: '',
        tips_for_candidates: ''
      })
      setShowForm(false)
      fetchExperiences()
      if (onSuccess) onSuccess()
    } catch (error) {
      console.error('Error sharing experience:', error)
    }
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600'
    if (rating >= 3) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">📝 Interview Experiences</h3>
        {user && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
          >
            {showForm ? '✕ Close' : '➕ Share Your Experience'}
          </button>
        )}
      </div>

      {/* Share Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Rating</label>
              <select
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {[1, 2, 3, 4, 5].map((r) => (
                  <option key={r} value={r}>
                    {'⭐'.repeat(r)} {r} stars
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Interview Type</label>
              <select
                value={formData.experience_type}
                onChange={(e) => setFormData({ ...formData, experience_type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="phone">Phone</option>
                <option value="video">Video</option>
                <option value="in-person">In-Person</option>
                <option value="group">Group</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Difficulty Level</label>
            <select
              value={formData.difficulty_level}
              onChange={(e) => setFormData({ ...formData, difficulty_level: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Your Experience</label>
            <textarea
              value={formData.experience_description}
              onChange={(e) => setFormData({ ...formData, experience_description: e.target.value })}
              placeholder="Describe your interview experience..."
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Questions Asked (optional)</label>
            <textarea
              value={formData.questions_asked}
              onChange={(e) => setFormData({ ...formData, questions_asked: e.target.value })}
              placeholder="Share questions you were asked..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tips for Candidates (optional)</label>
            <textarea
              value={formData.tips_for_candidates}
              onChange={(e) => setFormData({ ...formData, tips_for_candidates: e.target.value })}
              placeholder="Share helpful tips for other candidates..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-20"
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium"
          >
            Share Experience
          </button>
        </form>
      )}

      {/* Experiences List */}
      {loading ? (
        <div className="text-center py-8">Loading experiences...</div>
      ) : experiences.length > 0 ? (
        <div className="space-y-4">
          {experiences.map((exp) => (
            <div key={exp.id} className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold text-gray-900">{exp.teacher_name}</p>
                  <div className="flex gap-3 mt-1 text-sm text-gray-600">
                    <span>
                      <strong className={`${getRatingColor(exp.rating)}`}>
                        {exp.rating}⭐
                      </strong>
                    </span>
                    <span>📞 {exp.experience_type}</span>
                    <span>📊 {exp.difficulty_level}</span>
                  </div>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(exp.posted_at).toLocaleDateString()}
                </span>
              </div>

              <p className="text-gray-700 mb-3">{exp.experience_description}</p>

              {exp.questions_asked && (
                <div className="mb-3 p-3 bg-gray-50 rounded">
                  <p className="font-medium text-sm text-gray-900 mb-1">Questions Asked:</p>
                  <p className="text-sm text-gray-700">{exp.questions_asked}</p>
                </div>
              )}

              {exp.tips_for_candidates && (
                <div className="p-3 bg-green-50 rounded">
                  <p className="font-medium text-sm text-green-900 mb-1">💡 Tips for Candidates:</p>
                  <p className="text-sm text-green-800">{exp.tips_for_candidates}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-600">No interview experiences shared yet</p>
          <p className="text-sm text-gray-500 mt-1">Be the first to share your experience!</p>
        </div>
      )}
    </div>
  )
}
