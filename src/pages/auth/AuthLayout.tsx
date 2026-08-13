import { Outlet, Link } from 'react-router-dom'
import { GraduationCap, Sun, Moon } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'

export default function AuthLayout() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50/30 to-emerald-50 dark:from-emerald-950 dark:via-green-950/10 dark:to-emerald-950 flex flex-col">
      {/* Header */}
      <header className="w-full px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/25 group-hover:shadow-green-500/40 transition-shadow">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-emerald-950 dark:text-emerald-50 tracking-tight">
              Study<span className="text-green-600">Sphere</span>
            </span>
          </Link>
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl text-emerald-600 dark:text-emerald-400 hover:bg-white dark:hover:bg-emerald-800 hover:text-emerald-700 dark:hover:text-emerald-200 transition-all duration-200 shadow-sm"
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-6">
          <Link to="/" className="text-xs text-emerald-600 hover:text-green-500 transition-colors dark:text-emerald-400">Home</Link>
          <Link to="/login" className="text-xs text-emerald-600 hover:text-green-500 transition-colors dark:text-emerald-400">Login</Link>
          <Link to="/register" className="text-xs text-emerald-600 hover:text-green-500 transition-colors dark:text-emerald-400">Register</Link>
          <span className="text-xs text-emerald-300 dark:text-emerald-600">&copy; 2026 StudySphere</span>
        </div>
      </footer>
    </div>
  )
}
