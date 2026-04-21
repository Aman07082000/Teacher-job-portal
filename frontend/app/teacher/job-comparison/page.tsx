'use client'

import React, { useState, useEffect } from 'react'
import { searchAPI } from '@/lib/api'
import Link from 'next/link'

interface Job {
  id: number
  title: string
  description: string
  location: string
  subject_expertise: string
  salary_range: number
  posted_at: string
  school_id?: number
}

interface Comparison {
  id: number
  comparison_name: string
  job_ids: number[]
  jobs?: Job[]
  created_at: string
}

export default function JobComparison() {
  const [comparisons, setComparisons] = useState<Comparison[]>([])
  const [selectedComparison, setSelectedComparison] = useState<Comparison | null>(null)
  const [selectedJobs, setSelectedJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [comparisonName, setComparisonName] = useState('')

  useEffect(() => {
    fetchComparisons()
  }, [])

  const fetchComparisons = async () => {
    setLoading(true)
    try {
      const response = await searchAPI.getComparisons()
      setComparisons(response.data)
    } catch (error) {
      console.error('Error fetching comparisons:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateComparison = async () => {
    if (selectedJobs.length < 2) {
      alert('Please select at least 2 jobs to compare')
      return
    }

    try {
      const response = await searchAPI.createComparison({
        jobIds: selectedJobs.map((j) => j.id),
        comparisonName: comparisonName || `Comparison - ${new Date().toLocaleDateString()}`,
      })
      setComparisons([...comparisons, response.data])
      setShowCreateForm(false)
      setSelectedJobs([])
      setComparisonName('')
    } catch (error) {
      console.error('Error creating comparison:', error)
    }
  }

  const handleDeleteComparison = async (comparisonId: number) => {
    if (!confirm('Are you sure you want to delete this comparison?')) return

    try {
      await searchAPI.deleteComparison(comparisonId)
      setComparisons(comparisons.filter((c) => c.id !== comparisonId))
      setSelectedComparison(null)
    } catch (error) {
      console.error('Error deleting comparison:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">📊 Job Comparison</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar - Comparisons List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h3 className="text-lg font-semibold mb-4">Your Comparisons</h3>

              {loading ? (
                <div className="text-center py-4">Loading...</div>
              ) : comparisons.length > 0 ? (
                <div className="space-y-2 max-h-96 overflow-y-auto mb-4">
                  {comparisons.map((comparison) => (
                    <button
                      key={comparison.id}
                      onClick={() => setSelectedComparison(comparison)}
                      className={`w-full text-left p-3 rounded-lg ${
                        selectedComparison?.id === comparison.id
                          ? 'bg-blue-100 border-2 border-blue-500'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <p className="font-medium text-sm">{comparison.comparison_name}</p>
                      <p className="text-xs text-gray-500">
                        {comparison.job_ids?.length || 0} jobs
                      </p>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm mb-4">No comparisons yet</p>
              )}

              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                ➕ New Comparison
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {showCreateForm ? (
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">Create Comparison</h3>
                <input
                  type="text"
                  value={comparisonName}
                  onChange={(e) => setComparisonName(e.target.value)}
                  placeholder="Comparison name (optional)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-sm text-gray-600 mb-4">
                  Selected jobs: {selectedJobs.length}
                </p>
                <button
                  onClick={handleCreateComparison}
                  disabled={selectedJobs.length < 2}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 mr-2"
                >
                  Create Comparison
                </button>
                <button
                  onClick={() => {
                    setShowCreateForm(false)
                    setSelectedJobs([])
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            ) : null}

            {selectedComparison && selectedComparison.jobs && selectedComparison.jobs.length > 0 ? (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6 border-b">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold">{selectedComparison.comparison_name}</h3>
                      <p className="text-sm text-gray-500">
                        Created: {new Date(selectedComparison.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteComparison(selectedComparison.id)}
                      className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>

                {/* Comparison Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Job Title</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Location</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Subject</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Salary</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Posted</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedComparison.jobs.map((job) => (
                        <tr key={job.id} className="border-b hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm">
                            <Link
                              href={`/teacher/jobs/${job.id}`}
                              className="text-blue-500 hover:underline font-medium"
                            >
                              {job.title}
                            </Link>
                          </td>
                          <td className="px-6 py-4 text-sm">{job.location}</td>
                          <td className="px-6 py-4 text-sm">{job.subject_expertise}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-green-600">
                            ₹{job.salary_range.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {new Date(job.posted_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <button
                              onClick={async () => {
                                try {
                                  await searchAPI.removeJobFromComparison(selectedComparison.id, job.id)
                                  const updatedComparison = {
                                    ...selectedComparison,
                                    jobs: selectedComparison.jobs!.filter((j) => j.id !== job.id),
                                  }
                                  setSelectedComparison(updatedComparison)
                                  setComparisons(
                                    comparisons.map((c) =>
                                      c.id === selectedComparison.id ? updatedComparison : c
                                    )
                                  )
                                } catch (error) {
                                  console.error('Error removing job:', error)
                                }
                              }}
                              className="text-red-500 hover:text-red-700"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Comparison Details */}
                <div className="p-6 bg-gray-50">
                  <h4 className="font-semibold mb-4">Detailed Comparison</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedComparison.jobs.map((job) => (
                      <div key={job.id} className="bg-white p-4 rounded-lg border">
                        <h5 className="font-semibold mb-2">{job.title}</h5>
                        <p className="text-sm text-gray-700 mb-3">{job.description}</p>
                        <div className="space-y-1 text-sm">
                          <p>
                            <strong>Location:</strong> {job.location}
                          </p>
                          <p>
                            <strong>Subject:</strong> {job.subject_expertise}
                          </p>
                          <p>
                            <strong>Salary:</strong> ₹{job.salary_range.toLocaleString()}/month
                          </p>
                          <p>
                            <strong>Posted:</strong> {new Date(job.posted_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <p className="text-xl text-gray-500 mb-4">
                  {selectedComparison
                    ? 'No jobs in this comparison'
                    : 'Select a comparison or create a new one'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
