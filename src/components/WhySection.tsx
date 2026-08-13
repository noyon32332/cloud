import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Users, Shield, Globe, TrendingUp } from 'lucide-react'

const reasons = [
  {
    icon: Users,
    title: 'Easy Collaboration',
    desc: 'Work together seamlessly with real-time editing, messaging, and task management.',
    gradient: 'from-sky-500 to-teal-500',
  },
  {
    icon: Shield,
    title: 'Secure Cloud Platform',
    desc: 'Enterprise-grade security with encrypted data storage and secure authentication.',
    gradient: 'from-cyan-500 to-sky-500',
  },
  {
    icon: Globe,
    title: 'Anywhere Access',
    desc: 'Access your workspace from any device, anywhere in the world.',
    gradient: 'from-mint-500 to-cyan-500',
  },
  {
    icon: TrendingUp,
    title: 'Scalable Infrastructure',
    desc: 'Built on cloud infrastructure that scales with your needs.',
    gradient: 'from-sky-500 to-mint-500',
  },
]

export default function WhySection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="solutions" className="py-12 sm:py-16 lg:py-28 bg-slate-50/50 dark:bg-slate-900/50">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 lg:mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-sky-50 dark:bg-slate-950/50 text-sm font-semibold text-sky-600 dark:text-sky-400 border border-sky-200/50 dark:border-sky-800/50 mb-4">
            Why StudySphere
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
            Why choose
            <br />
            <span className="bg-gradient-to-r from-sky-600 to-teal-500 bg-clip-text text-transparent">StudySphere?</span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Built for the modern academic environment with features that matter.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((reason, i) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative p-7 rounded-2xl bg-white dark:bg-slate-800 border border-cyan-200/60 dark:border-cyan-700/60 hover:border-sky-300 dark:hover:border-sky-400 hover:shadow-xl hover:shadow-sky-500/5 dark:hover:shadow-sky-500/5 transition-all duration-300 overflow-hidden"
            >
              {/* Gradient Overlay on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${reason.gradient} flex items-center justify-center shadow-lg mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <reason.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">{reason.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{reason.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}