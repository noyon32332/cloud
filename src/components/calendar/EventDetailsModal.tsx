import { motion, AnimatePresence } from 'framer-motion'
import { X, Clock, CalendarDays, FileText, Pencil, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getEventTypeStyle, formatTime, formatDateFull, type CalendarEvent } from './types'

interface EventDetailsModalProps {
  event: CalendarEvent | null
  onClose: () => void
  onEdit: (event: CalendarEvent) => void
  onDelete: (eventId: string) => void
}

export default function EventDetailsModal({
  event,
  onClose,
  onEdit,
  onDelete,
}: EventDetailsModalProps) {
  if (!event) return null

  const style = getEventTypeStyle(event.type)

  return (
    <AnimatePresence>
      {event && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-emerald-950/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-emerald-900/50 bg-white/95 shadow-2xl backdrop-blur-xl dark:border-emerald-800/50 dark:bg-emerald-950/95"
          >
            {/* Header with colored accent */}
            <div className={cn('h-2 w-full', style.dot)} />
            <div className="flex items-start justify-between px-6 pt-5">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold capitalize',
                      style.bgColor,
                      style.color,
                      style.borderColor
                    )}
                  >
                    {event.type}
                  </span>
                </div>
                <h3 className="mt-2 text-xl font-bold text-emerald-950 dark:text-emerald-50">
                  {event.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-emerald-500 transition-colors hover:bg-emerald-100 hover:text-emerald-700 dark:hover:bg-emerald-800 dark:hover:text-emerald-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Details */}
            <div className="space-y-4 px-6 py-5">
              {/* Date */}
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-500/10 text-green-600 dark:text-green-400">
                  <CalendarDays className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-medium text-emerald-500 dark:text-emerald-400">Date</p>
                  <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-100">
                    {formatDateFull(event.date)}
                  </p>
                </div>
              </div>

              {/* Time */}
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-medium text-emerald-500 dark:text-emerald-400">Time</p>
                  <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-100">
                    {formatTime(event.startTime)} – {formatTime(event.endTime)}
                  </p>
                </div>
              </div>

              {/* Description */}
              {event.description && (
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-emerald-500 dark:text-emerald-400">Description</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-emerald-700 dark:text-emerald-200">
                      {event.description}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between border-t border-emerald-900/30 px-6 py-4 dark:border-emerald-800">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => onDelete(event.id)}
                className="flex h-9 items-center gap-1.5 rounded-xl border border-red-200 px-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </motion.button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="h-9 rounded-xl border border-emerald-800 px-4 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-50 dark:border-emerald-700 dark:text-emerald-300 dark:hover:bg-emerald-800"
                >
                  Close
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => onEdit(event)}
                  className="flex h-9 items-center gap-1.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-4 text-sm font-semibold text-white shadow-lg shadow-green-500/25 transition-all hover:from-green-500 hover:to-emerald-500"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
