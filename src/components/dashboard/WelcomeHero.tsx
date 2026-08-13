import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CalendarDays, Clock, Sparkles } from 'lucide-react'
import type { User } from '@/types'

interface WelcomeHeroProps {
  user: User | null
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export default function WelcomeHero({ user }: WelcomeHeroProps) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening'
  const firstName = user?.fullName?.split(' ')[0] || 'Student'
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative overflow-hidden rounded-3xl border border-slate-200/60 bg-white/70 p-6 shadow-xl shadow-slate-200/40 backdrop-blur-xl sm:p-8 dark:border-slate-800 dark:bg-slate-900/60 dark:shadow-slate-950/40"
    >
      {/* Ambient glow blobs */}
      <div className="pointer-events-none absolute -left-20 -top-24 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -right-16 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3.5 py-1.5"
          >
            <Sparkles className="h-3.5 w-3.5 text-blue-500 dark:text-blue-400" />
            <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">{greeting}</span>
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white"
          >
            Welcome back,{' '}
            <span className="bg-gradient-to-r from-blue-500 via-blue-400 to-indigo-500 bg-clip-text text-transparent">
              {firstName}
            </span>
            !
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32 }}
            className="mt-1.5 text-sm text-slate-500 dark:text-slate-400"
          >
            Here&apos;s what&apos;s happening in your academic life today.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-5 flex flex-wrap items-center gap-3"
          >
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white/70 px-3.5 py-2 dark:border-slate-700 dark:bg-slate-800/70">
              <CalendarDays className="h-4 w-4 text-blue-500 dark:text-blue-400" />
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{dateStr}</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white/70 px-3.5 py-2 tabular-nums dark:border-slate-700 dark:bg-slate-800/70">
              <Clock className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{timeStr}</span>
            </div>
          </motion.div>
        </div>

        {/* Avatar + summary */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35 }}
          className="flex items-center gap-4"
        >
          <div className="relative">
            <div className="absolute -inset-1.5 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 opacity-60 blur-lg" />
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.fullName}
                className="relative h-20 w-20 rounded-2xl border-2 border-white object-cover shadow-xl dark:border-slate-800"
              />
            ) : (
              <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-white bg-gradient-to-br from-blue-500 to-indigo-600 text-2xl font-bold text-white shadow-xl dark:border-slate-800">
                {getInitials(user?.fullName || 'S')}
              </div>
            )}
            <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-emerald-500 shadow-lg dark:border-slate-900">
              <span className="h-2 w-2 rounded-full bg-white" />
            </span>
          </div>

          <div className="space-y-2">
            <div className="rounded-xl border border-slate-200 bg-white/70 px-3.5 py-2 dark:border-slate-700 dark:bg-slate-800/70">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">Classes today</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                3 <span className="text-xs font-medium text-slate-400 dark:text-slate-500">scheduled</span>
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white/70 px-3.5 py-2 dark:border-slate-700 dark:bg-slate-800/70">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">Assignments due</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                2 <span className="text-xs font-medium text-slate-400 dark:text-slate-500">this week</span>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}
