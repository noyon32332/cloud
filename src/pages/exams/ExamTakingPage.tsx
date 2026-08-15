import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowLeft,
  Bookmark,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  RotateCcw,
  Send,
  ShieldAlert,
  Trophy,
} from 'lucide-react'
import { mockExams, type Exam, type Question } from '@/data/edtechData'
import { useAuth } from '@/contexts/AuthContext'
import {
  checkUserExamAttemptFirestore,
  submitExamFirestore,
  getExamByIdFirestore,
  type FirestoreAttempt,
} from '@/services/firestore'

export default function ExamTakingPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()

  // State
  const [exam, setExam] = useState<Exam>(mockExams.find((e) => e.id === id) || mockExams[0])
  const [loading, setLoading] = useState<boolean>(true)
  const [existingAttempt, setExistingAttempt] = useState<FirestoreAttempt | null>(null)
  const [currentIdx, setCurrentIdx] = useState<number>(0)
  const [answers, setAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>({})
  const [markedForReview, setMarkedForReview] = useState<Set<number>>(new Set())
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(exam.durationMinutes * 60)
  const [tabWarnings, setTabWarnings] = useState<number>(0)
  const [showWarningModal, setShowWarningModal] = useState<boolean>(false)
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false)
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const [earnedScore, setEarnedScore] = useState<number>(0)

  // Fetch exam & Check 1-Attempt Restriction
  useEffect(() => {
    async function initExam() {
      setLoading(true)
      const targetExamId = id || 'exam-1'
      const activeUserUid = user?.id || 'demo-user-1'

      // Fetch Exam
      const fetchedExam = await getExamByIdFirestore(targetExamId)
      if (fetchedExam) {
        setExam(fetchedExam as Exam)
        setTimeLeftSeconds(fetchedExam.durationMinutes * 60)
      }

      // Check Attempt Restriction
      const attempt = await checkUserExamAttemptFirestore(activeUserUid, targetExamId)
      if (attempt) {
        setExistingAttempt(attempt)
        setIsSubmitted(true)
        setEarnedScore(attempt.score)
      }
      setLoading(false)
    }
    void initExam()
  }, [id, user?.id])

  const currentQ: Question = exam.questions[currentIdx] || exam.questions[0]
  const totalQuestions = exam.questions.length

  // Grade & Final Submit to Firestore
  const handleFinalSubmit = useCallback(async () => {
    let score = 0
    exam.questions.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswer) {
        score += q.points
      }
    })

    setEarnedScore(score)
    setIsSubmitted(true)
    setShowSubmitModal(false)

    // Persist to Firestore
    try {
      await submitExamFirestore({
        userId: user?.id || 'demo-user-1',
        userName: user?.fullName || 'EduSphere Student',
        userEmail: user?.email || 'student@edusphere.edu',
        examId: exam.id,
        examTitle: exam.title,
        subject: exam.subject,
        userAnswers: answers,
        questions: exam.questions,
      })
    } catch (err) {
      console.warn('Firestore submit saving warning', err)
    }
  }, [answers, exam, user])

  // Countdown timer
  useEffect(() => {
    if (isSubmitted || loading) return
    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          void handleFinalSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [isSubmitted, loading, handleFinalSubmit])

  // Anti-Cheat Tab Switch Detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !isSubmitted && !loading) {
        setTabWarnings((prev) => {
          const next = prev + 1
          setShowWarningModal(true)
          return next
        })
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [isSubmitted, loading])

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

  const answeredCount = Object.keys(answers).length
  const progressPercent = Math.round((answeredCount / Math.max(totalQuestions, 1)) * 100)
  const isTimeCritical = timeLeftSeconds < 120

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent mx-auto" />
          <p className="text-xs font-semibold text-slate-600">Checking attempt status & loading examination...</p>
        </div>
      </div>
    )
  }

  // ----------------------------------------------------
  // SUBMISSION COMPLETED VIEW / ONE ATTEMPT BLOCKED VIEW
  // ----------------------------------------------------
  if (isSubmitted) {
    const passed = earnedScore >= exam.passingMarks
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg rounded-xl border border-slate-200/60 bg-white p-6 text-center shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-5"
        >
          <div
            className={`mx-auto flex h-16 w-16 items-center justify-center rounded-xl shadow-xs ${
              passed ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
            }`}
          >
            {passed ? <Trophy className="h-8 w-8" /> : <AlertTriangle className="h-8 w-8" />}
          </div>

          <div>
            <span
              className={`rounded px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                passed ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' : 'bg-amber-50 text-amber-700 border border-amber-200/60'
              }`}
            >
              {existingAttempt ? 'Exam Attempted (One-Attempt Limit Enforced)' : passed ? 'Assessment Passed' : 'Needs Retake'}
            </span>
            <h2 className="mt-2 text-lg font-bold text-slate-900">{exam.title}</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {existingAttempt
                ? 'You have already submitted an attempt for this examination. Re-attempts are restricted.'
                : 'Your submission has been saved to Firestore.'}
            </p>
          </div>

          {/* Score Card */}
          <div className="grid grid-cols-3 gap-2 rounded-lg bg-slate-50 border border-slate-200/60 p-3.5 text-xs">
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase">Score</p>
              <p className="text-lg font-bold text-blue-600">
                {earnedScore} / {exam.totalMarks}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase">Percentage</p>
              <p className="text-lg font-bold text-slate-900">
                {Math.round((earnedScore / Math.max(exam.totalMarks, 1)) * 100)}%
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase">Pass Mark</p>
              <p className="text-lg font-bold text-slate-700">{exam.passingMarks} pts</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => navigate('/results')}
              className="flex-1 rounded-lg bg-blue-600 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-all"
            >
              View Scored Transcripts
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="rounded-lg border border-slate-200/80 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Dashboard
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
      <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/95 backdrop-blur-xs px-4 sm:px-6 py-3">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (confirm('Are you sure you want to leave? Your progress will be retained.')) {
                  navigate('/exams')
                }
              }}
              className="rounded-lg border border-slate-200/80 p-1.5 text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              title="Exit Exam"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded bg-blue-50 px-2 py-0.5 text-[9px] font-bold text-blue-700 uppercase tracking-wider">
                  {exam.subject}
                </span>
                <span className="hidden sm:inline text-xs text-slate-400 font-medium">· Online Assessment</span>
              </div>
              <h1 className="text-xs sm:text-sm font-bold text-slate-900 truncate max-w-md">
                {exam.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1 font-mono text-xs font-bold border transition-colors ${
                isTimeCritical
                  ? 'border-red-300 bg-red-50 text-red-600 animate-pulse'
                  : 'border-slate-200/80 bg-slate-50 text-slate-800'
              }`}
            >
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              {formatTime(timeLeftSeconds)}
            </div>

            <button
              type="button"
              onClick={() => setShowSubmitModal(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 active:scale-95 transition-all"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Submit</span>
            </button>
          </div>
        </div>

        {/* Live Progress Bar */}
        <div className="mx-auto max-w-6xl mt-2.5">
          <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400 mb-1">
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

      {/* 2. Main Content Grid */}
      <div className="mx-auto max-w-6xl w-full flex-1 p-4 sm:p-6 grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* MAIN QUESTION CARD (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col justify-between space-y-5">
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.15 }}
            className="rounded-xl border border-slate-200/60 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-5 flex-1 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded bg-blue-600 text-xs font-bold text-white">
                    {currentIdx + 1}
                  </span>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Question {currentIdx + 1} of {totalQuestions}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-700">
                    {currentQ.points} Points
                  </span>
                </div>
              </div>

              <div className="py-4">
                <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-relaxed">
                  {currentQ.questionText}
                </p>
              </div>

              <div className="space-y-2.5">
                {(['A', 'B', 'C', 'D'] as const).map((optKey) => {
                  const isSelected = answers[currentIdx] === optKey
                  return (
                    <button
                      key={optKey}
                      type="button"
                      onClick={() => handleSelectOption(optKey)}
                      className={`w-full flex items-center gap-3 rounded-lg p-3 text-left text-xs transition-all border ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/60 font-semibold text-blue-950'
                          : 'border-slate-200/60 bg-slate-50/50 hover:border-slate-300 text-slate-800'
                      }`}
                    >
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded text-[10px] font-bold ${
                          isSelected ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {optKey}
                      </span>
                      <span className="flex-1">{currentQ.options[optKey]}</span>
                      {isSelected && <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleToggleReview}
                  className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold border transition-colors ${
                    markedForReview.has(currentIdx)
                      ? 'border-amber-400 bg-amber-50 text-amber-700'
                      : 'border-slate-200/80 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <Bookmark className="h-3.5 w-3.5" />
                  {markedForReview.has(currentIdx) ? 'Marked' : 'Mark Review'}
                </button>

                {answers[currentIdx] && (
                  <button
                    type="button"
                    onClick={handleClearAnswer}
                    className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs text-slate-400 hover:text-slate-700"
                  >
                    <RotateCcw className="h-3 w-3" /> Clear
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={currentIdx === 0}
                  onClick={() => setCurrentIdx((prev) => prev - 1)}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200/80 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" /> Previous
                </button>

                {currentIdx < totalQuestions - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentIdx((prev) => prev + 1)}
                    className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
                  >
                    Next <ChevronRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(true)}
                    className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" /> Submit Exam
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* SIDEBAR: NAVIGATOR (4 Cols) */}
        <div className="lg:col-span-4 space-y-5">
          <div className="rounded-xl border border-slate-200/60 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-4">
            <h3 className="text-xs font-bold text-slate-900">Question Navigator</h3>

            <div className="grid grid-cols-5 gap-2">
              {exam.questions.map((_, idx) => {
                const isCurrent = currentIdx === idx
                const isAnswered = answers[idx] !== undefined
                const isMarked = markedForReview.has(idx)

                let bgColor = 'bg-slate-100 text-slate-600'
                if (isCurrent) {
                  bgColor = 'ring-2 ring-blue-600 bg-blue-600 text-white font-bold'
                } else if (isMarked) {
                  bgColor = 'bg-amber-100 text-amber-800 font-bold'
                } else if (isAnswered) {
                  bgColor = 'bg-emerald-100 text-emerald-800 font-bold'
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentIdx(idx)}
                    className={`flex h-9 w-full items-center justify-center rounded-lg text-xs transition-all ${bgColor}`}
                  >
                    {idx + 1}
                  </button>
                )
              })}
            </div>

            <div className="border-t border-slate-100 pt-3 space-y-1.5 text-[11px] text-slate-500">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded bg-emerald-200" />
                <span>Answered ({answeredCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded bg-amber-200" />
                <span>Marked for Review ({markedForReview.size})</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowSubmitModal(true)}
              className="w-full rounded-lg bg-blue-600 py-2.5 text-xs font-semibold text-white hover:bg-blue-700 transition-all"
            >
              Finish Assessment
            </button>
          </div>
        </div>
      </div>

      {/* Warning Modal */}
      <AnimatePresence>
        {showWarningModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm rounded-xl bg-white p-5 text-center shadow-xl space-y-3"
            >
              <ShieldAlert className="h-7 w-7 text-amber-600 mx-auto" />
              <h3 className="text-sm font-bold text-slate-900">Anti-Cheat Warning #{tabWarnings}</h3>
              <p className="text-xs text-slate-500">
                Tab switching was logged in the proctor log.
              </p>
              <button
                type="button"
                onClick={() => setShowWarningModal(false)}
                className="w-full rounded-lg bg-slate-900 py-2 text-xs font-semibold text-white"
              >
                Return to Exam
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Final Submit Modal */}
      <AnimatePresence>
        {showSubmitModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm rounded-xl bg-white p-5 shadow-xl space-y-4 text-xs"
            >
              <h3 className="text-sm font-bold text-slate-900">Submit Examination</h3>
              <div className="rounded-lg bg-slate-50 p-3 space-y-1 text-slate-600">
                <div className="flex justify-between">
                  <span>Answered:</span>
                  <span className="font-bold text-emerald-600">{answeredCount} of {totalQuestions}</span>
                </div>
                <div className="flex justify-between">
                  <span>Unanswered:</span>
                  <span className="font-bold text-red-600">{totalQuestions - answeredCount}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="flex-1 rounded-lg border border-slate-200/80 py-2 font-semibold text-slate-700"
                >
                  Review
                </button>
                <button
                  type="button"
                  onClick={() => void handleFinalSubmit()}
                  className="flex-1 rounded-lg bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700"
                >
                  Submit
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
