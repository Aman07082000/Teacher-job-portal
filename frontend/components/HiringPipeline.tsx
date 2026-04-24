'use client'

import React, { useState, useEffect } from 'react'
import { FiTrendingUp, FiArrowRight } from 'react-icons/fi'
import { schoolFeaturesAPI } from '@/lib/api'

interface PipelineStage {
  stage: string
  count: number
}

export default function HiringPipeline() {
  const [pipeline, setPipeline] = useState<PipelineStage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchPipeline()
  }, [])

  const fetchPipeline = async () => {
    try {
      setLoading(true)
      const response = await schoolFeaturesAPI.getHiringPipeline()
      setPipeline(response.data)
      setError('')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load pipeline')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading hiring pipeline...</div>
      </div>
    )
  }

  const total = pipeline.reduce((sum, stage) => sum + stage.count, 0)

  const getStageColor = (stage: string) => {
    const colors: { [key: string]: { bg: string; text: string } } = {
      Applied: { bg: 'bg-blue-100', text: 'text-blue-900' },
      Shortlisted: { bg: 'bg-yellow-100', text: 'text-yellow-900' },
      'Interview Scheduled': { bg: 'bg-orange-100', text: 'text-orange-900' },
      'Offer Extended': { bg: 'bg-green-100', text: 'text-green-900' },
      Hired: { bg: 'bg-emerald-100', text: 'text-emerald-900' },
    }
    return colors[stage] || { bg: 'bg-gray-100', text: 'text-gray-900' }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FiTrendingUp className="text-blue-600" />
          Hiring Pipeline
        </h2>
        <p className="text-gray-600 mt-1">Visualize candidates through each stage</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          {error}
        </div>
      )}

      {/* Pipeline Visualization */}
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="flex flex-col md:flex-row items-stretch justify-between gap-4">
          {pipeline.length > 0 ? (
            pipeline.map((stage, idx) => {
              const percentage = total > 0 ? (stage.count / total) * 100 : 0
              const color = getStageColor(stage.stage)

              return (
                <React.Fragment key={idx}>
                  <div className="flex-1 flex flex-col items-center">
                    {/* Stage Box */}
                    <div className={`${color.bg} ${color.text} rounded-lg p-6 w-full text-center mb-4 transition hover:shadow-lg`}>
                      <p className="text-sm font-medium opacity-75">{stage.stage}</p>
                      <p className="text-3xl font-bold mt-2">{stage.count}</p>
                      <p className="text-xs opacity-60 mt-1">{percentage.toFixed(1)}% of pipeline</p>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${color.bg.replace('100', '600')}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Arrow */}
                  {idx < pipeline.length - 1 && (
                    <div className="hidden md:flex items-center">
                      <FiArrowRight className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </React.Fragment>
              )
            })
          ) : (
            <div className="w-full text-center text-gray-500 py-8">
              <p>No pipeline data available</p>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-gray-600 text-sm">Total in Pipeline</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{total}</p>
            </div>
            {pipeline.length > 0 && (
              <>
                <div>
                  <p className="text-gray-600 text-sm">Conversion Rate</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {total > 0 ? ((pipeline[pipeline.length - 1].count / pipeline[0].count) * 100).toFixed(1) : 0}%
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Average Stage</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {pipeline.length > 2 ? pipeline[Math.floor(pipeline.length / 2)].stage : pipeline[0].stage}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-2">💡 Pipeline Insights</h3>
        <ul className="space-y-1 text-blue-800 text-sm">
          <li>• Higher conversion rates from Applied to Shortlisted indicate good candidate sourcing</li>
          <li>• Monitor the Interview stage for smooth handoffs</li>
          <li>• Track offer acceptance to optimize your hiring process</li>
        </ul>
      </div>
    </div>
  )
}
