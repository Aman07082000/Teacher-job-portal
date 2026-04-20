'use client'

import { useState } from 'react'
import DashboardLayout from '@/app/dashboard-layout'
import { teacherAPI } from '@/lib/api'

export default function TeacherProfile() {
  const [formData, setFormData] = useState({
    subject_expertise: '',
    experience_years: '',
    location: '',
    summary: '',
  })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    setLoading(true)

    try {
      await teacherAPI.createProfile(formData)
      setMessage('Profile updated successfully!')
    } catch (error: any) {
      setMessage(error.response?.data?.error || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl">
        <h1 className="text-3xl font-bold">My Profile</h1>

        {message && (
          <div
            className={`p-4 rounded-lg ${
              message.includes('successfully')
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="card space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Subject Expertise
            </label>
            <input
              type="text"
              name="subject_expertise"
              value={formData.subject_expertise}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g., Mathematics, English, Science"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Years of Experience
            </label>
            <input
              type="number"
              name="experience_years"
              value={formData.experience_years}
              onChange={handleChange}
              className="input-field"
              placeholder="5"
              min="0"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="input-field"
              placeholder="City, State"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Professional Summary
            </label>
            <textarea
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              className="input-field"
              placeholder="Tell schools about your teaching experience and qualifications..."
              rows={5}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </DashboardLayout>
  )
}
