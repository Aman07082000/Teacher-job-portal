'use client'

import React, { useState, useEffect } from 'react'
import { advancedAPI } from '@/lib/api'
import Link from 'next/link'

interface Notification {
  id: number
  notification_type: string
  title: string
  description: string
  is_read: boolean
  created_at: string
  related_job_id?: number
  related_school_id?: number
}

export default function NotificationsCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState<'all' | 'unread'>('unread')

  useEffect(() => {
    fetchNotifications()
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchNotifications = async () => {
    setLoading(true)
    try {
      const response =
        filter === 'unread'
          ? await advancedAPI.getUnreadNotifications(50)
          : await advancedAPI.getAllNotifications(100)
      
      setNotifications(response.data)
      setUnreadCount(response.data.filter((n: Notification) => !n.is_read).length)
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await advancedAPI.markNotificationAsRead(notificationId)
      setNotifications(
        notifications.map((n) =>
          n.id === notificationId ? { ...n, is_read: true } : n
        )
      )
      setUnreadCount(Math.max(0, unreadCount - 1))
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await advancedAPI.markAllNotificationsAsRead()
      setNotifications(notifications.map((n) => ({ ...n, is_read: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error('Error marking all as read:', error)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'job_match':
        return '💼'
      case 'company_post':
        return '🏢'
      case 'interview_scheduled':
        return '📞'
      case 'offer':
        return '🎉'
      case 'message':
        return '💬'
      default:
        return '📬'
    }
  }

  const getNotificationLink = (notification: Notification) => {
    if (notification.related_job_id) {
      return `/teacher/jobs/${notification.related_job_id}`
    }
    return '#'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">🔔 Notifications</h2>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
          >
            Mark All as Read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => {
            setFilter('unread')
            fetchNotifications()
          }}
          className={`px-4 py-2 rounded-lg ${
            filter === 'unread'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Unread ({unreadCount})
        </button>
        <button
          onClick={() => {
            setFilter('all')
            fetchNotifications()
          }}
          className={`px-4 py-2 rounded-lg ${
            filter === 'all'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All Notifications
        </button>
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="text-center py-8">Loading notifications...</div>
      ) : notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <Link
              key={notification.id}
              href={getNotificationLink(notification)}
            >
              <div
                className={`p-4 rounded-lg border-l-4 cursor-pointer transition hover:shadow-md ${
                  notification.is_read
                    ? 'bg-gray-50 border-gray-300'
                    : 'bg-blue-50 border-blue-500'
                }`}
              >
                <div className="flex items-start gap-4">
                  <span className="text-2xl">
                    {getNotificationIcon(notification.notification_type)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-semibold text-gray-900">
                        {notification.title}
                      </h4>
                      {!notification.is_read && (
                        <span className="inline-block w-3 h-3 bg-blue-500 rounded-full flex-shrink-0 mt-1"></span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mt-1">
                      {notification.description}
                    </p>
                    <p className="text-gray-500 text-xs mt-2">
                      {new Date(notification.created_at).toLocaleDateString()}{' '}
                      {new Date(notification.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  {!notification.is_read && (
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        handleMarkAsRead(notification.id)
                      }}
                      className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 flex-shrink-0"
                    >
                      Mark Read
                    </button>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-12 text-center">
          <p className="text-xl text-gray-500 mb-4">No notifications</p>
          <p className="text-gray-600">You're all caught up! 🎉</p>
        </div>
      )}
    </div>
  )
}
