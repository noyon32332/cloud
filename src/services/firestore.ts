import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  type Timestamp,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Question, Exam } from '@/data/edtechData'
import { mockExams, mockCourses, mockChapters } from '@/data/edtechData'

// Interfaces
export interface FirestoreUser {
  uid: string
  email: string
  fullName: string
  role: 'student' | 'teacher' | 'admin'
  studentTeacherId?: string
  avatar?: string
  bio?: string
  createdAt?: any
}

export interface FirestoreExam {
  id: string
  title: string
  subject: string
  courseId?: string
  chapterId?: string
  durationMinutes: number
  passingMarks: number
  totalMarks: number
  status: 'Published' | 'Draft' | 'Assigned'
  createdBy: string
  questions: Question[]
  createdAt?: any
}

export interface FirestoreAttempt {
  id?: string
  userId: string
  examId: string
  score: number
  totalMarks: number
  percentage: number
  passed: boolean
  userAnswers: Record<number, 'A' | 'B' | 'C' | 'D'>
  submittedAt: any
}

export interface FirestoreResult {
  id?: string
  userId: string
  userName: string
  userEmail: string
  examId: string
  examTitle: string
  subject: string
  score: number
  totalMarks: number
  percentage: number
  passed: boolean
  submittedAt: any
}

// ----------------------------------------------------
// 1. User Management
// ----------------------------------------------------
export async function saveUserToFirestore(user: FirestoreUser): Promise<void> {
  const userRef = doc(db, 'users', user.uid)
  await setDoc(userRef, {
    ...user,
    createdAt: serverTimestamp(),
  }, { merge: true })
}

export async function getUserFromFirestore(uid: string): Promise<FirestoreUser | null> {
  const userRef = doc(db, 'users', uid)
  const snap = await getDoc(userRef)
  if (snap.exists()) {
    return snap.data() as FirestoreUser
  }
  return null
}

// ----------------------------------------------------
// 2. Exam Management (Create, Publish, List, Seed)
// ----------------------------------------------------
export async function createExamFirestore(examData: Omit<FirestoreExam, 'id'>): Promise<string> {
  const examsRef = collection(db, 'exams')
  const docRef = await addDoc(examsRef, {
    ...examData,
    createdAt: serverTimestamp(),
  })

  // Save questions under questions subcollection or array
  const questionsRef = collection(db, 'questions')
  for (const q of examData.questions) {
    await addDoc(questionsRef, {
      ...q,
      examId: docRef.id,
      createdAt: serverTimestamp(),
    })
  }

  return docRef.id
}

export async function publishExamFirestore(examId: string): Promise<void> {
  const examRef = doc(db, 'exams', examId)
  await updateDoc(examRef, {
    status: 'Published',
    updatedAt: serverTimestamp(),
  })
}

export async function getExamsFirestore(): Promise<FirestoreExam[]> {
  try {
    const examsRef = collection(db, 'exams')
    const snap = await getDocs(examsRef)
    
    if (snap.empty) {
      // Seed initial data if Firestore collection is empty
      await seedInitialExamsFirestore()
      const reSnap = await getDocs(examsRef)
      return reSnap.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as FirestoreExam))
    }

    return snap.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as FirestoreExam))
  } catch (err) {
    console.warn('Firestore fetch failed, returning typed seed models', err)
    return mockExams as FirestoreExam[]
  }
}

export async function getExamByIdFirestore(examId: string): Promise<FirestoreExam | null> {
  try {
    const examRef = doc(db, 'exams', examId)
    const snap = await getDoc(examRef)
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() } as FirestoreExam
    }
  } catch (err) {
    console.warn('Firestore single exam fetch failed', err)
  }
  const fallback = mockExams.find((e) => e.id === examId) || mockExams[0]
  return fallback as FirestoreExam
}

// ----------------------------------------------------
// 3. One Attempt Restriction & Attempt Checking
// ----------------------------------------------------
export async function checkUserExamAttemptFirestore(userId: string, examId: string): Promise<FirestoreAttempt | null> {
  try {
    const attemptsRef = collection(db, 'attempts')
    const q = query(attemptsRef, where('userId', '==', userId), where('examId', '==', examId))
    const snap = await getDocs(q)
    if (!snap.empty) {
      const docSnap = snap.docs[0]
      return { id: docSnap.id, ...docSnap.data() } as FirestoreAttempt
    }
  } catch (err) {
    console.warn('Firestore attempt check failed', err)
  }
  return null
}

// ----------------------------------------------------
// 4. Submit Exam & Save Results
// ----------------------------------------------------
export async function submitExamFirestore(submission: {
  userId: string
  userName: string
  userEmail: string
  examId: string
  examTitle: string
  subject: string
  userAnswers: Record<number, 'A' | 'B' | 'C' | 'D'>
  questions: Question[]
}): Promise<{ attempt: FirestoreAttempt; result: FirestoreResult }> {
  // Calculate Score
  let score = 0
  let totalMarks = 0

  submission.questions.forEach((q, idx) => {
    totalMarks += q.points
    if (submission.userAnswers[idx] === q.correctAnswer) {
      score += q.points
    }
  })

  const percentage = Math.round((score / Math.max(totalMarks, 1)) * 100)
  const passed = percentage >= 50

  const attemptData: FirestoreAttempt = {
    userId: submission.userId,
    examId: submission.examId,
    score,
    totalMarks,
    percentage,
    passed,
    userAnswers: submission.userAnswers,
    submittedAt: serverTimestamp(),
  }

  const resultData: FirestoreResult = {
    userId: submission.userId,
    userName: submission.userName,
    userEmail: submission.userEmail,
    examId: submission.examId,
    examTitle: submission.examTitle,
    subject: submission.subject,
    score,
    totalMarks,
    percentage,
    passed,
    submittedAt: serverTimestamp(),
  }

  // Save to attempts collection
  const attemptsRef = collection(db, 'attempts')
  const attemptDoc = await addDoc(attemptsRef, attemptData)
  attemptData.id = attemptDoc.id

  // Save to results collection
  const resultsRef = collection(db, 'results')
  const resultDoc = await addDoc(resultsRef, resultData)
  resultData.id = resultDoc.id

  return { attempt: attemptData, result: resultData }
}

export async function getResultsFirestore(userId?: string): Promise<FirestoreResult[]> {
  try {
    const resultsRef = collection(db, 'results')
    const q = userId ? query(resultsRef, where('userId', '==', userId)) : resultsRef
    const snap = await getDocs(q)
    return snap.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as FirestoreResult))
  } catch (err) {
    console.warn('Firestore getResults failed', err)
    return []
  }
}

// ----------------------------------------------------
// 5. Seed Firestore with Initial EdTech Data
// ----------------------------------------------------
export async function seedInitialExamsFirestore(): Promise<void> {
  const examsRef = collection(db, 'exams')
  for (const exam of mockExams) {
    const examDocRef = doc(examsRef, exam.id)
    await setDoc(examDocRef, {
      ...exam,
      createdAt: serverTimestamp(),
    })
  }
}
