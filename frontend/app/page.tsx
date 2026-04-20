import Link from 'next/link'
import { FiSearch, FiCheckCircle, FiBriefcase, FiTrendingUp, FiUsers, FiAward, FiArrowRight } from 'react-icons/fi'

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-3xl">📚</span>
            <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">TeacherJob</h1>
          </div>
          <div className="flex gap-4 items-center">
            <Link
              href="/auth/login?role=teacher"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 font-semibold transition-colors"
            >
              Login
            </Link>
            <Link
              href="/#signup"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-20 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Your Dream Teaching Job <span className="text-blue-200">Awaits</span>
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Connect with top schools across the country. Find the perfect teaching opportunity that matches your expertise and aspirations.
              </p>
              <div className="flex gap-4">
                <Link
                  href="/auth/register?role=teacher"
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold text-lg hover:bg-blue-50 transition-colors flex items-center gap-2"
                >
                  Start for Teachers
                  <FiArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/auth/register?role=school"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-blue-800 transition-colors flex items-center gap-2"
                >
                  For Schools
                  <FiArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="w-full h-96 bg-blue-500 rounded-2xl opacity-20 absolute transform rotate-6"></div>
              <div className="relative bg-gradient-to-br from-blue-300 to-blue-600 rounded-2xl p-8 text-center">
                <div className="text-6xl mb-4">🎓</div>
                <p className="text-2xl font-bold text-white">10,000+</p>
                <p className="text-blue-100">Active Teachers</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">
          Why Choose TeacherJob?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: FiSearch, title: 'Smart Search', desc: 'Find jobs matching your expertise and location preferences' },
            { icon: FiBriefcase, title: 'Verified Employers', desc: 'Apply to verified schools and educational institutions' },
            { icon: FiTrendingUp, title: 'Career Growth', desc: 'Get guidance and insights to advance your teaching career' },
            { icon: FiUsers, title: '24/7 Support', desc: 'Dedicated support team to help you succeed' },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="text-blue-600 dark:text-blue-400 mb-4">
                <feature.icon className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-100 dark:bg-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              { number: '10,000+', label: 'Active Teachers', icon: '👨‍🏫' },
              { number: '2,500+', label: 'Schools Hiring', icon: '🏫' },
              { number: '50,000+', label: 'Jobs Posted', icon: '📋' },
              { number: '95%', label: 'Success Rate', icon: '⭐' },
            ].map((stat, idx) => (
              <div key={idx}>
                <div className="text-4xl mb-2">{stat.icon}</div>
                <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">{stat.number}</p>
                <p className="text-gray-600 dark:text-gray-400 font-semibold">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              step: '01',
              title: 'Create Your Profile',
              desc: 'Sign up, add your qualifications, experience, and subject expertise.',
              icon: '📝',
            },
            {
              step: '02',
              title: 'Search & Apply',
              desc: 'Browse available positions and apply to jobs that match your profile.',
              icon: '🔍',
            },
            {
              step: '03',
              title: 'Get Hired',
              desc: 'Track applications, attend interviews, and get your dream job.',
              icon: '🎉',
            },
          ].map((item, idx) => (
            <div key={idx} className="text-center">
              <div className="text-6xl mb-4">{item.icon}</div>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-4">{item.step}</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{item.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-lg">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Role Cards Section */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">
            Whether You&apos;re a Teacher or a School
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Teacher Card */}
            <div className="bg-white dark:bg-gray-700 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-12 text-white">
                <div className="text-6xl mb-4">👨‍🏫</div>
                <h3 className="text-3xl font-bold mb-2">For Teachers</h3>
                <p className="text-blue-100 text-lg">Land your ideal teaching position</p>
              </div>
              <div className="p-12">
                <ul className="space-y-4 mb-8">
                  {[
                    'Browse 50,000+ job opportunities',
                    'Easy application process',
                    'Track your applications in real-time',
                    'Get insights about school reviews',
                    'Salary transparency',
                    'Career development resources',
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                      <FiCheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/auth/register?role=teacher"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold text-center transition-colors"
                >
                  Register as Teacher
                </Link>
              </div>
            </div>

            {/* School Card */}
            <div className="bg-white dark:bg-gray-700 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-12 text-white">
                <div className="text-6xl mb-4">🏫</div>
                <h3 className="text-3xl font-bold mb-2">For Schools</h3>
                <p className="text-purple-100 text-lg">Find talented educators for your institution</p>
              </div>
              <div className="p-12">
                <ul className="space-y-4 mb-8">
                  {[
                    'Post unlimited job listings',
                    'Access vetted teacher profiles',
                    'Manage applications easily',
                    'Contact top candidates',
                    'Dedicated account manager',
                    'Analytics and insights',
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                      <FiCheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/auth/register?role=school"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-bold text-center transition-colors"
                >
                  Register as School
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">
          Success Stories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: 'Priya Sharma',
              role: 'Math Teacher',
              school: 'Delhi Public School',
              text: 'TeacherJob helped me find my perfect teaching position. The application process was smooth and I got hired within 2 weeks!',
              avatar: '👩‍🏫',
            },
            {
              name: 'Rajeev Kumar',
              role: 'School Principal',
              school: 'St. Mary\'s Academy',
              text: 'We found exceptional teachers through TeacherJob. The platform is intuitive and the candidates are well-vetted and qualified.',
              avatar: '👨‍💼',
            },
            {
              name: 'Ananya Gupta',
              role: 'English Teacher',
              school: 'Modern School',
              text: 'The career insights and guidance provided on TeacherJob was invaluable. Highly recommended for all teachers!',
              avatar: '👩‍🏫',
            },
          ].map((testimonial, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-4xl">{testimonial.avatar}</div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">{testimonial.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">{testimonial.school}</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 italic">&quot;{testimonial.text}&quot;</p>
              <div className="flex gap-1 mt-4 text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>⭐</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Teaching Career?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of teachers and schools using TeacherJob to find the perfect match.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/auth/register?role=teacher"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition-colors"
            >
              Sign Up as Teacher
            </Link>
            <Link
              href="/auth/register?role=school"
              className="border-2 border-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
            >
              Sign Up as School
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-bold mb-4">TeacherJob</h4>
              <p className="text-sm">Connecting talented teachers with quality educational institutions.</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">For Teachers</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white transition-colors">Browse Jobs</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">My Applications</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Career Guide</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">For Schools</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white transition-colors">Post Job</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Find Teachers</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-sm">&copy; 2026 TeacherJob. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
