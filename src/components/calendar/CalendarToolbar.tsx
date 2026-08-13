import { endOfWeek, format, isSameDay, isSameMonth, isSameWeek, startOfWeek } from 'date-fns'
import { CalendarPlus, ChevronLeft, ChevronRight, Search, SlidersHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { EventPriority } from '@/services/calendar'
import type { CalendarView } from './calendarHelpers'

interface CalendarToolbarProps {
  view: CalendarView
  onViewChange: (view: CalendarView) => void
  viewDate: Date
  onPrev: () => void
  onNext: () => void
  onToday: () => void
  search: string
  onSearchChange: (value: string) => void
  priority: EventPriority | 'all'
  onPriorityChange: (priority: EventPriority | 'all') => void
  onAddEvent: () => void
}

const views: { key: CalendarView; label: string }[] = [
  { key: 'month', label: 'Month' },
  { key: 'week', label: 'Week' },
  { key: 'day', label: 'Day' },
]

const priorityOptions: { key: EventPriority | 'all'; label: string }[] = [
  { key: 'all', label: 'All priorities' },
  { key: 'high', label: 'High' },
  { key: 'medium', label: 'Medium' },
  { key: 'low', label: 'Low' },
]

function getRangeLabel(view: CalendarView, viewDate: Date): string {
  if (view === 'month') return format(viewDate, 'MMMM yyyy')
  if (view === 'day') return format(viewDate, 'EEEE, d MMMM yyyy')
  const start = startOfWeek(viewDate, { weekStartsOn: 0 })
  const end = endOfWeek(viewDate, { weekStartsOn: 0 })
  const sameMonth = start.getMonth() === end.getMonth()
  const sameYear = start.getFullYear() === end.getFullYear()
  if (sameMonth && sameYear) return `${format(start, 'd')} – ${format(end, 'd MMMM yyyy')}`
  if (sameYear) return `${format(start, 'd MMM')} – ${format(end, 'd MMM yyyy')}`
  return `${format(start, 'd MMM yyyy')} – ${format(end, 'd MMM yyyy')}`
}

export default function CalendarToolbar({
  view,
  onViewChange,
  viewDate,
  onPrev,
  onNext,
  onToday,
  search,
  onSearchChange,
  priority,
  onPriorityChange,
  onAddEvent,
}: CalendarToolbarProps) {
  const isTodayVisible =
    view === 'day'
      ? isSameDay(viewDate, new Date())
      : view === 'week'
        ? isSameWeek(viewDate, new Date(), { weekStartsOn: 0 })
        : isSameMonth(viewDate, new Date())

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      {/* Navigation */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1 rounded-xl border border-slate-200/60 bg-white/70 p-1 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/60">
          {views.map((v) => (
            <button
              key={v.key}
              type="button"
              onClick={() => onViewChange(v.key)}
              className={cn(
                'rounded-lg px-3.5 py-1.5 text-sm font-semibold transition-all',
                view === v.key
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100'
              )}
            >
              {v.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onPrev}
            aria-label="Previous period"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/60 bg-white/70 text-slate-500 backdrop-blur-xl transition-all hover:border-blue-400/50 hover:text-blue-500 active:scale-95 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400 dark:hover:text-blue-400"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onNext}
            aria-label="Next period"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/60 bg-white/70 text-slate-500 backdrop-blur-xl transition-all hover:border-blue-400/50 hover:text-blue-500 active:scale-95 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400 dark:hover:text-blue-400"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onToday}
            disabled={isTodayVisible}
            className="flex h-9 items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-3.5 text-xs font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-500 hover:to-indigo-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Today
          </button>
        </div>

        <h2 className="min-w-[180px] text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
          {getRangeLabel(view, viewDate)}
        </h2>
      </div>

      {/* Search + filter + add */}
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search events..."
            className="h-10 w-56 rounded-xl border border-slate-200/60 bg-white/70 pl-10 pr-3 text-sm text-slate-900 outline-none backdrop-blur-xl transition-all placeholder:text-slate-400 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-900/60 dark:text-white"
          />
        </div>

        <div className="relative">
          <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <select
            value={priority}
            onChange={(event) => onPriorityChange(event.target.value as EventPriority | 'all')}
            className="h-10 appearance-none rounded-xl border border-slate-200/60 bg-white/70 pl-9 pr-8 text-sm font-medium text-slate-700 outline-none backdrop-blur-xl transition-all focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-200"
          >
            {priorityOptions.map((option) => (
              <option key={option.key} value={option.key}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={onAddEvent}
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-500 hover:to-indigo-500 active:scale-95"
        >
          <CalendarPlus className="h-4 w-4" />
          New Event
        </button>
      </div>
    </div>
  )
}
