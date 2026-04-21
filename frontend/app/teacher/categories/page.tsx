'use client'

import React, { useState, useEffect } from 'react'
import { searchAPI, featuresAPI } from '@/lib/api'
import Link from 'next/link'
import SaveJobButton from '@/components/SaveJobButton'

interface Category {
  category: string
  count: number
  avg_salary: number
}

interface LocationData {
  location: string
  job_count: number
  avg_salary: number
}

interface Job {
  id: number
  title: string
  description: string
  location: string
  subject_expertise: string
  salary_range: number
  posted_at: string
}

export default function BrowseCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [locations, setLocations] = useState<LocationData[]>([])
  const [trendingJobs, setTrendingJobs] = useState<Job[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [catRes, locRes, trendRes] = await Promise.all([
        searchAPI.getJobCategories(),
        searchAPI.getLocationStats(),
        searchAPI.getTrendingJobs(),
      ])
      setCategories(catRes.data)
      setLocations(locRes.data)
      setTrendingJobs(trendRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">📚 Browse Categories</h1>
        <p className="text-gray-600 mb-8">Explore job opportunities by category and location</p>

        {/* Trending Jobs Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">🔥 Trending Jobs</h2>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : trendingJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingJobs.map((job) => (
                <div key={job.id} className="bg-white rounded-lg shadow hover:shadow-lg transition p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold">{job.title}</h3>
                    <SaveJobButton jobId={job.id} />
                  </div>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{job.description}</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <span>📍 {job.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span>💼 {job.subject_expertise}</span>
                    </div>
                    <div className="flex items-center text-sm text-green-600 font-semibold">
                      <span>₹{job.salary_range.toLocaleString()}/month</span>
                    </div>
                  </div>
                  <Link
                    href={`/teacher/jobs/${job.id}`}
                    className="inline-block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                  >
                    View Job
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500">No trending jobs at the moment</p>
            </div>
          )}
        </section>

        {/* Categories Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">📂 Job Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, idx) => (
              <Link
                key={idx}
                href={`/teacher/browse-jobs?subject=${encodeURIComponent(category.category)}`}
                className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 block"
              >
                <h3 className="text-lg font-semibold mb-2">{category.category}</h3>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    <strong>{category.count}</strong> job{category.count !== 1 ? 's' : ''}
                  </p>
                  <p className="text-sm text-gray-600">
                    Avg Salary: <strong>₹{Math.round(category.avg_salary).toLocaleString()}</strong>
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <span className="text-blue-500 font-semibold">Explore →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Locations Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">🌍 Top Locations</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Location</th>
                  <th className="px-6 py-4 text-left font-semibold">Job Openings</th>
                  <th className="px-6 py-4 text-left font-semibold">Avg Salary</th>
                  <th className="px-6 py-4 text-left font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {locations.map((location, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{location.location}</td>
                    <td className="px-6 py-4">{location.job_count}</td>
                    <td className="px-6 py-4 text-green-600 font-semibold">
                      ₹{Math.round(location.avg_salary).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/teacher/browse-jobs?location=${encodeURIComponent(location.location)}`}
                        className="text-blue-500 hover:underline"
                      >
                        Explore
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}
