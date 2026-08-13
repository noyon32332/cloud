import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { Users, GraduationCap, Building2, FolderOpen } from 'lucide-react'

const stats = [
  { icon: Users, value: 50000, suffix: '+', label: 'Students', color: 'from-sky-500 to-sky-400' },
  { icon: GraduationCap, value: 300, suffix: '+', label: 'Teachers', color: 'from-teal-500 to-teal-400' },
  { icon: Building2, value: 120, suffix: '+', label: 'Institutions', color: 'from-mint-500 to-mint-400' },
  { icon: FolderOpen, value: 1000000, suffix: '+', label: 'Files Shared', color: 'from-cyan-500 to-cyan-400' },
]

function formatNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(0)}M`
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`
  return n.toString()
}

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    const duration = 2000
    const steps = 60
    const increment = target / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [inView, target])

  return (
    <span ref={ref} className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white">
      {formatNumber(count)}{suffix}
    </span>
  )
}

export default function StatisticsSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="py-12 sm:py-16 lg:py-28 bg-slate-50/50 dark:bg-slate-900/50">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="relative group"
            >
              <div className="text-center p-6 lg:p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-cyan-200 dark:border-cyan-700/50 hover:border-sky-300 dark:hover:border-sky-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-sky-500/5 dark:hover:shadow-sky-500/5">
                <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                  <stat.icon className="w-7 h-7 text-white" />
                </div>
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}