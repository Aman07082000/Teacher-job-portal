'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store'
import { FiLogOut, FiUser } from 'react-icons/fi'

export default function Navbar() {
  const router = useRouter()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  if (!user) return null

  const dashboardLink = user.role === 'teacher' ? '/teacher/dashboard' : 
                       user.role === 'school' ? '/school/dashboard' : 
                       '/admin/dashboard'

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href={dashboardLink} className="text-2xl font-bold text-blue-600">
          📚 TJP
        </Link>

        <div className="flex items-center gap-4">
          <span className="text-gray-700 capitalize">{user.role}</span>
          <div className="flex items-center gap-2 text-gray-600">
            <FiUser className="w-5 h-5" />
            <span className="text-sm">{user.name}</span>
          </div>
          <button
            onClick={handleLogout}
            className="text-red-600 hover:text-red-700 flex items-center gap-2"
          >
            <FiLogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}
