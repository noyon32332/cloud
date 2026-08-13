import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Check, CheckCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Notification {
  id: string
  title: string
  message: string
  time: string
  unread: boolean
}

const sampleNotifications: Notification[] = [
  { id: '1', title: 'Assignment Due', message: 'Database Assignment due in 2 days', time: '2h ago', unread: true },
  { id: '2', title: 'Class Reminder', message: 'Web Engineering class starts in 30 minutes', time: '3h ago', unread: true },
  { id: '3', title: 'Meeting Scheduled', message: 'Team standup meeting tomorrow at 9 AM', time: '5h ago', unread: false },
]

export default function NotificationsMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState(sampleNotifications)

  const unreadCount = notifications.filter((n) => n.unread).length

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-800 bg-white/70 text-emerald-700 transition-all hover:border-green-500/50 hover:text-green-600 dark:border-emerald-700 dark:bg-emerald-900/70 dark:text-emerald-300 dark:hover:text-green-400"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-green-500 text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute right-0 z-50 mt-3 w-80 origin-top-right overflow-hidden rounded-2xl border border-emerald-900/40 bg-white/95 shadow-2xl shadow-emerald-950/20 backdrop-blur-xl dark:border-emerald-800/40 dark:bg-emerald-950/95"
          >
            <div className="flex items-center justify-between border-b border-emerald-900/30 px-4 py-3 dark:border-emerald-800">
              <h3 className="text-sm font-bold text-emerald-950 dark:text-emerald-50">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllRead}
                  className="flex items-center gap-1 text-xs font-medium text-green-600 transition-colors hover:text-green-500 dark:text-green-400"
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Bell className="h-8 w-8 text-emerald-300 dark:text-emerald-600" />
                  <p className="mt-2 text-xs text-emerald-500 dark:text-emerald-400">No notifications</p>
                </div>
              ) : (
                notifications.map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      'flex gap-3 border-b border-emerald-900/20 px-4 py-3 transition-colors hover:bg-emerald-50 dark:border-emerald-800/20 dark:hover:bg-emerald-800/30',
                      item.unread && 'bg-green-50/50 dark:bg-green-500/[0.06]'
                    )}
                  >
                    {item.unread && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-green-500" />}
                    <div className={cn('min-w-0 flex-1', !item.unread && 'ml-5')}>
                      <p className="text-sm font-semibold text-emerald-950 dark:text-emerald-50">{item.title}</p>
                      <p className="mt-0.5 text-xs text-emerald-600 dark:text-emerald-400">{item.message}</p>
                      <p className="mt-1 text-[10px] text-emerald-400 dark:text-emerald-500">{item.time}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="border-t border-emerald-900/30 bg-emerald-50/80 px-4 py-2 dark:border-emerald-800 dark:bg-emerald-800/60">
              <button
                type="button"
                className="flex w-full items-center justify-center gap-1.5 text-xs font-semibold text-green-600 transition-colors hover:text-green-500 dark:text-green-400"
              >
                View all notifications
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
