'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { authAPI } from '@/lib/api'
import { useAuthStore } from '@/lib/store'
import { FiEye, FiEyeOff, FiMail, FiLock, FiUser, FiAlertCircle, FiCheckCircle, FiArrowRight } from 'react-icons/fi'

export default function RegisterContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const role = searchParams.get('role') || 'teacher'

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)

  const { login } = useAuthStore()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (name === 'password') {
      // Calculate password strength
      let strength = 0
      if (value.length >= 8) strength++
      if (/[a-z]/.test(value) && /[A-Z]/.test(value)) strength++
      if (/[0-9]/.test(value)) strength++
      if (/[^a-zA-Z0-9]/.test(value)) strength++
      setPasswordStrength(strength)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const response = await authAPI.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role,
      })
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
      setError(err.response?.data?.error || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getRoleInfo = () => {
    switch (role) {
      case 'teacher':
        return { title: 'Teacher', subtitle: 'Build your teaching career', bg: 'from-blue-600 to-blue-800' }
      case 'school':
        return { title: 'School', subtitle: 'Find qualified teachers', bg: 'from-purple-600 to-purple-800' }
      default:
        return { title: 'TeacherJob', subtitle: 'Your job portal', bg: 'from-blue-600 to-blue-800' }
    }
  }

  const roleInfo = getRoleInfo()
  const passwordStrengthColor = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'][Math.max(0, passwordStrength - 1)] || 'bg-gray-300'
  const passwordStrengthLabel = ['Weak', 'Fair', 'Good', 'Strong'][Math.max(0, passwordStrength - 1)] || 'Very Weak'

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center p-4 pt-24">
      <div className="w-full max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
          {/* Left Side - Benefits */}
          <div className={`bg-gradient-to-br ${roleInfo.bg} text-white p-12 flex flex-col justify-center hidden lg:flex`}>
            <div className="mb-8">
              <div className="text-5xl mb-4">📚</div>
              <h1 className="text-4xl font-bold mb-2">TeacherJob</h1>
              <p className="text-xl text-blue-100">Join {role === 'teacher' ? '10,000+ Teachers' : '2,500+ Schools'}</p>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="text-3xl">🎯</div>
                <div>
                  <h3 className="font-bold text-lg">Right Opportunities</h3>
                  <p className="text-blue-100">{role === 'teacher' ? 'Find jobs matching your expertise' : 'Find teachers matching your needs'}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-3xl">🔒</div>
                <div>
                  <h3 className="font-bold text-lg">100% Verified & Secure</h3>
                  <p className="text-blue-100">Your data and privacy are protected</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-3xl">⚡</div>
                <div>
                  <h3 className="font-bold text-lg">Quick & Easy</h3>
                  <p className="text-blue-100">Get started in less than 2 minutes</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Register Form */}
          <div className="p-8 lg:p-12 flex flex-col justify-center max-h-[90vh] lg:max-h-none overflow-y-auto">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4 lg:hidden">
                <span className="text-3xl">📚</span>
                <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">TeacherJob</h1>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {role === 'teacher' ? 'Start Your Teaching Journey' : 'Find Your Next Teacher'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Create your account to get started
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg flex items-start gap-3">
                <FiAlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Min 6 characters"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                  </button>
                </div>

                {/* Password Strength */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${passwordStrengthColor} transition-all duration-300`}
                          style={{ width: `${(passwordStrength / 4) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                        {passwordStrengthLabel}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showConfirmPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                  </button>
                </div>
                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                  <div className="mt-2 flex items-center gap-2 text-green-600 dark:text-green-400 text-sm">
                    <FiCheckCircle className="w-4 h-4" />
                    <span>Passwords match</span>
                  </div>
                )}
              </div>

              {/* Terms */}
              <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                <input type="checkbox" className="rounded mt-1" defaultChecked required />
                <span>
                  I agree to the <Link href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Terms of Service</Link> and{' '}
                  <Link href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Privacy Policy</Link>
                </span>
              </div>

              {/* Register Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 mt-6"
              >
                {loading ? (
                  <>
                    <span className="inline-block animate-spin">⏳</span>
                    Creating Account...
                  </>
                ) : (
                  <>
                    Sign Up Now
                    <FiArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                Already have an account?
              </p>
              <Link
                href={`/auth/login?role=${role}`}
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
              >
                Login here
              </Link>
            </div>

            {/* Other Role Option */}
            <div className="mt-4 text-center">
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Want to signup as {role === 'teacher' ? 'School' : 'Teacher'}?
              </p>
              <Link
                href={`/auth/register?role=${role === 'teacher' ? 'school' : 'teacher'}`}
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
              >
                Switch role
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
