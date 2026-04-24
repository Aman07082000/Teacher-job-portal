'use client'

import React, { useState, useEffect } from 'react'
import { FiUsers, FiChevronDown, FiCheckCircle, FiEye, FiXCircle, FiClock, FiGift } from 'react-icons/fi'
import { schoolFeaturesAPI } from '@/lib/api'

interface Applicant {
  id: number
  teacher_id: number
  name: string
  email: string
  phone: string
  job_title: string
  status: string
  created_at: string
  updated_at: string
}

export default function ApplicantManagement() {
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null)
  const [expandedId, setExpandedId] = useState<number | null>(null)

  useEffect(() => {
    fetchApplicants()
  }, [page])

  const fetchApplicants = async () => {
    try {
      setLoading(true)
      const response = await schoolFeaturesAPI.getSchoolApplicants(page, 20)
      setApplicants(response.data.applicants)
      setTotal(response.data.total)
      setError('')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load applicants')
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (applicantId: number, newStatus: string) => {
    try {
      await schoolFeaturesAPI.updateApplicationStatus(applicantId, newStatus)
      setApplicants(
        applicants.map((a) => (a.id === applicantId ? { ...a, status: newStatus } : a))
      )
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update status')
    }
  }

  const getStatusIcon = (status: string) => {
    const icons: { [key: string]: any } = {
      applied: FiClock,
      viewed: FiEye,
      shortlisted: FiCheckCircle,
      interview_scheduled: FiClock,
      offer_extended: FiGift,
      offer_accepted: FiCheckCircle,
      rejected: FiXCircle,
    }
    return icons[status] || FiUsers
  }

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      applied: 'bg-blue-100 text-blue-800',
      viewed: 'bg-purple-100 text-purple-800',
      shortlisted: 'bg-yellow-100 text-yellow-800',
      interview_scheduled: 'bg-orange-100 text-orange-800',
      offer_extended: 'bg-green-100 text-green-800',
      offer_accepted: 'bg-emerald-100 text-emerald-800',
      rejected: 'bg-red-100 text-red-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  if (loading && applicants.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading applicants...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FiUsers className="text-blue-600" />
          Applicant Management
        </h2>
        <p className="text-gray-600 mt-1">Review and manage all applications</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          {error}
        </div>
      )}

      {/* Applicants List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {applicants.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {applicants.map((applicant) => (
              <div key={applicant.id} className="p-4 hover:bg-gray-50 transition">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{applicant.name}</h3>
                    <p className="text-sm text-gray-600">{applicant.job_title}</p>
                    <p className="text-xs text-gray-500 mt-1">{applicant.email} • {applicant.phone}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Status Badge */}
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getStatusColor(applicant.status)}`}>
                      {React.createElement(getStatusIcon(applicant.status), { className: 'w-3 h-3' })}
                      {applicant.status.replace('_', ' ')}
                    </div>

                    {/* Status Dropdown */}
                    <div className="relative">
                      <button
                        onClick={() => setExpandedId(expandedId === applicant.id ? null : applicant.id)}
                        className="p-2 hover:bg-gray-200 rounded-lg transition"
                      >
                        <FiChevronDown className="w-5 h-5 text-gray-600" />
                      </button>

                      {expandedId === applicant.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                          {['viewed', 'shortlisted', 'interview_scheduled', 'offer_extended', 'offer_accepted', 'rejected'].map((status) => (
                            <button
                              key={status}
                              onClick={() => {
                                updateStatus(applicant.id, status)
                                setExpandedId(null)
                              }}
                              className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700 first:rounded-t-lg last:rounded-b-lg"
                            >
                              {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <FiUsers className="w-12 h-12 mx-auto mb-2 opacity-20" />
            <p>No applicants yet</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {total > 20 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-gray-600">
            Page {page} of {Math.ceil(total / 20)}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page >= Math.ceil(total / 20)}
            className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-600 font-medium">Total Applicants</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">{total}</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-600 font-medium">Shortlisted</p>
          <p className="text-2xl font-bold text-yellow-900 mt-1">
            {applicants.filter((a) => a.status === 'shortlisted').length}
          </p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-600 font-medium">Offers Extended</p>
          <p className="text-2xl font-bold text-green-900 mt-1">
            {applicants.filter((a) => a.status === 'offer_extended' || a.status === 'offer_accepted').length}
          </p>
        </div>
      </div>
    </div>
  )
}
