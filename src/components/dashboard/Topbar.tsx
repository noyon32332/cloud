import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import {
  ArrowLeftRight,
  BookOpen,
  ChevronDown,
  FileCheck,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings,
} from 'lucide-react'
import NotificationsMenu from '@/components/dashboard/NotificationsMenu'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'
import type { User as AppUser } from '@/types'

interface TopbarProps {
  collapsed: boolean
  onToggleCollapse: () => void
  onOpenMobileMenu: () => void
  user: AppUser | null
  onLogout: () => void
}

const pageHeaders: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': { title: 'Dashboard', subtitle: 'Overview & key metrics' },
  '/courses': { title: 'Courses', subtitle: 'Enrolled subjects & syllabi' },
  '/chapters': { title: 'Chapters', subtitle: 'Notes & formula guides' },
  '/exams': { title: 'Exams', subtitle: 'Online assessments & tests' },
  '/exams/builder': { title: 'Exam Builder', subtitle: 'Compose & publish tests' },
  '/results': { title: 'Results', subtitle: 'Scores & detailed reviews' },
  '/analytics': { title: 'Analytics', subtitle: 'Performance diagnostics' },
  '/settings': { title: 'Settings', subtitle: 'Account & preferences' },
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export default function Topbar({ collapsed, onToggleCollapse, onOpenMobileMenu, user, onLogout }: TopbarProps) {
  const { pathname } = useLocation()
  const { toggleRole } = useAuth()
  const [profileOpen, setProfileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const profileRef = useRef<HTMLDivElement>(null)

  const isTeacher = user?.role === 'teacher'
  const headerInfo = pageHeaders[pathname] || {
    title: 'EduSphere',
    subtitle: 'Academic portal',
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/60 bg-white/95 backdrop-blur-xs">
      <div className="flex h-14 items-center justify-between gap-4 px-4 sm:px-6">
        {/* Left: Collapse toggle + Title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            aria-label="Open menu"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200/80 text-slate-600 hover:bg-slate-50 lg:hidden"
          >
            <Menu className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label="Toggle sidebar"
            className="hidden h-8 w-8 items-center justify-center rounded-lg border border-slate-200/80 text-slate-500 hover:bg-slate-50 hover:text-slate-800 lg:flex"
          >
            {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>

          <div className="min-w-0">
            <h1 className="truncate text-sm font-bold text-slate-900">{headerInfo.title}</h1>
            <p className="hidden text-[11px] text-slate-400 md:block truncate font-medium">{headerInfo.subtitle}</p>
          </div>
        </div>

        {/* Center: Linear Style Minimal Search */}
        <div className="hidden md:flex flex-1 max-w-sm mx-4">
          <div className="relative w-full">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Search (⌘K)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 w-full rounded-lg border border-slate-200/70 bg-slate-50/70 pl-8 pr-3 text-xs text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:border-blue-500 focus:bg-white"
            />
          </div>
        </div>

        {/* Right Actions: Role Toggle + Notifications + Profile */}
        <div className="flex items-center gap-2.5">
          {/* Quick Role Switcher */}
          <button
            type="button"
            onClick={toggleRole}
            title={`Switch to ${isTeacher ? 'Student' : 'Teacher'} perspective`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/80 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <ArrowLeftRight className="h-3 w-3 text-blue-600" />
            <span className="hidden sm:inline text-[11px]">Role:</span>
            <span className="capitalize text-[11px] font-bold text-blue-600">{user?.role || 'student'}</span>
          </button>

          {/* Notifications Dropdown */}
          <NotificationsMenu />

          {/* User Profile Dropdown */}
          <div ref={profileRef} className="relative">
            <button
              type="button"
              onClick={() => setProfileOpen((prev) => !prev)}
              className="flex items-center gap-2 rounded-lg border border-slate-200/80 p-1 pr-2 hover:bg-slate-50 transition-colors"
            >
              {user?.avatar ? (
                <img src={user.avatar} alt={user.fullName} className="h-6 w-6 rounded object-cover" />
              ) : (
                <div className="flex h-6 w-6 items-center justify-center rounded bg-blue-600 text-[10px] font-bold text-white">
                  {getInitials(user?.fullName || 'User')}
                </div>
              )}
              <span className="hidden max-w-[90px] truncate text-xs font-semibold text-slate-800 sm:block">
                {user?.fullName?.split(' ')[0] || 'User'}
              </span>
              <ChevronDown className={cn('h-3 w-3 text-slate-400 transition-transform', profileOpen && 'rotate-180')} />
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 4, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.98 }}
                  transition={{ duration: 0.12 }}
                  className="absolute right-0 mt-1.5 w-56 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg z-50 text-xs"
                >
                  <div className="border-b border-slate-100 p-2.5">
                    <p className="font-semibold text-slate-900">{user?.fullName || 'EduSphere User'}</p>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">{user?.email || 'user@edusphere.edu'}</p>
                  </div>

                  <div className="py-1 space-y-0.5 font-medium text-slate-700">
                    <Link
                      to="/dashboard"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 hover:bg-slate-50 transition-colors"
                    >
                      <BookOpen className="h-3.5 w-3.5 text-slate-400" />
                      Dashboard
                    </Link>
                    <Link
                      to="/exams"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 hover:bg-slate-50 transition-colors"
                    >
                      <FileCheck className="h-3.5 w-3.5 text-slate-400" />
                      Exams
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 hover:bg-slate-50 transition-colors"
                    >
                      <Settings className="h-3.5 w-3.5 text-slate-400" />
                      Settings
                    </Link>
                  </div>

                  <div className="border-t border-slate-100 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setProfileOpen(false)
                        onLogout()
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  )
}
