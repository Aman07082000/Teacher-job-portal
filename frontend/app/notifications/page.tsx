'use client'

import React from 'react'
import NotificationsCenter from '@/components/NotificationsCenter'
import RoleGuard from '@/components/RoleGuard'

export default function NotificationsPage() {
  return (
    <RoleGuard requiredRole="teacher">
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <NotificationsCenter />
        </div>
      </div>
    </RoleGuard>
  )
}e: 'A new English Teacher position at The Heritage School matches your profile',
    timestamp: '1 day ago',
    read: true,
    link: '/teacher/browse-jobs',
    icon: <FiBell className="w-5 h-5" />,
  },
  {
    id: 4,
    type: 'update',
    title: 'Profile Tips',
    message: 'Complete your profile to increase your chances of getting hired. 75% complete',
    timestamp: '2 days ago',
    read: true,
    icon: <FiAlertCircle className="w-5 h-5" />,
  },
  {
    id: 5,
    type: 'application',
    title: 'Application Status Update',
    message: 'Your application to Cathedral School has been shortlisted!',
    timestamp: '3 days ago',
    read: true,
    link: '/teacher/applications',
    icon: <FiCheckCircle className="w-5 h-5" />,
  },
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'application' | 'message'>('all')

  const filteredNotifications = notifications.filter(notif => {
    if (filterType === 'all') return true
    if (filterType === 'unread') return !notif.read
    return notif.type === filterType
  })

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id))
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'application':
        return 'border-blue-400 bg-blue-50 dark:bg-blue-900/10 dark:border-blue-700'
      case 'message':
        return 'border-purple-400 bg-purple-50 dark:bg-purple-900/10 dark:border-purple-700'
      case 'alert':
        return 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/10 dark:border-yellow-700'
      case 'update':
        return 'border-green-400 bg-green-50 dark:bg-green-900/10 dark:border-green-700'
      default:
        return 'border-gray-400 bg-gray-50 dark:bg-gray-900/10 dark:border-gray-700'
    }
  }

  const getIconColor = (type: string) => {
    switch (type) {
      case 'application':
        return 'text-blue-600 dark:text-blue-400'
      case 'message':
        return 'text-purple-600 dark:text-purple-400'
      case 'alert':
        return 'text-yellow-600 dark:text-yellow-400'
      case 'update':
        return 'text-green-600 dark:text-green-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-4xl font-bold">Notifications</h1>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
            >
              Mark all as read
            </button>
          )}
        </div>
        {unreadCount > 0 && (
          <p className="text-gray-600 dark:text-gray-400">
            You have <span className="font-bold text-blue-600 dark:text-blue-400">{unreadCount}</span> unread notification{unreadCount !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
        {(['all', 'unread', 'application', 'message'] as const).map(type => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-4 py-2 rounded-full font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
              filterType === type
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <FiFilter className="w-4 h-4" />
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-12 text-center">
          <div className="mb-4 text-5xl">🔕</div>
          <h2 className="text-2xl font-bold mb-2">No Notifications</h2>
          <p className="text-gray-600 dark:text-gray-400">
            {filterType === 'unread' ? 'All caught up! No unread notifications.' : 'You don\'t have any notifications yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map(notification => (
            <Link
              key={notification.id}
              href={notification.link || '#'}
              onClick={(e) => {
                if (!notification.read) {
                  markAsRead(notification.id)
                }
              }}
            >
              <div
                className={`border-l-4 rounded-lg p-4 transition-all hover:shadow-md cursor-pointer ${
                  getNotificationColor(notification.type)
                } ${!notification.read ? 'dark:bg-gray-800/50' : 'dark:bg-gray-800/30'}`}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex gap-4 flex-1">
                    <div className={`mt-1 flex-shrink-0 ${getIconColor(notification.type)}`}>
                      {notification.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className={`font-semibold text-lg ${!notification.read ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <span className="w-3 h-3 bg-blue-600 rounded-full flex-shrink-0 mt-1.5"></span>
                        )}
                      </div>
                      <p className="text-gray-700 dark:text-gray-400 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                        {notification.timestamp}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      deleteNotification(notification.id)
                    }}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-red-600 dark:hover:text-red-400 flex-shrink-0"
                    title="Delete notification"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
