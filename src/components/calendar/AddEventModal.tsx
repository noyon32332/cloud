import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { X, CalendarDays, Clock, Tag, FileText } from 'lucide-react'
import Modal from '@/components/ui/modal'
import { cn } from '@/lib/utils'
import { EVENT_TYPES, type CalendarEvent, type EventType } from './types'

interface AddEventModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (event: CalendarEvent | Omit<CalendarEvent, 'id'>) => void
  selectedDate: Date | null
  editingEvent?: CalendarEvent | null
}

export default function AddEventModal({
  isOpen,
  onClose,
  onSubmit,
  selectedDate,
  editingEvent,
}: AddEventModalProps) {
  const [title, setTitle] = useState('')
  const [type, setType] = useState<EventType>('class')
  const [date, setDate] = useState('')
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('10:00')
  const [description, setDescription] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const isEditing = !!editingEvent

  useEffect(() => {
    if (isOpen) {
      if (editingEvent) {
        setTitle(editingEvent.title)
        setType(editingEvent.type)
        setDate(editingEvent.date)
        setStartTime(editingEvent.startTime)
        setEndTime(editingEvent.endTime)
        setDescription(editingEvent.description || '')
      } else {
        setTitle('')
        setType('class')
        const dateStr = selectedDate
          ? selectedDate.toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0]
        setDate(dateStr)
        setStartTime('09:00')
        setEndTime('10:00')
        setDescription('')
      }
      setErrors({})
    }
  }, [isOpen, editingEvent, selectedDate])

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!title.trim()) newErrors.title = 'Event title is required.'
    if (!date) newErrors.date = 'Date is required.'
    if (!startTime) newErrors.startTime = 'Start time is required.'
    if (!endTime) newErrors.endTime = 'End time is required.'
    if (startTime && endTime && endTime <= startTime) {
      newErrors.endTime = 'End time must be after start time.'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return

    const eventData = {
      title: title.trim(),
      type,
      date,
      startTime,
      endTime,
      description: description.trim(),
    }

    if (editingEvent) {
      onSubmit({ ...eventData, id: editingEvent.id })
    } else {
      onSubmit(eventData)
    }
    onClose()
  }

  return (
    <Modal open={isOpen} onClose={onClose} title={isEditing ? 'Edit Event' : 'Add Event'}>
      <div className="space-y-4">
        {/* Title */}
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-emerald-800 dark:text-emerald-200">
            <Tag className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
            Event Title
          </label>
          <input
            value={title}
            onChange={(e) => { setTitle(e.target.value); setErrors((prev) => ({ ...prev, title: '' })) }}
            placeholder="e.g. Web Engineering Class"
            className={cn(
              'h-11 w-full rounded-xl border bg-white/70 px-4 text-sm text-emerald-950 outline-none transition-all focus:ring-2 dark:bg-emerald-900/70 dark:text-emerald-50',
              errors.title ? 'border-red-500/60 focus:border-red-500/60 focus:ring-red-500/20' : 'border-emerald-800 focus:border-green-500/60 focus:ring-green-500/20 dark:border-emerald-700'
            )}
          />
          {errors.title && <p className="mt-1 text-xs font-medium text-red-500">{errors.title}</p>}
        </div>

        {/* Event Type */}
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-emerald-800 dark:text-emerald-200">
            <FileText className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
            Event Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as EventType)}
            className="h-11 w-full cursor-pointer rounded-xl border border-emerald-800 bg-white/70 px-4 text-sm text-emerald-950 outline-none transition-all focus:border-green-500/60 focus:ring-2 focus:ring-green-500/20 dark:border-emerald-700 dark:bg-emerald-900/70 dark:text-emerald-50"
          >
            {EVENT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-emerald-800 dark:text-emerald-200">
            <CalendarDays className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => { setDate(e.target.value); setErrors((prev) => ({ ...prev, date: '' })) }}
            className={cn(
              'h-11 w-full rounded-xl border bg-white/70 px-4 text-sm text-emerald-950 outline-none transition-all focus:ring-2 dark:bg-emerald-900/70 dark:text-emerald-50',
              errors.date ? 'border-red-500/60 focus:border-red-500/60 focus:ring-red-500/20' : 'border-emerald-800 focus:border-green-500/60 focus:ring-green-500/20 dark:border-emerald-700'
            )}
          />
          {errors.date && <p className="mt-1 text-xs font-medium text-red-500">{errors.date}</p>}
        </div>

        {/* Time */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-emerald-800 dark:text-emerald-200">
              <Clock className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
              Start Time
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => { setStartTime(e.target.value); setErrors((prev) => ({ ...prev, startTime: '', endTime: '' })) }}
              className={cn(
                'h-11 w-full rounded-xl border bg-white/70 px-4 text-sm text-emerald-950 outline-none transition-all focus:ring-2 dark:bg-emerald-900/70 dark:text-emerald-50',
                errors.startTime ? 'border-red-500/60 focus:border-red-500/60 focus:ring-red-500/20' : 'border-emerald-800 focus:border-green-500/60 focus:ring-green-500/20 dark:border-emerald-700'
              )}
            />
            {errors.startTime && <p className="mt-1 text-xs font-medium text-red-500">{errors.startTime}</p>}
          </div>
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-emerald-800 dark:text-emerald-200">
              <Clock className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
              End Time
            </label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => { setEndTime(e.target.value); setErrors((prev) => ({ ...prev, startTime: '', endTime: '' })) }}
              className={cn(
                'h-11 w-full rounded-xl border bg-white/70 px-4 text-sm text-emerald-950 outline-none transition-all focus:ring-2 dark:bg-emerald-900/70 dark:text-emerald-50',
                errors.endTime ? 'border-red-500/60 focus:border-red-500/60 focus:ring-red-500/20' : 'border-emerald-800 focus:border-green-500/60 focus:ring-green-500/20 dark:border-emerald-700'
              )}
            />
            {errors.endTime && <p className="mt-1 text-xs font-medium text-red-500">{errors.endTime}</p>}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-emerald-800 dark:text-emerald-200">
            <FileText className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description..."
            rows={3}
            className="w-full rounded-xl border border-emerald-800 bg-white/70 px-4 py-3 text-sm text-emerald-950 outline-none transition-all focus:border-green-500/60 focus:ring-2 focus:ring-green-500/20 dark:border-emerald-700 dark:bg-emerald-900/70 dark:text-emerald-50"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-xl border border-emerald-800 px-5 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-50 dark:border-emerald-700 dark:text-emerald-300 dark:hover:bg-emerald-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-5 text-sm font-semibold text-white shadow-lg shadow-green-500/25 transition-all hover:from-green-500 hover:to-emerald-500"
          >
            <CalendarDays className="h-4 w-4" />
            {isEditing ? 'Save Changes' : 'Create Event'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
