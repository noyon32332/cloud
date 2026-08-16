import { useNavigate, Link } from 'react-router-dom'
import {
  BarChart3,
  CheckCircle2,
  FileCheck2,
  Plus,
  TrendingUp,
  Trophy,
  Users,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import {
  mockExams,
  mockLeaderboard,
  teacherStats,
} from '@/data/edtechData'

const teacherPerformanceData = [
  { name: 'Physics 301', avgScore: 82, passRate: 94 },
  { name: 'Calculus III', avgScore: 78, passRate: 88 },
  { name: 'Data Struct', avgScore: 85, passRate: 92 },
  { name: 'Organic Chem', avgScore: 68, passRate: 74 },
]

const completionRateData = [
  { name: 'Completed', value: 76, color: '#2563EB' },
  { name: 'In Progress', value: 18, color: '#64748B' },
  { name: 'Overdue', value: 6, color: '#EF4444' },
]

export default function TeacherDashboard() {
  const navigate = useNavigate()

  return (
    <div className="space-y-7">
      {/* SECTION 1: Performance Metric Cards (Notion / Stripe Minimal Style) */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Class Performance Metrics</h3>
          <span className="text-xs text-slate-400 font-medium">Real-time sync</span>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="panel-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Total Students</span>
              <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">{teacherStats.totalStudents.toLocaleString()}</p>
            <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>+14% new enrollments</span>
            </div>
          </div>

          <div className="panel-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Active Exams</span>
              <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
                <FileCheck2 className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">{teacherStats.totalExams}</p>
            <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-400 font-medium">
              <span>Across 4 courses</span>
            </div>
          </div>

          <div className="panel-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Published Exams</span>
              <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">{teacherStats.publishedExams}</p>
            <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-slate-500">
              <span>8 Drafts preparing</span>
            </div>
          </div>

          <div className="panel-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Average Score</span>
              <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
                <Trophy className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">{teacherStats.averageScore}%</p>
            <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>91.2% Overall Pass Rate</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Educator Quick Actions */}
      <section>
        <div className="panel-card p-5 space-y-3">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <button
              type="button"
              onClick={() => navigate('/exams/builder')}
              className="flex items-center gap-3 rounded-xl border border-slate-200/60 p-3.5 text-left hover:border-blue-500 hover:bg-slate-50 transition-all group"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 shrink-0">
                <Plus className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-900 group-hover:text-blue-600">Create Exam</p>
                <p className="text-[10px] text-slate-400">Build assessment</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => navigate('/exams')}
              className="flex items-center gap-3 rounded-xl border border-slate-200/60 p-3.5 text-left hover:border-slate-400 hover:bg-slate-50 transition-all group"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700 shrink-0">
                <FileCheck2 className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-900">Manage Exams</p>
                <p className="text-[10px] text-slate-400">Edit & publish</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => navigate('/results')}
              className="flex items-center gap-3 rounded-xl border border-slate-200/60 p-3.5 text-left hover:border-slate-400 hover:bg-slate-50 transition-all group"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700 shrink-0">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-900">View Results</p>
                <p className="text-[10px] text-slate-400">Grade reports</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => navigate('/analytics')}
              className="flex items-center gap-3 rounded-xl border border-slate-200/60 p-3.5 text-left hover:border-slate-400 hover:bg-slate-50 transition-all group"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700 shrink-0">
                <BarChart3 className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-900">Class Analytics</p>
                <p className="text-[10px] text-slate-400">Performance insights</p>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 3: Performance Charts */}
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* Exam Performance Bar Chart (8 cols) */}
        <div className="lg:col-span-8 panel-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Exam Performance by Course</h3>
              <p className="text-[11px] text-slate-400">Average student score and pass rate percentage</p>
            </div>
            <span className="text-[10px] font-semibold rounded-md bg-slate-100 px-2 py-0.5 text-slate-600">4 Courses</span>
          </div>
          <div className="h-64 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={teacherPerformanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '11px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                />
                <Bar dataKey="avgScore" name="Avg Score (%)" fill="#2563EB" radius={[4, 4, 0, 0]} />
                <Bar dataKey="passRate" name="Pass Rate (%)" fill="#64748B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Completion Status Gauge (4 cols) */}
        <div className="lg:col-span-4 panel-card p-5 flex flex-col justify-between space-y-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Submission Status</h3>
            <p className="text-[11px] text-slate-400">Completion rate breakdown</p>
          </div>
          <div className="h-44 w-full flex items-center justify-center my-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={completionRateData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {completionRateData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-1 border-t border-slate-100 pt-3 text-center">
            {completionRateData.map((item) => (
              <div key={item.name}>
                <p className="text-xs font-bold text-slate-800">{item.value}%</p>
                <p className="text-[9px] font-semibold text-slate-400 uppercase">{item.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: Latest Assessments & Top Performers */}
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Recent Exams */}
        <div className="panel-card p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Latest Published Assessments</h3>
            <Link to="/exams" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {mockExams.slice(0, 3).map((exam) => (
              <div
                key={exam.id}
                className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/60 p-3 hover:bg-slate-100/60 transition-colors"
              >
                <div className="min-w-0 flex-1 pr-3">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-blue-600">{exam.subject}</span>
                  <p className="truncate text-xs font-bold text-slate-900">{exam.title}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {exam.questions.length} Qs Â· {exam.durationMinutes}m Â· {exam.attemptsCount || 0} Submissions
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/results')}
                  className="shrink-0 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Reports
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Top Student Rankings */}
        <div className="panel-card p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Top Performing Students</h3>
            <Link to="/analytics" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
              Leaderboard
            </Link>
          </div>
          <div className="space-y-3">
            {mockLeaderboard.slice(0, 4).map((student) => (
              <div
                key={student.id}
                className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/60 p-2.5 hover:bg-slate-100/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-200 text-[10px] font-bold text-slate-700">
                    #{student.rank}
                  </span>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{student.name}</p>
                    <p className="text-[10px] text-slate-400">{student.examsTaken} Exams Completed</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-900">{student.averageScore}%</span>
                  <p className="text-[10px] font-semibold text-emerald-600">{student.grade}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
