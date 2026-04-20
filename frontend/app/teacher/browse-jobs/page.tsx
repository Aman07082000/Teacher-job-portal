'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { FiSearch, FiMapPin, FiDollarSign, FiBookmark, FiFilter, FiX } from 'react-icons/fi'
import RoleGuard from '@/components/RoleGuard'

interface Job {
  id: number
  title: string
  school_name: string
  location: string
  salary_min: number
  salary_max: number
  experience_required: number
  job_type: string
  description: string
  posted_date: string
}

interface Filters {
  location: string
  salaryMin: number
  salaryMax: number
  experience: string
  jobType: string
  search: string
}

const mockJobs: Job[] = [
  {
    id: 1,
    title: 'Senior English Teacher',
    school_name: 'Delhi Public School',
    location: 'New Delhi',
    salary_min: 30000,
    salary_max: 50000,
    experience_required: 5,
    job_type: 'Full-time',
    description: 'Seek experienced English teacher for senior classes.',
    posted_date: '2 days ago'
  },
  {
    id: 2,
    title: 'Mathematics Teacher',
    school_name: 'The Heritage School',
    location: 'Mumbai',
    salary_min: 25000,
    salary_max: 40000,
    experience_required: 3,
    job_type: 'Full-time',
    description: 'Mathematics teacher needed for grades 8-10.',
    posted_date: '3 days ago'
  },
  {
    id: 3,
    title: 'Science Teacher',
    school_name: 'Cathedral School',
    location: 'Bangalore',
    salary_min: 28000,
    salary_max: 45000,
    experience_required: 4,
    job_type: 'Full-time',
    description: 'Passionate science teacher for secondary school.',
    posted_date: '1 day ago'
  },
]

export default function BrowseJobsPage() {
  const [jobs, setJobs] = useState<Job[]>(mockJobs)
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(mockJobs)
  const [showFilters, setShowFilters] = useState(false)
  const [savedJobs, setSavedJobs] = useState<number[]>([])
  const [filters, setFilters] = useState<Filters>({
    location: '',
    salaryMin: 0,
    salaryMax: 100000,
    experience: '',
    jobType: '',
    search: '',
  })

  const applyFilters = useCallback(() => {
    let filtered = jobs

    if (filters.search) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        job.school_name.toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    if (filters.location) {
      filtered = filtered.filter(job =>
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      )
    }

    if (filters.jobType) {
      filtered = filtered.filter(job => job.job_type === filters.jobType)
    }

    if (filters.experience) {
      const exp = parseInt(filters.experience)
      filtered = filtered.filter(job => job.experience_required <= exp)
    }

    filtered = filtered.filter(job =>
      job.salary_max >= filters.salaryMin && job.salary_min <= filters.salaryMax
    )

    setFilteredJobs(filtered)
  }, [jobs, filters])

  useEffect(() => {
    applyFilters()
  }, [applyFilters])

  const toggleSaveJob = (jobId: number) => {
    setSavedJobs(prev =>
      prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId]
    )
  }

  const resetFilters = () => {
    setFilters({
      location: '',
      salaryMin: 0,
      salaryMax: 100000,
      experience: '',
      jobType: '',
      search: '',
    })
  }

  return (
    <RoleGuard allowedRoles={['teacher']}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-lg mb-8">
          <h1 className="text-4xl font-bold mb-4">Find Your Perfect Teaching Job</h1>
          <p className="text-blue-100 mb-6">Search from thousands of teaching opportunities</p>
          
          {/* Search Bar */}
          <div className="bg-white rounded-lg p-2 flex items-center gap-2">
            <FiSearch className="text-gray-600 ml-3" />
            <input
              type="text"
              placeholder="Search job title or school name..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="flex-1 py-2 px-2 outline-none text-gray-800"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className={`lg:col-span-1 ${showFilters ? 'col-span-1' : 'hidden lg:block'}`}>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md sticky top-24">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Filters</h2>
                <button
                  onClick={resetFilters}
                  className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                >
                  Reset
                </button>
              </div>

              {/* Location Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="City name"
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Job Type Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  Job Type
                </label>
                <select
                  value={filters.jobType}
                  onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                >
                  <option value="">All Types</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>

              {/* Experience Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  Experience (Years)
                </label>
                <input
                  type="number"
                  placeholder="Minimum years"
                  value={filters.experience}
                  onChange={(e) => setFilters({ ...filters, experience: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Salary Range */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  Salary Range
                </label>
                <div className="space-y-2">
                  <div>
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.salaryMin}
                      onChange={(e) => setFilters({ ...filters, salaryMin: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.salaryMax}
                      onChange={(e) => setFilters({ ...filters, salaryMax: parseInt(e.target.value) || 100000 })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowFilters(false)}
                className="w-full lg:hidden bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
              >
                Apply Filters
              </button>
            </div>
          </div>

          {/* Jobs List */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6 lg:hidden">
              <h2 className="text-lg font-semibold">Jobs ({filteredJobs.length})</h2>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                <FiFilter className="w-4 h-4" />
                Filters
              </button>
            </div>

            {filteredJobs.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-12 text-center">
                <p className="text-gray-600 dark:text-gray-400 text-lg">No jobs found matching your criteria</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredJobs.map(job => (
                  <div key={job.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <Link href={`/teacher/jobs/${job.id}`}>
                          <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                            {job.title}
                          </h3>
                        </Link>
                        <p className="text-gray-600 dark:text-gray-400 font-medium mb-3">{job.school_name}</p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <FiMapPin className="w-4 h-4" />
                            <span className="text-sm">{job.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <FiDollarSign className="w-4 h-4" />
                            <span className="text-sm">
                              ₹{job.salary_min.toLocaleString()}-{job.salary_max.toLocaleString()}
                            </span>
                          </div>
                          <div className="text-gray-600 dark:text-gray-400 text-sm">
                            {job.experience_required}+ yrs exp
                          </div>
                          <div className="text-gray-600 dark:text-gray-400 text-sm">
                            {job.posted_date}
                          </div>
                        </div>

                        <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-2">{job.description}</p>
                      </div>

                      <button
                        onClick={() => toggleSaveJob(job.id)}
                        className={`p-3 rounded-full transition-colors ${
                          savedJobs.includes(job.id)
                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                        title={savedJobs.includes(job.id) ? 'Remove from saved' : 'Save job'}
                      >
                        <FiBookmark className="w-5 h-5 fill-current" />
                      </button>
                    </div>

                    <div className="mt-4 flex gap-3">
                      <Link
                        href={`/teacher/jobs/${job.id}`}
                        className="flex-1 bg-blue-600 dark:bg-blue-700 text-white py-2 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 text-center transition-colors font-medium"
                      >
                        View Details
                      </Link>
                      <button className="flex-1 border border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 py-2 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors font-medium">
                        Apply Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </RoleGuard>
  )
}
