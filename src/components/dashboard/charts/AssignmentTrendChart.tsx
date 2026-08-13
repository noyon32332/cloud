import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { TrendingUp } from 'lucide-react'
import { assignmentTrend } from '@/data/dashboard'
import DashboardCard from '@/components/dashboard/DashboardCard'
import ChartTooltip from '@/components/dashboard/charts/ChartTooltip'
import { chartColors, axisProps } from '@/components/dashboard/charts/chartTheme'

const submittedId = 'assignmentSubmittedGradient'
const pendingId = 'assignmentPendingGradient'

export default function AssignmentTrendChart() {
  return (
    <DashboardCard
      title="Assignment Submission Trend"
      subtitle="Submitted vs pending"
      icon={TrendingUp}
      iconClassName="text-violet-500 dark:text-violet-400 from-violet-500/20 to-purple-500/20"
      delay={0.1}
    >
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={assignmentTrend} margin={{ top: 8, right: 4, left: -18, bottom: 0 }}>
            <defs>
              <linearGradient id={submittedId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={chartColors.violet} stopOpacity={0.35} />
                <stop offset="100%" stopColor={chartColors.violet} stopOpacity={0} />
              </linearGradient>
              <linearGradient id={pendingId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={chartColors.cyan} stopOpacity={0.25} />
                <stop offset="100%" stopColor={chartColors.cyan} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke={chartColors.grid} />
            <XAxis dataKey="week" {...axisProps} />
            <YAxis {...axisProps} allowDecimals={false} />
            <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'rgba(148, 163, 184, 0.2)' }} />
            <Area
              type="monotone"
              dataKey="submitted"
              name="Submitted"
              stroke={chartColors.violet}
              strokeWidth={2.5}
              fill={`url(#${submittedId})`}
              animationDuration={1400}
            />
            <Area
              type="monotone"
              dataKey="pending"
              name="Pending"
              stroke={chartColors.cyan}
              strokeWidth={2.5}
              fill={`url(#${pendingId})`}
              animationDuration={1400}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  )
}
