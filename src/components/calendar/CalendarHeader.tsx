import { motion } from 'framer-motion'
import { CalendarDays, ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { format } from 'date-fns'

interface CalendarHeaderProps {
  currentDate: Date
  onPrevMonth: () => void
  onNextMonth: () => void
  onToday: () => void
  onAddEvent: () => void
}

export default function CalendarHeader({
  currentDate,
  onPrevMonth,
  onNextMonth,
  onToday,
  onAddEvent,
}: CalendarHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Title & Subtitle */}
      <div className="flex items-center gap-3">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm shadow-blue-600/30"
        >
          <CalendarDays className="h-5 w-5" />
        </motion.div>
        <div>
          <span className="eyebrow">Academic Schedule</span>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Calendar</h1>
          <p className="mt-0.5 text-xs text-slate-500">
            Manage your classes, assignments, meetings and important deadlines.
          </p>
        </div>
      </div>

      {/* Navigation & Actions */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {/* Month Navigation */}
        <div className="flex items-center gap-1 panel-card p-1">
          <button
            type="button"
            onClick={onToday}
            className="btn-primary rounded-md px-3 py-1.5"
          >
            Today
          </button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={onPrevMonth}
            aria-label="Previous month"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
          >
            <ChevronLeft className="h-4 w-4" />
          </motion.button>
          <span className="min-w-[110px] px-2 text-center text-sm font-semibold text-slate-800">
            {format(currentDate, 'MMMM yyyy')}
          </span>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={onNextMonth}
            aria-label="Next month"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
          >
            <ChevronRight className="h-4 w-4" />
          </motion.button>
        </div>

        {/* Add Event Button */}
        <button
          type="button"
          onClick={onAddEvent}
          className="btn-primary h-9 px-4"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Event</span>
        </button>
      </div>
    </div>
  )
}