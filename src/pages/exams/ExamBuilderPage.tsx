import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Copy,
  Edit2,
  Eye,
  FileCheck2,
  HelpCircle,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Search,
  Send,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import {
  mockChapters,
  mockCourses,
  mockQuestions,
  type Question,
} from '@/data/edtechData'

export default function ExamBuilderPage() {
  const navigate = useNavigate()

  // Left Panel State (Chapter Viewer 40%)
  const [selectedCourseId, setSelectedCourseId] = useState<string>('course-1')
  const [selectedChapterId, setSelectedChapterId] = useState<string>('chap-1')
  const [chapterSearch, setChapterSearch] = useState<string>('')

  // Right Panel State (Exam Builder 60%)
  const [examTitle, setExamTitle] = useState<string>('Thermodynamics & Carnot Cycles Assessment')
  const [examSubject, setExamSubject] = useState<string>('Physics')
  const [durationMinutes, setDurationMinutes] = useState<number>(45)
  const [passingMarks, setPassingMarks] = useState<number>(9)
  const [questions, setQuestions] = useState<Question[]>(mockQuestions)

  // Manual Question Creator / Editor State
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null)
  const [questionText, setQuestionText] = useState<string>('')
  const [optA, setOptA] = useState<string>('')
  const [optB, setOptB] = useState<string>('')
  const [optC, setOptC] = useState<string>('')
  const [optD, setOptD] = useState<string>('')
  const [correctAnswer, setCorrectAnswer] = useState<'A' | 'B' | 'C' | 'D'>('A')
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium')
  const [points, setPoints] = useState<number>(3)
  const [explanation, setExplanation] = useState<string>('')

  // UI state
  const [previewOpen, setPreviewOpen] = useState<boolean>(false)
  const [aiGenerating, setAiGenerating] = useState<boolean>(false)
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null)

  // Selected chapter resolution
  const activeChapter = mockChapters.find((c) => c.id === selectedChapterId) || mockChapters[0]
  const courseChapters = mockChapters.filter((c) => c.courseId === selectedCourseId)

  // Filtered concepts in chapter
  const filteredConcepts = activeChapter.keyConcepts.filter(
    (c) =>
      c.title.toLowerCase().includes(chapterSearch.toLowerCase()) ||
      c.description.toLowerCase().includes(chapterSearch.toLowerCase())
  )

  // Add or Update Question handler
  const handleSubmitQuestion = (e: React.FormEvent) => {
    e.preventDefault()
    if (!questionText.trim() || !optA.trim() || !optB.trim() || !optC.trim() || !optD.trim()) {
      alert('Please fill out question text and all 4 options.')
      return
    }

    if (editingQuestionId) {
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === editingQuestionId
            ? {
                ...q,
                questionText: questionText.trim(),
                difficulty,
                options: {
                  A: optA.trim(),
                  B: optB.trim(),
                  C: optC.trim(),
                  D: optD.trim(),
                },
                correctAnswer,
                points,
                explanation: explanation.trim() || 'Correct answer verified against chapter curriculum.',
              }
            : q
        )
      )
      setEditingQuestionId(null)
    } else {
      const newQ: Question = {
        id: `q-${Date.now()}`,
        chapterId: selectedChapterId,
        questionText: questionText.trim(),
        difficulty,
        options: {
          A: optA.trim(),
          B: optB.trim(),
          C: optC.trim(),
          D: optD.trim(),
        },
        correctAnswer,
        points,
        explanation: explanation.trim() || 'Correct answer verified against chapter curriculum.',
      }
      setQuestions((prev) => [...prev, newQ])
    }

    setQuestionText('')
    setOptA('')
    setOptB('')
    setOptC('')
    setOptD('')
    setExplanation('')
  }

  const handleStartEdit = (q: Question) => {
    setEditingQuestionId(q.id)
    setQuestionText(q.questionText)
    setOptA(q.options.A)
    setOptB(q.options.B)
    setOptC(q.options.C)
    setOptD(q.options.D)
    setCorrectAnswer(q.correctAnswer)
    setDifficulty(q.difficulty)
    setPoints(q.points)
    setExplanation(q.explanation || '')
    window.scrollTo({ top: 200, behavior: 'smooth' })
  }

  const handleCancelEdit = () => {
    setEditingQuestionId(null)
    setQuestionText('')
    setOptA('')
    setOptB('')
    setOptC('')
    setOptD('')
    setExplanation('')
  }

  const handleDeleteQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id))
    if (editingQuestionId === id) {
      handleCancelEdit()
    }
  }

  const handleGenerateQuestionsAI = () => {
    setAiGenerating(true)
    setTimeout(() => {
      const generated: Question[] = [
        {
          id: `ai-q-${Date.now()}-1`,
          chapterId: selectedChapterId,
          questionText: `In an adiabatic process within ${activeChapter.title}, which thermodynamic quantity remains constant?`,
          difficulty: 'Medium',
          options: {
            A: 'Temperature (T)',
            B: 'Heat Transfer (Q = 0)',
            C: 'Pressure (P)',
            D: 'Internal Energy (ΔU = 0)',
          },
          correctAnswer: 'B',
          points: 3,
          explanation: 'Adiabatic processes involve no heat exchange with environment (Q = 0).',
        },
      ]
      setQuestions((prev) => [...prev, ...generated])
      setAiGenerating(false)
    }, 1000)
  }

  const handleSaveExam = () => {
    setSaveSuccess('Exam published successfully!')
    setTimeout(() => {
      setSaveSuccess(null)
      navigate('/exams')
    }, 1500)
  }

  const totalExamMarks = questions.reduce((sum, q) => sum + q.points, 0)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Sticky Top Action Bar */}
        <div className="sticky top-14 z-20 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-slate-200/60 bg-white/95 backdrop-blur-xs p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/exams')}
              className="rounded-lg border border-slate-200/80 p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded bg-blue-50 px-2 py-0.5 text-[9px] font-bold text-blue-700 uppercase tracking-wider">
                  Exam Builder
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {questions.length} Qs · {totalExamMarks} Marks
                </span>
              </div>
              <h1 className="text-sm sm:text-base font-bold text-slate-900 truncate mt-0.5">
                {examTitle || 'Untitled Exam'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setPreviewOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/80 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Eye className="h-3.5 w-3.5 text-slate-400" />
              Preview
            </button>
            <button
              type="button"
              onClick={handleSaveExam}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 active:scale-95 transition-all"
            >
              <Send className="h-3.5 w-3.5" />
              Publish Exam
            </button>
          </div>
        </div>

        {saveSuccess && (
          <div className="rounded-xl border border-emerald-200/60 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 flex items-center gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            {saveSuccess}
          </div>
        )}

        {/* 40% / 60% Split Grid */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          {/* LEFT PANEL (40%) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="rounded-xl border border-slate-200/60 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                  <h2 className="text-xs font-bold text-slate-900">Chapter Content Viewer</h2>
                </div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">40% Left Panel</span>
              </div>

              {/* Selectors */}
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Subject / Course</label>
                  <select
                    value={selectedCourseId}
                    onChange={(e) => {
                      setSelectedCourseId(e.target.value)
                      const firstChap = mockChapters.find((c) => c.courseId === e.target.value)
                      if (firstChap) setSelectedChapterId(firstChap.id)
                    }}
                    className="w-full rounded-lg border border-slate-200/80 bg-slate-50/80 px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-blue-500"
                  >
                    {mockCourses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.code} - {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Target Chapter</label>
                  <select
                    value={selectedChapterId}
                    onChange={(e) => setSelectedChapterId(e.target.value)}
                    className="w-full rounded-lg border border-slate-200/80 bg-slate-50/80 px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-blue-500"
                  >
                    {courseChapters.map((chap) => (
                      <option key={chap.id} value={chap.id}>
                        Chapter {chap.chapterNumber}: {chap.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="search"
                    placeholder="Search concepts & formulas..."
                    value={chapterSearch}
                    onChange={(e) => setChapterSearch(e.target.value)}
                    className="w-full rounded-lg border border-slate-200/80 bg-slate-50/80 pl-8 pr-3 py-1.5 text-xs text-slate-800 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* AI Generator */}
              <div className="rounded-lg border border-blue-100 bg-blue-50/40 p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-blue-600" />
                    <span className="text-xs font-bold text-blue-900">AI Curriculum Generator</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleGenerateQuestionsAI}
                    disabled={aiGenerating}
                    className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-2.5 py-1 text-[10px] font-semibold text-white shadow-xs hover:bg-blue-700 disabled:opacity-50"
                  >
                    {aiGenerating ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                    {aiGenerating ? 'Generating...' : 'Auto-Generate'}
                  </button>
                </div>
                <p className="text-[10px] text-blue-700 leading-relaxed font-medium">
                  Generates questions mapped to Chapter {activeChapter.chapterNumber} theory.
                </p>
              </div>

              {/* Concepts */}
              <div className="space-y-3 max-h-[440px] overflow-y-auto pr-1">
                <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-600 space-y-1">
                  <h4 className="font-bold text-slate-900">Summary</h4>
                  <p className="text-[11px] leading-relaxed text-slate-500">{activeChapter.summary}</p>
                </div>

                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Key Concepts</h4>
                {filteredConcepts.map((concept, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-slate-200/60 bg-white p-3 space-y-1 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{concept.title}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setQuestionText(`Regarding ${concept.title}: `)
                          setExplanation(concept.description)
                        }}
                        className="text-[10px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                      >
                        <Copy className="h-3 w-3" /> Use
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{concept.description}</p>
                    {concept.formulaOrSnippet && (
                      <div className="rounded bg-slate-900 px-2.5 py-1 text-[10px] font-mono text-emerald-400">
                        {concept.formulaOrSnippet}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT PANEL (60%) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Exam Meta */}
            <div className="rounded-xl border border-slate-200/60 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <FileCheck2 className="h-4 w-4 text-blue-600" />
                  <h2 className="text-xs font-bold text-slate-900">Exam Details & Rules</h2>
                </div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">60% Right Panel</span>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Exam Title</label>
                  <input
                    type="text"
                    value={examTitle}
                    onChange={(e) => setExamTitle(e.target.value)}
                    className="w-full rounded-lg border border-slate-200/80 bg-slate-50/80 px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Subject</label>
                  <input
                    type="text"
                    value={examSubject}
                    onChange={(e) => setExamSubject(e.target.value)}
                    className="w-full rounded-lg border border-slate-200/80 bg-slate-50/80 px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={180}
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-200/80 bg-slate-50/80 px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Passing Score (Marks)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={passingMarks}
                    onChange={(e) => setPassingMarks(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-200/80 bg-slate-50/80 px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Question Builder Form */}
            <form onSubmit={handleSubmitQuestion} className="rounded-xl border border-slate-200/60 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  {editingQuestionId ? <Edit2 className="h-3.5 w-3.5 text-amber-600" /> : <Plus className="h-3.5 w-3.5 text-blue-600" />}
                  {editingQuestionId ? 'Edit Question' : 'Question Builder'}
                </h3>
                {editingQuestionId && (
                  <button type="button" onClick={handleCancelEdit} className="text-xs text-slate-400 hover:text-slate-700">
                    Cancel
                  </button>
                )}
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Question Prompt</label>
                <textarea
                  rows={2}
                  placeholder="Enter problem statement..."
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  className="w-full rounded-lg border border-slate-200/80 bg-slate-50/80 p-3 text-xs font-medium text-slate-900 outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Option A</label>
                  <input
                    type="text"
                    placeholder="Choice A"
                    value={optA}
                    onChange={(e) => setOptA(e.target.value)}
                    className="w-full rounded-lg border border-slate-200/80 bg-slate-50/80 px-3 py-1.5 text-xs text-slate-900 outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Option B</label>
                  <input
                    type="text"
                    placeholder="Choice B"
                    value={optB}
                    onChange={(e) => setOptB(e.target.value)}
                    className="w-full rounded-lg border border-slate-200/80 bg-slate-50/80 px-3 py-1.5 text-xs text-slate-900 outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Option C</label>
                  <input
                    type="text"
                    placeholder="Choice C"
                    value={optC}
                    onChange={(e) => setOptC(e.target.value)}
                    className="w-full rounded-lg border border-slate-200/80 bg-slate-50/80 px-3 py-1.5 text-xs text-slate-900 outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Option D</label>
                  <input
                    type="text"
                    placeholder="Choice D"
                    value={optD}
                    onChange={(e) => setOptD(e.target.value)}
                    className="w-full rounded-lg border border-slate-200/80 bg-slate-50/80 px-3 py-1.5 text-xs text-slate-900 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 pt-1">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Correct Choice</label>
                  <select
                    value={correctAnswer}
                    onChange={(e) => setCorrectAnswer(e.target.value as 'A' | 'B' | 'C' | 'D')}
                    className="w-full rounded-lg border border-slate-200/80 bg-slate-50/80 px-3 py-2 text-xs font-bold text-emerald-600 outline-none"
                  >
                    <option value="A">Option A</option>
                    <option value="B">Option B</option>
                    <option value="C">Option C</option>
                    <option value="D">Option D</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as 'Easy' | 'Medium' | 'Hard')}
                    className="w-full rounded-lg border border-slate-200/80 bg-slate-50/80 px-3 py-2 text-xs font-semibold text-slate-800 outline-none"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Marks</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={points}
                    onChange={(e) => setPoints(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-200/80 bg-slate-50/80 px-3 py-2 text-xs font-semibold text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Answer Explanation</label>
                <input
                  type="text"
                  placeholder="Rationale..."
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  className="w-full rounded-lg border border-slate-200/80 bg-slate-50/80 px-3 py-2 text-xs text-slate-900 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                {editingQuestionId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="rounded-lg border border-slate-200/80 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 active:scale-95 transition-all"
                >
                  {editingQuestionId ? <Save className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                  {editingQuestionId ? 'Update Question' : 'Add Question'}
                </button>
              </div>
            </form>

            {/* Questions List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900">
                  Questions ({questions.length})
                </h3>
                <span className="text-xs font-bold text-blue-600">Total: {totalExamMarks} Marks</span>
              </div>

              {questions.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 bg-white p-6 text-center">
                  <HelpCircle className="mx-auto h-6 w-6 text-slate-300 mb-1" />
                  <p className="text-xs font-bold text-slate-600">No questions added.</p>
                </div>
              ) : (
                questions.map((q, index) => (
                  <div
                    key={q.id}
                    className="rounded-xl border border-slate-200/60 bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-slate-100 text-[10px] font-bold text-slate-700">
                          {index + 1}
                        </span>
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                            q.difficulty === 'Easy'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                              : q.difficulty === 'Medium'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200/60'
                              : 'bg-red-50 text-red-700 border border-red-200/60'
                          }`}
                        >
                          {q.difficulty}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-400">({q.points} pts)</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(q)}
                          className="text-slate-400 hover:text-blue-600 p-1 rounded hover:bg-slate-100"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteQuestion(q.id)}
                          className="text-slate-400 hover:text-red-600 p-1 rounded hover:bg-slate-100"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs font-semibold text-slate-900 leading-snug">{q.questionText}</p>

                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {(['A', 'B', 'C', 'D'] as const).map((optKey) => {
                        const isCorrect = q.correctAnswer === optKey
                        return (
                          <div
                            key={optKey}
                            className={`flex items-center gap-2 rounded-lg p-2 text-xs border ${
                              isCorrect
                                ? 'border-emerald-500 bg-emerald-50/70 font-semibold text-emerald-900'
                                : 'border-slate-100 bg-slate-50 text-slate-700'
                            }`}
                          >
                            <span
                              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded text-[9px] font-bold ${
                                isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                              }`}
                            >
                              {optKey}
                            </span>
                            <span className="truncate">{q.options[optKey]}</span>
                            {isCorrect && <CheckCircle2 className="ml-auto h-3.5 w-3.5 text-emerald-600 shrink-0" />}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Preview */}
      <AnimatePresence>
        {previewOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl space-y-5 text-xs"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Exam Preview</span>
                  <h2 className="text-base font-bold text-slate-900">{examTitle}</h2>
                  <p className="text-[11px] text-slate-400">{durationMinutes} Mins · {questions.length} Questions</p>
                </div>
                <button type="button" onClick={() => setPreviewOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                {questions.map((q, idx) => (
                  <div key={q.id} className="rounded-xl border border-slate-200/80 p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">Question {idx + 1}</span>
                      <span className="font-bold text-blue-600">{q.points} pts</span>
                    </div>
                    <p className="font-semibold text-slate-800">{q.questionText}</p>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-2">
                <button type="button" onClick={() => setPreviewOpen(false)} className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white">
                  Close Preview
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  )
}
