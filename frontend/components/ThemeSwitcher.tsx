"use client";
import { useEffect, useState } from 'react'

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

export function ThemeSwitcher() {
  const { theme, changeTheme } = useThemeMode()

  return (
    <div className="flex gap-2 items-center bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md">
      <span className="font-medium text-gray-900 dark:text-gray-100">Theme:</span>
      <button
        className={`px-3 py-1 rounded-md font-semibold transition-all duration-200 ${
          theme === 'light' 
            ? 'bg-blue-600 text-white shadow-md' 
            : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600'
        }`}
        onClick={() => changeTheme('light')}
        title="Light theme"
      >
        ☀️ Light
      </button>
      <button
        className={`px-3 py-1 rounded-md font-semibold transition-all duration-200 ${
          theme === 'dark' 
            ? 'bg-blue-600 text-white shadow-md' 
            : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600'
        }`}
        onClick={() => changeTheme('dark')}
        title="Dark theme"
      >
        🌙 Dark
      </button>
      <button
        className={`px-3 py-1 rounded-md font-semibold transition-all duration-200 ${
          theme === 'system' 
            ? 'bg-blue-600 text-white shadow-md' 
            : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600'
        }`}
        onClick={() => changeTheme('system')}
        title="System theme"
      >
        🖥️ System
      </button>
    </div>
  )
}
