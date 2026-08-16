import { motion } from 'framer-motion'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import type { Course } from '@/data/edtechData'
import { cn } from '@/lib/utils'

const courses: Course[] = [
  {
    id: 'course-cloud',
    title: 'Cloud Computing',
    code: 'CC-301',
    subject: 'Cloud Computing',
    instructor: 'Dr. Priya Sharma',
    enrolledStudents: 168,
    progress: 55,
    totalChapters: 10,
    totalExams: 4,
    color: 'from-sky-500 to-cyan-600',
    description:
      'Foundations of cloud architecture, virtualization, service models, and scalable infrastructure delivery.',
  },
  {
    id: 'course-network',
    title: 'Network Computing',
    code: 'NC-302',
    subject: 'Network Computing',
    instructor: 'Prof. Daniel Brooks',
    enrolledStudents: 142,
    progress: 62,
    totalChapters: 9,
    totalExams: 5,
    color: 'from-indigo-500 to-violet-600',
    description:
      'Network protocols, distributed systems, routing, and secure communication fundamentals.',
  },
]

const cardConfig: Record<string, { link: string; gradient: string }> = {
  'course-cloud': {
    link: 'https://www.coursera.org/browse/information-technology/cloud-computing',
    gradient: 'from-blue-500 via-cyan-400 to-sky-300',
  },
  'course-network': {
    link: 'https://www.youtube.com/watch?v=fQbBPa0ADvs',
    gradient: 'from-indigo-600 via-violet-500 to-purple-400',
  },
}

export default function CoursesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-7">
        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
          {courses.map((course, index) => {
            const config = cardConfig[course.id] ?? { link: '', gradient: 'from-slate-500 to-slate-400' }
            const cardClasses = cn(
              'flex min-h-[330px] flex-col items-center justify-center rounded-2xl bg-gradient-to-br p-5 sm:p-6 shadow-lg transition-all duration-200 ease-out',
              config.gradient,
              'hover:-translate-y-1 hover:shadow-xl'
            )
            const content = (
              <h3 className="text-center text-2xl font-bold tracking-tight text-white sm:text-[26px]">{course.title}</h3>
            )
            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.06, ease: 'easeOut' }}
              >
                {config.link ? (
                  <a
                    href={config.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(cardClasses, 'block cursor-pointer')}
                  >
                    {content}
                  </a>
                ) : (
                  <div className={cardClasses}>{content}</div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </DashboardLayout>
  )
}