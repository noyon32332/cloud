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
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CalendarEvent } from '@/services/calendar'
import { getDayKey, isEventOnDay, sortEventsByStart, eventStart, eventEnd } from './calendarHelpers'

interface MonthViewProps {
  viewDate: Date
  selectedDate: Date
  events: CalendarEvent[]
  onSelectDate: (date: Date) => void
  onPrevMonth: () => void
  onNextMonth: () => void
}

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function MonthView({
  viewDate,
  selectedDate,
  events,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
}: MonthViewProps) {
  const days = useMemo(() => {
    const monthStart = startOfMonth(viewDate)
    const monthEnd = endOfMonth(viewDate)
    return eachDayOfInterval({
      start: startOfWeek(monthStart, { weekStartsOn: 0 }),
      end: endOfWeek(monthEnd, { weekStartsOn: 0 }),
    })
  }, [viewDate])

  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>()
    for (const day of days) {
      const key = getDayKey(day)
      map.set(key, sortEventsByStart(events.filter((event) => isEventOnDay(event, day))))
    }
    return map
  }, [days, events])

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="relative overflow-hidden rounded-3xl border border-slate-200/60 bg-white/70 shadow-lg shadow-slate-200/40 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/60 dark:shadow-slate-950/40"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

      <div className="flex items-center justify-between p-4 sm:p-5">
        <button
          type="button"
          onClick={onPrevMonth}
          aria-label="Previous month"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition-all hover:border-blue-400/50 hover:text-blue-500 active:scale-95 dark:border-slate-700 dark:text-slate-400 dark:hover:text-blue-400"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <h3 className="text-base font-extrabold tracking-tight text-slate-900 sm:text-lg dark:text-white">
          {format(viewDate, 'MMMM yyyy')}
        </h3>
        <button
          type="button"
          onClick={onNextMonth}
          aria-label="Next month"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition-all hover:border-blue-400/50 hover:text-blue-500 active:scale-95 dark:border-slate-700 dark:text-slate-400 dark:hover:text-blue-400"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-px border-t border-slate-100 dark:border-slate-800">
        {weekDays.map((day) => (
          <span
            key={day}
            className="py-2 text-center text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500"
          >
            {day}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-px border-t border-slate-100 dark:border-slate-800">
        {days.map((day, index) => {
          const inMonth = isSameMonth(day, viewDate)
          const today = isToday(day)
          const selected = isSameDay(day, selectedDate)
          const dayEvents = eventsByDay.get(getDayKey(day)) ?? []

          return (
            <motion.button
              key={day.toISOString()}
              type="button"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: Math.min(index * 0.006, 0.2), duration: 0.2 }}
              onClick={() => onSelectDate(day)}
              aria-label={format(day, 'EEEE, d MMMM yyyy')}
              className={cn(
                'group relative flex min-h-[96px] flex-col items-stretch gap-1 p-1.5 text-left transition-colors sm:min-h-[110px] sm:p-2',
                !inMonth && 'bg-slate-50/60 dark:bg-slate-950/30',
                inMonth && 'hover:bg-slate-100/70 dark:hover:bg-slate-800/50',
                selected && 'ring-2 ring-inset ring-blue-500/70'
              )}
            >
              <span
                className={cn(
                  'flex h-7 w-7 shrink-0 items-center justify-center self-center rounded-full text-sm font-bold sm:self-start',
                  today
                    ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                    : inMonth
                      ? 'text-slate-700 dark:text-slate-200'
                      : 'text-slate-400 dark:text-slate-600'
                )}
              >
                {format(day, 'd')}
              </span>

              <div className="hidden flex-1 flex-col gap-1 sm:flex">
                {dayEvents.slice(0, 3).map((event) => (
                  <span
                    key={event.id}
                    className="flex items-center gap-1 overflow-hidden rounded-md px-1.5 py-0.5 text-[10px] font-semibold leading-4 text-white"
                    style={{ backgroundColor: event.color }}
                    title={`${event.title} · ${format(eventStart(event), 'h:mm a')} – ${format(eventEnd(event), 'h:mm a')}`}
                  >
                    <span className="truncate">{event.title}</span>
                  </span>
                ))}
                {dayEvents.length > 3 && (
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
                    +{dayEvents.length - 3} more
                  </span>
                )}
              </div>

              <div className="flex items-center justify-center gap-0.5 sm:hidden">
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">{format(day, 'd')}</span>
                {dayEvents.length > 0 && (
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: dayEvents[0].color }} />
                )}
              </div>

              {dayEvents.length === 0 && (
                <span className="pointer-events-none absolute inset-0 hidden items-center justify-center text-slate-300 opacity-0 transition-opacity group-hover:opacity-100 dark:text-slate-600 sm:flex">
                  <Plus className="h-4 w-4" />
                </span>
              )}
            </motion.button>
          )
        })}
      </div>
    </motion.section>
  )
}
