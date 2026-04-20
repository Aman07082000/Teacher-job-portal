'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FiBell, FiTrash2, FiToggleLeft, FiToggleRight, FiMapPin, FiDollarSign } from 'react-icons/fi'
import RoleGuard from '@/components/RoleGuard'

interface JobAlert {
  id: number
  name: string
  keywords: string[]
  locations: string[]
  salaryMin: number
  frequency: string
  enabled: boolean
  matchingJobs: number
}

interface Recommendation {
  id: number
  title: string
  school: string
  location: string
  match: number
  salaryMin: number
  salaryMax: number
}

const mockAlerts: JobAlert[] = [
  {
    id: 1,
    name: 'Senior English Teacher',
    keywords: ['English', 'Literature'],
    locations: ['Delhi', 'Bangalore'],
    salaryMin: 35000,
    frequency: 'Daily',
    enabled: true,
    matchingJobs: 5,
  },
  {
    id: 2,
    name: 'Mathematics Teaching',
    keywords: ['Mathematics', 'CBSE', 'ICSE'],
    locations: ['Mumbai', 'Pune'],
    salaryMin: 30000,
    frequency: 'Weekly',
    enabled: true,
    matchingJobs: 3,
  },
  {
    id: 3,
    name: 'Science Coordinator',
    keywords: ['Science', 'Lab'],
    locations: ['Bangalore'],
    salaryMin: 40000,
    frequency: 'Instant',
    enabled: false,
    matchingJobs: 0,
  },
]

const mockRecommendations: Recommendation[] = [
  {
    id: 1,
    title: 'Senior English Teacher',
    school: 'Delhi Public School',
    location: 'New Delhi',
    match: 95,
    salaryMin: 30000,
    salaryMax: 50000,
  },
  {
    id: 2,
    title: 'English Lecturer',
    school: 'The Heritage School',
    location: 'Mumbai',
    match: 88,
    salaryMin: 28000,
    salaryMax: 45000,
  },
  {
    id: 3,
    title: 'Senior English Coordinator',
    school: 'Cathedral School',
    location: 'Bangalore',
    match: 82,
    salaryMin: 35000,
    salaryMax: 55000,
  },
]

export default function JobAlertsPage() {
  const [alerts, setAlerts] = useState(mockAlerts)
  const [recommendations, setRecommendations] = useState(mockRecommendations)
  const [showCreateAlert, setShowCreateAlert] = useState(false)

  const deleteAlert = (id: number) => {
    setAlerts(alerts.filter(alert => alert.id !== id))
  }

  const toggleAlert = (id: number) => {
    setAlerts(alerts.map(alert =>
      alert.id === id ? { ...alert, enabled: !alert.enabled } : alert
    ))
  }

  return (
    <RoleGuard allowedRoles={['teacher']}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Alerts */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-4xl font-bold mb-2">Job Alerts</h1>
                <p className="text-gray-600 dark:text-gray-400">Get notified about jobs matching your profile</p>
              </div>
              <button
                onClick={() => setShowCreateAlert(!showCreateAlert)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                + Create Alert
              </button>
            </div>

            {/* Create Alert Form */}
            {showCreateAlert && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
                <h2 className="text-xl font-bold mb-4">Create New Job Alert</h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Alert name (e.g., Senior English Teacher)"
                    className="w-full px-4 py-2 border border-blue-300 dark:border-blue-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="Keywords (comma separated)"
                    className="w-full px-4 py-2 border border-blue-300 dark:border-blue-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="Locations (comma separated)"
                    className="w-full px-4 py-2 border border-blue-300 dark:border-blue-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="number"
                      placeholder="Minimum salary"
                      className="px-4 py-2 border border-blue-300 dark:border-blue-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    />
                    <select className="px-4 py-2 border border-blue-300 dark:border-blue-600 rounded-lg dark:bg-gray-700 dark:text-white">
                      <option>Daily</option>
                      <option>Weekly</option>
                      <option>Instant</option>
                    </select>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowCreateAlert(false)}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium"
                    >
                      Create Alert
                    </button>
                    <button
                      onClick={() => setShowCreateAlert(false)}
                      className="flex-1 border border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Alerts List */}
            <div className="space-y-4">
              {alerts.map(alert => (
                <div
                  key={alert.id}
                  className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{alert.name}</h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {alert.keywords.map((keyword, idx) => (
                          <span key={idx} className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => toggleAlert(alert.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        alert.enabled
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {alert.enabled ? <FiToggleRight className="w-6 h-6" /> : <FiToggleLeft className="w-6 h-6" />}
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4 py-4 border-t border-b border-gray-200 dark:border-gray-700">
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Locations</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{alert.locations.join(', ')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Minimum Salary</p>
                      <p className="font-semibold text-gray-900 dark:text-white">₹{alert.salaryMin.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Frequency</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{alert.frequency}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <FiBell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <span className="font-semibold text-blue-600 dark:text-blue-400">{alert.matchingJobs} matching jobs</span>
                    </div>
                    <button
                      onClick={() => deleteAlert(alert.id)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-red-600 dark:text-red-400"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Recommendations */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Recommended for You</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Based on your profile and preferences</p>

            <div className="space-y-4">
              {recommendations.map(rec => (
                <Link
                  key={rec.id}
                  href={`/teacher/jobs/${rec.id}`}
                  className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-all hover:-translate-y-1 block"
                >
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h3 className="font-bold text-gray-900 dark:text-white line-clamp-2">
                      {rec.title}
                    </h3>
                    <div className="flex-shrink-0 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded text-xs font-semibold">
                      {rec.match}%
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{rec.school}</p>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <FiMapPin className="w-4 h-4 flex-shrink-0" />
                      <span>{rec.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <FiDollarSign className="w-4 h-4 flex-shrink-0" />
                      <span>₹{rec.salaryMin.toLocaleString()}-{rec.salaryMax.toLocaleString()}</span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.preventDefault()
                    }}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    View Job
                  </button>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  )
}
