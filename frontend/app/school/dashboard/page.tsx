'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { schoolAPI } from '@/lib/api'
import DashboardLayout from '@/app/dashboard-layout'
import RoleGuard from '@/components/RoleGuard'
import { FiFileText, FiUsers, FiPlus } from 'react-icons/fi'

interface Job {
  id: number
  title: string
  description: string
  location: string
  posted_at: string
  is_active: boolean
}

interface Applicant {
  id: number
  teacher_name: string
  job_title: string
  status: string
  applied_at: string
}

export default function SchoolDashboard() {
  const [stats, setStats] = useState({ jobs: 0, applicants: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [jobsRes, applicantsRes] = await Promise.all([
        schoolAPI.postJob({}),
        schoolAPI.getApplicants(),
      ]).catch(() => [{ data: [] }, { data: [] }])

      setStats({
        jobs: Array.isArray(jobsRes.data) ? jobsRes.data.length : 0,
        applicants: Array.isArray(applicantsRes.data) ? applicantsRes.data.length : 0,
      })
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <RoleGuard allowedRoles={['school']}>
      <DashboardLayout>
        <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">School Dashboard</h1>
          <div className="flex gap-2">
            <Link href="/school/profile" className="btn-primary">
              My Profile
            </Link>
            <Link href="/school/jobs/new" className="btn-primary flex items-center gap-2">
              <FiPlus />
              Post Job
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Active Jobs</p>
                <p className="text-3xl font-bold">{stats.jobs}</p>
              </div>
              <FiFileText className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Total Applicants</p>
                <p className="text-3xl font-bold">{stats.applicants}</p>
              </div>
              <FiUsers className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/school/jobs" className="btn-secondary text-center">
              Manage Jobs
            </Link>
            <Link href="/school/applicants" className="btn-secondary text-center">
              View Applicants
            </Link>
            <Link href="/school/profile" className="btn-secondary text-center">
              Edit Profile
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
    </RoleGuard>
  )
}
