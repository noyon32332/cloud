import { useEffect, useState } from 'react'
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
import { getExamsFirestore, type FirestoreExam } from '@/services/firestore'

export default function ExamsListPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const isTeacher = user?.role === 'teacher'

  const [exams, setExams] = useState<FirestoreExam[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('All')
  const [selectedStatus, setSelectedStatus] = useState('All')

  const subjects = ['All', 'Physics', 'Mathematics', 'Computer Science', 'Chemistry']
  const statuses = ['All', 'Published', 'Assigned', 'Completed']

  useEffect(() => {
    async function loadExams() {
      setLoading(true)
      const data = await getExamsFirestore()
      setExams(data)
      setLoading(false)
    }
    void loadExams()
  }, [])

  const filteredExams = exams.filter((exam) => {
    const matchesSearch =
      exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.subject.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSubject = selectedSubject === 'All' || exam.subject === selectedSubject
    const matchesStatus =
      selectedStatus === 'All' ||
      (selectedStatus === 'Assigned' && exam.status === 'Assigned') ||
      (selectedStatus === 'Published' && exam.status === 'Published')

    return matchesSearch && matchesSubject && matchesStatus
  })

  return (
    <DashboardLayout>
      <div className="space-y-7">
        {/* Header */}
        <section className="panel-card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <span className="eyebrow">Firestore Assessments</span>
            <h1 className="mt-1 text-lg font-bold text-slate-900">Exams Hub</h1>
            <p className="mt-0.5 text-xs font-medium text-slate-500">
              {isTeacher
                ? 'Create, publish, and manage Firestore-backed examinations.'
                : 'Take active assessments, test knowledge, and record scored transcripts.'}
            </p>
          </div>

          {isTeacher && (
            <button
              type="button"
              onClick={() => navigate('/exams/builder')}
              className="btn-primary shrink-0"
            >
              <Plus className="h-3.5 w-3.5" />
              Open Exam Builder
            </button>
          )}
        </section>

        {/* Filter Bar */}
        <div className="panel-card flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Search by exam name or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-8"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <Filter className="h-3.5 w-3.5" /> Subject:
            </div>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="h-9 rounded-lg border border-slate-200/80 bg-slate-50/80 px-3 text-xs font-semibold text-slate-800 outline-none transition-colors focus:border-blue-500"
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
              className="h-9 rounded-lg border border-slate-200/80 bg-slate-50/80 px-3 text-xs font-semibold text-slate-800 outline-none transition-colors focus:border-blue-500"
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
        {loading ? (
          <div className="panel-card p-10 text-center space-y-2">
            <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
            <p className="text-xs font-medium text-slate-500">Fetching examinations from Firestore...</p>
          </div>
        ) : filteredExams.length === 0 ? (
          <div className="panel-card border-dashed p-10 text-center">
            <FileCheck2 className="mx-auto mb-1 h-8 w-8 text-slate-300" />
            <h3 className="text-xs font-bold text-slate-700">No exams match your filters</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredExams.map((exam) => (
              <motion.div
                key={exam.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="panel-card panel-card-interactive flex flex-col justify-between p-5 space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="chip bg-slate-100 text-slate-600">
                      {exam.subject}
                    </span>
                    <span className="chip bg-blue-50 text-blue-700 ring-1 ring-blue-200/60">
                      {exam.status}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold leading-snug text-slate-900">{exam.title}</h3>

                  <div className="grid grid-cols-3 gap-1 rounded-xl bg-slate-50 p-2.5 text-center text-xs">
                    <div>
                      <p className="text-[9px] font-semibold uppercase text-slate-400">Time</p>
                      <p className="font-bold text-slate-800">{exam.durationMinutes}m</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-semibold uppercase text-slate-400">Questions</p>
                      <p className="font-bold text-slate-800">{exam.questions?.length || 0}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-semibold uppercase text-slate-400">Total</p>
                      <p className="font-bold text-slate-800">{exam.totalMarks} pts</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-3">
                  <button
                    type="button"
                    onClick={() => navigate(`/exams/take/${exam.id}`)}
                    className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 py-2 text-xs font-semibold text-white shadow-sm shadow-blue-600/20 transition-all hover:bg-blue-700 active:scale-[0.98]"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                    Take Exam
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
