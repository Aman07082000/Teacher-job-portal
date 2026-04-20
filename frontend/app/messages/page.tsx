'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { FiSend, FiSearch, FiPhone, FiPlus, FiMoreVertical, FiFileText, FiImage, FiSmile } from 'react-icons/fi'

interface ChatMessage {
  id: number
  sender: string
  senderRole: 'teacher' | 'school'
  message: string
  timestamp: string
  read: boolean
  type: 'text' | 'file' | 'image'
  fileUrl?: string
}

interface ChatConversation {
  id: number
  name: string
  avatar: string
  role: string
  lastMessage: string
  timestamp: string
  unread: number
  online: boolean
}

const mockConversations: ChatConversation[] = [
  {
    id: 1,
    name: 'Delhi Public School',
    avatar: '🏫',
    role: 'School Admin',
    lastMessage: 'Can you join the interview tomorrow at 2 PM?',
    timestamp: '2 mins ago',
    unread: 2,
    online: true,
  },
  {
    id: 2,
    name: 'Priya Sharma',
    avatar: '👩‍💼',
    role: 'HR Manager',
    lastMessage: 'Your application has been shortlisted!',
    timestamp: '5 mins ago',
    unread: 0,
    online: true,
  },
  {
    id: 3,
    name: 'The Heritage School',
    avatar: '🏫',
    role: 'School',
    lastMessage: 'Thank you for applying',
    timestamp: '1 hour ago',
    unread: 0,
    online: false,
  },
]

const mockMessages: ChatMessage[] = [
  {
    id: 1,
    sender: 'Delhi Public School',
    senderRole: 'school',
    message: 'Hi Rajesh! We reviewed your profile and we\'re impressed!',
    timestamp: '10:30 AM',
    read: true,
    type: 'text',
  },
  {
    id: 2,
    sender: 'You',
    senderRole: 'teacher',
    message: 'Thank you! I\'m very interested in the position.',
    timestamp: '10:35 AM',
    read: true,
    type: 'text',
  },
  {
    id: 3,
    sender: 'Delhi Public School',
    senderRole: 'school',
    message: 'Can you join the interview tomorrow at 2 PM? We\'ll send you a video call link.',
    timestamp: '10:40 AM',
    read: true,
    type: 'text',
  },
  {
    id: 4,
    sender: 'Delhi Public School',
    senderRole: 'school',
    message: 'interview-schedule.pdf',
    timestamp: '10:42 AM',
    read: true,
    type: 'file',
    fileUrl: '#',
  },
]

export default function ChatPage() {
  const [conversations, setConversations] = useState(mockConversations)
  const [selectedConversation, setSelectedConversation] = useState(conversations[0])
  const [messages, setMessages] = useState(mockMessages)
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: ChatMessage = {
        id: messages.length + 1,
        sender: 'You',
        senderRole: 'teacher',
        message: newMessage,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        read: false,
        type: 'text',
      }
      setMessages([...messages, message])
      setNewMessage('')

      // Simulate reply
      setTimeout(() => {
        const reply: ChatMessage = {
          id: messages.length + 2,
          sender: selectedConversation.name,
          senderRole: 'school',
          message: 'Thanks for your message! We\'ll get back to you soon.',
          timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          read: true,
          type: 'text',
        }
        setMessages(prev => [...prev, reply])
      }, 1500)
    }
  }

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Messages</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Conversations List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <FiSearch className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div className="overflow-y-auto flex-1">
            {filteredConversations.map(conv => (
              <button
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                className={`w-full p-4 text-left border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                  selectedConversation.id === conv.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative text-2xl">{conv.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                        {conv.name}
                      </h3>
                      {conv.online && (
                        <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{conv.role}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {conv.lastMessage}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500 dark:text-gray-500">
                        {conv.timestamp}
                      </span>
                      {conv.unread > 0 && (
                        <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {conv.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl">{selectedConversation.avatar}</div>
              <div>
                <h2 className="font-bold text-gray-900 dark:text-white">
                  {selectedConversation.name}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {selectedConversation.online ? '🟢 Online' : '🔘 Offline'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-600 dark:text-gray-400">
                <FiPhone className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-600 dark:text-gray-400">
                <FiMoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    msg.sender === 'You'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none'
                  }`}
                >
                  {msg.type === 'file' ? (
                    <a href={msg.fileUrl} className="flex items-center gap-2 hover:underline">
                      <FiFileText className="w-4 h-4" />
                      <span className="text-sm">{msg.message}</span>
                    </a>
                  ) : (
                    <p className="text-sm">{msg.message}</p>
                  )}
                  <span className={`text-xs mt-1 block ${msg.sender === 'You' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-3">
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-600 dark:text-gray-400">
                <FiPlus className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-600 dark:text-gray-400">
                <FiImage className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-600 dark:text-gray-400">
                <FiSmile className="w-5 h-5" />
              </button>
            </div>
            <div className="flex gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FiSend className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* You can add call/video section later */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/video-interviews"
          className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-8 rounded-lg hover:shadow-lg transition-shadow"
        >
          <h3 className="text-2xl font-bold mb-2">📹 Video Interviews</h3>
          <p>Schedule and conduct video interviews</p>
        </Link>
        <Link
          href="/school/pricing"
          className="bg-gradient-to-r from-green-600 to-green-800 text-white p-8 rounded-lg hover:shadow-lg transition-shadow"
        >
          <h3 className="text-2xl font-bold mb-2">💼 Subscription Plans</h3>
          <p>View pricing plans for job postings</p>
        </Link>
      </div>
    </div>
  )
}
