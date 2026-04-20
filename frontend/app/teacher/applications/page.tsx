'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/app/dashboard-layout'
import { teacherAPI } from '@/lib/api'
import { useAuthStore } from '@/lib/store'

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
        return 'bg-blue-100 text-blue-800'
      case 'shortlisted':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">My Applications</h1>

        {loading ? (
          <div className="text-center py-8">Loading applications...</div>
        ) : applications.length === 0 ? (
          <div className="card text-center py-8">
            <p className="text-gray-500">You haven't applied to any jobs yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app.id} className="card">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-blue-600 mb-2">
                      {app.job_title}
                    </h3>
                    <p className="text-gray-600 mb-2">
                      School: <span className="font-semibold">{app.school_name}</span>
                    </p>
                    <p className="text-sm text-gray-500">
                      Applied: {new Date(app.applied_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-4 py-2 rounded-lg font-semibold capitalize ${getStatusColor(
                      app.status
                    )}`}
                  >
                    {app.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
