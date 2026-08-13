import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts'
import { CalendarCheck } from 'lucide-react'
import { attendanceData } from '@/data/dashboard'
import DashboardCard from '@/components/dashboard/DashboardCard'
import ChartTooltip from '@/components/dashboard/charts/ChartTooltip'
import { chartColors, axisProps } from '@/components/dashboard/charts/chartTheme'

const gradientId = 'attendanceGradient'

export default function AttendanceChart() {
  return (
    <DashboardCard
      title="Attendance Trend"
      subtitle="Class attendance rate"
      icon={CalendarCheck}
      iconClassName="text-emerald-500 dark:text-emerald-400 from-emerald-500/20 to-teal-500/20"
      delay={0.05}
    >
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={attendanceData} margin={{ top: 8, right: 4, left: -18, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={chartColors.emerald} />
                <stop offset="100%" stopColor={chartColors.cyan} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke={chartColors.grid} />
            <XAxis dataKey="week" tickFormatter={(value: string) => value.replace('Week ', 'W')} {...axisProps} />
            <YAxis {...axisProps} domain={[70, 100]} />
            <Tooltip content={<ChartTooltip formatter={(value) => `${value}%`} />} cursor={{ stroke: 'rgba(148, 163, 184, 0.2)' }} />
            <ReferenceLine y={90} stroke="rgba(16, 185, 129, 0.35)" strokeDasharray="4 4" />
            <Line
              type="monotone"
              dataKey="rate"
              name="Attendance"
              stroke={`url(#${gradientId})`}
              strokeWidth={3}
              dot={{ r: 3.5, fill: chartColors.emerald, strokeWidth: 0 }}
              activeDot={{ r: 5, strokeWidth: 0 }}
              animationDuration={1400}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  )
}
