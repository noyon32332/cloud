import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from 'date-fns'
import { cn } from '@/lib/utils'
import { getEventTypeStyle, formatTime, type CalendarEvent } from './types'

interface CalendarGridProps {
  currentDate: Date
  today: Date
  selectedDate: Date | null
  eventsByDate: Map<string, CalendarEvent[]>
  onSelectDate: (date: Date) => void
  onSelectEvent: (event: CalendarEvent) => void
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function dateKey(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

export default function CalendarGrid({
  currentDate,
  today,
  selectedDate,
  eventsByDate,
  onSelectDate,
  onSelectEvent,
}: CalendarGridProps) {
  const days = useMemo(() => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    return eachDayOfInterval({
      start: startOfWeek(monthStart, { weekStartsOn: 0 }),
      end: endOfWeek(monthEnd, { weekStartsOn: 0 }),
    })
  }, [currentDate])

  const selectedKey = selectedDate ? dateKey(selectedDate) : null

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full rounded-3xl border border-emerald-900/40 bg-white/70 shadow-lg shadow-emerald-200/40 backdrop-blur-xl dark:border-emerald-800/40 dark:bg-emerald-900/60 dark:shadow-emerald-950/40"
    >
      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b border-emerald-900/30 dark:border-emerald-800/30">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="px-1 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-emerald-600 sm:px-2 dark:text-emerald-400"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7">
        {days.map((day, index) => {
          const inMonth = isSameMonth(day, currentDate)
          const isCurrentDay = isToday(day)
          const selected = selectedKey ? dateKey(day) === selectedKey : false
          const dayKey = dateKey(day)
          const dayEvents = eventsByDate.get(dayKey) ?? []

          return (
            <motion.div
              key={day.toISOString()}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: Math.min(index * 0.006, 0.2), duration: 0.2 }}
              onClick={() => onSelectDate(day)}
              className={cn(
                'group relative flex min-h-[80px] cursor-pointer flex-col border-b border-r border-slate-200/20 p-1 transition-colors sm:min-h-[105px] sm:p-1.5 dark:border-slate-700/20',
                !inMonth && 'bg-slate-50/50 dark:bg-slate-950/20',
                inMonth && !isCurrentDay && !selected && 'hover:bg-slate-100 dark:hover:bg-slate-800',
                selected && !isCurrentDay && 'bg-emerald-50/60 dark:bg-emerald-900/20',
                selected && 'ring-2 ring-inset ring-emerald-500/40'
              )}
            >
              {/* Date number */}
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    'flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold sm:h-7 sm:w-7 sm:text-sm',
                    isCurrentDay && 'bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/30',
!isCurrentDay && inMonth && 'text-slate-800 dark:text-slate-400',
            !isCurrentDay && !inMonth && 'text-slate-500 dark:text-slate-400'
                  )}
                >
                  {format(day, 'd')}
                </span>
                {dayEvents.length > 0 && (
                  <span className="hidden text-[10px] font-bold text-emerald-500 sm:block dark:text-emerald-400">
                    {dayEvents.length}
                  </span>
                )}
              </div>

              {/* Events - desktop */}
              <div className="mt-1 hidden flex-1 flex-col gap-0.5 overflow-hidden sm:flex">
                {dayEvents.slice(0, 2).map((event) => {
                  const style = getEventTypeStyle(event.type)
                  return (
                    <button
                      key={event.id}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        onSelectEvent(event)
                      }}
                      className={cn(
                        'flex w-full items-center gap-1 truncate rounded-md px-1.5 py-0.5 text-left transition-all hover:opacity-80',
                        style.bgColor,
                        style.color
                      )}
                      title={`${event.title} - ${formatTime(event.startTime)}`}
                    >
                      <span className={cn('h-1.5 w-1.5 shrink-0 rounded-full', style.dot)} />
                      <span className="truncate text-[10px] font-semibold leading-tight">
                        {event.title}
                      </span>
                    </button>
                  )
                })}
                {dayEvents.length > 2 && (
                  <span className="px-1.5 text-[10px] font-bold text-emerald-500 dark:text-emerald-400">
                    +{dayEvents.length - 2} more
                  </span>
                )}
              </div>

              {/* Events - mobile dots */}
              <div className="mt-1 flex flex-wrap items-center justify-center gap-0.5 sm:hidden">
                {dayEvents.slice(0, 3).map((event) => {
                  const style = getEventTypeStyle(event.type)
                  return (
                    <span
                      key={event.id}
                      className={cn('h-1.5 w-1.5 rounded-full', style.dot)}
                    />
                  )
                })}
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.section>
  )
}
