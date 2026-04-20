'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/app/dashboard-layout'
import RoleGuard from '@/components/RoleGuard'
import { adminAPI } from '@/lib/api'

interface Job {
  id: number
  title: string
  description: string
  location: string
  subject_expertise: string
  is_active: boolean
  posted_at: string
}

export default function MonitorJobs() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      const response = await adminAPI.monitorJobs()
      setJobs(response.data)
    } catch (error) {
      console.error('Failed to fetch jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <RoleGuard allowedRoles={['admin']}>
      <DashboardLayout>
        <div className="space-y-6">
        <h1 className="text-3xl font-bold">Job Monitoring</h1>

        {loading ? (
          <div className="text-center py-8">Loading jobs...</div>
        ) : jobs.length === 0 ? (
          <div className="card text-center py-8">
            <p className="text-gray-500">No jobs found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job.id} className="card">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-blue-600 mb-2">
                      {job.title}
                    </h3>
                    <p className="text-gray-600 mb-2">{job.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <div>📍 {job.location}</div>
                      <div>📚 {job.subject_expertise}</div>
                      <div>📅 {new Date(job.posted_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div>
                    <span
                      className={`px-4 py-2 rounded-lg font-semibold ${
                        job.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {job.is_active ? 'Active' : 'Inactive'}
                    </span>
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
