import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Server, Database, Zap, Shield, Cloud, Lock, HardDrive, Cpu } from 'lucide-react'

const technologies = [
  { icon: Server, name: 'AWS EC2', desc: 'Elastic compute power' },
  { icon: HardDrive, name: 'AWS S3', desc: 'Scalable object storage' },
  { icon: Zap, name: 'AWS Lambda', desc: 'Serverless computing' },
  { icon: Database, name: 'MongoDB Atlas', desc: 'NoSQL database' },
  { icon: Cloud, name: 'Firebase', desc: 'Real-time backend' },
  { icon: Lock, name: 'JWT Auth', desc: 'Secure authentication' },
  { icon: Shield, name: 'Cloud Storage', desc: 'Encrypted file storage' },
  { icon: Cpu, name: 'Cloud Security', desc: 'Enterprise-grade security' },
]

export default function CloudTechnologySection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="py-12 sm:py-16 lg:py-28 bg-slate-50/50 dark:bg-slate-900/50">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 lg:mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/50 text-sm font-semibold text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/50 mb-4">
            Technology Stack
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
            Powered by
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">modern cloud technology</span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Built on industry-leading cloud infrastructure for reliability, performance, and security.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
          {technologies.map((tech, i) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="group p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-xl hover:shadow-blue-500/5 dark:hover:shadow-blue-500/5 transition-all duration-300 text-center hover:-translate-y-1"
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/30 flex items-center justify-center group-hover:from-blue-100 group-hover:to-blue-200 dark:group-hover:from-blue-900/50 dark:group-hover:to-blue-800/30 transition-colors">
                <tech.icon className="w-7 h-7 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">{tech.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{tech.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
