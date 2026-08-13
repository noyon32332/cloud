import { useState, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import CalendarHeader from '@/components/calendar/CalendarHeader'
import CalendarGrid from '@/components/calendar/CalendarGrid'
import AddEventModal from '@/components/calendar/AddEventModal'
import EventDetailsModal from '@/components/calendar/EventDetailsModal'
import UpcomingEvents from '@/components/calendar/UpcomingEvents'
import type { CalendarEvent } from '@/components/calendar/types'

const SAMPLE_EVENTS: CalendarEvent[] = [
  {
    id: '1',
    title: 'Web Engineering',
    type: 'class',
    date: '2026-08-11',
    startTime: '10:00',
    endTime: '11:30',
    description: 'React hooks and state management patterns',
  },
  {
    id: '2',
    title: 'Database Assignment',
    type: 'assignment',
    date: '2026-08-11',
    startTime: '23:59',
    endTime: '23:59',
    description: 'Design a normalized database schema for e-commerce platform',
  },
  {
    id: '3',
    title: 'Team Standup',
    type: 'meeting',
    date: '2026-08-12',
    startTime: '09:00',
    endTime: '09:30',
    description: 'Daily sync with the project team',
  },
  {
    id: '4',
    title: 'Algorithm Presentation',
    type: 'presentation',
    date: '2026-08-13',
    startTime: '14:00',
    endTime: '15:30',
    description: 'Present sorting algorithm analysis to the class',
  },
  {
    id: '5',
    title: 'Data Structures Exam',
    type: 'exam',
    date: '2026-08-15',
    startTime: '10:00',
    endTime: '12:00',
    description: 'Mid-term examination covering trees, graphs, and hash tables',
  },
  {
    id: '6',
    title: 'Research Paper Deadline',
    type: 'deadline',
    date: '2026-08-17',
    startTime: '23:59',
    endTime: '23:59',
    description: 'Submit final draft of machine learning research paper',
  },
  {
    id: '7',
    title: 'Machine Learning',
    type: 'class',
    date: '2026-08-18',
    startTime: '11:00',
    endTime: '12:30',
    description: 'Introduction to neural networks and backpropagation',
  },
  {
    id: '8',
    title: 'UX Design Workshop',
    type: 'meeting',
    date: '2026-08-20',
    startTime: '13:00',
    endTime: '15:00',
    description: 'Hands-on workshop on user experience design principles',
  },
  {
    id: '9',
    title: 'Physics Lab Report',
    type: 'assignment',
    date: '2026-08-22',
    startTime: '17:00',
    endTime: '17:00',
    description: 'Submit lab report on electromagnetic induction experiments',
  },
  {
    id: '10',
    title: 'Career Fair',
    type: 'meeting',
    date: '2026-08-25',
    startTime: '09:00',
    endTime: '16:00',
    description: 'Annual university career fair with tech companies',
  },
  {
    id: '11',
    title: 'Operating Systems',
    type: 'class',
    date: '2026-08-14',
    startTime: '14:00',
    endTime: '15:30',
    description: 'Process synchronization and deadlock handling',
  },
  {
    id: '12',
    title: 'Final Project Demo',
    type: 'presentation',
    date: '2026-08-28',
    startTime: '10:00',
    endTime: '12:00',
    description: 'Demonstrate the capstone project to faculty panel',
  },
]

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>(SAMPLE_EVENTS)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null)

  const today = useMemo(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), now.getDate())
  }, [])

  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>()
    events.forEach((event) => {
      const existing = map.get(event.date) || []
      existing.push(event)
      map.set(event.date, existing)
    })
    return map
  }, [events])

  const handleAddEvent = useCallback((event: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: Date.now().toString(),
    }
    setEvents((prev) => [...prev, newEvent])
    setIsAddModalOpen(false)
  }, [])

  const handleUpdateEvent = useCallback((updatedEvent: CalendarEvent | Omit<CalendarEvent, 'id'>) => {
    const event = updatedEvent as CalendarEvent
    setEvents((prev) => prev.map((e) => (e.id === event.id ? event : e)))
    setEditingEvent(null)
  }, [])

  const handleDeleteEvent = useCallback((eventId: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== eventId))
    setSelectedEvent(null)
  }, [])

  const handlePrevMonth = useCallback(() => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  }, [])

  const handleNextMonth = useCallback(() => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
  }, [])

  const handleToday = useCallback(() => {
    setCurrentDate(new Date())
    setSelectedDate(new Date())
  }, [])

  const handleSelectDate = useCallback((date: Date) => {
    setSelectedDate(date)
  }, [])

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex min-w-0 flex-1 flex-col gap-6 overflow-visible"
      >
        {/* Header */}
        <CalendarHeader
          currentDate={currentDate}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onToday={handleToday}
          onAddEvent={() => setIsAddModalOpen(true)}
        />

        {/* Main Content: Calendar + Sidebar */}
        <div className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-[1fr_320px]">
          {/* Calendar Grid */}
          <div className="min-w-0 flex-1">
            <CalendarGrid
              currentDate={currentDate}
              today={today}
              selectedDate={selectedDate}
              eventsByDate={eventsByDate}
              onSelectDate={handleSelectDate}
              onSelectEvent={setSelectedEvent}
            />
          </div>

          {/* Upcoming Events Panel */}
          <div className="min-w-0">
            <UpcomingEvents
              events={events}
              today={today}
              onSelectEvent={setSelectedEvent}
            />
          </div>
        </div>
      </motion.div>

      {/* Add Event Modal */}
      <AddEventModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddEvent}
        selectedDate={selectedDate}
      />

      {/* Event Details Modal */}
      <EventDetailsModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onEdit={(event) => {
          setSelectedEvent(null)
          setEditingEvent(event)
        }}
        onDelete={handleDeleteEvent}
      />

      {/* Edit Event Modal */}
      <AddEventModal
        isOpen={!!editingEvent}
        onClose={() => setEditingEvent(null)}
        onSubmit={handleUpdateEvent}
        editingEvent={editingEvent}
        selectedDate={selectedDate}
      />
    </DashboardLayout>
  )
}
