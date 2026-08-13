import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DashboardCardProps {
  title: string
  subtitle?: string
  icon?: LucideIcon
  iconClassName?: string
  action?: ReactNode
  children: ReactNode
  className?: string
  bodyClassName?: string
  delay?: number
}

export default function DashboardCard({
  title,
  subtitle,
  icon: Icon,
  iconClassName,
  action,
  children,
  className,
  bodyClassName,
  delay = 0,
}: DashboardCardProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className={cn(
        'relative overflow-hidden rounded-3xl border border-emerald-900/40 bg-white/70 backdrop-blur-xl shadow-lg shadow-emerald-200/40 dark:border-emerald-800/40 dark:bg-emerald-900/60 dark:shadow-emerald-950/40',
        className
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent" />
      <div className="flex items-center justify-between gap-3 p-5 pb-0">
        <div className="flex items-center gap-3">
          {Icon && (
            <div
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 text-green-600 dark:text-green-400',
                iconClassName
              )}
            >
              <Icon className="h-4.5 w-4.5" />
            </div>
          )}
          <div>
            <h3 className="text-sm font-bold text-emerald-950 dark:text-emerald-50">{title}</h3>
            {subtitle && <p className="text-xs text-emerald-600 dark:text-emerald-400">{subtitle}</p>}
          </div>
        </div>
        {action}
      </div>
      <div className={cn('p-5', bodyClassName)}>{children}</div>
    </motion.section>
  )
}
