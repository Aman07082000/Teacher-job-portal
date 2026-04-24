'use client'

import React, { useState, useEffect } from 'react'
import { advancedAPI } from '@/lib/api'

interface AnalyticsData {
  analytics: {
    profile_views: number
    applications_sent: number
    interviews_scheduled: number
    offers_received: number
    profile_completion_percentage: number
  }
  applications: any[]
  savedJobs: { count: number }
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const response = await advancedAPI.getAnalyticsDashboard()
      setData(response.data)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading analytics...</div>
  }

  if (!data) {
    return <div className="text-center py-8">No analytics available</div>
  }

  const metrics = [
    {
      label: 'Profile Views',
      value: data.analytics.profile_views,
      icon: '👁️',
      color: 'bg-blue-100'
    },
    {
      label: 'Applications Sent',
      value: data.analytics.applications_sent,
      icon: '📤',
      color: 'bg-green-100'
    },
    {
      label: 'Interviews Scheduled',
      value: data.analytics.interviews_scheduled,
      icon: '📞',
      color: 'bg-purple-100'
    },
    {
      label: 'Offers Received',
      value: data.analytics.offers_received,
      icon: '🎉',
      color: 'bg-yellow-100'
    },
    {
      label: 'Saved Jobs',
      value: data.savedJobs.count,
      icon: '💾',
      color: 'bg-red-100'
    }
  ]

  // Calculate status distribution
  const statusCounts = {} as any
  data.applications.forEach((app) => {
    statusCounts[app.status] = (statusCounts[app.status] || 0) + app.count
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">📊 Your Career Analytics</h2>
        <p className="text-gray-600">Track your job search progress and insights</p>
      </div>

      {/* Profile Strength */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow p-6 text-white">
        <h3 className="text-lg font-semibold mb-3">Profile Strength</h3>
        <div className="flex items-center gap-4">
          <div className="text-4xl font-bold">{data.analytics.profile_completion_percentage}%</div>
          <div className="flex-1">
            <div className="w-full bg-white bg-opacity-30 rounded-full h-4 overflow-hidden">
              <div
                className="bg-white h-full rounded-full transition-all"
                style={{
                  width: `${data.analytics.profile_completion_percentage}%`
                }}
              ></div>
            </div>
            <p className="text-sm mt-2 text-white text-opacity-90">
              Complete your profile to increase visibility
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, idx) => (
          <div key={idx} className={`${metric.color} rounded-lg shadow p-6`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl">{metric.icon}</span>
              <span className="text-gray-500 text-sm">This Month</span>
            </div>
            <h4 className="text-gray-700 font-medium mb-1">{metric.label}</h4>
            <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
          </div>
        ))}
      </div>

      {/* Application Status Breakdown */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Application Status</h3>
        <div className="space-y-3">
          {Object.entries(statusCounts).map(([status, count]: any) => (
            <div key={status} className="flex items-center justify-between">
              <span className="capitalize text-gray-700 font-medium">{status}</span>
              <div className="flex items-center gap-3">
                <div className="w-48 bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-500 h-full"
                    style={{
                      width: `${(count / data.analytics.applications_sent) * 100}%`
                    }}
                  ></div>
                </div>
                <span className="text-gray-600 font-semibold">{count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-blue-900">💡 Improvement Tips</h3>
        <ul className="space-y-2 text-blue-800">
          <li>• Complete 100% of your profile to stand out to recruiters</li>
          <li>• Apply to jobs regularly to increase your chances</li>
          <li>• Share your interview experiences to help others</li>
          <li>• Get skill endorsements from your network</li>
          <li>• Maintain a positive rating from interactions</li>
        </ul>
      </div>
    </div>
  )
}
