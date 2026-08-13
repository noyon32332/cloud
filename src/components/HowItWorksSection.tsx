import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { UserPlus, FolderPlus, UserCheck, Handshake, Trophy, ArrowRight } from 'lucide-react'

const steps = [
  { icon: UserPlus, title: 'Create Account', desc: 'Sign up in seconds with your institutional email.' },
  { icon: FolderPlus, title: 'Create Workspace', desc: 'Set up your team workspace and invite members.' },
  { icon: UserCheck, title: 'Invite Team', desc: 'Add classmates, teachers, and collaborators.' },
  { icon: Handshake, title: 'Collaborate', desc: 'Work together in real-time on projects.' },
  { icon: Trophy, title: 'Complete Project', desc: 'Deliver results and track achievements.' },
]

export default function HowItWorksSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="py-12 sm:py-16 lg:py-28 bg-white dark:bg-slate-900 overflow-hidden">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 lg:mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/50 text-sm font-semibold text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/50 mb-4">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
            Start collaborating in
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">5 simple steps</span>
          </h2>
        </motion.div>

        {/* Desktop: horizontal with connectors */}
        <div className="hidden md:grid md:grid-cols-5 gap-4 lg:gap-2 items-start">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative text-center group"
            >
              {/* Connector Arrow */}
              {i < steps.length - 1 && (
                <div className="absolute top-8 left-[calc(50%+2.5rem)] w-[calc(100%-2rem)] flex items-center justify-center z-10">
                  <div className="w-full flex items-center">
                    <div className="flex-1 h-px bg-gradient-to-r from-blue-300 to-blue-200 dark:from-blue-600 dark:to-blue-700/50" />
                    <ArrowRight className="w-4 h-4 text-blue-400 dark:text-blue-500 shrink-0 -ml-0.5" />
                  </div>
                </div>
              )}

              {/* Step Icon */}
              <div className="relative inline-flex mb-5">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-shadow">
                  <step.icon className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white dark:bg-slate-800 border-2 border-blue-500 flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{i + 1}</span>
                </div>
              </div>

              <h3 className="text-sm lg:text-base font-semibold text-slate-900 dark:text-white mb-2">{step.title}</h3>
              <p className="text-xs lg:text-sm text-slate-500 dark:text-slate-400 max-w-[180px] mx-auto leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Mobile: vertical list with connectors */}
        <div className="md:hidden space-y-0">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="flex gap-4"
            >
              {/* Vertical Line + Icon */}
              <div className="flex flex-col items-center">
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                    <step.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-white dark:bg-slate-800 border-2 border-blue-500 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">{i + 1}</span>
                  </div>
                </div>
                {i < steps.length - 1 && (
                  <div className="w-px flex-1 min-h-[2rem] bg-gradient-to-b from-blue-300 to-blue-100 dark:from-blue-600 dark:to-blue-800/30 my-2" />
                )}
              </div>

              {/* Content */}
              <div className={`flex-1 ${i < steps.length - 1 ? 'pb-8' : ''}`}>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">{step.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
