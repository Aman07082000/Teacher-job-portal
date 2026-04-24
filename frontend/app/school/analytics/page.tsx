'use client'

import React from 'react'
import SchoolAnalyticsDashboard from '@/components/SchoolAnalyticsDashboard'
import RoleGuard from '@/components/RoleGuard'

export default function SchoolAnalyticsPage() {
  return (
    <RoleGuard requiredRole="school">
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <SchoolAnalyticsDashboard />
        </div>
      </div>
    </RoleGuard>
  )
}
