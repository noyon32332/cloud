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
import { db } from '@/lib/firebase'

export type EventPriority = 'low' | 'medium' | 'high'

export interface CalendarEventInput {
  title: string
  description: string
  startTime: string
  endTime: string
  priority: EventPriority
  color: string
}

export interface CalendarEvent extends CalendarEventInput {
  id: string
  uid: string
  createdAt: string
}

const COLLECTION = 'student_calendar_events'

function toISOString(value: unknown): string {
  if (!value) return new Date().toISOString()
  if (typeof value === 'object' && 'toDate' in value) {
    return (value as { toDate: () => Date }).toDate().toISOString()
  }
  return new Date(value as string | number | Date).toISOString()
}

function normalizePriority(value: unknown): EventPriority {
  if (value === 'low' || value === 'medium' || value === 'high') return value
  return 'medium'
}

function toCalendarEvent(id: string, data: Record<string, unknown>): CalendarEvent {
  return {
    id,
    uid: (data.uid as string) || '',
    title: (data.title as string) || 'Untitled',
    description: (data.description as string) || '',
    startTime: (data.startTime as string) || '',
    endTime: (data.endTime as string) || '',
    priority: normalizePriority(data.priority),
    color: (data.color as string) || '#6366f1',
    createdAt: toISOString(data.createdAt),
  }
}

export async function listStudentCalendarEvents(uid: string): Promise<CalendarEvent[]> {
  const q = query(collection(db, COLLECTION), where('uid', '==', uid))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((docSnap) => toCalendarEvent(docSnap.id, docSnap.data() as Record<string, unknown>))
}

export async function createCalendarEvent(uid: string, input: CalendarEventInput): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION), {
    uid,
    title: input.title,
    description: input.description,
    startTime: input.startTime,
    endTime: input.endTime,
    priority: input.priority,
    color: input.color,
    createdAt: serverTimestamp(),
  })
  return docRef.id
}

export async function updateCalendarEvent(eventId: string, input: CalendarEventInput): Promise<void> {
  await updateDoc(doc(db, COLLECTION, eventId), {
    title: input.title,
    description: input.description,
    startTime: input.startTime,
    endTime: input.endTime,
    priority: input.priority,
    color: input.color,
  })
}

export async function deleteCalendarEvent(eventId: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, eventId))
}
