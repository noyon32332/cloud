import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  FileCheck2,
  Play,
  Search,
  Sparkles,
} from 'lucide-react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { mockChapters, mockCourses } from '@/data/edtechData'

export default function ChaptersPage() {
  const navigate = useNavigate()
  const [selectedChapId, setSelectedChapId] = useState<string>('chap-1')
  const [searchFilter, setSearchFilter] = useState<string>('')

  const activeChap = mockChapters.find((c) => c.id === selectedChapId) || mockChapters[0]
  const course = mockCourses.find((c) => c.id === activeChap.courseId) || mockCourses[0]

  const filteredChapters = mockChapters.filter(
    (c) =>
      c.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      c.subject.toLowerCase().includes(searchFilter.toLowerCase())
  )

  return (
    <DashboardLayout>
      <div className="space-y-7">
        {/* Header */}
        <section className="panel-card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <span className="eyebrow">Study Hub</span>
            <h1 className="mt-1 text-lg font-bold text-slate-900">
              Chapter Content Reader
            </h1>
            <p className="mt-0.5 text-xs font-medium text-slate-500">
              Read key principles, reference formulas, and practice chapter assessments.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/exams/builder')}
            className="btn-primary shrink-0"
          >
            <FileCheck2 className="h-4 w-4" />
            Build Exam From Chapter
          </button>
        </section>

        {/* 2-Column Reader Layout */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            <div className="panel-card p-5 space-y-3">
              <h3 className="text-xs font-bold text-slate-900">Chapters & Modules</h3>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  placeholder="Filter chapters..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="input-field pl-8"
                />
              </div>

              <div className="space-y-2">
                {filteredChapters.map((chap) => {
                  const isSelected = chap.id === selectedChapId
                  return (
                    <button
                      key={chap.id}
                      type="button"
                      onClick={() => setSelectedChapId(chap.id)}
                      className={`w-full flex items-start gap-3 rounded-xl p-3 text-left transition-all border ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/70 shadow-sm font-semibold text-blue-950'
                          : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[10px] font-bold ${
                          isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {chap.chapterNumber}
                      </span>
                      <div className="min-w-0 flex-1">
                        <span className="text-[9px] font-bold uppercase text-slate-400">{chap.subject}</span>
                        <p className="text-xs font-bold truncate">{chap.title}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{chap.readTime}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Reader Area */}
          <div className="lg:col-span-8 space-y-5">
            <motion.div
              key={activeChap.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="panel-card p-6 space-y-5"
            >
              {/* Meta */}
              <div className="border-b border-slate-100 pb-3 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="chip bg-blue-50 text-blue-700">
                    {course.code} · Chapter {activeChap.chapterNumber}
                  </span>
                  <span className="text-xs font-medium text-slate-400">· {activeChap.readTime}</span>
                </div>
                <h2 className="text-lg font-bold text-slate-900">{activeChap.title}</h2>
                <p className="text-xs font-medium leading-relaxed text-slate-500">{activeChap.summary}</p>
              </div>

              {/* Paragraphs */}
              <div className="space-y-3.5 text-xs leading-relaxed text-slate-700 font-normal">
                {activeChap.contentParagraphs.map((para, index) => (
                  <p key={index}>{para}</p>
                ))}
              </div>

              {/* Concepts */}
              <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 space-y-3">
                <h3 className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                  Key Principles & Formulations
                </h3>

                <div className="space-y-2.5">
                  {activeChap.keyConcepts.map((concept, index) => (
                    <div key={index} className="panel-card p-3 space-y-1">
                      <h4 className="text-xs font-bold text-slate-900">{concept.title}</h4>
                      <p className="text-[11px] text-slate-500">{concept.description}</p>
                      {concept.formulaOrSnippet && (
                        <div className="rounded-lg bg-slate-900 px-2.5 py-1.5 text-[10px] font-mono text-emerald-400">
                          {concept.formulaOrSnippet}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer CTA */}
              <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
                <div className="text-xs font-medium text-slate-500">
                  Ready to test Chapter {activeChap.chapterNumber}?
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/exams')}
                  className="btn-primary"
                >
                  <Play className="h-3.5 w-3.5 fill-current" />
                  Practice Quiz
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
