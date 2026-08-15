import { useNavigate, Link } from 'react-router-dom'
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  FileCheck2,
  Sparkles,
  TrendingUp,
  Trophy,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import {
  mockExams,
  studentStats,
} from '@/data/edtechData'

export default function StudentDashboard() {
  const navigate = useNavigate()

  return (
    <div className="space-y-7">
      {/* SECTION 1: Student Statistics Cards */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">My Academic Progress</h3>
          <span className="text-xs text-slate-400 font-medium">Active Term 2026</span>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-200/60 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Assigned Exams</span>
              <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
                <FileCheck2 className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">{studentStats.assignedExams}</p>
            <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-blue-600">
              <span>3 Active this week</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200/60 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Completed Exams</span>
              <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">{studentStats.completedExams}</p>
            <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>100% On-time submission</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200/60 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Pending Tests</span>
              <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">{studentStats.pendingExams}</p>
            <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-slate-500">
              <span>Next deadline: Tomorrow</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200/60 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">My Average Score</span>
              <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
                <Trophy className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">{studentStats.averageScore}%</p>
            <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-slate-500">
              <span>Top 10% class rank</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: My Exams Grid */}
      <section className="rounded-xl border border-slate-200/60 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">My Exams & Assessments</h3>
            <p className="text-[11px] text-slate-400">Upcoming, active, and completed quizzes</p>
          </div>
          <Link to="/exams" className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
            View All Exams <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {mockExams.map((exam) => {
            const isCompleted = exam.userStatus === 'Completed'
            return (
              <div
                key={exam.id}
                className="flex flex-col justify-between rounded-xl border border-slate-200/60 bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:border-slate-300 transition-all space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-700 uppercase tracking-wider">
                      {exam.subject}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                        isCompleted
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                          : 'bg-blue-50 text-blue-700 border border-blue-200/60'
                      }`}
                    >
                      {isCompleted ? 'Completed' : 'Pending'}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-2">{exam.title}</h4>
                  <div className="mt-3 flex items-center gap-2.5 text-[11px] text-slate-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      {exam.durationMinutes}m
                    </span>
                    <span>·</span>
                    <span>{exam.questions.length} Qs</span>
                    <span>·</span>
                    <span>{exam.totalMarks} pts</span>
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
                      className="w-full rounded-lg bg-blue-600 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 active:scale-95 transition-all"
                    >
                      Start Exam
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* SECTION 3: Score Trajectory & Subject Proficiency */}
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* Progress Chart (8 cols) */}
        <div className="lg:col-span-8 rounded-xl border border-slate-200/60 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Score Trajectory & Class Benchmark</h3>
              <p className="text-[11px] text-slate-400">Your score versus class average</p>
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
              +9% Above Average
            </span>
          </div>
          <div className="h-64 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={studentStats.scoreHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreColorStud" x1="0" y1="0" x2="0" y2="1">
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
                <Area type="monotone" dataKey="score" name="My Score" stroke="#2563EB" strokeWidth={2} fillOpacity={1} fill="url(#scoreColorStud)" />
                <Area type="monotone" dataKey="avg" name="Class Average" stroke="#94A3B8" strokeWidth={1.5} strokeDasharray="4 4" fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject Mastery Breakdown (4 cols) */}
        <div className="lg:col-span-4 rounded-xl border border-slate-200/60 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between space-y-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Subject Proficiency</h3>
            <p className="text-[11px] text-slate-400">Calculated from recent assessments</p>
          </div>

          <div className="space-y-3 my-1">
            {studentStats.subjectMastery.map((sub) => (
              <div key={sub.subject} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-800">{sub.subject}</span>
                  <span className="text-blue-600">{sub.score}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      sub.score >= 85 ? 'bg-emerald-500' : sub.score >= 75 ? 'bg-blue-600' : 'bg-amber-500'
                    }`}
                    style={{ width: `${sub.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-lg bg-slate-50 border border-slate-200/60 p-3">
            <p className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-blue-600" />
              AI Recommendation
            </p>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              Review <strong>Organic Chemistry: Reaction Mechanisms</strong> before next test.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
