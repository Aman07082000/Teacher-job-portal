'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import DashboardLayout from '@/app/dashboard-layout'
import RoleGuard from '@/components/RoleGuard'
import { teacherAPI, jobAPI } from '@/lib/api'
import { FiArrowLeft, FiDownload, FiAlertCircle, FiCheckCircle, FiFileText, FiBriefcase, FiCalendar, FiMapPin } from 'react-icons/fi'
import Link from 'next/link'

interface Application {
  id: number
  job_id: number
  status: 'submitted' | 'shortlisted' | 'rejected' | 'interview' | 'hired'
  cover_letter: string
  experience_years: number
  resume_url: string
  applied_at: string
  updated_at: string
}

interface Job {
  id: number
  title: string
  description: string
  location: string
  subject_expertise: string
  salary_range: string
  school_name?: string
  posted_at: string
}

interface ApplicationTimeline {
  status: string
  date: string
  description: string
  icon: React.ReactNode
}

export default function ApplicationDetail() {
  const params = useParams()
  const router = useRouter()
  const applicationId = params.id as string

  const [application, setApplication] = useState<Application | null>(null)
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchApplicationDetails = useCallback(async () => {
    try {
      // Fetch application details
      const appResponse = await teacherAPI.getApplicationDetail(parseInt(applicationId))
      setApplication(appResponse.data)

      // Fetch job details
      const jobResponse = await jobAPI.getJobById(appResponse.data.job_id)
      setJob(jobResponse.data)
    } catch (err: any) {
      console.error('Failed to fetch application details:', err)
      setError(err.response?.data?.error || 'Failed to load application details')
    } finally {
      setLoading(false)
    }
  }, [applicationId])

  useEffect(() => {
    fetchApplicationDetails()
  }, [applicationId, fetchApplicationDetails])

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'submitted':
        return { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', icon: '📩', label: 'Submitted' }
      case 'shortlisted':
        return { color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200', icon: '⭐', label: 'Shortlisted' }
      case 'interview':
        return { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', icon: '📞', label: 'Interview Scheduled' }
      case 'hired':
        return { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', icon: '🎉', label: 'Hired' }
      case 'rejected':
        return { color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', icon: '❌', label: 'Not Selected' }
      default:
        return { color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200', icon: '📄', label: 'Pending' }
    }
  }

  const getTimeline = (): ApplicationTimeline[] => {
    const timeline: ApplicationTimeline[] = [
      {
        status: 'submitted',
        date: application?.applied_at ? new Date(application.applied_at).toLocaleDateString() : '',
        description: 'Your application was submitted',
        icon: '📩',
      },
    ]

    if (application?.status === 'shortlisted' || application?.status === 'interview' || application?.status === 'hired') {
      timeline.push({
        status: 'shortlisted',
        date: new Date(application?.updated_at || '').toLocaleDateString(),
        description: 'You were shortlisted for this position',
        icon: '⭐',
      })
    }

    if (application?.status === 'interview' || application?.status === 'hired') {
      timeline.push({
        status: 'interview',
        date: new Date(application?.updated_at || '').toLocaleDateString(),
        description: 'Interview scheduled - Check your email for details',
        icon: '📞',
      })
    }

    if (application?.status === 'hired') {
      timeline.push({
        status: 'hired',
        date: new Date(application?.updated_at || '').toLocaleDateString(),
        description: 'Congratulations! You have been hired',
        icon: '🎉',
      })
    }

    if (application?.status === 'rejected') {
      timeline.push({
        status: 'rejected',
        date: new Date(application?.updated_at || '').toLocaleDateString(),
        description: 'Unfortunately, you were not selected for this position',
        icon: '❌',
      })
    }

    return timeline
  }

  if (loading) {
    return (
      <RoleGuard allowedRoles={['teacher']}>
        <DashboardLayout>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </DashboardLayout>
      </RoleGuard>
    )
  }

  if (error || !application || !job) {
    return (
      <RoleGuard allowedRoles={['teacher']}>
        <DashboardLayout>
          <div className="space-y-4">
            <Link href="/teacher/applications" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
              <FiArrowLeft className="w-5 h-5" />
              Back to Applications
            </Link>
            <div className="card bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-red-800 dark:text-red-300">{error || 'Application not found'}</p>
            </div>
          </div>
        </DashboardLayout>
      </RoleGuard>
    )
  }

  const statusInfo = getStatusInfo(application.status)
  const timeline = getTimeline()

  return (
    <RoleGuard allowedRoles={['teacher']}>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <Link href="/teacher/applications" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mb-4">
              <FiArrowLeft className="w-5 h-5" />
              Back to Applications
            </Link>
          </div>

          {/* Status Overview */}
          <div className="card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {job.title}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  {job.school_name || 'School Name'}
                </p>
              </div>
              <div className={`px-6 py-3 rounded-lg text-center ${statusInfo.color}`}>
                <div className="text-3xl mb-2">{statusInfo.icon}</div>
                <div className="font-bold text-lg">{statusInfo.label}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Application & Job Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Your Application */}
              <div className="card">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <FiFileText className="w-6 h-6 text-blue-600" />
                  Your Application
                </h2>

                <div className="space-y-4">
                  {/* Cover Letter */}
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Cover Letter</h3>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {application.cover_letter}
                      </p>
                    </div>
                  </div>

                  {/* Experience */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Years of Experience</p>
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{application.experience_years}</p>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Applied On</p>
                      <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                        {new Date(application.applied_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Resume Download */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
                      <FiDownload className="w-5 h-5" />
                      Download Resume
                    </button>
                  </div>
                </div>
              </div>

              {/* Job Details */}
              <div className="card">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <FiBriefcase className="w-6 h-6 text-blue-600" />
                  Job Details
                </h2>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <FiMapPin className="w-5 h-5 text-gray-600 dark:text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Location</p>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">{job.location}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <FiBriefcase className="w-5 h-5 text-gray-600 dark:text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Subject/Expertise</p>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">{job.subject_expertise}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <FiFileText className="w-5 h-5 text-gray-600 dark:text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Salary Range</p>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">{job.salary_range}</p>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Job Description</p>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{job.description}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Timeline */}
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
                <FiCalendar className="w-6 h-6 text-blue-600" />
                Application Timeline
              </h2>

              <div className="space-y-4">
                {timeline.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="text-2xl">{item.icon}</div>
                      {index < timeline.length - 1 && (
                        <div className="w-1 h-12 bg-gray-300 dark:bg-gray-600 mt-2"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="font-semibold text-gray-900 dark:text-gray-100">{item.status}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{item.date}</div>
                      <div className="text-sm text-gray-700 dark:text-gray-300 mt-1">{item.description}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Contact Info */}
              {(application.status === 'interview' || application.status === 'hired') && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                    <p className="flex items-center gap-2 text-green-800 dark:text-green-300 font-semibold">
                      <FiCheckCircle className="w-5 h-5" />
                      Check your email for updates
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </RoleGuard>
  )
}
