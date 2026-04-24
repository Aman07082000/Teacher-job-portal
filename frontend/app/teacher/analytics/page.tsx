'use client'

import React from 'react'
import AnalyticsDashboard from '@/components/AnalyticsDashboard'
import RoleGuard from '@/components/RoleGuard'

export default function AnalyticsPage() {
  return (
    <RoleGuard requiredRole="teacher">
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <AnalyticsDashboard />
        </div>
      </div>
    </RoleGuard>
  )
}
