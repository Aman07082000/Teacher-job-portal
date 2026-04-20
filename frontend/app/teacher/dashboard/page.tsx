'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { jobAPI } from '@/lib/api'
import DashboardLayout from '@/app/dashboard-layout'
import RoleGuard from '@/components/RoleGuard'
import { FiSearch, FiMapPin, FiBriefcase } from 'react-icons/fi'

interface Job {
  id: number
  title: string
  description: string
  location: string
  subject_expertise: string
  salary_range: string
  posted_at: string
}

export default function TeacherDashboard() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      const response = await jobAPI.getAllJobs()
      setJobs(response.data)
    } catch (error) {
      console.error('Failed to fetch jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <RoleGuard allowedRoles={['teacher']}>
      <DashboardLayout>
        <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
          <div className="flex gap-2">
            <Link href="/teacher/profile" className="btn-primary">
              My Profile
            </Link>
            <Link href="/teacher/applications" className="btn-secondary">
              My Applications
            </Link>
          </div>
        </div>

        {/* Search Jobs */}
        <div className="card">
          <div className="flex items-center gap-3">
            <FiSearch className="w-6 h-6 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs by title or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
            />
          </div>
        </div>

        {/* Job Listings */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Available Jobs</h2>
          {loading ? (
            <div className="text-center py-8">Loading jobs...</div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No jobs found</div>
          ) : (
            filteredJobs.map((job) => (
              <div key={job.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-blue-600 mb-2">
                      {job.title}
                    </h3>
                    <p className="text-gray-600 mb-3">{job.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <FiMapPin className="w-4 h-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <FiBriefcase className="w-4 h-4" />
                        {job.subject_expertise}
                      </div>
                      <div>Salary: {job.salary_range}</div>
                    </div>
                  </div>
                  <Link
                    href={`/teacher/jobs/${job.id}`}
                    className="btn-primary"
                  >
                    View & Apply
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
    </RoleGuard>
  )
}
