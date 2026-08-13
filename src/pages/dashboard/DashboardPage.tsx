import { useAuth } from '@/contexts/AuthContext'
import { statCards } from '@/data/dashboard'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import WelcomeHero from '@/components/dashboard/WelcomeHero'
import StatCard from '@/components/dashboard/StatCard'
import QuickActions from '@/components/dashboard/QuickActions'
import ProgressSection from '@/components/dashboard/ProgressSection'
import StudyHoursChart from '@/components/dashboard/charts/StudyHoursChart'
import AssignmentTrendChart from '@/components/dashboard/charts/AssignmentTrendChart'
import AttendanceChart from '@/components/dashboard/charts/AttendanceChart'
import PerformanceChart from '@/components/dashboard/charts/PerformanceChart'
import ActivityTimeline from '@/components/dashboard/ActivityTimeline'
import ProfileCard from '@/components/dashboard/ProfileCard'
import {
  TodayClasses,
  UpcomingAssignments,
  CalendarWidget,
  RecentNotificationsWidget,
  DeadlinesWidget,
} from '@/components/dashboard/widgets'

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-[1400px] space-y-6">
        <WelcomeHero user={user} />

        {/* Stat cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card, index) => (
            <StatCard key={card.id} data={card} index={index} />
          ))}
        </div>

        <QuickActions />
        <ProgressSection />

        {/* Charts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <StudyHoursChart />
          <AssignmentTrendChart />
          <AttendanceChart />
          <PerformanceChart />
        </div>

        {/* Lower grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <TodayClasses />
            <UpcomingAssignments />
            <ActivityTimeline />
          </div>
          <div className="space-y-6">
            <ProfileCard user={user} />
            <CalendarWidget />
            <RecentNotificationsWidget />
            <DeadlinesWidget />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
