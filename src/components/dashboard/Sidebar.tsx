import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import {
  BarChart3,
  BookOpen,
  CheckCircle2,
  FileCheck2,
  GraduationCap,
  Layers,
  LayoutDashboard,
  LogOut,
  Settings,
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
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', badge: '' },
  { label: 'Courses', icon: BookOpen, path: '/courses', badge: '4' },
  { label: 'Chapters', icon: Layers, path: '/chapters', badge: '' },
  { label: 'Exams', icon: FileCheck2, path: '/exams', badge: '3' },
  { label: 'Results', icon: CheckCircle2, path: '/results', badge: '' },
  { label: 'Analytics', icon: BarChart3, path: '/analytics', badge: '' },
  { label: 'Settings', icon: Settings, path: '/settings', badge: '' },
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
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  const isTeacher = user?.role === 'teacher'

  const renderContent = (layoutId: string) => (
    <div className="flex h-full min-h-0 w-full flex-col bg-[#0F172A] border-r border-slate-800 text-slate-300">
      {/* Brand Header */}
      <div className={cn('flex h-14 shrink-0 items-center gap-3 border-b border-slate-800/80 px-5', collapsed && 'lg:justify-center lg:px-2')}>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-600 shadow-sm shadow-blue-500/20">
          <GraduationCap className="h-4.5 w-4.5 text-white" />
        </div>
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col leading-none"
            >
              <span className="text-sm font-bold tracking-tight text-white">
                Edu<span className="text-blue-400">Sphere</span>
              </span>
              <span className="text-[9px] font-semibold uppercase tracking-widest text-slate-400 mt-1">
                {isTeacher ? 'Teacher Portal' : 'Student Hub'}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Workspace Role Selector */}
      {!collapsed && (
        <div className="mx-3.5 my-3 rounded-xl bg-slate-800/50 border border-slate-800 p-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={cn('h-2 w-2 rounded-full', isTeacher ? 'bg-indigo-400' : 'bg-emerald-400')} />
            <span className="text-xs font-medium text-slate-200 capitalize">{user?.role || 'student'} Mode</span>
          </div>
          <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 uppercase tracking-wider">
            {isTeacher ? 'Educator' : 'Learner'}
          </span>
        </div>
      )}

      {/* Minimal Navigation List */}
      <nav className="sidebar-nav flex-1 min-h-0 overflow-y-auto px-3 py-2 space-y-1">
        {!collapsed && (
          <p className="px-3 pb-1.5 pt-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Platform Menu
          </p>
        )}
        {navItems.map((item) => {
          const isActive = pathname === item.path || (item.path !== '/dashboard' && pathname.startsWith(item.path))
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
                  'group relative flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium transition-all duration-150',
                  collapsed && 'lg:justify-center lg:px-0',
                  isActive
                    ? 'text-white bg-blue-600 font-semibold shadow-xs'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId={layoutId}
                    className="absolute inset-0 rounded-xl bg-blue-600"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                <item.icon
                  className={cn(
                    'relative z-10 h-4 w-4 shrink-0 transition-colors',
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                  )}
                />
                <AnimatePresence mode="wait">
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -4 }}
                      transition={{ duration: 0.12 }}
                      className="relative z-10 truncate"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {item.badge && !collapsed && (
                  <span
                    className={cn(
                      'relative z-10 ml-auto rounded-md px-1.5 py-0.5 text-[9px] font-bold',
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>

              {/* Tooltip for collapsed mode */}
              {collapsed && hoveredItem === item.label && (
                <motion.div
                  initial={{ opacity: 0, x: -4, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -4, scale: 0.95 }}
                  transition={{ duration: 0.12 }}
                  className="absolute left-full top-1/2 z-[60] ml-3 -translate-y-1/2 whitespace-nowrap rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium text-white border border-slate-700 shadow-lg"
                >
                  {item.label}
                </motion.div>
              )}
            </div>
          )
        })}
      </nav>

      {/* User Dark Profile Footer */}
      <div className="shrink-0 border-t border-slate-800/80 p-3">
        <div className={cn('flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-slate-800/50', collapsed && 'justify-center p-1')}>
          {user?.avatar ? (
            <img src={user.avatar} alt={user.fullName} className="h-8 w-8 rounded-lg object-cover border border-slate-700" />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-xs font-bold text-white shadow-xs">
              {getInitials(user?.fullName || 'User')}
            </div>
          )}

          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-slate-200">{user?.fullName || 'EduSphere User'}</p>
              <p className="truncate text-[10px] text-slate-400 capitalize">{user?.role || 'student'}</p>
            </div>
          )}

          {!collapsed && (
            <button
              type="button"
              onClick={onLogout}
              title="Logout"
              aria-label="Logout"
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          'hidden shrink-0 border-r border-slate-800 transition-all duration-200 ease-in-out lg:block sticky top-0 h-screen',
          collapsed ? 'w-16' : 'w-60'
        )}
      >
        {renderContent('desktop-active-nav')}
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden"
            />
            <motion.div
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: 'spring', damping: 28, stiffness: 350 }}
              className="fixed inset-y-0 left-0 z-50 w-64 lg:hidden shadow-2xl"
            >
              {renderContent('mobile-active-nav')}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
