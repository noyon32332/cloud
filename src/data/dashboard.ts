import type { LucideIcon } from 'lucide-react'
import {
  Award,
  Bell,
  BookOpen,
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  FileText,
  FolderOpen,
  ListChecks,
  MessageSquare,
  Trophy,
  UserPlus,
} from 'lucide-react'

export type TrendDirection = 'up' | 'down'

export interface StatCardData {
  id: string
  label: string
  value: number
  prefix?: string
  suffix?: string
  decimals?: number
  icon: LucideIcon
  gradient: string
  glow: string
  trend: {
    value: string
    direction: TrendDirection
    note: string
  }
  path?: string
}

export const statCards: StatCardData[] = [
  {
    id: 'attendance',
    label: 'Attendance',
    value: 94,
    suffix: '%',
    icon: CalendarCheck,
    gradient: 'from-green-600 to-emerald-700',
    glow: 'shadow-green-600/40',
    trend: { value: '+3%', direction: 'up', note: 'vs last month' },
  },
  {
    id: 'gpa',
    label: 'GPA',
    value: 3.72,
    decimals: 2,
    icon: Award,
    gradient: 'from-teal-500 to-green-600',
    glow: 'shadow-teal-500/40',
    trend: { value: '+0.2', direction: 'up', note: 'vs last term' },
  },
  {
    id: 'messages',
    label: 'Messages',
    value: 24,
    icon: MessageSquare,
    gradient: 'from-emerald-600 to-green-700',
    glow: 'shadow-emerald-600/40',
    trend: { value: '+8', direction: 'up', note: 'unread' },
    path: '/chat',
  },
  {
    id: 'notifications',
    label: 'Notifications',
    value: 8,
    icon: Bell,
    gradient: 'from-green-500 to-teal-500',
    glow: 'shadow-green-500/40',
    trend: { value: '-3', direction: 'down', note: 'cleared today' },
  },
  {
    id: 'exams',
    label: 'Assigned Exams',
    value: 8,
    icon: CheckCircle2,
    gradient: 'from-blue-600 to-indigo-600',
    glow: 'shadow-blue-600/40',
    trend: { value: '3 pending', direction: 'up', note: 'due this week' },
    path: '/exams',
  },
]

export interface QuickActionData {
  id: string
  label: string
  icon: LucideIcon
  gradient: string
  path?: string
}

export const quickActions: QuickActionData[] = [
  { id: 'exams', label: 'Take Exam', icon: CheckCircle2, gradient: 'from-blue-500 to-indigo-600', path: '/exams' },
  { id: 'builder', label: 'Exam Builder', icon: BookOpen, gradient: 'from-sky-500 to-blue-600', path: '/exams/builder' },
  { id: 'courses', label: 'My Courses', icon: ListChecks, gradient: 'from-indigo-500 to-purple-600', path: '/courses' },
  { id: 'results', label: 'View Results', icon: Trophy, gradient: 'from-emerald-500 to-teal-600', path: '/results' },
  { id: 'analytics', label: 'Analytics', icon: Award, gradient: 'from-amber-500 to-orange-600', path: '/analytics' },
]

export interface ClassItem {
  id: string
  course: string
  time: string
  room: string
  status: 'ongoing' | 'next' | 'upcoming'
  accent: string
}

export const todayClasses: ClassItem[] = [
  { id: 'c1', course: 'Advanced Mathematics', time: '09:00 - 10:30', room: 'Room 204', status: 'ongoing', accent: 'from-green-500 to-emerald-500' },
  { id: 'c2', course: 'Physics Lab', time: '11:00 - 12:30', room: 'Lab 3', status: 'next', accent: 'from-emerald-500 to-teal-500' },
  { id: 'c3', course: 'Computer Science', time: '14:00 - 15:30', room: 'Room 110', status: 'upcoming', accent: 'from-teal-500 to-green-600' },
]

export interface NotificationItem {
  id: string
  title: string
  description: string
  time: string
  unread: boolean
  accent: string
  icon: LucideIcon
}

export const notifications: NotificationItem[] = [
  { id: 'n1', title: 'Assignment feedback', description: 'Prof. Rahman commented on your Data Structures submission.', time: '2m ago', unread: true, accent: 'bg-green-500', icon: MessageSquare },
  { id: 'n2', title: 'Quiz result published', description: 'Your Physics quiz score is now available.', time: '1h ago', unread: true, accent: 'bg-emerald-500', icon: FileText },
  { id: 'n3', title: 'New course material', description: 'Lecture notes for Advanced Mathematics uploaded.', time: '3h ago', unread: true, accent: 'bg-teal-500', icon: BookOpen },
  { id: 'n4', title: 'Certificate earned', description: 'You earned the Python Basics certificate.', time: '1d ago', unread: false, accent: 'bg-green-600', icon: Award },
]

