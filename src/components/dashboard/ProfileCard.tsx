import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { GraduationCap, Mail, Pencil, School, UserSquare2 } from 'lucide-react'
import type { User } from '@/types'
import DashboardCard from '@/components/dashboard/DashboardCard'

interface ProfileCardProps {
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

export default function ProfileCard({ user }: ProfileCardProps) {
  const semester = 'Semester 5'

  return (
    <DashboardCard
      title="Student Profile"
      subtitle="Your account overview"
      icon={UserSquare2}
      iconClassName="text-blue-500 dark:text-blue-400 from-blue-500/20 to-indigo-500/20"
      action={
        <Link
          to="/profile"
          className="flex items-center gap-1.5 rounded-lg bg-blue-500/10 px-2.5 py-1.5 text-xs font-semibold text-blue-600 transition-colors hover:bg-blue-500/20 dark:text-blue-400"
        >
          <Pencil className="h-3 w-3" />
          Edit Profile
        </Link>
      }
    >
      <div className="flex flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="relative"
        >
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 opacity-50 blur-lg" />
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.fullName}
              className="relative h-20 w-20 rounded-2xl border-2 border-white object-cover shadow-xl dark:border-slate-800"
            />
          ) : (
            <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-white bg-gradient-to-br from-blue-500 to-indigo-600 text-xl font-bold text-white shadow-xl dark:border-slate-800">
              {getInitials(user?.fullName || 'S')}
            </div>
          )}
        </motion.div>

        <h4 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">{user?.fullName || 'Student'}</h4>
        <span className="mt-1 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
          {user?.role}
        </span>

        <div className="mt-5 w-full space-y-2.5 text-left">
          <div className="flex items-center gap-3 rounded-xl border border-slate-200/70 bg-white/60 px-3.5 py-2.5 dark:border-slate-800 dark:bg-slate-900/60">
            <Mail className="h-4 w-4 shrink-0 text-slate-400" />
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Email</p>
              <p className="truncate text-xs font-medium text-slate-700 dark:text-slate-300">{user?.email || '—'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-slate-200/70 bg-white/60 px-3.5 py-2.5 dark:border-slate-800 dark:bg-slate-900/60">
            <GraduationCap className="h-4 w-4 shrink-0 text-slate-400" />
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Student ID</p>
              <p className="truncate text-xs font-medium tabular-nums text-slate-700 dark:text-slate-300">
                {user?.studentTeacherId || 'Not set'}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="rounded-xl border border-slate-200/70 bg-white/60 px-3.5 py-2.5 dark:border-slate-800 dark:bg-slate-900/60">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Department</p>
              <p className="mt-0.5 flex items-center gap-1 text-xs font-medium text-slate-700 dark:text-slate-300">
                <School className="h-3 w-3 text-slate-400" />
                Computer Science
              </p>
            </div>
            <div className="rounded-xl border border-slate-200/70 bg-white/60 px-3.5 py-2.5 dark:border-slate-800 dark:bg-slate-900/60">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Semester</p>
              <p className="mt-0.5 flex items-center gap-1 text-xs font-medium text-slate-700 dark:text-slate-300">
                <GraduationCap className="h-3 w-3 text-slate-400" />
                {semester}
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardCard>
  )
}
