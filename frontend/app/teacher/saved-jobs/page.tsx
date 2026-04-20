'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import DashboardLayout from '@/app/dashboard-layout'
import RoleGuard from '@/components/RoleGuard'
import { featuresAPI } from '@/lib/api'
import { FiArrowLeft, FiMapPin, FiBriefcase, FiDollarSign, FiTrash2, FiArrowRight } from 'react-icons/fi'
import JobMatchScore from '@/components/JobMatchScore'

interface SavedJob {
  id: number
  title: string
  description: string
  location: string
  subject_expertise: string
  salary_range: string
  posted_at: string
  saved_at: string
}

export default function SavedJobsPage() {
  const [jobs, setJobs] = useState<SavedJob[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchSavedJobs()
  }, [])

  const fetchSavedJobs = async () => {
    try {
      setLoading(true)
      const response = await featuresAPI.getSavedJobs()
      setJobs(response.data)
    } catch (err) {
      console.error('Failed to fetch saved jobs:', err)
      setError('Failed to load saved jobs')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveSaved = async (jobId: number) => {
    try {
      await featuresAPI.removeSavedJob(jobId)
      setJobs(jobs.filter(job => job.id !== jobId))
    } catch (err) {
      console.error('Failed to remove saved job:', err)
    }
  }

  return (
    <RoleGuard allowedRoles={['teacher']}>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <Link href="/teacher/dashboard" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mb-4">
              <FiArrowLeft className="w-5 h-5" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Saved Jobs</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">{jobs.length} job{jobs.length !== 1 ? 's' : ''} saved</p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Jobs List */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : jobs.length === 0 ? (
            <div className="card text-center py-12">
              <div className="text-6xl mb-4">📌</div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">No saved jobs yet</p>
              <Link href="/teacher/browse-jobs" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors">
                Browse Jobs
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job.id} className="card hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Link href={`/teacher/jobs/${job.id}`}>
                        <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 hover:underline mb-2 cursor-pointer">
                          {job.title}
                        </h3>
                      </Link>

                      <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{job.description}</p>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <FiMapPin className="w-4 h-4" />
                          <span className="text-sm">{job.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <FiBriefcase className="w-4 h-4" />
                          <span className="text-sm">{job.subject_expertise}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <FiDollarSign className="w-4 h-4" />
                          <span className="text-sm">{job.salary_range}</span>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Saved {new Date(job.saved_at).toLocaleDateString()}
                        </div>
                      </div>

                      <JobMatchScore jobId={job.id} size="small" />
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Link href={`/teacher/jobs/${job.id}`} className="flex items-center gap-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors">
                        View
                        <FiArrowRight className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleRemoveSaved(job.id)}
                        className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
                        title="Remove from saved"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>
    </RoleGuard>
  )
}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Saved Jobs</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {savedJobs.length} job{savedJobs.length !== 1 ? 's' : ''} saved
          </p>
        </div>

        {savedJobs.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-12 text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto">
                <span className="text-3xl">💼</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2">No Saved Jobs</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You haven&apos;t saved any jobs yet. Browse jobs and save them for later!
            </p>
            <Link
              href="/teacher/browse-jobs"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {savedJobs.map(job => (
              <div
                key={job.id}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow flex justify-between items-center gap-4"
              >
                <Link href={`/teacher/jobs/${job.id}`} className="flex-1">
                  <div className="cursor-pointer hover:opacity-80 transition-opacity">
                    <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                      {job.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 font-medium mb-3">
                      {job.school_name}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                        <FiMapPin className="w-4 h-4" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                        <FiDollarSign className="w-4 h-4" />
                        <span>₹{job.salary_min.toLocaleString()}-{job.salary_max.toLocaleString()}</span>
                      </div>
                      <div className="text-gray-600 dark:text-gray-400 text-sm">
                        {job.experience_required}+ yrs exp
                      </div>
                      <div className="text-gray-500 dark:text-gray-500 text-sm">
                        Saved {job.saved_date}
                      </div>
                    </div>
                  </div>
                </Link>

                <div className="flex gap-2">
                  <Link
                    href={`/teacher/jobs/${job.id}`}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
                  >
                    View <FiChevronRight className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => removeSavedJob(job.id)}
                    className="bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-2 rounded-md hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
                    title="Remove from saved"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </RoleGuard>
  )
}
