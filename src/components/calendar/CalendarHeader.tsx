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
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/30"
        >
          <CalendarDays className="h-5 w-5 text-white" />
        </motion.div>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-emerald-950 dark:text-emerald-50">
            Calendar
          </h1>
          <p className="mt-0.5 text-sm text-emerald-600 dark:text-emerald-400">
            Manage your classes, assignments, meetings and important deadlines.
          </p>
        </div>
      </div>

      {/* Navigation & Actions */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {/* Month Navigation */}
        <div className="flex items-center gap-1 rounded-2xl border border-emerald-800 bg-white/70 p-1 backdrop-blur-xl dark:border-emerald-700 dark:bg-emerald-900/60">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={onToday}
            className="rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-md shadow-green-500/20 transition-all hover:from-green-500 hover:to-emerald-500"
          >
            Today
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={onPrevMonth}
            aria-label="Previous month"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-emerald-700 transition-colors hover:bg-emerald-100 hover:text-green-600 dark:text-emerald-300 dark:hover:bg-emerald-800 dark:hover:text-green-400"
          >
            <ChevronLeft className="h-4 w-4" />
          </motion.button>
          <span className="min-w-[110px] px-2 text-center text-sm font-semibold text-emerald-900 dark:text-emerald-100">
            {format(currentDate, 'MMMM yyyy')}
          </span>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={onNextMonth}
            aria-label="Next month"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-emerald-700 transition-colors hover:bg-emerald-100 hover:text-green-600 dark:text-emerald-300 dark:hover:bg-emerald-800 dark:hover:text-green-400"
          >
            <ChevronRight className="h-4 w-4" />
          </motion.button>
        </div>

        {/* Add Event Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={onAddEvent}
          className="flex h-9 items-center gap-1.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-4 text-sm font-semibold text-white shadow-lg shadow-green-500/25 transition-all hover:from-green-500 hover:to-emerald-500"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Event</span>
        </motion.button>
      </div>
    </div>
  )
}
