import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
      <div className="text-center text-white">
        <h1 className="text-5xl font-bold mb-6">Teacher Job Portal</h1>
        <p className="text-xl mb-12">Connect teachers with opportunities</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {/* Teacher Panel */}
          <div className="card text-gray-800 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-bold mb-4">👨‍🏫 Teacher</h2>
            <p className="mb-6">Find jobs, build your profile, and track applications</p>
            <div className="space-y-2">
              <Link href="/auth/login?role=teacher" className="btn-primary block">
                Login
              </Link>
              <Link href="/auth/register?role=teacher" className="btn-secondary block">
                Register
              </Link>
            </div>
          </div>

          {/* School Panel */}
          <div className="card text-gray-800 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-bold mb-4">🏫 School</h2>
            <p className="mb-6">Post jobs, manage applicants, and build your team</p>
            <div className="space-y-2">
              <Link href="/auth/login?role=school" className="btn-primary block">
                Login
              </Link>
              <Link href="/auth/register?role=school" className="btn-secondary block">
                Register
              </Link>
            </div>
          </div>

          {/* Admin Panel */}
          <div className="card text-gray-800 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-bold mb-4">⚙️ Admin</h2>
            <p className="mb-6">Manage users, monitor jobs, and view analytics</p>
            <div className="space-y-2">
              <Link href="/auth/login?role=admin" className="btn-primary block">
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
