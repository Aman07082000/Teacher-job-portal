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
    <div className="flex gap-2 items-center">
      <span className="font-medium">Theme:</span>
      <button
        className={`btn ${theme === 'light' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        onClick={() => changeTheme('light')}
      >
        Light
      </button>
      <button
        className={`btn ${theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        onClick={() => changeTheme('dark')}
      >
        Dark
      </button>
      <button
        className={`btn ${theme === 'system' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        onClick={() => changeTheme('system')}
      >
        System
      </button>
    </div>
  )
}
