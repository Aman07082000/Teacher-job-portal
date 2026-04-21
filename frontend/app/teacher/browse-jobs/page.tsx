'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { searchAPI, featuresAPI } from '@/lib/api'
import SaveJobButton from '@/components/SaveJobButton'
import JobMatchScore from '@/components/JobMatchScore'
import Link from 'next/link'

interface Job {
  id: number
  title: string
  description: string
  location: string
  subject_expertise: string
  salary_range: number
  posted_at: string
}

interface SearchFilters {
  title?: string
  location?: string
  subject?: string
  minSalary?: number
  maxSalary?: number
  sortBy?: string
}

export default function AdvancedJobSearch() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [filters, setFilters] = useState<SearchFilters>({})
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('recent')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [locations, setLocations] = useState<any[]>([])
  const [saveMessage, setSaveMessage] = useState('')

  // Fetch jobs with current filters
  const fetchJobs = useCallback(async () => {
    setLoading(true)
    try {
      const response = await searchAPI.advancedSearch({
        ...filters,
        sortBy,
        page,
        pageSize: 20,
      })
      setJobs(response.data.jobs)
      setTotalPages(response.data.pagination.totalPages)
      
      // Save search to history
      await searchAPI.saveSearch({
        searchQuery: searchQuery || 'Browse Jobs',
        filters,
      })
    } catch (error) {
      console.error('Error fetching jobs:', error)
    } finally {
      setLoading(false)
    }
  }, [filters, sortBy, page, searchQuery])

  // Fetch categories and locations
  useEffect(() => {
    const fetchCategoriesAndLocations = async () => {
      try {
        const [catRes, locRes] = await Promise.all([
          searchAPI.getJobCategories(),
          searchAPI.getLocationStats(),
        ])
        setCategories(catRes.data)
        setLocations(locRes.data)
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
    fetchCategoriesAndLocations()
  }, [])

  // Fetch search suggestions
  useEffect(() => {
    if (searchQuery.length > 1) {
      const timer = setTimeout(async () => {
        try {
          const response = await searchAPI.getSearchSuggestions(searchQuery)
          setSuggestions(response.data)
          setShowSuggestions(true)
        } catch (error) {
          console.error('Error fetching suggestions:', error)
        }
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [searchQuery])

  useEffect(() => {
    fetchJobs()
  }, [fetchJobs])

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPage(1)
  }

  const handleCategoryClick = (category: string) => {
    handleFilterChange('subject', category)
    setSearchQuery('')
  }

  const handleLocationClick = (location: string) => {
    handleFilterChange('location', location)
  }

  const handleSuggestionClick = (suggestion: any) => {
    if (suggestion.type === 'title') {
      handleFilterChange('title', suggestion.text)
    } else if (suggestion.type === 'location') {
      handleFilterChange('location', suggestion.text)
    } else if (suggestion.type === 'subject') {
      handleFilterChange('subject', suggestion.text)
    }
    setSearchQuery('')
    setShowSuggestions(false)
  }

  const clearFilters = () => {
    setFilters({})
    setSearchQuery('')
    setPage(1)
  }

  const handleSaveSearch = async () => {
    try {
      const name = `Search - ${new Date().toLocaleDateString()}`
      await searchAPI.createSavedSearch({
        name,
        search_query: searchQuery,
        filters,
      })
      setSaveMessage('Search saved successfully!')
      setTimeout(() => setSaveMessage(''), 3000)
    } catch (error) {
      console.error('Error saving search:', error)
      setSaveMessage('Failed to save search')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Find Your Perfect Job</h1>
          
          {/* Search Bar with Suggestions */}
          <div className="relative mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by job title, location, or subject..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 z-10 max-h-60 overflow-y-auto">
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 border-b last:border-b-0 flex items-center gap-2"
                  >
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {suggestion.type}
                    </span>
                    {suggestion.text}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <input
              type="text"
              placeholder="Job Title"
              value={filters.title || ''}
              onChange={(e) => handleFilterChange('title', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={filters.location || ''}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Locations</option>
              {locations.map((loc, idx) => (
                <option key={idx} value={loc.location}>
                  {loc.location} ({loc.job_count})
                </option>
              ))}
            </select>
            <select
              value={filters.subject || ''}
              onChange={(e) => handleFilterChange('subject', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Subjects</option>
              {categories.map((cat, idx) => (
                <option key={idx} value={cat.category}>
                  {cat.category} ({cat.count})
                </option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value)
                setPage(1)
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="recent">Most Recent</option>
              <option value="salary-high">Highest Salary</option>
              <option value="salary-low">Lowest Salary</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleSaveSearch}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              💾 Save Search
            </button>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
            >
              Clear Filters
            </button>
            {saveMessage && (
              <div className="px-4 py-2 bg-green-100 text-green-800 rounded-lg">
                {saveMessage}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Categories & Locations */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h3 className="font-semibold mb-4">Top Categories</h3>
              <div className="space-y-2 mb-6">
                {categories.slice(0, 8).map((cat, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleCategoryClick(cat.category)}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-blue-100 rounded-lg"
                  >
                    {cat.category} <span className="float-right text-gray-500">({cat.count})</span>
                  </button>
                ))}
              </div>

              <h3 className="font-semibold mb-4">Top Locations</h3>
              <div className="space-y-2">
                {locations.slice(0, 8).map((loc, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleLocationClick(loc.location)}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-blue-100 rounded-lg"
                  >
                    {loc.location} <span className="float-right text-gray-500">({loc.job_count})</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content - Job Listings */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : jobs.length > 0 ? (
              <>
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <div
                      key={job.id}
                      className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 border-l-4 border-blue-500"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                          <div className="flex flex-wrap gap-2 mb-3">
                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                              {job.location}
                            </span>
                            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                              {job.subject_expertise}
                            </span>
                            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                              ₹{job.salary_range.toLocaleString()}/month
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <SaveJobButton jobId={job.id} />
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(job.posted_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-4 line-clamp-2">
                        {job.description}
                      </p>

                      <div className="flex justify-between items-center">
                        <JobMatchScore jobId={job.id} />
                        <Link
                          href={`/teacher/jobs/${job.id}`}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <div className="mt-8 flex justify-center items-center gap-2">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <p className="text-xl text-gray-500 mb-4">No jobs found matching your criteria</p>
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Clear Filters & Try Again
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
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
