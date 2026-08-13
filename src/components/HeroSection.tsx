import { motion } from 'framer-motion'
import { ArrowRight, Play, Cloud, Users, CheckSquare, MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function HeroSection() {
  return (
    <section id="home" className="relative">
      {/* Full-width Hero Banner directly below Navigation */}
      <div className="w-full bg-[url('/images/studysphere-hero.png')] bg-no-repeat bg-center bg-contain object-cover object-bottom height-96 md:h-[500px] lg:h-[600px]">
        {/* Subtle bottom border referencing navbar color */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/20 dark:bg-slate-900/20" />
      </div>

      {/* Image description overlay */}
      <div className="absolute bottom-6 left-6 right-6 text-center">
        <p className="text-lg font-medium text-white dark:text-slate-200">
          <strong>StudySphere</strong>
        </p>
        <p className="text-sm text-slate-400 dark:text-slate-500">
          The academic collaboration platform
        </p>
      </div>

      {/* Floating accent elements - subtle and small */}
      <div className="absolute top-0 left-0 w-16 h-16 bg-emerald-500/5 rounded-3xl blur-xl -mt-8 hidden xl:block" />
      <div className="absolute bottom-0 right-0 w-16 h-16 bg-sky-500/5 rounded-full blur-xl -mr-8 hidden xl:block" />

      <div className="relative z-10">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 dark:bg-slate-950/50 border border-emerald-200/50 dark:border-emerald-800/50 mb-8 mx-6"
        >
          <span className="w-2 h-2 rounded-full emerald-500 animate-pulse" />
          <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
            Trusted by 120+ Institutions
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white leading-[1.1] tracking-tight mb-6 mx-6"
        >
          Collaborate Smarter.
          <br />
          <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 bg-clip-text text-transparent">
            Learn Better.
          </span>
          <br />
          Together.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-8 mx-6"
        >
          StudySphere is a cloud-based academic collaboration platform where students, teachers, and administrators can communicate, manage projects, share files, submit assignments, and collaborate from anywhere.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 mx-6"
        >
          <Link
            to="/register"
            className="group inline-flex items-center gap-2.5 px-7 py-3.5 text-base font-semibold text-white bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-2xl shadow-sm shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:from-emerald-600 hover:to-emerald-700 active:scale-95 transition-all duration-300"
          >
            Get Started Free
            <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="#features"
            onClick={(e) => {
              e.preventDefault()
              document.querySelector('#features')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="group inline-flex items-center gap-2.5 px-7 py-3.5 text-base font-semibold text-emerald-200 dark:text-emerald-700 bg-white dark:bg-slate-800 rounded-2xl shadow-sm shadow-emerald-200/20 dark:shadow-emerald-200/20 border border-emerald-200/20 dark:border-emerald-300 hover:border-emerald-400 dark:hover:border-emerald-500 hover:shadow-emerald-100 dark:hover:shadow-emerald-900/30 active:scale-95 transition-all duration-300"
          >
            <Play className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
            Live Demo
          </a>
        </motion.div>
      </div>
    </section>
  )
}