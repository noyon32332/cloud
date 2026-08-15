import { motion } from 'framer-motion'
import { Activity } from 'lucide-react'
import { recentActivities } from '@/data/dashboard'
import DashboardCard from '@/components/dashboard/DashboardCard'
import { cn } from '@/lib/utils'

export default function ActivityTimeline() {
  return (
    <DashboardCard
      title="Recent Activity"
      subtitle="Your latest academic actions"
      icon={Activity}
      iconClassName="text-blue-500 dark:text-blue-400 from-blue-500/20 to-indigo-500/20"
    >
      <div className="relative">
        <div className="absolute bottom-2 left-[19px] top-2 w-px bg-emerald-500/40" />
        <div className="space-y-5">
          {recentActivities.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="group relative flex gap-4"
            >
              <div className={cn('relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg', item.accent)}>
                <item.icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1 rounded-2xl border border-slate-200/70 bg-white p-3.5 transition-all group-hover:border-emerald-500/30 group-hover:shadow-lg group-hover:shadow-emerald-500/5">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.title}</p>
                  <span className="shrink-0 text-[11px] font-medium text-slate-400 dark:text-slate-500">{item.time}</span>
                </div>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardCard>
  )
}
