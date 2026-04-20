'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/app/dashboard-layout'
import RoleGuard from '@/components/RoleGuard'
import { adminAPI } from '@/lib/api'
import { FiUsers, FiFileText, FiCheckCircle, FiTrendingUp } from 'react-icons/fi'

interface Analytics {
  users_count: number
  jobs_count: number
  applications_count: number
  shortlisted_count: number
}

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<Analytics>({
    users_count: 0,
    jobs_count: 0,
    applications_count: 0,
    shortlisted_count: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await adminAPI.getAnalytics()
      setAnalytics(response.data)
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Total Users',
      value: analytics.users_count,
      icon: FiUsers,
      color: 'blue',
    },
    {
      title: 'Active Jobs',
      value: analytics.jobs_count,
      icon: FiFileText,
      color: 'green',
    },
    {
      title: 'Total Applications',
      value: analytics.applications_count,
      icon: FiTrendingUp,
      color: 'purple',
    },
    {
      title: 'Shortlisted',
      value: analytics.shortlisted_count,
      icon: FiCheckCircle,
      color: 'yellow',
    },
  ]

  return (
    <RoleGuard allowedRoles={['admin']}>
      <DashboardLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">{stat.title}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <Icon className={`w-12 h-12 text-${stat.color}-600 opacity-20`} />
                </div>
              </div>
            )
          })}
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card">
            <h3 className="text-lg font-bold mb-3">Users Management</h3>
            <p className="text-gray-600 text-sm mb-4">Manage all registered teachers and schools</p>
            <a href="/admin/users" className="btn-primary block text-center">
              View Users
            </a>
          </div>

          <div className="card">
            <h3 className="text-lg font-bold mb-3">Job Monitoring</h3>
            <p className="text-gray-600 text-sm mb-4">Monitor all job postings and applications</p>
            <a href="/admin/jobs" className="btn-primary block text-center">
              Monitor Jobs
            </a>
          </div>

          <div className="card">
            <h3 className="text-lg font-bold mb-3">Platform Control</h3>
            <p className="text-gray-600 text-sm mb-4">Manage platform settings and configurations</p>
            <a href="/admin/settings" className="btn-primary block text-center">
              Settings
            </a>
          </div>
        </div>
      </div>
    </DashboardLayout>
    </RoleGuard>
  )
}
