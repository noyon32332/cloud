import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { CalendarDays, Clock, Flag, Palette, Save, Type } from 'lucide-react'
import Modal from '@/components/ui/modal'
import type { CalendarEvent, CalendarEventInput, EventPriority } from '@/services/calendar'
import { cn } from '@/lib/utils'
import { EVENT_COLORS, PRIORITY_CLASSES, PRIORITY_LABEL } from './calendarHelpers'

interface EventModalProps {
  open: boolean
  editing: CalendarEvent | null
  defaultStart: Date
  defaultEnd: Date
  onClose: () => void
  onSubmit: (input: CalendarEventInput) => Promise<void>
}

interface FormState {
  title: string
  description: string
  date: string
  startTime: string
  endTime: string
  priority: EventPriority
  color: string
}

const priorities: EventPriority[] = ['high', 'medium', 'low']

const inputClassName =
  'h-11 w-full rounded-xl border border-slate-200 bg-white/70 px-4 text-sm text-slate-900 outline-none transition-all focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800/70 dark:text-white'

function timeString(date: Date): string {
  return format(date, 'HH:mm')
}

function buildEmpty(defaultStart: Date, defaultEnd: Date): FormState {
  return {
    title: '',
    description: '',
    date: format(defaultStart, 'yyyy-MM-dd'),
    startTime: timeString(defaultStart),
    endTime: timeString(defaultEnd),
    priority: 'medium',
    color: EVENT_COLORS[0].value,
  }
}

function buildFromEvent(event: CalendarEvent): FormState {
  return {
    title: event.title,
    description: event.description,
    date: format(new Date(event.startTime), 'yyyy-MM-dd'),
    startTime: format(new Date(event.startTime), 'HH:mm'),
    endTime: format(new Date(event.endTime), 'HH:mm'),
    priority: event.priority,
    color: event.color,
  }
}

export default function EventModal({ open, editing, defaultStart, defaultEnd, onClose, onSubmit }: EventModalProps) {
  const [form, setForm] = useState<FormState>(() => buildEmpty(defaultStart, defaultEnd))
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) {
      setForm(editing ? buildFromEvent(editing) : buildEmpty(defaultStart, defaultEnd))
      setErrors({})
    }
  }, [open, editing, defaultStart, defaultEnd])

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev))
  }

  const handleSubmit = async () => {
    const nextErrors: Partial<Record<keyof FormState, string>> = {}
    if (!form.title.trim()) nextErrors.title = 'Title is required.'
    if (!form.date) nextErrors.date = 'Date is required.'
    if (!form.startTime) nextErrors.startTime = 'Start time is required.'
    if (!form.endTime) nextErrors.endTime = 'End time is required.'
    if (form.startTime && form.endTime && form.endTime <= form.startTime) {
      nextErrors.endTime = 'End time must be after the start time.'
    }
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSaving(true)
    try {
      await onSubmit({
        title: form.title.trim(),
        description: form.description.trim(),
        startTime: new Date(`${form.date}T${form.startTime}:00`).toISOString(),
        endTime: new Date(`${form.date}T${form.endTime}:00`).toISOString(),
        priority: form.priority,
        color: form.color,
      })
      setSaving(false)
    } catch {
      setSaving(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={editing ? 'Edit Event' : 'New Event'}>
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
            <Type className="h-3.5 w-3.5 text-blue-500 dark:text-blue-400" />
            Title
          </label>
          <input
            value={form.title}
            onChange={(event) => setField('title', event.target.value)}
            placeholder="e.g. Final exam review"
            className={cn(inputClassName, errors.title && 'border-red-500/60 focus:border-red-500/60 focus:ring-red-500/20')}
          />
          {errors.title && <p className="mt-1 text-xs font-medium text-red-500">{errors.title}</p>}
        </div>

        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
            <Type className="h-3.5 w-3.5 text-blue-500 dark:text-blue-400" />
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(event) => setField('description', event.target.value)}
            placeholder="Add a short description..."
            rows={3}
            className="w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800/70 dark:text-white"
          />
        </div>

        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
            <CalendarDays className="h-3.5 w-3.5 text-blue-500 dark:text-blue-400" />
            Date
          </label>
          <input
            type="date"
            value={form.date}
            onChange={(event) => setField('date', event.target.value)}
            className={cn(inputClassName, errors.date && 'border-red-500/60 focus:border-red-500/60 focus:ring-red-500/20')}
          />
          {errors.date && <p className="mt-1 text-xs font-medium text-red-500">{errors.date}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
              <Clock className="h-3.5 w-3.5 text-blue-500 dark:text-blue-400" />
              Start
            </label>
            <input
              type="time"
              value={form.startTime}
              onChange={(event) => setField('startTime', event.target.value)}
              className={cn(inputClassName, errors.startTime && 'border-red-500/60 focus:border-red-500/60 focus:ring-red-500/20')}
            />
            {errors.startTime && <p className="mt-1 text-xs font-medium text-red-500">{errors.startTime}</p>}
          </div>
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
              <Clock className="h-3.5 w-3.5 text-blue-500 dark:text-blue-400" />
              End
            </label>
            <input
              type="time"
              value={form.endTime}
              onChange={(event) => setField('endTime', event.target.value)}
              className={cn(inputClassName, errors.endTime && 'border-red-500/60 focus:border-red-500/60 focus:ring-red-500/20')}
            />
            {errors.endTime && <p className="mt-1 text-xs font-medium text-red-500">{errors.endTime}</p>}
          </div>
        </div>

        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
            <Flag className="h-3.5 w-3.5 text-blue-500 dark:text-blue-400" />
            Priority
          </label>
          <div className="grid grid-cols-3 gap-2">
            {priorities.map((priority) => (
              <button
                key={priority}
                type="button"
                onClick={() => setField('priority', priority)}
                className={cn(
                  'rounded-xl border px-2 py-2 text-xs font-bold capitalize transition-all',
                  form.priority === priority
                    ? PRIORITY_CLASSES[priority]
                    : 'border-slate-200 text-slate-500 hover:border-slate-300 dark:border-slate-700 dark:text-slate-400 dark:hover:border-slate-600'
                )}
              >
                {PRIORITY_LABEL[priority]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
            <Palette className="h-3.5 w-3.5 text-blue-500 dark:text-blue-400" />
            Color
          </label>
          <div className="flex flex-wrap gap-2">
            {EVENT_COLORS.map((color) => (
              <button
                key={color.value}
                type="button"
                title={color.name}
                onClick={() => setField('color', color.value)}
                className={cn(
                  'h-8 w-8 rounded-full transition-all hover:scale-110',
                  form.color === color.value &&
                    'ring-2 ring-offset-2 ring-slate-900 dark:ring-offset-slate-900 dark:ring-white'
                )}
                style={{ backgroundColor: color.value }}
                aria-label={color.name}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={saving}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50"
          >
            {saving && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
            <Save className="h-4 w-4" />
            {editing ? 'Save Changes' : 'Add Event'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
