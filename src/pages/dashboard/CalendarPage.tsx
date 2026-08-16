import { useState, useMemo, useCallback } from 'react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import CalendarHeader from '@/components/calendar/CalendarHeader'
import CalendarGrid from '@/components/calendar/CalendarGrid'
import type { CalendarEvent } from '@/components/calendar/types'

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const today = useMemo(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), now.getDate())
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

  const eventsByDate = useMemo(() => new Map<string, CalendarEvent[]>(), [])

  return (
    <DashboardLayout>
      <div className="flex min-w-0 flex-1 flex-col gap-6">
        {/* Calendar Header */}
        <CalendarHeader
          currentDate={currentDate}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onToday={handleToday}
          onAddEvent={() => {}}
        />

        {/* Calendar Grid */}
        <div className="min-w-0 flex-1">
          <CalendarGrid
            currentDate={currentDate}
            today={today}
            selectedDate={selectedDate}
            eventsByDate={eventsByDate}
            onSelectDate={handleSelectDate}
            onSelectEvent={() => {}}
          />
        </div>
      </div>
    </DashboardLayout>
  )
}