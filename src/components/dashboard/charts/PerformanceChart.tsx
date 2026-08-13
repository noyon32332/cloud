import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts'
import { Gauge } from 'lucide-react'
import { performanceData } from '@/data/dashboard'
import DashboardCard from '@/components/dashboard/DashboardCard'
import ChartTooltip from '@/components/dashboard/charts/ChartTooltip'
import { chartColors, axisProps } from '@/components/dashboard/charts/chartTheme'

const barColors = [chartColors.blue, chartColors.emerald, chartColors.violet, chartColors.amber, chartColors.rose]

export default function PerformanceChart() {
  return (
    <DashboardCard
      title="Performance Overview"
      subtitle="Average score by subject"
      icon={Gauge}
      iconClassName="text-amber-500 dark:text-amber-400 from-amber-500/20 to-orange-500/20"
      delay={0.1}
    >
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={performanceData} layout="vertical" margin={{ top: 4, right: 12, left: 4, bottom: 0 }}>
            <CartesianGrid horizontal={false} stroke={chartColors.grid} />
            <XAxis type="number" domain={[0, 100]} {...axisProps} />
            <YAxis type="category" dataKey="subject" width={64} {...axisProps} />
            <Tooltip
              content={<ChartTooltip formatter={(value) => `${value}/100`} />}
              cursor={{ fill: 'rgba(148, 163, 184, 0.08)' }}
            />
            <Bar dataKey="score" name="Score" radius={[0, 8, 8, 0]} maxBarSize={18} animationDuration={1200}>
              {performanceData.map((entry, index) => (
                <Cell key={entry.subject} fill={barColors[index % barColors.length]} fillOpacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  )
}
