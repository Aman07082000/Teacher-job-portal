'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FiEdit2, FiTrash2, FiPlus, FiEye, FiUsers } from 'react-icons/fi'
import RoleGuard from '@/components/RoleGuard'

interface PostedJob {
  id: number
  title: string
  location: string
  postedDate: string
  status: 'active' | 'closed' | 'draft'
  applicants: number
  views: number
  salaryMax: number
  salaryMin: number
}

const mockJobs: PostedJob[] = [
  {
    id: 1,
    title: 'Senior English Teacher',
    location: 'New Delhi',
    postedDate: '2 days ago',
    status: 'active',
    applicants: 12,
    views: 245,
    salaryMin: 30000,
    salaryMax: 50000,
  },
  {
    id: 2,
    title: 'Mathematics Teacher',
    location: 'Mumbai',
    postedDate: '1 week ago',
    status: 'active',
    applicants: 8,
    views: 180,
    salaryMin: 25000,
    salaryMax: 40000,
  },
  {
    id: 3,
    title: 'Science Coordinator',
    location: 'Bangalore',
    postedDate: '2 weeks ago',
    status: 'closed',
    applicants: 5,
    views: 120,
    salaryMin: 35000,
    salaryMax: 55000,
  },
]

export default function SchoolJobsPage() {
  const [jobs, setJobs] = useState<PostedJob[]>(mockJobs)
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'closed' | 'draft'>('all')

  const filteredJobs = filterStatus === 'all' ? jobs : jobs.filter(job => job.status === filterStatus)

  const deleteJob = (id: number) => {
    if (confirm('Are you sure you want to delete this job?')) {
      setJobs(jobs.filter(job => job.id !== id))
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
      case 'closed':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
      default:
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
    }
  }

  return (
    <RoleGuard allowedRoles={['school']}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Manage Job Postings</h1>
            <p className="text-gray-600 dark:text-gray-400">{jobs.length} jobs posted</p>
          </div>
          <Link
            href="/school/post-job"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold flex items-center gap-2"
          >
            <FiPlus className="w-5 h-5" />
            Post New Job
          </Link>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          {(['all', 'active', 'closed', 'draft'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-6 py-2 rounded-full font-medium transition-colors whitespace-nowrap ${
                filterStatus === status
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              {status !== 'all' && ` (${jobs.filter(j => j.status === status).length})`}
            </button>
          ))}
        </div>

        {/* Jobs Table */}
        {filteredJobs.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-12 text-center">
            <div className="mb-4 text-5xl">💼</div>
            <h2 className="text-2xl font-bold mb-2">No jobs {filterStatus !== 'all' ? filterStatus : ''}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {filterStatus === 'all' 
                ? 'You haven\'t posted any jobs yet.'
                : `You don't have any ${filterStatus} jobs.`}
            </p>
            <Link
              href="/school/post-job"
              className="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Post Your First Job
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredJobs.map(job => (
              <div
                key={job.id}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-center">
                  {/* Job Info */}
                  <div className="lg:col-span-2">
                    <Link href={`/school/jobs/${job.id}`} className="cursor-pointer">
                      <h3 className="text-xl font-bold text-purple-600 dark:text-purple-400 hover:underline mb-2">
                        {job.title}
                      </h3>
                    </Link>
                    <p className="text-gray-600 dark:text-gray-400">{job.location}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">Posted {job.postedDate}</p>
                  </div>

                  {/* Metrics */}
                  <div className="flex gap-6">
                    <div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                        <FiUsers className="w-4 h-4" />
                        <span className="text-sm">Applicants</span>
                      </div>
                      <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{job.applicants}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                        <FiEye className="w-4 h-4" />
                        <span className="text-sm">Views</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">{job.views}</p>
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex items-center justify-between gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(job.status)}`}>
                      {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                    </span>

                    <div className="flex gap-2">
                      <Link
                        href={`/school/applicants/${job.id}`}
                        title="View applicants"
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-blue-600 dark:text-blue-400"
                      >
                        <FiUsers className="w-5 h-5" />
                      </Link>
                      <Link
                        href={`/school/jobs/${job.id}/edit`}
                        title="Edit job"
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-orange-600 dark:text-orange-400"
                      >
                        <FiEdit2 className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => deleteJob(job.id)}
                        title="Delete job"
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-red-600 dark:text-red-400"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </RoleGuard>
  )
}
