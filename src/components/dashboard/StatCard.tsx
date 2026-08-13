import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { useCountUp } from '@/hooks/useCountUp'
import { cn } from '@/lib/utils'
import type { StatCardData } from '@/data/dashboard'

interface StatCardProps {
  data: StatCardData
  index: number
}

export default function StatCard({ data, index }: StatCardProps) {
  const { ref, value } = useCountUp(data.value, { decimals: data.decimals ?? 0 })
  const isUp = data.trend.direction === 'up'
  const TrendIcon = isUp ? ArrowUpRight : ArrowDownRight

  const inner = (
    <div
      className={cn(
        'group relative h-full overflow-hidden rounded-2xl border border-emerald-900/40 bg-white/70 p-5 shadow-lg backdrop-blur-xl transition-all duration-300',
        'hover:-translate-y-1.5 hover:scale-[1.02] hover:shadow-2xl',
        data.glow,
        'dark:border-emerald-800/40 dark:bg-emerald-900/60 dark:shadow-emerald-950/50'
      )}
    >
      {/* Hover border glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-green-500/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="flex items-start justify-between">
        <div className={cn('flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg', data.gradient)}>
          <data.icon className="h-5 w-5" />
        </div>
        <span
          className={cn(
            'flex items-center gap-0.5 rounded-full px-2 py-1 text-xs font-semibold',
            isUp ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
          )}
        >
          <TrendIcon className="h-3 w-3" />
          {data.trend.value}
        </span>
      </div>

      <div className="mt-4">
        <p className="text-xs font-medium uppercase tracking-wider text-emerald-600 dark:text-emerald-400">{data.label}</p>
        <p className="mt-1.5 flex items-baseline gap-1 text-3xl font-extrabold tabular-nums tracking-tight text-emerald-950 dark:text-emerald-50">
          {data.prefix && <span className="text-lg text-emerald-500">{data.prefix}</span>}
          <span ref={ref}>
            {data.decimals ? value.toFixed(data.decimals) : Math.round(value)}
          </span>
          {data.suffix && <span className="text-lg text-emerald-500">{data.suffix}</span>}
        </p>
        <p className="mt-1 text-xs text-emerald-500 dark:text-emerald-400">{data.trend.note}</p>
      </div>
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: 'easeOut' }}
      className="h-full cursor-pointer"
    >
      {data.path ? <Link to={data.path} className="block h-full">{inner}</Link> : <>{inner}</>}
    </motion.div>
  )
}
