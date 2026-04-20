'use client'

import { useEffect, useState } from 'react'
import { FiChevronDown } from 'react-icons/fi'

export type ThemeMode = 'light' | 'dark' | 'system'

export function useThemeMode() {
  const [theme, setTheme] = useState<ThemeMode>('system')

  useEffect(() => {
    // On mount, check localStorage or system
    const saved = localStorage.getItem('theme-mode') as ThemeMode | null
    if (saved) {
      setTheme(saved)
      applyTheme(saved)
    } else {
      applyTheme('system')
    }
  }, [])

  const applyTheme = (mode: ThemeMode) => {
    if (mode === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      document.documentElement.classList.toggle('dark', isDark)
    } else {
      document.documentElement.classList.toggle('dark', mode === 'dark')
    }
  }

  const changeTheme = (mode: ThemeMode) => {
    setTheme(mode)
    localStorage.setItem('theme-mode', mode)
    applyTheme(mode)
  }

  return { theme, changeTheme }
}

const themeOptions: { label: string; icon: string; value: ThemeMode }[] = [
  { label: 'Light', icon: '☀️', value: 'light' },
  { label: 'Dark', icon: '🌙', value: 'dark' },
  { label: 'System', icon: '🖥️', value: 'system' },
]

export function ThemeDropdown() {
  const { theme, changeTheme } = useThemeMode()
  const [isOpen, setIsOpen] = useState(false)

  const currentTheme = themeOptions.find(opt => opt.value === theme)

  return (
    <div className="relative group">
      {/* Dropdown Trigger Button */}
      <button
        className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        title="Change theme"
      >
        <span className="text-lg">{currentTheme?.icon}</span>
        <span className="text-sm font-medium hidden sm:inline">{currentTheme?.label}</span>
        <FiChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      <div
        className={`absolute right-0 mt-0 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-200 origin-top ${
          isOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-95 pointer-events-none'
        }`}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <div className="py-1">
          {themeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                changeTheme(option.value)
                setIsOpen(false)
              }}
              className={`w-full px-4 py-2 text-left flex items-center gap-3 transition-colors duration-150 ${
                theme === option.value
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <span className="text-lg">{option.icon}</span>
              <span className="font-medium">{option.label}</span>
              {theme === option.value && <span className="ml-auto text-sm">✓</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
