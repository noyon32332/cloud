import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import { CalendarPlus, Clock, Pencil, Trash2, X } from 'lucide-react'
import type { CalendarEvent } from '@/services/calendar'
import { cn } from '@/lib/utils'
import { eventStart, formatEventTime, PRIORITY_CLASSES, PRIORITY_LABEL, sortEventsByStart } from './calendarHelpers'

interface EventPanelProps {
  open: boolean
  selectedDate: Date
  events: CalendarEvent[]
  onClose: () => void
  onAdd: () => void
  onEdit: (event: CalendarEvent) => void
  onDelete: (event: CalendarEvent) => void
}

export default function EventPanel({ open, selectedDate, events, onClose, onAdd, onEdit, onDelete }: EventPanelProps) {
  const sorted = useMemo(() => sortEventsByStart(events), [events])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col overflow-hidden border-l border-slate-200/60 bg-white/95 shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/95"
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

            <div className="flex items-start justify-between gap-3 border-b border-slate-200/60 p-5 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">Events</h3>
                <p className="mt-0.5 text-sm text-slate-400 dark:text-slate-500">
                  {format(selectedDate, 'EEEE, d MMMM yyyy')}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close events panel"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-5">
              {sorted.length === 0 ? (
                <div className="flex h-full min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 p-6 text-center dark:border-slate-700">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 text-blue-500 dark:text-blue-400">
                    <CalendarPlus className="h-6 w-6" />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">No events for this day</p>
                  <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">Click "New Event" to schedule something.</p>
                </div>
              ) : (
                sorted.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.06, duration: 0.3 }}
                    className="group overflow-hidden rounded-2xl border border-slate-200/70 bg-white/60 transition-all hover:shadow-lg hover:shadow-blue-500/5 dark:border-slate-800 dark:bg-slate-900/60"
                  >
                    <div className="h-1 w-full" style={{ backgroundColor: event.color }} />
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-3">
                          <div
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white shadow-md"
                            style={{ backgroundColor: event.color }}
                          >
                            <Clock className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{event.title}</p>
                            <span
                              className={cn(
                                'mt-1 inline-block rounded-full border px-2 py-0.5 text-[11px] font-bold tabular-nums',
                                PRIORITY_CLASSES[event.priority]
                              )}
                            >
                              {PRIORITY_LABEL[event.priority]} · {formatEventTime(event)}
                            </span>
                          </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-0.5">
                          <button
                            type="button"
                            title="Edit event"
                            onClick={() => onEdit(event)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-all hover:scale-105 hover:text-blue-500 dark:text-slate-500 dark:hover:text-blue-400"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            title="Delete event"
                            onClick={() => onDelete(event)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-all hover:scale-105 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      {event.description && (
                        <p className="mt-2.5 border-t border-slate-100 pt-2.5 text-xs leading-relaxed text-slate-500 dark:border-slate-800 dark:text-slate-400">
                          {event.description}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            <div className="border-t border-slate-200/60 p-4 dark:border-slate-800">
              <button
                type="button"
                onClick={onAdd}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-500 hover:to-indigo-500 active:scale-[0.99]"
              >
                <CalendarPlus className="h-4 w-4" />
                Add Event
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
