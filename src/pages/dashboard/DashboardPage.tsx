import { useNavigate } from 'react-router-dom'
import {
  Award,
  FileCheck2,
  GraduationCap,
  Plus,
} from 'lucide-react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { useAuth } from '@/contexts/AuthContext'
import TeacherDashboard from '@/pages/dashboard/TeacherDashboard'
import StudentDashboard from '@/pages/dashboard/StudentDashboard'

export default function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const isTeacher = user?.role === 'teacher'

  return (
    <DashboardLayout>
      <div className="space-y-7">
        {/* SECTION 0: Welcome Header Banner (Notion / Linear Minimal Style) */}
        <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-slate-200/60 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
              {isTeacher ? <GraduationCap className="h-5 w-5" /> : <Award className="h-5 w-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                  {isTeacher ? 'Instructor Portal' : 'Student Hub'}
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </div>
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 mt-0.5">
                Welcome back, {user?.fullName || (isTeacher ? 'Professor' : 'Student')}
              </h2>
              <p className="text-xs text-slate-500 max-w-xl mt-0.5 font-medium">
                {isTeacher
                  ? 'Monitor student examinations, manage test banks, and review live performance.'
                  : 'Track scheduled exams, review graded quizzes, and practice chapter concepts.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {isTeacher ? (
              <button
                type="button"
                onClick={() => navigate('/exams/builder')}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 active:scale-95 transition-all"
              >
                <Plus className="h-3.5 w-3.5" />
                Create Exam
              </button>
            ) : (
              <button
                type="button"
                onClick={() => navigate('/exams')}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 active:scale-95 transition-all"
              >
                <FileCheck2 className="h-3.5 w-3.5" />
                Assigned Exams
              </button>
            )}
          </div>
        </section>

        {/* SECTION 1-4: Modular Role Dashboards */}
        {isTeacher ? <TeacherDashboard /> : <StudentDashboard />}
      </div>
    </DashboardLayout>
  )
}
