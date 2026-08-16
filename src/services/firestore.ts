import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  deleteDoc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  type Timestamp,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { supabase, STUDENT_FILES_BUCKET } from '@/lib/supabase'
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

export interface FirestoreFile {
  id: string
  fileName: string
  fileUrl: string
  fileType: string
  fileSize: number // in bytes
  uploadedBy: string
  uploadedAt: any
  storagePath: string // Supabase Storage object path (for deletion)
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
// 5. Supabase Storage Upload & Firestore Metadata Management
// ----------------------------------------------------
export async function uploadFileToSupabase(
  file: File,
  userId: string,
  onProgress?: (progress: number) => void
): Promise<FirestoreFile> {
  const timestamp = Date.now()
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const storagePath = `${userId}/${timestamp}_${sanitizedName}`

  // ── Diagnostic: pre-upload state ─────────────────────────────────────────
  console.group('[Supabase Upload] Starting upload')
  console.log('FILE name       :', file.name)
  console.log('FILE type       :', file.type)
  console.log('FILE size       :', file.size, 'bytes')
  console.log('USER id         :', userId)
  console.log('STORAGE PATH    :', storagePath)
  console.log('BUCKET          :', STUDENT_FILES_BUCKET)
  console.log('SUPABASE URL    :', import.meta.env.VITE_SUPABASE_URL ?? '⛔ MISSING')
  console.log('KEY EXISTS      :', !!import.meta.env.VITE_SUPABASE_ANON_KEY)
  console.log('KEY LENGTH      :', (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.length ?? 0)

  // Probe: list all buckets — tells us if the client/key is working at all
  const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
  console.log('BUCKETS FOUND   :', buckets?.map((b) => b.name) ?? [])
  console.log('BUCKETS ERROR   :', bucketsError?.message ?? 'none')
  console.groupEnd()
  // ─────────────────────────────────────────────────────────────────────────

  onProgress?.(10)

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from(STUDENT_FILES_BUCKET)
    .upload(storagePath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type || 'application/octet-stream',
    })

  // ── Diagnostic: post-upload result ───────────────────────────────────────
  console.group('[Supabase Upload] Result')
  console.log('UPLOAD DATA     :', uploadData)
  console.log('UPLOAD ERROR    :', uploadError)
  console.groupEnd()
  // ─────────────────────────────────────────────────────────────────────────

  if (uploadError) {
    console.error('[Supabase Upload] ❌ FULL ERROR OBJECT:', uploadError)
    throw new Error(
      `Supabase Storage upload failed: ${uploadError.message}\n` +
      `\nDiagnosis hints:\n` +
      `  • "Invalid Compact JWS" → VITE_SUPABASE_ANON_KEY is missing/malformed in .env.local\n` +
      `  • "Bucket not found"    → Create bucket named "${STUDENT_FILES_BUCKET}" in Supabase Dashboard → Storage\n` +
      `  • "row violates RLS"   → Add INSERT policy for "anon" role on bucket "${STUDENT_FILES_BUCKET}"\n` +
      `  • "Unauthorized"       → Bucket is private; set it to Public or add anon INSERT policy`
    )
  }

  onProgress?.(80)

  // Generate a permanent public URL
  const { data: urlData } = supabase.storage
    .from(STUDENT_FILES_BUCKET)
    .getPublicUrl(storagePath)

  const fileUrl = urlData.publicUrl
  console.log('[Supabase Upload] ✅ Public URL:', fileUrl)

  const fileDocData = {
    fileName: file.name,
    fileUrl,
    fileType: file.type || file.name.split('.').pop() || 'unknown',
    fileSize: file.size,
    uploadedBy: userId,
    storagePath,
    uploadedAt: serverTimestamp(),
  }

  const filesCollection = collection(db, 'files')
  const docRef = await addDoc(filesCollection, fileDocData)

  onProgress?.(100)

  return {
    id: docRef.id,
    ...fileDocData,
  }
}

export async function getUserFilesFirestore(userId: string): Promise<FirestoreFile[]> {
  try {
    const filesRef = collection(db, 'files')
    const q = query(filesRef, where('uploadedBy', '==', userId))
    const snap = await getDocs(q)
    return snap.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as FirestoreFile))
  } catch (err) {
    console.warn('Firestore getUserFiles failed', err)
    return []
  }
}

export async function deleteFileFirestore(
  fileId: string,
  storagePath?: string
): Promise<void> {
  // Remove the object from Supabase Storage
  if (storagePath) {
    const { error } = await supabase.storage
      .from(STUDENT_FILES_BUCKET)
      .remove([storagePath])
    if (error) {
      console.warn('Supabase Storage delete error:', error.message)
    }
  }
  // Remove the Firestore metadata document
  const fileDocRef = doc(db, 'files', fileId)
  await deleteDoc(fileDocRef)
}

// ----------------------------------------------------
// 6. Seed Firestore with Initial EdTech Data
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
