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
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    dot: 'bg-blue-600',
    borderColor: 'border-blue-200',
  },
  {
    value: 'assignment',
    label: 'Assignment',
    color: 'text-indigo-700',
    bgColor: 'bg-indigo-50',
    dot: 'bg-indigo-500',
    borderColor: 'border-indigo-200',
  },
  {
    value: 'meeting',
    label: 'Meeting',
    color: 'text-teal-700',
    bgColor: 'bg-teal-50',
    dot: 'bg-teal-500',
    borderColor: 'border-teal-200',
  },
  {
    value: 'presentation',
    label: 'Presentation',
    color: 'text-violet-700',
    bgColor: 'bg-violet-50',
    dot: 'bg-violet-500',
    borderColor: 'border-violet-200',
  },
  {
    value: 'exam',
    label: 'Exam',
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    dot: 'bg-red-500',
    borderColor: 'border-red-200',
  },
  {
    value: 'deadline',
    label: 'Deadline',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    dot: 'bg-amber-500',
    borderColor: 'border-amber-200',
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
