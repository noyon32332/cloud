import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import {
  Bell,
  BookOpen,
  CalendarDays,
  ClipboardList,
  FileText,
  FolderOpen,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Settings,
  User,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { User as AppUser } from '@/types'

interface SidebarProps {
  collapsed: boolean
  mobileOpen: boolean
  onClose: () => void
  onLogout: () => void
  user: AppUser | null
}

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Assignments', icon: FileText, path: '/workspaces' },
  { label: 'My Files', icon: FolderOpen, path: '/files' },
  { label: 'Messages', icon: MessageSquare, path: '/chat' },
  { label: 'Attendance', icon: Bell, path: '/dashboard' },
  { label: 'Calendar', icon: CalendarDays, path: '/calendar' },
  { label: 'Profile', icon: User, path: '/profile' },
  { label: 'Settings', icon: Settings, path: '/settings' },
]

function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export default function Sidebar({ collapsed, mobileOpen, onClose, onLogout, user }: SidebarProps) {
  const { pathname } = useLocation()
  const current = navItems.find((item) => item.path === pathname)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  const renderContent = (layoutId: string) => (
    <div className="flex h-full min-h-0 w-full flex-col">
      {/* Brand */}
      <div className={cn('flex h-16 shrink-0 items-center gap-2.5 border-b border-emerald-900/60 dark:border-emerald-900/40 px-4', collapsed && 'lg:justify-center lg:px-2')}>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/30">
          <GraduationCap className="h-5 w-5 text-white" />
        </div>
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col leading-tight"
            >
              <span className="text-base font-bold text-emerald-950 dark:text-emerald-50">
                Study<span className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">Sphere</span>
              </span>
              <span className="text-[10px] font-medium uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Student Portal</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav - scrollable area */}
      <nav className="sidebar-nav flex-1 min-h-0 overflow-y-auto p-3">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-2 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400"
            >
              Menu
            </motion.p>
          )}
        </AnimatePresence>
        {navItems.map((item) => {
          const isActive = current === item
          return (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => setHoveredItem(item.label)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <Link
                to={item.path}
                onClick={onClose}
                title={item.label}
                className={cn(
                  'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  collapsed && 'lg:justify-center lg:px-0',
                  isActive
                    ? 'text-white'
                    : 'text-emerald-800 hover:text-emerald-950 dark:text-emerald-200 dark:hover:text-white'
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId={layoutId}
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 shadow-lg shadow-green-500/30"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <item.icon className={cn('relative z-10 h-5 w-5 shrink-0', isActive ? 'text-white' : 'text-emerald-500 group-hover:text-green-600 dark:text-emerald-400 dark:group-hover:text-green-400', 'transition-colors')} />
                <AnimatePresence mode="wait">
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -4 }}
                      transition={{ duration: 0.15 }}
                      className="relative z-10 truncate"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {isActive && !collapsed && (
                  <span className="relative z-10 ml-auto h-1.5 w-1.5 rounded-full bg-white/80" />
                )}
              </Link>
              {/* Tooltip for collapsed state */}
              {collapsed && hoveredItem === item.label && (
                <motion.div
                  initial={{ opacity: 0, x: -4, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -4, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-full top-1/2 z-[60] ml-3 -translate-y-1/2 whitespace-nowrap rounded-lg bg-emerald-900 px-3 py-1.5 text-xs font-medium text-white shadow-lg"
                >
                  {item.label}
                </motion.div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Footer: user + logout - fixed at bottom */}
      <div className="shrink-0 border-t border-emerald-900/60 p-3 dark:border-emerald-900/40">
        <div className={cn('flex items-center gap-3 rounded-xl bg-emerald-100/80 p-2.5 dark:bg-emerald-900/40', collapsed && 'lg:justify-center lg:bg-transparent lg:p-0 dark:lg:bg-transparent')}>
          {user?.avatar ? (
            <img src={user.avatar} alt={user.fullName} className="h-9 w-9 shrink-0 rounded-xl object-cover" />
          ) : (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-xs font-bold text-white shadow-lg shadow-green-500/30">
              {getInitials(user?.fullName || 'S')}
            </div>
          )}
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -4 }}
                transition={{ duration: 0.2 }}
                className="min-w-0 flex-1 leading-tight"
              >
                <p className="truncate text-sm font-semibold text-emerald-950 dark:text-emerald-50">{user?.fullName || 'Student'}</p>
                <p className="truncate text-xs capitalize text-emerald-600 dark:text-emerald-400">{user?.role}</p>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            type="button"
            onClick={onLogout}
            title="Logout"
            className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-emerald-500 transition-colors hover:bg-red-500/10 hover:text-red-500 lg:hidden dark:text-emerald-400"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className={cn('mt-2 hidden w-full items-center justify-center gap-2 rounded-xl border border-emerald-800 px-3 py-2 text-sm font-medium text-emerald-600 transition-all hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-500 lg:flex dark:border-emerald-700 dark:text-emerald-400', collapsed && 'lg:justify-center lg:px-0')}
        >
          <LogOut className="h-4 w-4" />
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-emerald-950/60 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar: mobile drawer */}
      <motion.aside
        initial={{ x: '-100%' }}
        animate={{ x: mobileOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', stiffness: 350, damping: 32 }}
        className="fixed inset-y-0 left-0 z-50 flex h-screen w-64 flex-col border-r border-emerald-900/60 bg-emerald-50/90 backdrop-blur-xl dark:border-emerald-900/40 dark:bg-emerald-950/90 lg:hidden"
      >
        {renderContent('sidebar-active-mobile')}
      </motion.aside>

      {/* Sidebar: desktop - sticky flex item */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 76 : 256 }}
        transition={{ type: 'spring', stiffness: 300, damping: 32 }}
        className="sticky left-0 top-0 z-30 hidden h-screen shrink-0 flex-col border-r border-emerald-900/60 bg-emerald-50/80 backdrop-blur-xl dark:border-emerald-900/40 dark:bg-emerald-950/80 lg:flex"
      >
        {renderContent('sidebar-active-desktop')}
      </motion.aside>
    </>
  )
}
