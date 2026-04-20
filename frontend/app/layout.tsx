import type { Metadata } from 'next'
import './globals.css'
import { ThemeSwitcher } from '../components/ThemeSwitcher'

export const metadata: Metadata = {
  title: 'Teacher Job Portal',
  description: 'A comprehensive job portal for teachers and schools',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="w-full flex justify-end p-4">
          <ThemeSwitcher />
        </div>
        {children}
      </body>
    </html>
  )
}
