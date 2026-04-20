'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { authAPI } from '@/lib/api'
import { useAuthStore } from '@/lib/store'
import { FiEye, FiEyeOff, FiMail, FiLock, FiArrowRight } from 'react-icons/fi'

export default function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const role = searchParams.get('role') || 'teacher'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await authAPI.login({ email, password })
      const { user, token } = response.data
      login(token, user)

      // Redirect based on role
      if (user.role === 'teacher') {
        router.push('/teacher/dashboard')
      } else if (user.role === 'school') {
        router.push('/school/dashboard')
      } else if (user.role === 'admin') {
        router.push('/admin/dashboard')
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getRoleInfo = () => {
    switch (role) {
      case 'teacher':
        return { title: 'Teacher', subtitle: 'Find your dream teaching job', bg: 'from-blue-600 to-blue-800' }
      case 'school':
        return { title: 'School', subtitle: 'Find qualified teachers', bg: 'from-purple-600 to-purple-800' }
      case 'admin':
        return { title: 'Admin', subtitle: 'Manage the platform', bg: 'from-gray-700 to-gray-900' }
      default:
        return { title: 'TeacherJob', subtitle: 'Your job portal', bg: 'from-blue-600 to-blue-800' }
    }
  }

  const roleInfo = getRoleInfo()

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
          {/* Left Side - Branding */}
          <div className={`bg-gradient-to-br ${roleInfo.bg} text-white p-12 flex flex-col justify-center hidden lg:flex`}>
            <div className="mb-8">
              <div className="text-5xl mb-4">📚</div>
              <h1 className="text-4xl font-bold mb-2">TeacherJob</h1>
              <p className="text-xl text-blue-100">Connecting Teachers with Opportunity</p>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="text-3xl">✅</div>
                <div>
                  <h3 className="font-bold text-lg">Verified Positions</h3>
                  <p className="text-blue-100">Browse through vetted job listings from top schools</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-3xl">🚀</div>
                <div>
                  <h3 className="font-bold text-lg">Quick Application</h3>
                  <p className="text-blue-100">Apply to multiple positions with one click</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-3xl">⭐</div>
                <div>
                  <h3 className="font-bold text-lg">Career Support</h3>
                  <p className="text-blue-100">Get guidance and insights for career development</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="p-12 flex flex-col justify-center">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4 lg:hidden">
                <span className="text-3xl">📚</span>
                <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">TeacherJob</h1>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Login to {roleInfo.title} account
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg flex items-start gap-3">
                <span className="text-xl">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="flex justify-between items-center text-sm">
                <label className="flex items-center gap-2 cursor-pointer text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300">
                  <input type="checkbox" className="rounded" />
                  <span>Remember me</span>
                </label>
                <Link href="/forgot-password" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold">
                  Forgot Password?
                </Link>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 mt-6"
              >
                {loading ? (
                  <>
                    <span className="inline-block animate-spin">⏳</span>
                    Logging in...
                  </>
                ) : (
                  <>
                    Login
                    <FiArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Signup Link */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Don&apos;t have an account?
              </p>
              <Link
                href={`/auth/register?role=${role}`}
                className="inline-block bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Sign Up as {role.charAt(0).toUpperCase() + role.slice(1)}
              </Link>
            </div>

            {/* Other Role Option */}
            {role !== 'admin' && (
              <div className="mt-6 text-center">
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Want to login as {role === 'teacher' ? 'School' : 'Teacher'}?
                </p>
                <Link
                  href={`/auth/login?role=${role === 'teacher' ? 'school' : 'teacher'}`}
                  className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                >
                  Switch role
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
