export type EventType = 'class' | 'assignment' | 'meeting' | 'presentation' | 'exam' | 'deadline'

export interface CalendarEvent {
  id: string
  title: string
  type: EventType
  date: string // YYYY-MM-DD
  startTime: string // HH:mm
  endTime: string // HH:mm
  description?: string
}

export const EVENT_TYPES: { value: EventType; label: string; color: string; bgColor: string; dot: string; borderColor: string }[] = [
  {
    value: 'class',
    label: 'Class',
    color: 'text-[0F172A] dark:text-[475569]',
    bgColor: 'bg-slate-50 dark:bg-slate-900/60',
    dot: 'bg-emerald-600',
    borderColor: 'border-slate-300 dark:border-slate-600',
  },
  {
    value: 'assignment',
    label: 'Assignment',
    color: 'text-green-700 dark:text-green-300',
    bgColor: 'bg-slate-100 dark:bg-slate-900/60',
    dot: 'bg-green-500',
    borderColor: 'border-green-300 dark:border-green-600',
  },
  {
    value: 'meeting',
    label: 'Meeting',
    color: 'text-teal-700 dark:text-teal-300',
    bgColor: 'bg-slate-100 dark:bg-slate-900/60',
    dot: 'bg-teal-500',
    borderColor: 'border-slate-300 dark:border-slate-600',
  },
  {
    value: 'presentation',
    label: 'Presentation',
    color: 'text-green-800 dark:text-green-200',
    bgColor: 'bg-slate-100 dark:bg-slate-900/60',
    dot: 'bg-green-600',
    borderColor: 'border-green-400 dark:border-green-500',
  },
  {
    value: 'exam',
    label: 'Exam',
    color: 'text-red-700 dark:text-red-300',
    bgColor: 'bg-slate-100 dark:bg-slate-900/60',
    dot: 'bg-red-500',
    borderColor: 'border-red-300 dark:border-red-600',
  },
  {
    value: 'deadline',
    label: 'Deadline',
    color: 'text-amber-700 dark:text-amber-300',
    bgColor: 'bg-slate-100 dark:bg-slate-900/60',
    dot: 'bg-amber-500',
    borderColor: 'border-amber-300 dark:border-amber-700',
  },
]

export function getEventTypeStyle(type: EventType) {
  return EVENT_TYPES.find((t) => t.value === type) || EVENT_TYPES[0]
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number)
  const period = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours % 12 || 12
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

export function formatDateFull(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
}
