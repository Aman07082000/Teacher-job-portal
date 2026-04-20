'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FiVideo, FiCalendar, FiClock, FiMapPin, FiCheckCircle, FiAlertCircle, FiX, FiPlus } from 'react-icons/fi'
import RoleGuard from '@/components/RoleGuard'

interface Interview {
  id: number
  jobTitle: string
  schoolName: string
  interviewerName: string
  date: string
  time: string
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled'
  duration: number
  videoLink?: string
  notes?: string
}

const mockInterviews: Interview[] = [
  {
    id: 1,
    jobTitle: 'Senior English Teacher',
    schoolName: 'Delhi Public School',
    interviewerName: 'Priya Sharma',
    date: '2026-04-21',
    time: '14:00',
    status: 'scheduled',
    duration: 45,
    videoLink: 'https://meet.google.com/xyz-demo-link',
    notes: 'Interview via Google Meet. Please ensure good internet connectivity.',
  },
  {
    id: 2,
    jobTitle: 'Mathematics Teacher',
    schoolName: 'The Heritage School',
    interviewerName: 'Rajiv Kumar',
    date: '2026-04-18',
    time: '10:00',
    status: 'completed',
    duration: 50,
    notes: 'Great interview! You will hear from us in 2 days.',
  },
  {
    id: 3,
    jobTitle: 'Science Coordinator',
    schoolName: 'Cathedral School',
    interviewerName: 'Dr. Sarah Johnson',
    date: '2026-04-25',
    time: '16:00',
    status: 'scheduled',
    duration: 60,
    videoLink: 'https://meet.google.com/abc-xyz-123',
  },
]

export default function VideoInterviewsPage() {
  const [interviews, setInterviews] = useState(mockInterviews)
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [newInterview, setNewInterview] = useState({
    jobTitle: '',
    date: '',
    time: '',
    interviewerName: '',
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
      case 'ongoing':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
      case 'completed':
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300'
      case 'cancelled':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
      default:
        return ''
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled':
        return '⏰'
      case 'ongoing':
        return '🔴'
      case 'completed':
        return '✅'
      case 'cancelled':
        return '❌'
      default:
        return ''
    }
  }

  return (
    <RoleGuard allowedRoles={['teacher', 'school']}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">📹 Video Interviews</h1>
            <p className="text-gray-600 dark:text-gray-400">Schedule and conduct video interviews</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            <FiPlus className="w-5 h-5" />
            Schedule Interview
          </button>
        </div>

        {/* Schedule Form */}
        {showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md mb-8">
            <h2 className="text-2xl font-bold mb-6">Schedule New Interview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <input
                type="text"
                placeholder="Job Title"
                value={newInterview.jobTitle}
                onChange={(e) => setNewInterview({ ...newInterview, jobTitle: e.target.value })}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              />
              <input
                type="text"
                placeholder="Interviewer Name"
                value={newInterview.interviewerName}
                onChange={(e) => setNewInterview({ ...newInterview, interviewerName: e.target.value })}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              />
              <input
                type="date"
                value={newInterview.date}
                onChange={(e) => setNewInterview({ ...newInterview, date: e.target.value })}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              />
              <input
                type="time"
                value={newInterview.time}
                onChange={(e) => setNewInterview({ ...newInterview, time: e.target.value })}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="flex gap-3">
              <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-semibold">
                Schedule
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Interviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {interviews.map(interview => (
            <div
              key={interview.id}
              onClick={() => setSelectedInterview(interview)}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-all cursor-pointer border-l-4 border-blue-600"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {interview.jobTitle}
                </h3>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getStatusColor(interview.status)}`}>
                  {getStatusIcon(interview.status)} {interview.status}
                </span>
              </div>

              <p className="text-gray-600 dark:text-gray-400 font-medium mb-4">
                {interview.schoolName}
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <FiCalendar className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">{interview.date}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <FiClock className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">{interview.time} (Duration: {interview.duration} min)</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <FiMapPin className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">Video Interview</span>
                </div>
              </div>

              {interview.status === 'scheduled' && (
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2">
                  <FiVideo className="w-4 h-4" />
                  Join Interview
                </button>
              )}
              {interview.status === 'ongoing' && (
                <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center gap-2 animate-pulse">
                  <FiVideo className="w-4 h-4" />
                  Ongoing
                </button>
              )}
              {interview.status === 'completed' && (
                <button className="w-full bg-gray-600 text-white py-2 rounded-lg cursor-default font-semibold flex items-center justify-center gap-2">
                  <FiCheckCircle className="w-4 h-4" />
                  Completed
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Interview Details Modal */}
        {selectedInterview && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-start">
                <h2 className="text-2xl font-bold">{selectedInterview.jobTitle}</h2>
                <button onClick={() => setSelectedInterview(null)}>
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedInterview.status)}`}>
                      {getStatusIcon(selectedInterview.status)} {selectedInterview.status}
                    </span>
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
                      School
                    </p>
                    <p className="text-lg text-gray-900 dark:text-white">
                      {selectedInterview.schoolName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
                      Interviewer
                    </p>
                    <p className="text-lg text-gray-900 dark:text-white">
                      {selectedInterview.interviewerName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
                      Date & Time
                    </p>
                    <p className="text-lg text-gray-900 dark:text-white">
                      {selectedInterview.date} at {selectedInterview.time}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
                      Duration
                    </p>
                    <p className="text-lg text-gray-900 dark:text-white">
                      {selectedInterview.duration} minutes
                    </p>
                  </div>
                </div>

                {selectedInterview.videoLink && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                      Video Link
                    </p>
                    <a
                      href={selectedInterview.videoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline break-all"
                    >
                      {selectedInterview.videoLink}
                    </a>
                  </div>
                )}

                {selectedInterview.notes && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                      Notes
                    </p>
                    <p className="text-gray-900 dark:text-gray-100">
                      {selectedInterview.notes}
                    </p>
                  </div>
                )}

                {selectedInterview.status === 'scheduled' && (
                  <div className="flex gap-3">
                    <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold flex items-center justify-center gap-2">
                      <FiVideo className="w-5 h-5" />
                      Join Video Call
                    </button>
                    <button
                      onClick={() => setSelectedInterview(null)}
                      className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </RoleGuard>
  )
}
