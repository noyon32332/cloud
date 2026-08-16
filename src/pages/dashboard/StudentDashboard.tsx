import { Sparkles } from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { studentStats } from '@/data/edtechData'

export default function StudentDashboard() {
  return (
    <div className="flex flex-1 flex-col gap-7">
      {/* SECTION 3: Score Trajectory & Subject Proficiency */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:flex-1 lg:grid-rows-[1fr]">
        {/* Progress Chart (8 cols) */}
        <div className="panel-card flex min-h-[340px] flex-col p-5 space-y-4 sm:p-6 lg:col-span-8">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Score Trajectory & Class Benchmark</h3>
              <p className="mt-0.5 text-[13px] text-slate-400">Your score versus class average</p>
            </div>
            <span className="chip bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/60">
              +9% Above Average
            </span>
          </div>
          <div className="min-h-[280px] w-full flex-1 pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={studentStats.scoreHistory} margin={{ top: 16, right: 12, left: -20, bottom: 4 }}>
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
        <div className="panel-card flex flex-col justify-between p-5 space-y-4 sm:p-6 lg:col-span-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Subject Proficiency</h3>
            <p className="mt-0.5 text-[13px] text-slate-400">Calculated from recent assessments</p>
          </div>

          <div className="space-y-4 py-1">
            {studentStats.subjectMastery.map((sub) => (
              <div key={sub.subject} className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-slate-700">{sub.subject}</span>
                  <span className="font-semibold text-blue-600">{sub.score}%</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full transition-all ${
                      sub.score >= 85 ? 'bg-emerald-500' : sub.score >= 75 ? 'bg-blue-600' : 'bg-amber-500'
                    }`}
                    style={{ width: `${sub.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4">
            <p className="flex items-center gap-1.5 text-[13px] font-semibold text-slate-800">
              <Sparkles className="h-4 w-4 text-blue-600" />
              AI Recommendation
            </p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-slate-500">
              Review <strong>Organic Chemistry: Reaction Mechanisms</strong> before next test.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}