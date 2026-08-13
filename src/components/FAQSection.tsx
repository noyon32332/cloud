import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef, useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'

const faqs = [
  {
    q: 'What is StudySphere?',
    a: 'StudySphere is a cloud-based academic collaboration platform designed for students, teachers, and administrators. It provides tools for communication, project management, file sharing, assignment submission, and more — all in one secure platform.',
  },
  {
    q: 'How secure is it?',
    a: 'StudySphere uses enterprise-grade security including JWT authentication, encrypted data storage, HTTPS encryption in transit, and role-based access control. Your data is protected with the same standards used by Fortune 500 companies.',
  },
  {
    q: 'Can teachers create assignments?',
    a: 'Absolutely! Teachers can create, distribute, and grade assignments directly on the platform. They can set deadlines, attach resources, provide rubrics, and give feedback — all within a streamlined digital workflow.',
  },
  {
    q: 'Does it support teamwork?',
    a: 'Yes, teamwork is at the core of StudySphere. You can create study groups, shared workspaces, collaborate on documents in real-time, manage tasks together, and communicate through built-in chat and video features.',
  },
  {
    q: 'Is cloud storage included?',
    a: 'Yes, every account comes with generous cloud storage. Files are securely stored on AWS S3 infrastructure with automatic backups, versioning, and access controls. Storage scales with your institution\'s needs.',
  },
]

function FAQItem({ faq, isOpen, toggle }: { faq: typeof faqs[0]; isOpen: boolean; toggle: () => void }) {
  return (
    <div className="border border-cyan-200/60 dark:border-cyan-700/60 rounded-2xl overflow-hidden hover:border-sky-300 dark:hover:border-sky-400/50 transition-colors">
      <button
        onClick={toggle}
        className="w-full flex items-center justify-between p-5 text-left"
        aria-expanded={isOpen}
      >
        <span className="text-base font-semibold text-slate-900 dark:text-white pr-4">{faq.q}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0"
        >
          <ChevronDown className="w-5 h-5 text-slate-400" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-5 pb-5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-cyan-100 dark:border-cyan-700/50 pt-4">
              {faq.a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="about" className="py-12 sm:py-16 lg:py-28 bg-slate-50/50 dark:bg-slate-900/50">
      <div ref={ref} className="max-w-5xl mx-auto px-6 sm:px-10 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-50 dark:bg-slate-950/50 text-sm font-semibold text-sky-600 dark:text-sky-400 border border-sky-200/50 dark:border-sky-800/50 mb-4">
            <HelpCircle className="w-4 h-4" />
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
            Frequently asked
            <br />
            <span className="bg-gradient-to-r from-sky-600 to-teal-500 bg-clip-text text-transparent">questions</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-3"
        >
          {faqs.map((faq, i) => (
            <FAQItem
              key={i}
              faq={faq}
              isOpen={openIndex === i}
              toggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}