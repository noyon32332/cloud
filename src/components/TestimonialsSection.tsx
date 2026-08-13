import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Computer Science Student',
    avatar: 'S',
    gradient: 'from-sky-500 to-teal-500',
    rating: 5,
    text: 'StudySphere has completely transformed how our study group collaborates. The real-time chat and shared workspace features make group projects effortless.',
  },
  {
    name: 'Dr. James Wilson',
    role: 'Professor of Engineering',
    avatar: 'J',
    gradient: 'from-cyan-500 to-sky-500',
    rating: 5,
    text: 'As an educator, I appreciate the assignment submission and grading workflow. It saves me hours every week and the analytics help me track student engagement.',
  },
  {
    name: 'Maria Rodriguez',
    role: 'Academic Administrator',
    avatar: 'M',
    gradient: 'from-mint-500 to-cyan-500',
    rating: 5,
    text: 'The scalable infrastructure handles our entire institution of 5,000+ students without any issues. The security features give us complete peace of mind.',
  },
]

export default function TestimonialsSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="py-12 sm:py-16 lg:py-28 bg-[#65B3DC] dark:bg-[#65B3DC]">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative p-7 rounded-2xl bg-white dark:bg-slate-800 border border-cyan-200/60 dark:border-cyan-700/60 hover:border-sky-300 dark:hover:border-sky-400 hover:shadow-xl hover:shadow-sky-500/5 dark:hover:shadow-sky-500/5 transition-all duration-300"
            >
              <Quote className="w-8 h-8 text-sky-500/20 dark:text-sky-400/20 mb-4" />
              
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                ))}
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">{t.text}</p>

              <div className="flex items-center gap-3 pt-4 border-t border-cyan-100 dark:border-cyan-700/50">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white font-bold text-sm`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{t.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}