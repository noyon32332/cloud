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
    <section id="features" className="py-12 sm:py-16 lg:py-28 bg-[#65B3DC]">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 lg:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#14532D] mb-4">
            Everything you need to
            <br />
            <span className="text-emerald-400">{'collaborate effectively'}</span>
          </h2>
          <p className="text-lg text-[#6F8F7A] max-w-2xl mx-auto">
            A complete suite of tools designed to enhance academic collaboration and streamline project management.
          </p>
        </motion.div>

        {/* Timeline & Features */}
        <div className="relative flex flex-col-reverse lg:flex-row gap-8 lg:gap-12 pt-12 pb-6">
          {/* Green timeline line */}
          <div className="flex-1 flex justify-center lg:justify-start pt-6">
            <div className="w-1.5 bg-emerald-500 rounded-full opacity-60 blur-sm transition-opacity duration-500 group-hover:opacity-100 shadow-emerald-500/20" />
            <div className="absolute -top-6 -left-1 w-6 h-6 bg-white border-2 border-emerald-500 rounded-full flex items-center justify-center text-emerald-500 text-xs font-bold shadow-emerald-500/20">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M8 12l4 4L16 12" />
              </svg>
            </div>
          </div>

          {/* Feature Cards - alternating left/right */}
          <div className="flex-1 flex flex-col lg:flex-row gap-6 pt-4">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.7, delay: i * 0.1, type: 'spring' }}
                className="flex flex-col flex-1 min-w-0"
              >
                <div className="rounded-2xl bg-white border border-[#C8F3E4] transition-all duration-300 hover:border-emerald-300 hover:shadow-lg">
                  <div className="w-14 h-14 rounded-xl bg-[#E8FFF8] border border-emerald-500/30 flex items-center justify-center mb-4 group-hover:border-emerald-400 transition-colors">
                    <feature.icon className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-base font-medium text-[#14532D] mb-2 flex-1">{feature.title}</h3>
                  <p className="text-sm text-[#6F8F7A] leading-relaxed flex-1">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}