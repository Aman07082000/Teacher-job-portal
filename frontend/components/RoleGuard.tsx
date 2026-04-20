'use client'

import { useAuthStore } from '@/lib/store'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface RoleGuardProps {
  children: React.ReactNode
  allowedRoles: ('teacher' | 'school' | 'admin')[]
  redirectTo?: string
}

export default function RoleGuard({
  children,
  allowedRoles,
  redirectTo = '/'
}: RoleGuardProps) {
  const router = useRouter()
  const { user, token } = useAuthStore()

  useEffect(() => {
    // Check if user is authenticated
    if (!token) {
      router.push('/')
      return
    }

    // Check if user has required role
    if (!user || !allowedRoles.includes(user.role)) {
      // Redirect based on user role
      if (user?.role === 'teacher') {
        router.push('/teacher/dashboard')
      } else if (user?.role === 'school') {
        router.push('/school/dashboard')
      } else {
        router.push('/')
      }
      return
    }
  }, [user, token, allowedRoles, router])

  // Don't render anything while checking authentication/role
  if (!token || !user || !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return <>{children}</>
}