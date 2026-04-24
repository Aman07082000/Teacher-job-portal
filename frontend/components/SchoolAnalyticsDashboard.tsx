'use client'

import React, { useState, useEffect } from 'react'
import { FiBarChart2, FiUsers, FiBriefcase, FiCheckCircle, FiTrendingUp, FiFileText } from 'react-icons/fi'
import { schoolFeaturesAPI } from '@/lib/api'

interface AnalyticsData {
  totalJobs: number
  totalApplications: number
  offersExtended: number
  offersAccepted: number
  hireRate: number
  applicationsByStatus: Array<{ status: string; count: number }>
}

export default function SchoolAnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true)
        const response = await schoolFeaturesAPI.getSchoolAnalytics()
        setAnalytics(response.data)
        setError('')
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load analytics')
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading analytics...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
        <p className="font-semibold">Error</p>
        <p>{error}</p>
      </div>
    )
  }

  const metrics = [
    { icon: FiBriefcase, label: 'Active Jobs', value: analytics?.totalJobs || 0, color: 'blue' },
    { icon: FiFileText, label: 'Applications', value: analytics?.totalApplications || 0, color: 'purple' },
    { icon: FiCheckCircle, label: 'Offers Extended', value: analytics?.offersExtended || 0, color: 'green' },
    { icon: FiTrendingUp, label: 'Offer Acceptance Rate', value: `${analytics?.hireRate || 0}%`, color: 'amber' },
  ]

  const MetricCard = ({ icon: Icon, label, value, color }: any) => {
    const colorClasses = {
      blue: 'bg-blue-50 text-blue-600',
      purple: 'bg-purple-50 text-purple-600',
      green: 'bg-green-50 text-green-600',
      amber: 'bg-amber-50 text-amber-600',
    }

    return (
      <div className={`${colorClasses[color as keyof typeof colorClasses]} p-6 rounded-lg border`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium opacity-75">{label}</p>
            <p className="text-3xl font-bold mt-2">{value}</p>
          </div>
          <Icon className="w-12 h-12 opacity-20" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <FiBarChart2 className="text-blue-600" />
          Recruitment Analytics
        </h1>
        <p className="text-gray-600 mt-1">Monitor your hiring performance and key metrics</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, idx) => (
          <MetricCard key={idx} {...metric} />
        ))}
      </div>

      {/* Application Status Breakdown */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Application Status Breakdown</h2>
        <div className="space-y-3">
          {analytics?.applicationsByStatus && analytics.applicationsByStatus.length > 0 ? (
            analytics.applicationsByStatus.map((status: any, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-gray-700 capitalize">{status.status.replace('_', ' ')}</span>
                <div className="flex items-center gap-2 flex-1 ml-4">
                  <div className="bg-gray-200 rounded-full flex-1 h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${(status.count / (analytics?.totalApplications || 1)) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-gray-900 font-semibold min-w-12 text-right">{status.count}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No applications yet</p>
          )}
        </div>
      </div>

      {/* Hiring Insights */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-blue-900 mb-3">Hiring Insights</h2>
        <div className="space-y-2 text-blue-800 text-sm">
          <p>✓ You've received <strong>{analytics?.totalApplications || 0}</strong> applications across <strong>{analytics?.totalJobs || 0}</strong> jobs</p>
          <p>✓ Extended <strong>{analytics?.offersExtended || 0}</strong> offers with <strong>{analytics?.offersAccepted || 0}</strong> acceptances</p>
          <p>✓ Your current hire rate is <strong>{analytics?.hireRate || 0}%</strong></p>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-amber-900 mb-3">💡 Improvement Tips</h2>
        <ul className="space-y-2 text-amber-800 text-sm">
          <li>• Review shortlisted candidates regularly to maintain engagement</li>
          <li>• Schedule interviews within 3 days of shortlisting for best results</li>
          <li>• Use the candidate comparison tool to make informed hiring decisions</li>
          <li>• Maintain comprehensive notes during the hiring process</li>
        </ul>
      </div>
    </div>
  )
}
