import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle2,
  Eye,
  Search,
  Sparkles,
  X,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { useAuth } from '@/contexts/AuthContext'
import {
  mockExams,
  mockLeaderboard,
  studentStats,
  type Exam,
} from '@/data/edtechData'

const radarData = [
  { subject: 'Math', mastery: 91 },
  { subject: 'Physics', mastery: 88 },
  { subject: 'CS', mastery: 84 },
  { subject: 'Chemistry', mastery: 72 },
  { subject: 'Algorithms', mastery: 80 },
  { subject: 'Thermodynamics', mastery: 94 },
]

export default function ResultsPage() {
  const { user } = useAuth()
  const isTeacher = user?.role === 'teacher'
  const [activeTab, setActiveTab] = useState<'overview' | 'teacher_analytics' | 'student_review'>('overview')
  const [reviewExam, setReviewExam] = useState<Exam | null>(null)
  const [searchStudent, setSearchStudent] = useState<string>('')

  const filteredLeaderboard = mockLeaderboard.filter((s) =>
    s.name.toLowerCase().includes(searchStudent.toLowerCase()) ||
    s.email.toLowerCase().includes(searchStudent.toLowerCase())
  )

  return (
    <DashboardLayout>
      <div className="space-y-7">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-slate-200/60 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div>
            <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[9px] font-bold text-blue-700 uppercase tracking-wider">
              Evaluation & Insights
            </span>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 mt-1">Results & Analytics</h1>
            <p className="text-xs text-slate-500 font-medium">
              {isTeacher
                ? 'Review class distributions, test failure points, and student rankings.'
                : 'Analyze score trajectory, subject mastery, and review question solutions.'}
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex rounded-lg bg-slate-100 p-1 border border-slate-200/60">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                activeTab === 'overview' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Overview
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('teacher_analytics')}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                activeTab === 'teacher_analytics' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {isTeacher ? 'Class Analytics' : 'Leaderboard'}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('student_review')}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                activeTab === 'student_review' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Solution Reviews
            </button>
          </div>
        </div>

        {/* SECTION 1: CHARTS ON TOP */}
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Analytics & Visualizations</h2>
            <span className="text-xs text-slate-400 font-medium">Calculated Metrics</span>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
            {/* Score History Trajectory Area Chart (7 cols) */}
            <div className="lg:col-span-7 rounded-xl border border-slate-200/60 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Score History Trajectory</h3>
                  <p className="text-[11px] text-slate-400">Historical average versus cohort benchmark</p>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                  +12.4% Growth
                </span>
              </div>
              <div className="h-64 w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={studentStats.scoreHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="scoreColorRes" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                    <XAxis dataKey="exam" stroke="#94A3B8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} domain={[50, 100]} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '11px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                    />
                    <Area type="monotone" dataKey="score" name="Cohort Score" stroke="#2563EB" strokeWidth={2} fillOpacity={1} fill="url(#scoreColorRes)" />
                    <Area type="monotone" dataKey="avg" name="Passing Line" stroke="#94A3B8" strokeWidth={1.5} strokeDasharray="4 4" fill="none" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Subject Mastery Radar Chart (5 cols) */}
            <div className="lg:col-span-5 rounded-xl border border-slate-200/60 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between space-y-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Subject Mastery Radar</h3>
                <p className="text-[11px] text-slate-400">6 Core Domain Ratings</p>
              </div>

              <div className="h-56 w-full flex items-center justify-center my-1">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                    <PolarGrid stroke="#E2E8F0" />
                    <PolarAngleAxis dataKey="subject" stroke="#64748B" fontSize={10} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#94A3B8" fontSize={9} />
                    <Radar name="Proficiency" dataKey="mastery" stroke="#2563EB" fill="#2563EB" fillOpacity={0.35} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="rounded-lg bg-blue-50/60 border border-blue-100 p-3 text-xs">
                <p className="font-semibold text-blue-900 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                  Thermodynamics Peak (94%)
                </p>
                <p className="text-[11px] text-blue-700 mt-0.5">
                  Highest score registered in theoretical mechanics.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: TABLES BELOW */}
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Class Performance & Leaderboard</h2>
            <span className="text-xs text-slate-400 font-medium">{filteredLeaderboard.length} Ranks</span>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
            {/* Student Leaderboard Table (8 cols) */}
            <div className="lg:col-span-8 rounded-xl border border-slate-200/60 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Student Leaderboard</h3>
                  <p className="text-[11px] text-slate-400">Overall assessment averages</p>
                </div>
                <div className="relative max-w-xs w-full">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="search"
                    placeholder="Search student..."
                    value={searchStudent}
                    onChange={(e) => setSearchStudent(e.target.value)}
                    className="w-full rounded-lg border border-slate-200/80 bg-slate-50/80 pl-8 pr-3 py-1.5 text-xs text-slate-900 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200/80 text-slate-400 font-bold uppercase text-[9px] tracking-wider">
                      <th className="pb-2.5">Rank</th>
                      <th className="pb-2.5">Student</th>
                      <th className="pb-2.5">Completed</th>
                      <th className="pb-2.5">Avg Score</th>
                      <th className="pb-2.5 text-right">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredLeaderboard.map((student) => (
                      <tr key={student.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-2.5">
                          <span className="flex h-5 w-5 items-center justify-center rounded bg-slate-100 text-[10px] font-bold text-slate-700">
                            #{student.rank}
                          </span>
                        </td>
                        <td className="py-2.5">
                          <p className="font-bold text-slate-900">{student.name}</p>
                          <p className="text-[10px] text-slate-400">{student.email}</p>
                        </td>
                        <td className="py-2.5 font-medium text-slate-600">{student.examsTaken} Exams</td>
                        <td className="py-2.5 font-bold text-blue-600">{student.averageScore}%</td>
                        <td className="py-2.5 text-right font-bold text-emerald-600">{student.grade}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Question Error Analysis (4 cols) */}
            <div className="lg:col-span-4 rounded-xl border border-slate-200/60 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-3">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900">Error Analysis</h3>
                <p className="text-[11px] text-slate-400">Frequent student mistake points</p>
              </div>

              <div className="space-y-3">
                {[
                  { q: 'Carnot Efficiency Calc (Q4)', failureRate: '42%', difficulty: 'Hard', topic: 'Physics' },
                  { q: 'Adiabatic Work Formula (Q2)', failureRate: '28%', difficulty: 'Medium', topic: 'Thermodynamics' },
                  { q: 'Organic Rate Law (Q7)', failureRate: '35%', difficulty: 'Hard', topic: 'Chemistry' },
                ].map((item, idx) => (
                  <div key={idx} className="rounded-lg border border-slate-100 bg-slate-50/60 p-3 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-900">{item.q}</span>
                      <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-100">
                        {item.failureRate} Error
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>Topic: {item.topic}</span>
                      <span className="font-semibold text-slate-600">{item.difficulty}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: EXAM SOLUTION REVIEWS GRID */}
        <section className="rounded-xl border border-slate-200/60 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Graded Examination Solution Reviews</h3>
            <p className="text-[11px] text-slate-400">Click any exam to inspect solution rationales</p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {mockExams.map((exam) => (
              <div
                key={exam.id}
                className="flex flex-col justify-between rounded-xl border border-slate-200/60 bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:border-slate-300 transition-all space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-700 uppercase tracking-wider">
                      {exam.subject}
                    </span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200/60 uppercase">
                      Graded
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-2">{exam.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-2">
                    Score: <strong className="text-blue-600">{exam.userScore}/{exam.totalMarks}</strong> ({Math.round(((exam.userScore || 0) / exam.totalMarks) * 100)}%)
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-3">
                  <button
                    type="button"
                    onClick={() => setReviewExam(exam)}
                    className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-slate-900 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Review Solutions
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Solution Review Modal */}
      <AnimatePresence>
        {reviewExam && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl space-y-5 text-xs"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Graded Solution Review</span>
                  <h2 className="text-base font-bold text-slate-900">{reviewExam.title}</h2>
                  <p className="text-[11px] text-slate-400">Score: {reviewExam.userScore}/{reviewExam.totalMarks} Points</p>
                </div>
                <button type="button" onClick={() => setReviewExam(null)} className="p-1 text-slate-400 hover:text-slate-700">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                {reviewExam.questions.map((q, idx) => (
                  <div key={q.id} className="rounded-xl border border-slate-200/80 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">Question {idx + 1}</span>
                      <span className="font-bold text-blue-600">{q.points} pts</span>
                    </div>
                    <p className="font-semibold text-slate-800">{q.questionText}</p>

                    <div className="space-y-2">
                      {(['A', 'B', 'C', 'D'] as const).map((opt) => {
                        const isCorrect = q.correctAnswer === opt
                        return (
                          <div
                            key={opt}
                            className={`flex items-center justify-between rounded-lg p-2.5 border ${
                              isCorrect
                                ? 'border-emerald-500 bg-emerald-50 font-bold text-emerald-900'
                                : 'border-slate-200 bg-white text-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className={`flex h-4 w-4 items-center justify-center rounded text-[9px] font-bold ${isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                                {opt}
                              </span>
                              <span>{q.options[opt]}</span>
                            </div>
                            {isCorrect && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-2">
                <button type="button" onClick={() => setReviewExam(null)} className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white">
                  Close Review
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  )
}
