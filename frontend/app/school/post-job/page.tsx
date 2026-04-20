'use client'

import { useState } from 'react'
import { FiArrowLeft, FiCheck, FiAlertCircle } from 'react-icons/fi'
import Link from 'next/link'
import RoleGuard from '@/components/RoleGuard'

interface JobForm {
  title: string
  description: string
  location: string
  jobType: string
  experienceRequired: number
  salaryMin: number
  salaryMax: number
  qualifications: string
  responsibilities: string
  subjects: string[]
}

export default function PostJobPage() {
  const [formData, setFormData] = useState<JobForm>({
    title: '',
    description: '',
    location: '',
    jobType: 'Full-time',
    experienceRequired: 0,
    salaryMin: 0,
    salaryMax: 0,
    qualifications: '',
    responsibilities: '',
    subjects: [],
  })

  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('Salary') || name === 'experienceRequired' ? parseInt(value) : value,
    }))
  }

  const validateForm = () => {
    const newErrors = []
    if (!formData.title.trim()) newErrors.push('Job title is required')
    if (!formData.location.trim()) newErrors.push('Location is required')
    if (!formData.description.trim()) newErrors.push('Job description is required')
    if (formData.salaryMax < formData.salaryMin) newErrors.push('Max salary must be greater than min salary')
    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 3000)
    }
  }

  return (
    <RoleGuard allowedRoles={['school']}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/school/jobs" className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-6">
          <FiArrowLeft className="w-4 h-4" />
          Back to Jobs
        </Link>

        <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-8 rounded-lg mb-8">
          <h1 className="text-4xl font-bold mb-2">Post a New Job</h1>
          <p className="text-purple-100">Fill in the details below to create and publish your job posting</p>
        </div>

        {errors.length > 0 && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <div className="flex gap-3 mb-2">
              <FiAlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
              <p className="font-semibold text-red-600 dark:text-red-400">Please fix the following errors:</p>
            </div>
            <ul className="list-disc list-inside space-y-1 text-red-600 dark:text-red-400">
              {errors.map((error, idx) => (
                <li key={idx}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {submitted && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6 flex items-center gap-3">
            <FiCheck className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
            <p className="text-green-600 dark:text-green-400 font-semibold">Job posted successfully! ✓</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          {/* Job Title Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  Job Title *
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="e.g., Senior Mathematics Teacher"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  placeholder="e.g., New Delhi, India"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  Job Type
                </label>
                <select
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Temporary">Temporary</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  Experience Required (Years)
                </label>
                <input
                  type="number"
                  name="experienceRequired"
                  value={formData.experienceRequired}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Salary Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Salary Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  Minimum Salary (₹)
                </label>
                <input
                  type="number"
                  name="salaryMin"
                  value={formData.salaryMin}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  Maximum Salary (₹)
                </label>
                <input
                  type="number"
                  name="salaryMax"
                  value={formData.salaryMax}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Job Details</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                Job Description *
              </label>
              <textarea
                name="description"
                placeholder="Describe the role, responsibilities, and what makes this job unique..."
                value={formData.description}
                onChange={handleInputChange}
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                Key Responsibilities
              </label>
              <textarea
                name="responsibilities"
                placeholder="List the main responsibilities of the position..."
                value={formData.responsibilities}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                Required Qualifications
              </label>
              <textarea
                name="qualifications"
                placeholder="List the required qualifications, certifications, and skills..."
                value={formData.qualifications}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="submit"
              className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold"
            >
              Publish Job
            </button>
            <Link
              href="/school/jobs"
              className="flex-1 border-2 border-purple-600 dark:border-purple-400 text-purple-600 dark:text-purple-400 py-3 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors font-semibold text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </RoleGuard>
  )
}
