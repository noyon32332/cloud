import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts'
import { BarChart3 } from 'lucide-react'
import { studyHours } from '@/data/dashboard'
import DashboardCard from '@/components/dashboard/DashboardCard'
import ChartTooltip from '@/components/dashboard/charts/ChartTooltip'
import { chartColors, axisProps } from '@/components/dashboard/charts/chartTheme'

const gradientId = 'studyHoursGradient'

export default function StudyHoursChart() {
  return (
    <DashboardCard
      title="Weekly Study Hours"
      subtitle="Hours logged this week"
      icon={BarChart3}
      iconClassName="text-blue-500 dark:text-blue-400 from-blue-500/20 to-indigo-500/20"
      delay={0.05}
    >
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={studyHours} margin={{ top: 8, right: 4, left: -18, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={chartColors.blue} stopOpacity={1} />
                <stop offset="100%" stopColor={chartColors.indigo} stopOpacity={0.25} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke={chartColors.grid} />
            <XAxis dataKey="day" {...axisProps} />
            <YAxis {...axisProps} />
            <Tooltip
              content={<ChartTooltip formatter={(value) => `${value} hrs`} />}
              cursor={{ fill: 'rgba(148, 163, 184, 0.08)' }}
            />
            <Bar dataKey="hours" fill={`url(#${gradientId})`} radius={[8, 8, 2, 2]} maxBarSize={34} animationDuration={1200}>
              {studyHours.map((entry, index) => (
                <Cell key={entry.day} fillOpacity={index === 4 ? 1 : 0.72} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  )
}
