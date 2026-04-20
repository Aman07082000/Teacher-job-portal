'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import DashboardLayout from '@/app/dashboard-layout'
import RoleGuard from '@/components/RoleGuard'
import { jobAPI, teacherAPI } from '@/lib/api'
import { FiMapPin, FiBriefcase, FiDollarSign, FiCalendar, FiArrowLeft } from 'react-icons/fi'

interface Job {
  id: number
  title: string
  description: string
  location: string
  subject_expertise: string
  salary_range: string
  posted_at: string
}

export default function JobDetail() {
  const params = useParams()
  const router = useRouter()
  const jobId = params.id as string

  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [showApplyForm, setShowApplyForm] = useState(false)
  const [coverLetter, setCoverLetter] = useState('')
  const [experienceYears, setExperienceYears] = useState('')
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [error, setError] = useState('')

  const fetchJobDetails = useCallback(async () => {
    try {
      // For now, we'll get all jobs and find the specific one
      // In a real app, you'd have a dedicated endpoint for single job
      const response = await jobAPI.getAllJobs()
      const foundJob = response.data.find((j: Job) => j.id === parseInt(jobId))

      if (foundJob) {
        setJob(foundJob)
      } else {
        setError('Job not found')
      }
    } catch (err) {
      console.error('Failed to fetch job details:', err)
      setError('Failed to load job details')
    } finally {
      setLoading(false)
    }
  }, [jobId])

  useEffect(() => {
    fetchJobDetails()
  }, [jobId, fetchJobDetails])

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!coverLetter.trim()) {
      setError('Please provide a cover letter')
      return
    }
    if (!experienceYears.trim() || isNaN(Number(experienceYears))) {
      setError('Please enter your experience in years (number)')
      return
    }
    if (!resumeFile) {
      setError('Please upload your resume (PDF, DOC, DOCX)')
      return
    }

    setApplying(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('coverLetter', coverLetter)
      formData.append('experience_years', experienceYears)
      formData.append('resume', resumeFile)

      await teacherAPI.applyJob(parseInt(jobId), formData)
      alert('Application submitted successfully!')
      setShowApplyForm(false)
      setCoverLetter('')
      setExperienceYears('')
      setResumeFile(null)
      router.push('/teacher/applications')
    } catch (err: any) {
      console.error('Failed to apply:', err)
      setError(err.response?.data?.error || 'Failed to submit application')
    } finally {
      setApplying(false)
    }
  }

  if (loading) {
    return (
      <RoleGuard allowedRoles={['teacher']}>
        <DashboardLayout>
          <div className="flex justify-center items-center min-h-96">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        </DashboardLayout>
      </RoleGuard>
    )
  }

  if (error && !job) {
    return (
      <RoleGuard allowedRoles={['teacher']}>
        <DashboardLayout>
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => router.push('/teacher/dashboard')}
              className="btn-primary"
            >
              Back to Dashboard
            </button>
          </div>
        </DashboardLayout>
      </RoleGuard>
    )
  }

  if (!job) return null

  return (
    <RoleGuard allowedRoles={['teacher']}>
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Back Button */}
          <button
            onClick={() => router.push('/teacher/dashboard')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <FiArrowLeft className="w-5 h-5" />
            Back to Jobs
          </button>

          {/* Job Header */}
          <div className="card">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-blue-600 mb-2">{job.title}</h1>
                <div className="flex flex-wrap gap-4 text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <FiMapPin className="w-5 h-5" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <FiBriefcase className="w-5 h-5" />
                    {job.subject_expertise}
                  </div>
                  <div className="flex items-center gap-1">
                    <FiDollarSign className="w-5 h-5" />
                    {job.salary_range}
                  </div>
                  <div className="flex items-center gap-1">
                    <FiCalendar className="w-5 h-5" />
                    Posted {new Date(job.posted_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowApplyForm(true)}
                className="btn-primary"
                disabled={showApplyForm}
              >
                Apply Now
              </button>
            </div>
          </div>

          {/* Job Description */}
          <div className="card">
            <h2 className="text-2xl font-bold mb-4">Job Description</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{job.description}</p>
            </div>
          </div>

          {/* Application Form */}
          {showApplyForm && (
            <div className="card border-2 border-blue-200">
              <h2 className="text-2xl font-bold mb-4">Apply for this Position</h2>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleApply} className="space-y-4" encType="multipart/form-data">
                <div>
                  <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Cover Letter *
                  </label>
                  <textarea
                    id="coverLetter"
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Tell us why you're interested in this position and why you'd be a great fit..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-32"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="experienceYears" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Experience (in years) *
                  </label>
                  <input
                    id="experienceYears"
                    type="number"
                    min="0"
                    value={experienceYears}
                    onChange={e => setExperienceYears(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 5"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="resume" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Upload Resume (PDF, DOC, DOCX) *
                  </label>
                  <input
                    id="resume"
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={e => setResumeFile(e.target.files?.[0] || null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={applying}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {applying ? 'Submitting...' : 'Submit Application'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowApplyForm(false)
                      setCoverLetter('')
                      setExperienceYears('')
                      setResumeFile(null)
                      setError('')
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Requirements Section */}
          <div className="card">
            <h2 className="text-2xl font-bold mb-4">Requirements</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>Bachelor&apos;s degree in Education or related field</li>
              <li>Teaching certification in {job.subject_expertise}</li>
              <li>Experience teaching at appropriate grade level</li>
              <li>Strong communication and classroom management skills</li>
              <li>Commitment to student success and professional development</li>
            </ul>
          </div>
        </div>
      </DashboardLayout>
    </RoleGuard>
  )
}