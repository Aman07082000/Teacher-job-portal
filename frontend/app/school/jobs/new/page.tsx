'use client'

import { useState } from 'react'
import DashboardLayout from '@/app/dashboard-layout'
import { schoolAPI } from '@/lib/api'

export default function PostJob() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    subject_expertise: '',
    salary_range: '',
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
      await schoolAPI.postJob(formData)
      setMessage('Job posted successfully!')
      setFormData({
        title: '',
        description: '',
        location: '',
        subject_expertise: '',
        salary_range: '',
      })
    } catch (error: any) {
      setMessage(error.response?.data?.error || 'Failed to post job')
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl">
        <h1 className="text-3xl font-bold">Post a New Job</h1>

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
              Job Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g., Mathematics Teacher"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Job Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="input-field"
              placeholder="Describe the job responsibilities and requirements..."
              rows={5}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Subject/Expertise
              </label>
              <input
                type="text"
                name="subject_expertise"
                value={formData.subject_expertise}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g., Mathematics, Science"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Salary Range
            </label>
            <input
              type="text"
              name="salary_range"
              value={formData.salary_range}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g., 30,000 - 50,000 per annum"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? 'Posting...' : 'Post Job'}
          </button>
        </form>
      </div>
    </DashboardLayout>
  )
}
