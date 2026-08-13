import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore'
import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage'
import { storage, db } from '@/lib/firebase'
import { getFileTypeInfo } from '@/lib/fileUtils'
import type { User } from '@/types'

export interface StudentFile {
  id: string
  fileName: string
  originalFileName: string
  fileType: string
  fileSize: number
  downloadURL: string
  storagePath: string
  uploadedBy: string
  uploadedAt: string
  studentName: string
  studentEmail: string
}

const COLLECTION = 'student_files'

function toStudentFile(id: string, data: Record<string, unknown>): StudentFile {
  const uploadedAtValue = data.uploadedAt
  return {
    id,
    fileName: (data.fileName as string) || 'Untitled',
    originalFileName: (data.originalFileName as string) || '',
    fileType: (data.fileType as string) || '',
    fileSize: (data.fileSize as number) || 0,
    downloadURL: (data.downloadURL as string) || '',
    storagePath: (data.storagePath as string) || '',
    uploadedBy: (data.uploadedBy as string) || '',
    uploadedAt: toISOString(uploadedAtValue),
    studentName: (data.studentName as string) || '',
    studentEmail: (data.studentEmail as string) || '',
  }
}

function toISOString(value: unknown): string {
  if (!value) return new Date().toISOString()
  if (typeof value === 'object' && 'toDate' in value) {
    return (value as { toDate: () => Date }).toDate().toISOString()
  }
  return new Date(value as string | number | Date).toISOString()
}

export async function listStudentFiles(uid: string): Promise<StudentFile[]> {
  const q = query(collection(db, COLLECTION), where('uploadedBy', '==', uid))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((docSnap) => toStudentFile(docSnap.id, docSnap.data() as Record<string, unknown>))
}

export interface UploadCallbacks {
  onProgress: (percent: number) => void
}

export async function uploadStudentFile(
  file: File,
  user: User,
  { onProgress }: UploadCallbacks
): Promise<StudentFile> {
  const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${file.name}`
  const path = `files/${user.id}/${uniqueName}`
  const ref = storageRef(storage, path)
  const uploadTask = uploadBytesResumable(ref, file)

  return new Promise<StudentFile>((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const percent = snapshot.totalBytes > 0 ? Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100) : 0
        onProgress(percent)
      },
      (error) => reject(error),
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
          const info = getFileTypeInfo(file.name)
          const docRef = await addDoc(collection(db, COLLECTION), {
            fileName: file.name,
            originalFileName: file.name,
            fileType: info.label,
            fileSize: file.size,
            downloadURL,
            storagePath: path,
            uploadedBy: user.id,
            uploadedAt: serverTimestamp(),
            studentName: user.fullName,
            studentEmail: user.email,
          })
          resolve({
            id: docRef.id,
            fileName: file.name,
            originalFileName: file.name,
            fileType: info.label,
            fileSize: file.size,
            downloadURL,
            storagePath: path,
            uploadedBy: user.id,
            uploadedAt: new Date().toISOString(),
            studentName: user.fullName,
            studentEmail: user.email,
          })
        } catch (error) {
          reject(error)
        }
      }
    )
  })
}

export async function renameStudentFile(fileId: string, newName: string): Promise<void> {
  const trimmed = newName.trim()
  if (!trimmed) throw new Error('File name cannot be empty.')
  await updateDoc(doc(db, COLLECTION, fileId), { fileName: trimmed, originalFileName: trimmed })
}

export async function deleteStudentFile(file: StudentFile): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, file.id))
  try {
    if (file.storagePath) {
      await deleteObject(storageRef(storage, file.storagePath))
    }
  } catch {
    // Storage object may already be gone; the Firestore record is authoritative.
  }
}

export function getFirestoreErrorMessage(error: unknown, fallback: string): string {
  const code = (error as { code?: string })?.code ?? ''
  const message = (error as Error)?.message ?? ''
  switch (code) {
    case 'storage/unauthorized':
      return 'You are not allowed to upload this file.'
    case 'storage/quota-exceeded':
      return 'Storage quota exceeded. Please try again later.'
    case 'storage/canceled':
      return 'Upload cancelled.'
    case 'permission-denied':
      return 'Permission denied. Please check your Firebase security rules.'
    case 'not-found':
      return 'File not found. It may have been removed.'
    default:
      return message || fallback
  }
}
