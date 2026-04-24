'use client'

import React from 'react'
import HiringPipeline from '@/components/HiringPipeline'
import RoleGuard from '@/components/RoleGuard'

export default function HiringPipelinePage() {
  return (
    <RoleGuard requiredRole="school">
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <HiringPipeline />
        </div>
      </div>
    </RoleGuard>
  )
}
