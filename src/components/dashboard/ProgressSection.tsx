import { motion } from 'framer-motion'
import { Target } from 'lucide-react'
import { progressItems } from '@/data/dashboard'
import DashboardCard from '@/components/dashboard/DashboardCard'
import { cn } from '@/lib/utils'

export default function ProgressSection() {
  return (
    <DashboardCard
      title="Study Progress"
      subtitle="Your semester goals at a glance"
      icon={Target}
      iconClassName="text-emerald-500 dark:text-emerald-400 from-emerald-500/20 to-teal-500/20"
    >
      <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
        {progressItems.map((item, index) => (
          <div key={item.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{item.label}</p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 dark:text-slate-500">{item.detail}</span>
                <span className="text-sm font-bold tabular-nums text-slate-900 dark:text-white">{item.value}%</span>
              </div>
            </div>
            <div className="relative h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${item.value}%` }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 1.1, delay: 0.15 + index * 0.1, ease: 'easeOut' }}
                className={cn('relative h-full rounded-full bg-gradient-to-r', item.gradient)}
              >
                <div className="absolute inset-x-0 top-0 h-px bg-white/40" />
                <motion.div
                  className="absolute right-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 translate-x-1/2 rounded-full border-2 border-white bg-current shadow-lg dark:border-slate-900"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  )
}
