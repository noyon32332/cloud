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
    color: 'text-emerald-700 dark:text-emerald-300',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/40',
    dot: 'bg-emerald-500',
    borderColor: 'border-emerald-300 dark:border-emerald-700',
  },
  {
    value: 'assignment',
    label: 'Assignment',
    color: 'text-green-700 dark:text-green-300',
    bgColor: 'bg-green-100 dark:bg-green-900/40',
    dot: 'bg-green-500',
    borderColor: 'border-green-300 dark:border-green-700',
  },
  {
    value: 'meeting',
    label: 'Meeting',
    color: 'text-teal-700 dark:text-teal-300',
    bgColor: 'bg-teal-100 dark:bg-teal-900/40',
    dot: 'bg-teal-500',
    borderColor: 'border-teal-300 dark:border-teal-700',
  },
  {
    value: 'presentation',
    label: 'Presentation',
    color: 'text-green-800 dark:text-green-200',
    bgColor: 'bg-green-200 dark:bg-green-800/40',
    dot: 'bg-green-600',
    borderColor: 'border-green-400 dark:border-green-600',
  },
  {
    value: 'exam',
    label: 'Exam',
    color: 'text-red-700 dark:text-red-300',
    bgColor: 'bg-red-100 dark:bg-red-900/40',
    dot: 'bg-red-500',
    borderColor: 'border-red-300 dark:border-red-700',
  },
  {
    value: 'deadline',
    label: 'Deadline',
    color: 'text-amber-700 dark:text-amber-300',
    bgColor: 'bg-amber-100 dark:bg-amber-900/40',
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
