'use client'

import React, { useState, useEffect } from 'react'
import { searchAPI } from '@/lib/api'
import Link from 'next/link'

interface SearchItem {
  id: number
  search_query: string
  filters: any
  results_count: number
  searched_at: string
}

interface SearchHistoryProps {
  onSelectSearch?: (filters: any) => void
}

export default function SearchHistory({ onSelectSearch }: SearchHistoryProps) {
  const [searches, setSearches] = useState<SearchItem[]>([])
  const [loading, setLoading] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  useEffect(() => {
    if (showHistory) {
      fetchSearchHistory()
    }
  }, [showHistory])

  const fetchSearchHistory = async () => {
    setLoading(true)
    try {
      const response = await searchAPI.getSearchHistory(20)
      setSearches(response.data)
    } catch (error) {
      console.error('Error fetching search history:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteItem = async (searchId: number) => {
    try {
      await searchAPI.deleteSearchHistoryItem(searchId)
      setSearches(searches.filter((s) => s.id !== searchId))
    } catch (error) {
      console.error('Error deleting search:', error)
    }
  }

  const handleClearAll = async () => {
    if (confirm('Are you sure you want to clear all search history?')) {
      try {
        await searchAPI.clearSearchHistory()
        setSearches([])
      } catch (error) {
        console.error('Error clearing history:', error)
      }
    }
  }

  return (
    <div className="w-full">
      <button
        onClick={() => setShowHistory(!showHistory)}
        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 flex items-center gap-2"
      >
        📜 Search History
        <span className={`transition-transform ${showHistory ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {showHistory && (
        <div className="mt-4 bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Recent Searches</h3>
            {searches.length > 0 && (
              <button
                onClick={handleClearAll}
                className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200"
              >
                Clear All
              </button>
            )}
          </div>

          {loading ? (
            <div className="text-center py-4">Loading...</div>
          ) : searches.length > 0 ? (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {searches.map((search) => (
                <div
                  key={search.id}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                >
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => {
                      if (onSelectSearch) {
                        onSelectSearch(search.filters)
                      }
                    }}
                  >
                    <p className="font-medium">{search.search_query}</p>
                    <p className="text-xs text-gray-500">
                      {search.results_count} results • {new Date(search.searched_at).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteItem(search.id)}
                    className="px-2 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No search history yet</p>
          )}
        </div>
      )}
    </div>
  )
}
