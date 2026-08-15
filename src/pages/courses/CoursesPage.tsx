import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  Users,
} from 'lucide-react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { mockCourses } from '@/data/edtechData'

export default function CoursesPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('All')

  const subjects = ['All', 'Physics', 'Mathematics', 'Computer Science', 'Chemistry']

  const filteredCourses = mockCourses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSubject = selectedSubject === 'All' || course.subject === selectedSubject
    return matchesSearch && matchesSubject
  })

  return (
    <DashboardLayout>
      <div className="space-y-7">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-slate-200/60 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div>
            <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[9px] font-bold text-blue-700 uppercase tracking-wider">
              Curriculum Hub
            </span>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 mt-1">My Courses</h1>
            <p className="text-xs text-slate-500 font-medium">
              Access syllabus modules, chapter notes, and related tests.
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col gap-3 rounded-xl border border-slate-200/60 bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Search course code, title, or instructor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8.5 w-full rounded-lg border border-slate-200/80 bg-slate-50/80 pl-8 pr-3 text-xs text-slate-900 outline-none focus:border-blue-500 focus:bg-white"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {subjects.map((sub) => (
              <button
                key={sub}
                type="button"
                onClick={() => setSelectedSubject(sub)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  selectedSubject === sub
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'border border-slate-200/80 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {filteredCourses.map((course) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col justify-between rounded-xl border border-slate-200/60 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:border-slate-300 transition-all space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-700 uppercase tracking-wider">
                    {course.code} · {course.subject}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                    <Users className="h-3.5 w-3.5" />
                    <span>{course.enrolledStudents} students</span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-900">{course.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{course.description}</p>

                <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-600 flex items-center justify-between">
                  <span>Instructor: <strong className="text-slate-900">{course.instructor}</strong></span>
                  <span className="font-bold text-blue-600">{course.totalChapters} Chapters</span>
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-[11px] font-bold text-slate-600">
                    <span>Curriculum Progress</span>
                    <span className="text-blue-600">{course.progress}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${course.progress}%` }} />
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3 flex gap-2.5">
                <button
                  type="button"
                  onClick={() => navigate('/chapters')}
                  className="flex-1 rounded-lg bg-blue-600 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors"
                >
                  Open Chapters
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/exams')}
                  className="rounded-lg border border-slate-200/80 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  {course.totalExams} Exams
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
