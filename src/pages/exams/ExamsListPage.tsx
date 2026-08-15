import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  FileCheck2,
  Filter,
  Play,
  Plus,
  Search,
} from 'lucide-react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { useAuth } from '@/contexts/AuthContext'
import { mockExams } from '@/data/edtechData'

export default function ExamsListPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const isTeacher = user?.role === 'teacher'

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('All')
  const [selectedStatus, setSelectedStatus] = useState('All')

  const subjects = ['All', 'Physics', 'Mathematics', 'Computer Science', 'Chemistry']
  const statuses = ['All', 'Published', 'Assigned', 'Completed']

  const filteredExams = mockExams.filter((exam) => {
    const matchesSearch =
      exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.subject.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSubject = selectedSubject === 'All' || exam.subject === selectedSubject
    const matchesStatus =
      selectedStatus === 'All' ||
      (selectedStatus === 'Completed' && exam.userStatus === 'Completed') ||
      (selectedStatus === 'Assigned' && exam.status === 'Assigned') ||
      (selectedStatus === 'Published' && exam.status === 'Published')

    return matchesSearch && matchesSubject && matchesStatus
  })

  return (
    <DashboardLayout>
      <div className="space-y-7">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-slate-200/60 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div>
            <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[9px] font-bold text-blue-700 uppercase tracking-wider">
              Assessments & Quizzes
            </span>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 mt-1">Exams Hub</h1>
            <p className="text-xs text-slate-500 font-medium">
              {isTeacher
                ? 'Create, manage, and distribute tests across your classes.'
                : 'Take active assessments, test chapter knowledge, and view scored evaluations.'}
            </p>
          </div>

          {isTeacher && (
            <button
              type="button"
              onClick={() => navigate('/exams/builder')}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 active:scale-95 transition-all"
            >
              <Plus className="h-3.5 w-3.5" />
              Open Exam Builder
            </button>
          )}
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col gap-3 rounded-xl border border-slate-200/60 bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Search by exam name or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8.5 w-full rounded-lg border border-slate-200/80 bg-slate-50/80 pl-8 pr-3 text-xs text-slate-900 outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <Filter className="h-3.5 w-3.5" /> Subject:
            </div>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="rounded-lg border border-slate-200/80 bg-slate-50/80 px-3 py-1.5 text-xs font-semibold text-slate-800 outline-none"
            >
              {subjects.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="rounded-lg border border-slate-200/80 bg-slate-50/80 px-3 py-1.5 text-xs font-semibold text-slate-800 outline-none"
            >
              {statuses.map((st) => (
                <option key={st} value={st}>
                  Status: {st}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Exam Cards Grid */}
        {filteredExams.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-white p-10 text-center">
            <FileCheck2 className="mx-auto h-8 w-8 text-slate-300 mb-1" />
            <h3 className="text-xs font-bold text-slate-700">No exams match your filters</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredExams.map((exam) => {
              const isCompleted = exam.userStatus === 'Completed'
              return (
                <motion.div
                  key={exam.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col justify-between rounded-xl border border-slate-200/60 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:border-slate-300 transition-all space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-700 uppercase tracking-wider">
                        {exam.subject}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                          isCompleted
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                            : 'bg-blue-50 text-blue-700 border border-blue-200/60'
                        }`}
                      >
                        {isCompleted ? 'Completed' : exam.status}
                      </span>
                    </div>

                    <h3 className="text-xs font-bold text-slate-900 leading-snug">{exam.title}</h3>

                    <div className="grid grid-cols-3 gap-1 rounded-lg bg-slate-50 p-2.5 text-center text-xs">
                      <div>
                        <p className="text-[9px] text-slate-400 font-semibold uppercase">Time</p>
                        <p className="font-bold text-slate-800">{exam.durationMinutes}m</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-400 font-semibold uppercase">Questions</p>
                        <p className="font-bold text-slate-800">{exam.questions.length}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-400 font-semibold uppercase">Total</p>
                        <p className="font-bold text-slate-800">{exam.totalMarks} pts</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-3">
                    {isCompleted ? (
                      <button
                        type="button"
                        onClick={() => navigate('/results')}
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                      >
                        Scorecard ({exam.userScore}/{exam.totalMarks})
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => navigate(`/exams/take/${exam.id}`)}
                        className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 active:scale-95 transition-all"
                      >
                        <Play className="h-3.5 w-3.5 fill-current" />
                        Take Exam
                      </button>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
