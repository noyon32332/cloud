import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, CheckCheck } from 'lucide-react'
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
        aria-label="Notifications"
        className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/80 bg-white text-slate-500 transition-colors hover:bg-slate-50 hover:text-blue-600"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white shadow-sm">
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
            className="absolute right-0 z-50 mt-3 w-80 origin-top-right overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xl shadow-slate-900/10"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllRead}
                  className="flex items-center gap-1 text-xs font-medium text-blue-600 transition-colors hover:text-blue-700"
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Bell className="h-8 w-8 text-slate-300" />
                  <p className="mt-2 text-xs text-slate-400">No notifications</p>
                </div>
              ) : (
                notifications.map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      'flex gap-3 border-b border-slate-100/80 px-4 py-3 transition-colors hover:bg-slate-50',
                      item.unread && 'bg-blue-50/50'
                    )}
                  >
                    {item.unread && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-600" />}
                    <div className={cn('min-w-0 flex-1', !item.unread && 'ml-5')}>
                      <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                      <p className="mt-0.5 text-xs text-slate-500">{item.message}</p>
                      <p className="mt-1 text-[10px] text-slate-400">{item.time}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="border-t border-slate-100 bg-slate-50/80 px-4 py-2">
              <button
                type="button"
                className="flex w-full items-center justify-center gap-1.5 rounded-lg py-1 text-xs font-semibold text-blue-600 transition-colors hover:text-blue-700"
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