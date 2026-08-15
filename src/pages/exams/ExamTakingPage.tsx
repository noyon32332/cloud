import { useEffect, useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowLeft,
  Bookmark,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  Flag,
  HelpCircle,
  RotateCcw,
  Save,
  Send,
  ShieldAlert,
  Sparkles,
  Trophy,
  X,
} from 'lucide-react'
import { mockExams, type Exam, type Question } from '@/data/edtechData'

export default function ExamTakingPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  // Find active exam
  const exam: Exam = mockExams.find((e) => e.id === id) || mockExams[0]

  // State
  const [currentIdx, setCurrentIdx] = useState<number>(0)
  const [answers, setAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>({})
  const [markedForReview, setMarkedForReview] = useState<Set<number>>(new Set())
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(exam.durationMinutes * 60)
  const [tabWarnings, setTabWarnings] = useState<number>(0)
  const [showWarningModal, setShowWarningModal] = useState<boolean>(false)
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false)
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const [earnedScore, setEarnedScore] = useState<number>(0)

  const currentQ: Question = exam.questions[currentIdx] || exam.questions[0]
  const totalQuestions = exam.questions.length

  // Countdown timer
  useEffect(() => {
    if (isSubmitted) return
    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleFinalSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [isSubmitted])

  // Anti-Cheat Tab Switch Detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !isSubmitted) {
        setTabWarnings((prev) => {
          const next = prev + 1
          setShowWarningModal(true)
          return next
        })
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [isSubmitted])

  // Format time
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  // Answer selection
  const handleSelectOption = (opt: 'A' | 'B' | 'C' | 'D') => {
    setAnswers((prev) => ({ ...prev, [currentIdx]: opt }))
  }

  // Clear answer
  const handleClearAnswer = () => {
    setAnswers((prev) => {
      const copy = { ...prev }
      delete copy[currentIdx]
      return copy
    })
  }

  // Toggle Mark for Review
  const handleToggleReview = () => {
    setMarkedForReview((prev) => {
      const copy = new Set(prev)
      if (copy.has(currentIdx)) {
        copy.delete(currentIdx)
      } else {
        copy.add(currentIdx)
      }
      return copy
    })
  }

  // Grade & Final Submit
  const handleFinalSubmit = useCallback(() => {
    let score = 0
    exam.questions.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswer) {
        score += q.points
      }
    })
    setEarnedScore(score)
    setIsSubmitted(true)
    setShowSubmitModal(false)
  }, [answers, exam.questions])

  const answeredCount = Object.keys(answers).length
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100)
  const isTimeCritical = timeLeftSeconds < 120

  // ----------------------------------------------------
  // SUBMISSION COMPLETED VIEW
  // ----------------------------------------------------
  if (isSubmitted) {
    const passed = earnedScore >= exam.passingMarks
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 text-center shadow-xl shadow-slate-200/50 space-y-6"
        >
          <div
            className={`mx-auto flex h-20 w-20 items-center justify-center rounded-3xl shadow-lg ${
              passed
                ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-emerald-500/30'
                : 'bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-amber-500/30'
            }`}
          >
            {passed ? <Trophy className="h-10 w-10" /> : <AlertTriangle className="h-10 w-10" />}
          </div>

          <div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-wider ${
                passed ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}
            >
              {passed ? 'Assessment Passed' : 'Needs Retake'}
            </span>
            <h2 className="mt-3 text-2xl font-extrabold text-slate-900">{exam.title}</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Your test has been automatically graded and logged to your academic transcript.
            </p>
          </div>

          {/* Score Card */}
          <div className="grid grid-cols-3 gap-3 rounded-2xl bg-slate-50 border border-slate-200/80 p-4">
            <div>
              <p className="text-xs font-semibold text-slate-500">Your Score</p>
              <p className="text-xl font-extrabold text-blue-600">
                {earnedScore} / {exam.totalMarks}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Percentage</p>
              <p className="text-xl font-extrabold text-slate-900">
                {Math.round((earnedScore / exam.totalMarks) * 100)}%
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Pass Mark</p>
              <p className="text-xl font-extrabold text-slate-700">{exam.passingMarks} pts</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/results')}
              className="flex-1 rounded-xl bg-blue-600 py-3 text-xs sm:text-sm font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-all"
            >
              View Detailed Answer Review
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="rounded-xl border border-slate-200 px-5 py-3 text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Return to Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  // ----------------------------------------------------
  // DISTRACTION-FREE EXAM TAKING INTERFACE
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* 1. Distraction-Free Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md px-4 sm:px-8 py-3.5">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (confirm('Are you sure you want to leave? Your progress will be retained.')) {
                  navigate('/exams')
                }
              }}
              className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              title="Exit Exam"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                  {exam.subject}
                </span>
                <span className="hidden sm:inline text-xs text-slate-400">· Proctored Online Assessment</span>
              </div>
              <h1 className="text-sm sm:text-base font-extrabold text-slate-900 truncate max-w-md">
                {exam.title}
              </h1>
            </div>
          </div>

          {/* Right Status: Countdown Timer & Auto-Save */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Auto-Saved
            </div>

            <div
              className={`flex items-center gap-2 rounded-xl px-3 sm:px-4 py-1.5 font-mono text-xs sm:text-sm font-extrabold border transition-colors ${
                isTimeCritical
                  ? 'border-red-300 bg-red-50 text-red-600 animate-pulse'
                  : 'border-slate-200 bg-slate-50 text-slate-800'
              }`}
            >
              <Clock className="h-4 w-4 text-slate-500" />
              {formatTime(timeLeftSeconds)}
            </div>

            <button
              type="button"
              onClick={() => setShowSubmitModal(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 sm:px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 active:scale-95 transition-all"
            >
              <Send className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Submit Exam</span>
              <span className="sm:hidden">Submit</span>
            </button>
          </div>
        </div>

        {/* Live Progress Bar */}
        <div className="mx-auto max-w-7xl mt-3">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-1">
            <span>
              Progress: {answeredCount} of {totalQuestions} answered ({progressPercent}%)
            </span>
            <span>{totalQuestions - answeredCount} Remaining</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </header>

      {/* 2. Main Content Grid (Question Area + Question Navigator) */}
      <div className="mx-auto max-w-7xl w-full flex-1 p-4 sm:p-6 lg:p-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* ======================================================== */}
        {/* MAIN QUESTION CARD (8 Cols)                              */}
        {/* ======================================================== */}
        <div className="lg:col-span-8 flex flex-col justify-between space-y-6">
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6 flex-1 flex flex-col justify-between"
          >
            <div>
              {/* Question Header Meta */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-blue-600 text-xs font-extrabold text-white">
                    {currentIdx + 1}
                  </span>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Question {currentIdx + 1} of {totalQuestions}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      currentQ.difficulty === 'Easy'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : currentQ.difficulty === 'Medium'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}
                  >
                    {currentQ.difficulty}
                  </span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-700">
                    {currentQ.points} Points
                  </span>
                </div>
              </div>

              {/* Question Text */}
              <div className="py-6">
                <p className="text-sm sm:text-base md:text-lg font-semibold text-slate-900 leading-relaxed">
                  {currentQ.questionText}
                </p>
              </div>

              {/* Options Radio List */}
              <div className="space-y-3">
                {(['A', 'B', 'C', 'D'] as const).map((optKey) => {
                  const isSelected = answers[currentIdx] === optKey
                  return (
                    <button
                      key={optKey}
                      type="button"
                      onClick={() => handleSelectOption(optKey)}
                      className={`w-full flex items-center gap-3.5 rounded-2xl p-4 text-left text-xs sm:text-sm transition-all border ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/60 shadow-sm font-bold text-blue-900 ring-2 ring-blue-600/10'
                          : 'border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-white text-slate-800'
                      }`}
                    >
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                          isSelected ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {optKey}
                      </span>
                      <span className="flex-1">{currentQ.options[optKey]}</span>
                      {isSelected && <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0" />}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-6 mt-6">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleToggleReview}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold border transition-colors ${
                    markedForReview.has(currentIdx)
                      ? 'border-amber-400 bg-amber-50 text-amber-700'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Bookmark className="h-3.5 w-3.5" />
                  {markedForReview.has(currentIdx) ? 'Marked for Review' : 'Mark for Review'}
                </button>

                {answers[currentIdx] && (
                  <button
                    type="button"
                    onClick={handleClearAnswer}
                    className="inline-flex items-center gap-1 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-400 hover:text-slate-700"
                  >
                    <RotateCcw className="h-3 w-3" /> Clear Selection
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={currentIdx === 0}
                  onClick={() => setCurrentIdx((prev) => prev - 1)}
                  className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" /> Previous
                </button>

                {currentIdx < totalQuestions - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentIdx((prev) => prev + 1)}
                    className="inline-flex items-center gap-1 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700"
                  >
                    Next <ChevronRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(true)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-sm shadow-emerald-500/20"
                  >
                    <CheckCircle2 className="h-4 w-4" /> Submit Exam
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* ======================================================== */}
        {/* SIDEBAR: QUESTION PALETTE & STATUS (4 Cols)              */}
        {/* ======================================================== */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
            <h3 className="text-sm font-bold text-slate-900">Question Navigator</h3>

            {/* Question Numbers Grid */}
            <div className="grid grid-cols-5 gap-2.5">
              {exam.questions.map((_, idx) => {
                const isCurrent = currentIdx === idx
                const isAnswered = answers[idx] !== undefined
                const isMarked = markedForReview.has(idx)

                let bgColor = 'bg-slate-100 text-slate-600 border-slate-200'
                if (isCurrent) {
                  bgColor = 'ring-2 ring-blue-600 bg-blue-600 text-white font-extrabold border-transparent'
                } else if (isMarked) {
                  bgColor = 'bg-amber-100 text-amber-800 border-amber-300 font-bold'
                } else if (isAnswered) {
                  bgColor = 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold'
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentIdx(idx)}
                    className={`flex h-10 w-full items-center justify-center rounded-xl text-xs border transition-all hover:scale-105 ${bgColor}`}
                  >
                    {idx + 1}
                  </button>
                )
              })}
            </div>

            {/* Status Legend */}
            <div className="border-t border-slate-100 pt-4 space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-md bg-emerald-100 border border-emerald-300" />
                <span>Answered ({answeredCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-md bg-amber-100 border border-amber-300" />
                <span>Marked for Review ({markedForReview.size})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-md bg-slate-100 border border-slate-200" />
                <span>Unvisited ({totalQuestions - answeredCount})</span>
              </div>
            </div>

            {/* Exam Quick Meta */}
            <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Total Marks:</span>
                <span className="font-bold text-slate-800">{exam.totalMarks} pts</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Passing Requirement:</span>
                <span className="font-bold text-slate-800">{exam.passingMarks} pts</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Integrity Warnings:</span>
                <span className="font-bold text-amber-600">{tabWarnings} / 3</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowSubmitModal(true)}
              className="w-full rounded-xl bg-blue-600 py-3 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-all"
            >
              Finish & Submit Assessment
            </button>
          </div>
        </div>
      </div>

      {/* Anti-Cheat Tab Switch Warning Modal */}
      <AnimatePresence>
        {showWarningModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-md rounded-3xl bg-white p-6 text-center shadow-2xl space-y-4"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
                <ShieldAlert className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">Anti-Cheat Warning #{tabWarnings}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tab switching or leaving the examination window was detected. All tab changes are recorded in the instructor proctor log.
              </p>
              <button
                type="button"
                onClick={() => setShowWarningModal(false)}
                className="w-full rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white hover:bg-slate-800"
              >
                I Understand, Return to Exam
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Final Submit Confirmation Modal */}
      <AnimatePresence>
        {showSubmitModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-7 shadow-2xl space-y-5"
            >
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <Send className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Submit Examination</h3>
                  <p className="text-xs text-slate-500">Confirm final grading submission</p>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600">Answered Questions:</span>
                  <span className="font-bold text-emerald-600">{answeredCount} of {totalQuestions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Unanswered Questions:</span>
                  <span className="font-bold text-red-600">{totalQuestions - answeredCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Marked for Review:</span>
                  <span className="font-bold text-amber-600">{markedForReview.size}</span>
                </div>
              </div>

              <p className="text-xs text-slate-500">
                Are you sure you want to finalize your submission? You cannot modify answers after submission.
              </p>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Continue Reviewing
                </button>
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  className="flex-1 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700"
                >
                  Yes, Submit Now
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
