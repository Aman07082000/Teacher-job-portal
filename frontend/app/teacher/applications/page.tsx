'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import DashboardLayout from '@/app/dashboard-layout'
import { teacherAPI } from '@/lib/api'
import { useAuthStore } from '@/lib/store'
import { FiChevronRight, FiBriefcase, FiCalendar, FiAlertCircle } from 'react-icons/fi'

interface Application {
  id: number
  job_title: string
  school_name: string
  status: string
  applied_at: string
}

export default function TeacherApplications() {
  const { user } = useAuthStore()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>('all')

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      const response = await teacherAPI.trackApplications()
      setApplications(response.data)
    } catch (error) {
      console.error('Failed to fetch applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'shortlisted':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'interview':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'hired':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted':
        return '📩'
      case 'shortlisted':
        return '⭐'
      case 'interview':
        return '📞'
      case 'hired':
        return '🎉'
      case 'rejected':
        return '❌'
      default:
        return '📄'
    }
  }

  const filteredApplications =
    filterStatus === 'all'
      ? applications
      : applications.filter((app) => app.status === filterStatus)

  const stats = {
    total: applications.length,
    submitted: applications.filter((a) => a.status === 'submitted').length,
    shortlisted: applications.filter((a) => a.status === 'shortlisted').length,
    interview: applications.filter((a) => a.status === 'interview').length,
    hired: applications.filter((a) => a.status === 'hired').length,
    rejected: applications.filter((a) => a.status === 'rejected').length,
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">My Applications</h1>
          <p className="text-gray-600 dark:text-gray-400">Track and manage your job applications</p>
        </div>

        {/* Stats Cards */}
        {!loading && applications.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="card bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</p>
            </div>
            <div className="card bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
              <p className="text-sm text-gray-600 dark:text-gray-400">Shortlisted</p>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.shortlisted}</p>
            </div>
            <div className="card bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
              <p className="text-sm text-gray-600 dark:text-gray-400">Interviews</p>
              <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{stats.interview}</p>
            </div>
            <div className="card bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <p className="text-sm text-gray-600 dark:text-gray-400">Hired</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.hired}</p>
            </div>
            <div className="card bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-sm text-gray-600 dark:text-gray-400">Rejected</p>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400">{stats.rejected}</p>
            </div>
            <div className="card bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
              <p className="text-3xl font-bold text-gray-600 dark:text-gray-400">{stats.submitted}</p>
            </div>
          </div>
        )}

        {/* Filter Buttons */}
        {!loading && applications.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                filterStatus === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus('submitted')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                filterStatus === 'submitted'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilterStatus('shortlisted')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                filterStatus === 'shortlisted'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Shortlisted
            </button>
            <button
              onClick={() => setFilterStatus('interview')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                filterStatus === 'interview'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Interview
            </button>
          </div>
        )}

        {/* Applications List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : applications.length === 0 ? (
          <div className="card text-center py-12">
            <FiBriefcase className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-4">You haven&apos;t applied to any jobs yet.</p>
            <Link href="/teacher/dashboard" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors">
              Browse Jobs
            </Link>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="card text-center py-12">
            <FiAlertCircle className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No applications found with this filter.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((app) => (
              <Link key={app.id} href={`/teacher/applications/${app.id}`}>
                <div className="card hover:shadow-lg transition-shadow cursor-pointer group">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{getStatusIcon(app.status)}</span>
                        <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 group-hover:underline">
                          {app.job_title}
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <FiBriefcase className="w-4 h-4" />
                          <span>{app.school_name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <FiCalendar className="w-4 h-4" />
                          <span>Applied: {new Date(app.applied_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`px-4 py-2 rounded-lg font-semibold capitalize whitespace-nowrap ${getStatusColor(
                          app.status
                        )}`}
                      >
                        {app.status}
                      </span>
                      <FiChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-600 flex-shrink-0" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
