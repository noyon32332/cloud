import { useNavigate } from 'react-router-dom'
import {
  Award,
  FileCheck2,
  GraduationCap,
  Plus,
  Sparkles,
} from 'lucide-react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { useAuth } from '@/contexts/AuthContext'
import TeacherDashboard from '@/pages/dashboard/TeacherDashboard'
import StudentDashboard from '@/pages/dashboard/StudentDashboard'

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const isTeacher = user?.role === 'teacher'

  return (
    <DashboardLayout>
      <div className="space-y-7">
        {/* SECTION 0: Welcome Hero */}
        <section className="panel-card relative overflow-hidden p-5 sm:p-6">
          {/* Soft ambient accents */}
          <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-blue-100/60 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-10 h-56 w-56 rounded-full bg-indigo-100/50 blur-3xl" />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25">
                {isTeacher ? <GraduationCap className="h-6 w-6" /> : <Award className="h-6 w-6" />}
                <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="eyebrow">{isTeacher ? 'Instructor Portal' : 'Student Hub'}</span>
                </div>
                <h2 className="mt-1 text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                  {getGreeting()}, {user?.fullName?.split(' ')[0] || (isTeacher ? 'Professor' : 'Student')}
                </h2>
                <p className="mt-0.5 max-w-xl text-xs font-medium text-slate-500">
                  {isTeacher
                    ? 'Monitor student examinations, manage test banks, and review live performance.'
                    : 'Track scheduled exams, review graded quizzes, and practice chapter concepts.'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              {!isTeacher && (
                <span className="hidden items-center gap-1.5 rounded-lg border border-blue-100 bg-blue-50/70 px-3 py-1.5 text-[11px] font-semibold text-blue-700 md:inline-flex">
                  <Sparkles className="h-3.5 w-3.5" />
                  Active Term 2026
                </span>
              )}
              {isTeacher ? (
                <button
                  type="button"
                  onClick={() => navigate('/exams/builder')}
                  className="btn-primary"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Create Exam
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => navigate('/exams')}
                  className="btn-primary"
                >
                  <FileCheck2 className="h-3.5 w-3.5" />
                  Assigned Exams
                </button>
              )}
            </div>
          </div>
        </section>

        {/* SECTION 1-4: Modular Role Dashboards */}
        {isTeacher ? <TeacherDashboard /> : <StudentDashboard />}
      </div>
    </DashboardLayout>
  )
}