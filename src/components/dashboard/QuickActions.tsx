import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Zap } from 'lucide-react'
import { quickActions } from '@/data/dashboard'
import { cn } from '@/lib/utils'

export default function QuickActions() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="relative overflow-hidden rounded-3xl border border-slate-200/60 bg-white/70 p-6 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/60"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 text-blue-500 dark:text-blue-400">
            <Zap className="h-4.5 w-4.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Quick Actions</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500">Shortcuts to keep you productive</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
        {quickActions.map((action, index) => {
          const button = (
            <div
              className={cn(
                'group flex h-full w-full flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200/70 bg-white/60 px-3 py-5 backdrop-blur-xl transition-all duration-300',
                'hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-500/10',
                'dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-blue-500/40'
              )}
            >
              <div
                className={cn(
                  'flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3',
                  action.gradient
                )}
              >
                <action.icon className="h-5.5 w-5.5" />
              </div>
              <span className="text-center text-xs font-semibold text-slate-700 transition-colors group-hover:text-blue-600 dark:text-slate-300 dark:group-hover:text-blue-400">
                {action.label}
              </span>
            </div>
          )

          return (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
            >
              {action.path ? (
                <Link to={action.path} className="block h-full">
                  {button}
                </Link>
              ) : (
                <button type="button" className="block h-full w-full">
                  {button}
                </button>
              )}
            </motion.div>
          )
        })}
      </div>
    </motion.section>
  )
}
