import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Bell,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  Flame,
  MapPin,
  Paperclip,
} from 'lucide-react'
import {
  todayClasses,
  deadlines,
  notifications,
  calendarEvents,
} from '@/data/dashboard'
import DashboardCard from '@/components/dashboard/DashboardCard'
import { cn } from '@/lib/utils'

const statusStyles: Record<string, { label: string; className: string; dot: string }> = {
  ongoing: {
    label: 'Ongoing',
    className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    dot: 'bg-emerald-500',
  },
  next: {
    label: 'Next',
    className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    dot: 'bg-blue-500',
  },
  upcoming: {
    label: 'Upcoming',
    className: 'bg-slate-500/10 text-slate-500 dark:text-slate-400',
    dot: 'bg-slate-400',
  },
}

const priorityStyles: Record<string, string> = {
  high: 'bg-red-500/10 text-red-600 dark:text-red-400',
  medium: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  low: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
}

const urgencyStyles: Record<string, string> = {
  urgent: 'bg-red-500/10 text-red-600 dark:text-red-400',
  soon: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  normal: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
}

export function TodayClasses() {
  return (
    <DashboardCard title="Today's Classes" subtitle="Your schedule for today" icon={Clock}>
      <div className="space-y-3">
        {todayClasses.map((item, index) => {
          const status = statusStyles[item.status]
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="group flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-white p-3 transition-all hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/5 dark:border-slate-800"
            >
              <div className={cn('flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg', item.accent)}>
                <Clock className="h-4 w-4" />
                <span className="mt-0.5 text-[8px] font-bold uppercase leading-none">class</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{item.course}</p>
                <p className="mt-0.5 flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                  <span className="tabular-nums">{item.time}</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {item.room}
                  </span>
                </p>
              </div>
              <span className={cn('flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold', status.className)}>
                {item.status === 'ongoing' && <span className={cn('h-1.5 w-1.5 animate-pulse rounded-full', status.dot)} />}
                {status.label}
              </span>
            </motion.div>
          )
        })}
      </div>
    </DashboardCard>
  )
}

const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

export function CalendarWidget({ onClick }: { onClick?: () => void }) {
  const { days, firstDay, monthLabel, year, today } = useMemo(() => {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()
    const days = new Date(year, month + 1, 0).getDate()
    const firstDay = new Date(year, month, 1).getDay()
    const monthLabel = now.toLocaleDateString('en-US', { month: 'long' })
    const today = now.getDate()
    return { days, firstDay, monthLabel, year, today }
  }, [])

  const eventDays = new Set(calendarEvents.map((event) => event.day))
  const eventColorFor = (day: number) => calendarEvents.find((event) => event.day === day)?.color

  return (
    <DashboardCard
      title="Calendar"
      subtitle={`${monthLabel} ${year}`}
      icon={CalendarDays}
      action={
        <div className="flex items-center gap-1">
          <button type="button" className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button type="button" className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-7 gap-1 text-center" onClick={onClick}>
        {weekDays.map((day) => (
          <span key={day} className="py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {day}
          </span>
        ))}
        {Array.from({ length: firstDay }).map((_, index) => (
          <span key={`empty-${index}`} />
        ))}
        {Array.from({ length: days }).map((_, index) => {
          const day = index + 1
          const isToday = day === today
          const hasEvent = eventDays.has(day)
          return (
            <div
              key={day}
              className={cn(
                'relative mx-auto flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium text-slate-600 transition-all dark:text-slate-300',
                isToday
                  ? 'bg-gradient-to-br from-blue-600 to-indigo-600 font-bold text-white shadow-lg shadow-blue-500/30'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800'
              )}
            >
              {day}
              {hasEvent && (
                <span className={cn('absolute bottom-0.5 h-1 w-1 rounded-full', eventColorFor(day))} />
              )}
            </div>
          )
        })}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-3 dark:border-slate-800">
        {calendarEvents.slice(0, 4).map((event) => (
          <span key={event.day} className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500">
            <span className={cn('h-1.5 w-1.5 rounded-full', event.color)} />
            Aug {event.day}
          </span>
        ))}
      </div>
    </DashboardCard>
  )
}

export function DeadlinesWidget() {
  return (
    <DashboardCard title="Deadlines" subtitle="Upcoming submissions" icon={Flame}>
      <div className="space-y-3">
        {deadlines.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08 }}
            className="group flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-white/60 p-3 transition-all hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/5 dark:border-slate-800 dark:bg-slate-900/60"
          >
            <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-amber-500 dark:text-amber-400">
              <Flame className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{item.title}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">{item.date}</p>
            </div>
            <span className={cn('shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold tabular-nums', urgencyStyles[item.urgency])}>
              {item.daysLeft}d
            </span>
          </motion.div>
        ))}
      </div>
    </DashboardCard>
  )
}

export function RecentNotificationsWidget() {
  return (
    <DashboardCard title="Recent Notifications" subtitle="Latest updates for you" icon={Bell}>
      <div className="space-y-1">
        {notifications.slice(0, 4).map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.07 }}
            className={cn(
              'flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50',
              item.unread && 'bg-emerald-50/[0.04]'
            )}
          >
            <div className={cn('mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white', item.accent)}>
              <item.icon className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{item.title}</p>
                {item.unread && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />}
              </div>
              <p className="mt-0.5 line-clamp-1 text-xs text-slate-500 dark:text-slate-400">{item.description}</p>
              <p className="mt-0.5 text-[11px] text-slate-400 dark:text-slate-500">{item.time}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </DashboardCard>
  )
}
