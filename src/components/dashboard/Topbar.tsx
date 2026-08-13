import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ChevronDown, Menu, PanelLeftClose, PanelLeftOpen, Search, Settings, User } from 'lucide-react'
import NotificationsMenu from '@/components/dashboard/NotificationsMenu'
import { cn } from '@/lib/utils'
import type { User as AppUser } from '@/types'

interface TopbarProps {
  collapsed: boolean
  onToggleCollapse: () => void
  onOpenMobileMenu: () => void
  user: AppUser | null
  onLogout: () => void
}

const titles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/workspaces': 'My Courses',
  '/files': 'My Files',
  '/chat': 'Messages',
  '/profile': 'Profile',
  '/settings': 'Settings',
  '/calendar': 'Calendar',
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
  const navigate = useNavigate()
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

  const title = titles[pathname] || 'Dashboard'

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
    <header className="sticky top-0 z-20 border-b border-emerald-900/60 bg-emerald-50/70 backdrop-blur-xl dark:border-emerald-900/40 dark:bg-emerald-950/70">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={onOpenMobileMenu}
          aria-label="Open menu"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-800 text-emerald-700 transition-colors hover:text-green-600 lg:hidden dark:border-emerald-700 dark:text-emerald-300"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Collapse toggle (desktop) */}
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label="Toggle sidebar"
          className="hidden h-10 w-10 items-center justify-center rounded-xl border border-emerald-800 text-emerald-700 transition-colors hover:text-green-600 lg:flex dark:border-emerald-700 dark:text-emerald-300"
        >
          {collapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
        </button>

        {/* Title */}
        <div className="min-w-0">
          <h1 className="truncate text-lg font-bold tracking-tight text-emerald-950 dark:text-emerald-50">{title}</h1>
          <p className="hidden text-xs text-emerald-600 sm:block dark:text-emerald-400">Student Dashboard</p>
        </div>

        {/* Search */}
        <div className="ml-auto hidden flex-1 justify-end md:flex">
          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-500 dark:text-emerald-400" />
            <input
              type="search"
              placeholder="Search courses, assignments..."
              className="h-10 w-full rounded-xl border border-emerald-800 bg-white/70 pl-12 pr-4 text-sm text-emerald-950 outline-none transition-all placeholder:text-emerald-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 dark:border-emerald-700 dark:bg-emerald-900/70 dark:text-emerald-50 dark:placeholder:text-emerald-400"
            />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <NotificationsMenu />

          {/* Profile menu */}
          <div ref={profileRef} className="relative">
            <button
              type="button"
              onClick={() => setProfileOpen((prev) => !prev)}
              className="flex items-center gap-2 rounded-xl border border-emerald-800 bg-white/70 p-1.5 pr-2.5 transition-all hover:border-green-500/50 hover:shadow-lg hover:shadow-green-500/5 dark:border-emerald-700 dark:bg-emerald-900/70"
            >
              {user?.avatar ? (
                <img src={user.avatar} alt={user.fullName} className="h-7 w-7 rounded-lg object-cover" />
              ) : (
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 text-[10px] font-bold text-white">
                  {getInitials(user?.fullName || 'S')}
                </div>
              )}
              <span className="hidden max-w-[120px] truncate text-sm font-semibold text-emerald-950 sm:block dark:text-emerald-50">
                {user?.fullName?.split(' ')[0] || 'Student'}
              </span>
              <ChevronDown className={cn('h-4 w-4 text-emerald-500 transition-transform', profileOpen && 'rotate-180 dark:text-emerald-400')} />
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className="absolute right-0 z-50 mt-3 w-52 origin-top-right overflow-hidden rounded-2xl border border-emerald-800 bg-white/95 py-1.5 shadow-2xl shadow-emerald-950/20 backdrop-blur-xl dark:border-emerald-700 dark:bg-emerald-950/95"
                >
                  <div className="border-b border-emerald-100 px-4 py-3 dark:border-emerald-800">
                    <p className="truncate text-sm font-semibold text-emerald-950 dark:text-emerald-50">{user?.fullName || 'Student'}</p>
                    <p className="truncate text-xs text-emerald-600 dark:text-emerald-400">{user?.email || ''}</p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-emerald-700 transition-colors hover:bg-emerald-50 dark:text-emerald-200 dark:hover:bg-emerald-800/60"
                  >
                    <User className="h-4 w-4 text-emerald-500" />
                    My Profile
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-emerald-700 transition-colors hover:bg-emerald-50 dark:text-emerald-200 dark:hover:bg-emerald-800/60"
                  >
                    <Settings className="h-4 w-4 text-emerald-500" />
                    Settings
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false)
                      navigate('/login')
                      void onLogout()
                    }}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-red-500 transition-colors hover:bg-red-500/10"
                  >
                    <span className="h-4 w-4 rounded-full border-2 border-red-500" />
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  )
}
