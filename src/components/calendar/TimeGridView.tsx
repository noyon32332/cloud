import { useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { motion } from 'framer-motion'
import {
  eachDayOfInterval,
  endOfDay,
  endOfWeek,
  format,
  isSameDay,
  isToday,
  startOfDay,
  startOfWeek,
} from 'date-fns'
import { Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CalendarEvent } from '@/services/calendar'
import type { CalendarView } from './calendarHelpers'
import { eventEnd, eventStart, getDayKey, isEventOnDay, sortEventsByStart } from './calendarHelpers'

const SLOT_MINUTES = 30
const SLOT_HEIGHT = 48
const HOURS = 24
const TOTAL_SLOTS = HOURS * (60 / SLOT_MINUTES)
const GRID_HEIGHT = TOTAL_SLOTS * SLOT_HEIGHT
const MIN_EVENT_HEIGHT = 22

interface TimeGridViewProps {
  view: CalendarView
  viewDate: Date
  selectedDate: Date
  events: CalendarEvent[]
  onSelectDate: (date: Date) => void
  onSelectRange: (start: Date, end: Date) => void
  onEditEvent: (event: CalendarEvent) => void
}

interface PlacedEvent {
  event: CalendarEvent
  top: number
  height: number
  left: number
  width: number
  startOffset: number
}

interface Selection {
  dayIndex: number
  startSlot: number
  endSlot: number
}

function minutesBetween(start: Date, end: Date): number {
  return (end.getTime() - start.getTime()) / 60000
}

function clipToDay(event: CalendarEvent, day: Date): { start: Date; end: Date } {
  const dayStart = startOfDay(day)
  const dayEnd = endOfDay(day)
  return {
    start: eventStart(event) < dayStart ? dayStart : eventStart(event),
    end: eventEnd(event) > dayEnd ? dayEnd : eventEnd(event),
  }
}

function layoutDayEvents(day: Date, events: CalendarEvent[]): PlacedEvent[] {
  const dayStart = startOfDay(day).getTime()
  const minutesPerPx = SLOT_MINUTES / SLOT_HEIGHT
  const dayEvents = sortEventsByStart(events.filter((event) => isEventOnDay(event, day)))

  const candidates = dayEvents.map((event) => {
    const { start, end } = clipToDay(event, day)
    return { event, start, end }
  })

  const clusters: typeof candidates[] = []
  let current: typeof candidates = []
  for (const candidate of candidates) {
    if (current.length === 0) {
      current = [candidate]
      continue
    }
    const clusterEnd = Math.max(...current.map((c) => c.end.getTime()))
    if (candidate.start.getTime() < clusterEnd) {
      current.push(candidate)
    } else {
      clusters.push(current)
      current = [candidate]
    }
  }
  if (current.length > 0) clusters.push(current)

  const placed: PlacedEvent[] = []
  for (const cluster of clusters) {
    const columns: number[] = []
    const columnFor = new Map<string, number>()
    for (const candidate of cluster) {
      let target = columns.findIndex((lastEnd) => lastEnd <= candidate.start.getTime())
      if (target === -1) {
        target = columns.length
        columns.push(candidate.end.getTime())
      } else {
        columns[target] = Math.max(columns[target], candidate.end.getTime())
      }
      columnFor.set(candidate.event.id, target)
    }
    const numColumns = columns.length
    const width = 100 / numColumns
    for (const candidate of cluster) {
      const startOffset = minutesBetween(new Date(dayStart), candidate.start)
      const duration = minutesBetween(candidate.start, candidate.end)
      placed.push({
        event: candidate.event,
        top: startOffset / minutesPerPx,
        height: Math.max(MIN_EVENT_HEIGHT, duration / minutesPerPx),
        left: (columnFor.get(candidate.event.id) ?? 0) * width,
        width,
        startOffset,
      })
    }
  }

  return placed.sort((a, b) => a.top - b.top)
}

function slotFromY(clientY: number, rectTop: number): number {
  const slot = Math.floor((clientY - rectTop) / SLOT_HEIGHT)
  return Math.max(0, Math.min(TOTAL_SLOTS - 1, slot))
}

export default function TimeGridView({
  view,
  viewDate,
  selectedDate,
  events,
  onSelectDate,
  onSelectRange,
  onEditEvent,
}: TimeGridViewProps) {
  const days = useMemo(() => {
    if (view === 'day') return [viewDate]
    const start = startOfWeek(viewDate, { weekStartsOn: 0 })
    return eachDayOfInterval({ start, end: endOfWeek(start, { weekStartsOn: 0 }) })
  }, [view, viewDate])

  const placedByDay = useMemo(() => {
    const map = new Map<string, PlacedEvent[]>()
    for (const day of days) {
      map.set(getDayKey(day), layoutDayEvents(day, events))
    }
    return map
  }, [days, events])

  const [selection, setSelection] = useState<Selection | null>(null)
  const dragRef = useRef<{ dayIndex: number; anchorSlot: number } | null>(null)

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>, dayIndex: number) => {
    if (event.button !== 0) return
    event.preventDefault()
    const rect = event.currentTarget.getBoundingClientRect()
    const slot = slotFromY(event.clientY, rect.top)
    dragRef.current = { dayIndex, anchorSlot: slot }
    setSelection({ dayIndex, startSlot: slot, endSlot: slot })
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>, dayIndex: number) => {
    const drag = dragRef.current
    if (!drag || drag.dayIndex !== dayIndex) return
    const rect = event.currentTarget.getBoundingClientRect()
    const slot = slotFromY(event.clientY, rect.top)
    setSelection({ dayIndex, startSlot: Math.min(drag.anchorSlot, slot), endSlot: Math.max(drag.anchorSlot, slot) })
  }

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>, dayIndex: number) => {
    const drag = dragRef.current
    if (!drag || drag.dayIndex !== dayIndex) return
    const rect = event.currentTarget.getBoundingClientRect()
    const slot = slotFromY(event.clientY, rect.top)
    const startSlot = Math.min(drag.anchorSlot, slot)
    const endSlot = Math.max(drag.anchorSlot, slot)
    dragRef.current = null
    setSelection(null)
    if (endSlot - startSlot >= 1) {
      const day = days[dayIndex]
      const start = startOfDay(day)
      const end = new Date(start)
      start.setMinutes(startSlot * SLOT_MINUTES)
      end.setMinutes(endSlot * SLOT_MINUTES)
      onSelectRange(start, end)
    } else {
      onSelectDate(days[dayIndex])
    }
  }

  const now = new Date()
  const nowSlot = now.getHours() * 2 + Math.floor(now.getMinutes() / SLOT_MINUTES)

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="relative overflow-hidden rounded-3xl border border-slate-200/60 bg-white/70 shadow-lg shadow-slate-200/40 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/60 dark:shadow-slate-950/40"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

      <div className="flex items-center gap-2 px-5 pt-4 text-xs font-semibold text-slate-400 dark:text-slate-500">
        <Clock className="h-3.5 w-3.5" />
        Drag across a day to create an event · Click a day to view its events
      </div>

      <div className="overflow-x-auto p-4">
        <div className="min-w-[720px]">
          {/* Day headers */}
          <div className="grid" style={{ gridTemplateColumns: `56px repeat(${days.length}, minmax(0, 1fr))` }}>
            <div />
            {days.map((day) => {
              const today = isToday(day)
              const selected = isSameDay(day, selectedDate)
              return (
                <div
                  key={getDayKey(day)}
                  className={cn(
                    'flex flex-col items-center gap-1 border-b border-slate-100 py-2.5 dark:border-slate-800',
                    today && 'border-blue-500/30 bg-blue-500/5'
                  )}
                >
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {format(day, 'EEE')}
                  </span>
                  <button
                    type="button"
                    onClick={() => onSelectDate(day)}
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-colors',
                      today
                        ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                        : selected
                          ? 'bg-violet-500/15 text-violet-600 dark:bg-violet-500/25 dark:text-violet-300'
                          : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
                    )}
                  >
                    {format(day, 'd')}
                  </button>
                </div>
              )
            })}
          </div>

          {/* Body */}
          <div className="grid" style={{ gridTemplateColumns: `56px repeat(${days.length}, minmax(0, 1fr))` }}>
            {/* Gutter */}
            <div className="relative" style={{ height: GRID_HEIGHT }}>
              {Array.from({ length: HOURS }).map((_, hour) => (
                <div
                  key={hour}
                  className="absolute inset-x-0 pr-2 text-right"
                  style={{ top: hour * SLOT_HEIGHT * 2 }}
                >
                  <span className="-translate-y-1/2 text-[10px] font-bold tabular-nums text-slate-400 dark:text-slate-500">
                    {format(new Date(2000, 0, 1, hour), 'ha')}
                  </span>
                </div>
              ))}
            </div>

            {days.map((day, dayIndex) => {
              const placed = placedByDay.get(getDayKey(day)) ?? []
              const today = isToday(day)
              const select = selection?.dayIndex === dayIndex ? selection : null

              return (
                <div
                  key={getDayKey(day)}
                  className="relative cursor-crosshair border-l border-slate-100 dark:border-slate-800"
                  style={{ height: GRID_HEIGHT }}
                  onPointerDown={(event) => handlePointerDown(event, dayIndex)}
                  onPointerMove={(event) => handlePointerMove(event, dayIndex)}
                  onPointerUp={(event) => handlePointerUp(event, dayIndex)}
                >
                  {/* Hour lines */}
                  {Array.from({ length: TOTAL_SLOTS }).map((_, slot) => (
                    <div
                      key={slot}
                      className={cn(
                        'pointer-events-none absolute inset-x-0 border-t',
                        slot % 2 === 0
                          ? 'border-slate-200/70 dark:border-slate-700/60'
                          : 'border-slate-100 dark:border-slate-800/60'
                      )}
                      style={{ top: slot * SLOT_HEIGHT }}
                    />
                  ))}

                  {/* Now line */}
                  {today && (
                    <div
                      className="pointer-events-none absolute inset-x-0 z-10 border-t-2 border-red-500/70"
                      style={{ top: nowSlot * SLOT_HEIGHT }}
                    >
                      <span className="absolute -left-0.5 -top-1 h-2 w-2 rounded-full bg-red-500" />
                    </div>
                  )}

                  {/* Events */}
                  {placed.map((item) => (
                    <button
                      key={item.event.id}
                      type="button"
                      title={`${item.event.title}`}
                      onPointerDown={(event) => event.stopPropagation()}
                      onClick={(event) => {
                        event.stopPropagation()
                        onEditEvent(item.event)
                      }}
                      className="group absolute z-10 overflow-hidden rounded-lg border border-white/40 px-1.5 py-1 text-left text-white shadow-md shadow-black/10 transition-transform hover:z-20 hover:scale-[1.02]"
                      style={{
                        top: item.top,
                        height: item.height,
                        left: `${item.left + 0.5}%`,
                        width: `calc(${item.width}% - 4px)`,
                        backgroundColor: item.event.color,
                      }}
                    >
                      <p className="truncate text-[11px] font-bold leading-tight">{item.event.title}</p>
                      {item.height >= 40 && (
                        <p className="truncate text-[9px] font-medium opacity-90 tabular-nums">
                          {format(eventStart(item.event), 'h:mm a')}
                        </p>
                      )}
                    </button>
                  ))}

                  {/* Drag selection */}
                  {select && (
                    <div
                      className="pointer-events-none absolute inset-x-0 z-10 rounded-lg border-2 border-blue-500 bg-blue-500/15"
                      style={{
                        top: select.startSlot * SLOT_HEIGHT,
                        height: (select.endSlot - select.startSlot) * SLOT_HEIGHT,
                      }}
                    >
                      <span className="absolute -top-1 left-1.5 text-[9px] font-bold uppercase tracking-wide text-blue-600 dark:text-blue-400">
                        New event
                      </span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </motion.section>
  )
}
