'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/app/dashboard-layout'
import { schoolAPI } from '@/lib/api'
import { FiCheckCircle } from 'react-icons/fi'

interface Applicant {
  id: number
  teacher_name: string
  job_title: string
  status: string
  applied_at: string
}

export default function ManageApplicants() {
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchApplicants()
  }, [])

  const fetchApplicants = async () => {
    try {
      const response = await schoolAPI.getApplicants()
      setApplicants(response.data)
    } catch (error) {
      console.error('Failed to fetch applicants:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleShortlist = async (applicationId: number) => {
    try {
      await schoolAPI.shortlistCandidate(applicationId)
      // Update the applicant status
      setApplicants(prev =>
        prev.map(app =>
          app.id === applicationId ? { ...app, status: 'shortlisted' } : app
        )
      )
    } catch (error) {
      console.error('Failed to shortlist candidate:', error)
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
        <h1 className="text-3xl font-bold">Manage Applicants</h1>

        {loading ? (
          <div className="text-center py-8">Loading applicants...</div>
        ) : applicants.length === 0 ? (
          <div className="card text-center py-8">
            <p className="text-gray-500">No applications received yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applicants.map((app) => (
              <div key={app.id} className="card">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold">{app.teacher_name}</h3>
                    <p className="text-gray-600 mb-2">
                      Position: <span className="font-semibold">{app.job_title}</span>
                    </p>
                    <p className="text-sm text-gray-500">
                      Applied: {new Date(app.applied_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-4 py-2 rounded-lg font-semibold capitalize ${getStatusColor(
                        app.status
                      )}`}
                    >
                      {app.status}
                    </span>
                    {app.status !== 'shortlisted' && (
                      <button
                        onClick={() => handleShortlist(app.id)}
                        className="btn-primary flex items-center gap-2"
                      >
                        <FiCheckCircle />
                        Shortlist
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
