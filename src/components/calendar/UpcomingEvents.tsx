import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Clock, CalendarDays } from 'lucide-react'
import { isToday, isTomorrow, format, parseISO } from 'date-fns'
import { cn } from '@/lib/utils'
import type { CalendarEvent } from './types'
import { getEventTypeStyle, formatTime } from './types'

interface UpcomingEventsProps {
  events: CalendarEvent[]
  today: Date
  onSelectEvent: (event: CalendarEvent) => void
}

type GroupedEvents = {
  label: string
  events: CalendarEvent[]
}

export default function UpcomingEvents({ events, today, onSelectEvent }: UpcomingEventsProps) {
  const grouped = useMemo(() => {
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const upcoming = events
      .filter((e) => {
        const eventDate = parseISO(e.date)
        return eventDate >= todayStart
      })
      .sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date)
        return a.startTime.localeCompare(b.startTime)
      })
      .slice(0, 8)

    const groups: GroupedEvents[] = []
    let currentLabel = ''

    for (const event of upcoming) {
      const eventDate = parseISO(event.date)
      let label = ''

      if (isToday(eventDate)) {
        label = 'Today'
      } else if (isTomorrow(eventDate)) {
        label = 'Tomorrow'
      } else {
        label = format(eventDate, 'MMM d')
      }

      if (label !== currentLabel) {
        currentLabel = label
        groups.push({ label, events: [event] })
      } else {
        groups[groups.length - 1].events.push(event)
      }
    }

    return groups
  }, [events, today])

  return (
    <motion.aside
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
      className="w-full rounded-3xl border border-emerald-900/40 bg-white/70 p-5 shadow-lg shadow-emerald-200/40 backdrop-blur-xl dark:border-emerald-800/40 dark:bg-emerald-900/60 dark:shadow-emerald-950/40"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 text-green-600 dark:text-green-400">
            <CalendarDays className="h-4.5 w-4.5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold tracking-tight text-emerald-950 dark:text-emerald-50">
              Upcoming Events
            </h3>
            <p className="text-xs text-emerald-600 dark:text-emerald-400">
              Next {Math.min(events.length, 8)} events
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-5">
        {grouped.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-emerald-800 py-10 text-center dark:border-emerald-700">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 text-green-600 dark:text-green-400">
              <CalendarDays className="h-6 w-6" />
            </div>
            <p className="mt-3 text-sm font-semibold text-emerald-950 dark:text-emerald-50">No upcoming events</p>
            <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
              Add events to see them here.
            </p>
          </div>
        ) : (
          grouped.map((group, groupIndex) => (
            <div key={group.label}>
              {/* Group header */}
              <div className="mb-2 flex items-center gap-2">
                <span
                  className={cn(
                    'rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide',
                    group.label === 'Today'
                      ? 'bg-green-500/15 text-green-600 dark:text-green-400'
                      : group.label === 'Tomorrow'
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                        : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-800 dark:text-emerald-400'
                  )}
                >
                  {group.label}
                </span>
                <div className="h-px flex-1 bg-emerald-900/30 dark:bg-emerald-800" />
              </div>

              {/* Events in group */}
              <div className="space-y-2">
                {group.events.map((event, eventIndex) => {
                  const typeStyle = getEventTypeStyle(event.type)
                  return (
                    <motion.button
                      key={event.id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: groupIndex * 0.05 + eventIndex * 0.03, duration: 0.3 }}
                      type="button"
                      onClick={() => onSelectEvent(event)}
                      className="group flex w-full items-center gap-3 rounded-xl border border-emerald-900/30 bg-white/50 p-3 text-left transition-all hover:border-green-500/30 hover:bg-white/80 hover:shadow-md dark:border-emerald-800/30 dark:bg-emerald-900/40 dark:hover:border-green-500/30 dark:hover:bg-emerald-800/60"
                    >
                      {/* Type dot */}
                      <div className={cn('h-2.5 w-2.5 shrink-0 rounded-full', typeStyle.dot)} />

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-emerald-950 group-hover:text-green-600 dark:text-emerald-50 dark:group-hover:text-green-400">
                          {event.title}
                        </p>
                        <div className="mt-0.5 flex items-center gap-2">
                          <span className={cn('text-[11px] font-medium capitalize', typeStyle.color)}>
                            {event.type}
                          </span>
                          <span className="flex items-center gap-0.5 text-[11px] text-emerald-600 dark:text-emerald-400">
                            <Clock className="h-3 w-3" />
                            {formatTime(event.startTime)}
                          </span>
                        </div>
                      </div>

                      {/* Arrow */}
                      <span className="shrink-0 text-emerald-400 transition-transform group-hover:translate-x-0.5 group-hover:text-green-500 dark:text-emerald-500">
                        →
                      </span>
                    </motion.button>
                  )
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </motion.aside>
  )
}
