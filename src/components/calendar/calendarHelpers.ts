import { endOfDay, format, parseISO, startOfDay } from 'date-fns'
import type { CalendarEvent, EventPriority } from '@/services/calendar'

export type CalendarView = 'month' | 'week' | 'day'

export const PRIORITY_ORDER: Record<EventPriority, number> = {
  high: 0,
  medium: 1,
  low: 2,
}

export const PRIORITY_LABEL: Record<EventPriority, string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
}

export const PRIORITY_CLASSES: Record<EventPriority, string> = {
  high: 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30',
  medium: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
  low: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
}

export const EVENT_COLORS: { value: string; name: string }[] = [
  { value: '#6366f1', name: 'Indigo' },
  { value: '#3b82f6', name: 'Blue' },
  { value: '#06b6d4', name: 'Cyan' },
  { value: '#10b981', name: 'Emerald' },
  { value: '#84cc16', name: 'Lime' },
  { value: '#f59e0b', name: 'Amber' },
  { value: '#ef4444', name: 'Red' },
  { value: '#ec4899', name: 'Pink' },
  { value: '#8b5cf6', name: 'Violet' },
  { value: '#64748b', name: 'Slate' },
]

export function eventStart(event: CalendarEvent): Date {
  return parseISO(event.startTime)
}

export function eventEnd(event: CalendarEvent): Date {
  return parseISO(event.endTime)
}

export function getDayKey(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

export function formatEventTime(event: CalendarEvent): string {
  return `${format(eventStart(event), 'h:mm a')} – ${format(eventEnd(event), 'h:mm a')}`
}

export function formatEventDate(event: CalendarEvent): string {
  return format(eventStart(event), 'EEE, d MMM')
}

export function overlapMinutes(a: CalendarEvent, b: CalendarEvent): boolean {
  const aStart = eventStart(a).getTime()
  const aEnd = eventEnd(a).getTime()
  const bStart = eventStart(b).getTime()
  const bEnd = eventEnd(b).getTime()
  return aStart < bEnd && bStart < aEnd
}

export function clampPriority(value: unknown): EventPriority {
  if (value === 'low' || value === 'medium' || value === 'high') return value
  return 'medium'
}

export function isEventOnDay(event: CalendarEvent, day: Date): boolean {
  const start = eventStart(event)
  const end = eventEnd(event)
  const dayStart = startOfDay(day).getTime()
  const dayEnd = endOfDay(day).getTime()
  return start.getTime() < dayEnd && end.getTime() > dayStart
}

export function sortEventsByStart(events: CalendarEvent[]): CalendarEvent[] {
  return [...events].sort((a, b) => eventStart(a).getTime() - eventStart(b).getTime())
}