export interface ActivityItem {
  id: string
  title: string
  description: string
  time: string
  icon: LucideIcon
  accent: string
}

export const recentActivities: ActivityItem[] = [
  { id: 'act1', title: 'Assignment Submitted', description: 'Data Structures Project · Computer Science', time: '25 min ago', icon: FileText, accent: 'from-green-500 to-emerald-500' },
  { id: 'act2', title: 'Teacher Feedback', description: 'Prof. Rahman left feedback on your quiz.', time: '1 hour ago', icon: MessageSquare, accent: 'from-emerald-500 to-teal-500' },
  { id: 'act3', title: 'Quiz Completed', description: 'Physics · Module 3 scored 18/20', time: '3 hours ago', icon: CheckCircle2, accent: 'from-teal-500 to-green-600' },
  { id: 'act4', title: 'Course Joined', description: 'Advanced Mathematics · Semester 5', time: 'Yesterday', icon: BookOpen, accent: 'from-green-600 to-emerald-600' },
  { id: 'act5', title: 'Certificate Earned', description: 'Python Basics · Verified', time: '2 days ago', icon: Award, accent: 'from-emerald-600 to-teal-600' },
]

export interface ProgressItem {
  id: string
  label: string
  value: number
  detail: string
  gradient: string
}

export const progressItems: ProgressItem[] = [
  { id: 'p1', label: 'Course Completion', value: 78, detail: '12 of 15 modules', gradient: 'from-green-500 to-emerald-500' },
  { id: 'p2', label: 'Attendance', value: 92, detail: '24 of 26 classes', gradient: 'from-emerald-500 to-teal-500' },
  { id: 'p3', label: 'Assignment Completion', value: 65, detail: '13 of 20 submitted', gradient: 'from-teal-500 to-green-600' },
  { id: 'p4', label: 'Study Goal', value: 54, detail: '27 of 50 hours', gradient: 'from-green-600 to-emerald-600' },
]

export interface StudyHourDatum {
  day: string
  hours: number
}

export const studyHours: StudyHourDatum[] = [
  { day: 'Mon', hours: 4 },
  { day: 'Tue', hours: 3 },
  { day: 'Wed', hours: 5 },
  { day: 'Thu', hours: 2 },
  { day: 'Fri', hours: 6 },
  { day: 'Sat', hours: 4.5 },
  { day: 'Sun', hours: 3.5 },
]

export interface AssignmentTrendDatum {
  week: string
  submitted: number
  pending: number
}

export const assignmentTrend: AssignmentTrendDatum[] = [
  { week: 'W1', submitted: 4, pending: 2 },
  { week: 'W2', submitted: 6, pending: 3 },
  { week: 'W3', submitted: 5, pending: 1 },
  { week: 'W4', submitted: 8, pending: 2 },
  { week: 'W5', submitted: 10, pending: 1 },
]

export interface AttendanceDatum {
  week: string
  rate: number
}

export const attendanceData: AttendanceDatum[] = [
  { week: 'Week 1', rate: 82 },
  { week: 'Week 2', rate: 88 },
  { week: 'Week 3', rate: 86 },
  { week: 'Week 4', rate: 92 },
  { week: 'Week 5', rate: 94 },
  { week: 'Week 6', rate: 91 },
]

export interface PerformanceDatum {
  subject: string
  score: number
}

export const performanceData: PerformanceDatum[] = [
  { subject: 'Math', score: 88 },
  { subject: 'Physics', score: 82 },
  { subject: 'CS', score: 94 },
  { subject: 'English', score: 76 },
  { subject: 'Chem', score: 71 },
]

export interface CalendarEvent {
  day: number
  color: string
}

export const calendarEvents: CalendarEvent[] = [
  { day: 4, color: 'bg-green-500' },
  { day: 8, color: 'bg-emerald-500' },
  { day: 12, color: 'bg-teal-500' },
  { day: 16, color: 'bg-green-600' },
  { day: 22, color: 'bg-emerald-600' },
  { day: 27, color: 'bg-teal-600' },
]

export interface DeadlineItem {
  id: string
  title: string
  date: string
  daysLeft: number
  urgency: 'urgent' | 'soon' | 'normal'
}

export const deadlines: DeadlineItem[] = [
  { id: 'd1', title: 'Physics Lab Report', date: 'Aug 04', daysLeft: 2, urgency: 'urgent' },
  { id: 'd2', title: 'Data Structures Project', date: 'Aug 05', daysLeft: 3, urgency: 'soon' },
  { id: 'd3', title: 'Calculus Problem Set', date: 'Aug 09', daysLeft: 7, urgency: 'normal' },
]
