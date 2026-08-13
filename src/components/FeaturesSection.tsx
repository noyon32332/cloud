import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import {
  Cloud, Users, CheckSquare, FileUp, MessageSquare,
  Calendar, BarChart3, Bell, HardDrive, ShieldCheck,
} from 'lucide-react'

const features = [
  { icon: Cloud, title: 'Cloud File Sharing', desc: 'Share files seamlessly with your team through secure cloud storage.' },
  { icon: Users, title: 'Study Groups', desc: 'Create and manage study groups for better collaborative learning.' },
  { icon: CheckSquare, title: 'Task Management', desc: 'Organize tasks, set deadlines, and track progress efficiently.' },
  { icon: FileUp, title: 'Assignment Submission', desc: 'Submit and grade assignments with a streamlined digital workflow.' },
  { icon: MessageSquare, title: 'Real-time Chat', desc: 'Communicate instantly with your team through built-in messaging.' },
  { icon: Calendar, title: 'Shared Calendar', desc: 'Coordinate schedules and never miss an important deadline.' },
  { icon: BarChart3, title: 'Progress Dashboard', desc: 'Visualize your academic progress with detailed analytics.' },
  { icon: Bell, title: 'Notifications', desc: 'Stay informed with smart, customizable notifications.' },
  { icon: HardDrive, title: 'Cloud Storage', desc: 'Securely store all your academic files in the cloud.' },
  { icon: ShieldCheck, title: 'Secure Authentication', desc: 'Enterprise-grade security to protect your data and privacy.' },
]

export default function FeaturesSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="features" className="py-12 sm:py-16 lg:py-28 bg-slate-50/50 dark:bg-slate-900/50">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 lg:mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-slate-950/50 text-sm font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/50 mb-4">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
            Everything you need to
            <br />
            <span className="bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">collaborate effectively</span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            A complete suite of tools designed to enhance academic collaboration and streamline project management.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="group flex flex-col p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 hover:border-emerald-300 dark:hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/5 dark:hover:shadow-emerald-500/5 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-slate-950/50 flex items-center justify-center mb-4 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/50 transition-colors shrink-0">
                <feature.icon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}