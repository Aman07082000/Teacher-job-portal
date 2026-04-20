'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FiTrash2, FiMapPin, FiDollarSign, FiChevronRight } from 'react-icons/fi'
import RoleGuard from '@/components/RoleGuard'

interface SavedJob {
  id: number
  title: string
  school_name: string
  location: string
  salary_min: number
  salary_max: number
  experience_required: number
  saved_date: string
}

const mockSavedJobs: SavedJob[] = [
  {
    id: 1,
    title: 'Senior English Teacher',
    school_name: 'Delhi Public School',
    location: 'New Delhi',
    salary_min: 30000,
    salary_max: 50000,
    experience_required: 5,
    saved_date: '2 days ago',
  },
  {
    id: 3,
    title: 'Science Teacher',
    school_name: 'Cathedral School',
    location: 'Bangalore',
    salary_min: 28000,
    salary_max: 45000,
    experience_required: 4,
    saved_date: '1 week ago',
  },
]

export default function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>(mockSavedJobs)

  const removeSavedJob = (jobId: number) => {
    setSavedJobs(savedJobs.filter(job => job.id !== jobId))
  }

  return (
    <RoleGuard allowedRoles={['teacher']}>
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
