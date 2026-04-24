'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store'
import { FiLogOut, FiUser, FiChevronDown } from 'react-icons/fi'
import { ThemeDropdown } from './ThemeDropdown'
import { useState } from 'react'

export default function Navbar() {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const [showMenu, setShowMenu] = useState(false)

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const dashboardLink = user
    ? user.role === 'teacher' ? '/teacher/dashboard' : 
      user.role === 'school' ? '/school/dashboard' : 
      '/admin/dashboard'
    : '/'

  const getNavLinks = () => {
    if (!user) return null

    if (user.role === 'teacher') {
      return [
        { label: 'Dashboard', href: '/teacher/dashboard' },
        { label: 'Browse Jobs', href: '/teacher/browse-jobs' },
        { label: 'Categories', href: '/teacher/categories' },
        { label: 'Saved Jobs', href: '/teacher/saved-jobs' },
        { label: 'Compare Jobs', href: '/teacher/job-comparison' },
        { label: 'Analytics', href: '/teacher/analytics' },
        { label: 'Applications', href: '/teacher/applications' },
        { label: 'My Profile', href: '/teacher/profile' },
      ]
    } else if (user.role === 'school') {
      return [
        { label: 'Dashboard', href: '/school/dashboard' },
        { label: 'Post Job', href: '/school/post-job' },
        { label: 'Manage Jobs', href: '/school/manage-jobs' },
        { label: 'Pricing', href: '/school/pricing' },
        { label: 'Applicants', href: '/school/applicants' },
        { label: 'Company Profile', href: '/school/profile' },
      ]
    }
    return null
  }

  const navLinks = getNavLinks()

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href={dashboardLink} className="text-2xl font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">
            📚 TJP
          </Link>

          {/* Nav Links - Desktop */}
          {navLinks && (
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <ThemeDropdown />
            <Link
              href="/notifications"
              className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              title="Notifications"
            >
              <span className="text-2xl">🔔</span>
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-600 rounded-full"></span>
            </Link>
            
            {user ? (
              <>
                <div className="hidden sm:flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                  <FiUser className="w-4 h-4" />
                  <span className="capitalize">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 flex items-center gap-2 font-medium"
                  title="Logout"
                >
                  <FiLogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>

                {/* Mobile Menu */}
                {navLinks && (
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="md:hidden text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  >
                    <FiChevronDown className={`w-5 h-5 transition-transform ${showMenu ? 'rotate-180' : ''}`} />
                  </button>
                )}
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {showMenu && navLinks && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                onClick={() => setShowMenu(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
