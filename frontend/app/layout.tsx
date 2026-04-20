import type { Metadata } from 'next'
import './globals.css'
import ThemeProvider from '../components/ThemeProvider'
import Navbar from '../components/Navbar'

export const metadata: Metadata = {
  title: 'TeacherJob - Find Your Dream Teaching Position',
  description: 'Connect teachers with quality educational institutions. Find top teaching jobs, build your profile, and advance your career.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
        <ThemeProvider>
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
