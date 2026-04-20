'use client'

import { useAuthStore } from '@/lib/store'
import Navbar from '@/components/Navbar'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { token } = useAuthStore()

  useEffect(() => {
    if (!token) {
      router.push('/')
    }
  }, [token, router])

  if (!token) return null

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
    </>
  )
}
