import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { LayoutDashboard, MessageSquare, Kanban, BarChart3 } from 'lucide-react'

interface Tab {
  id: string
  label: string
  icon: typeof LayoutDashboard
  gradient: string
  border: string
  render: () => ReactNode
}

const tabs: Tab[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    gradient: 'from-sky-50 via-sky-100 to-sky-50/30',
    border: 'border-sky-200/50 dark:border-sky-700/30',
    render: () => (
      <div className="space-y-3 sm:space-y-4">
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {[
            { label: 'Active Tasks', value: '24', change: '+12%' },
            { label: 'Completed', value: '156', change: '+8%' },
            { label: 'Team Members', value: '12', change: '+3%' },
          ].map((s) => (
            <div key={s.label} className="p-2.5 sm:p-3 rounded-xl bg-white/60 dark:bg-slate-800/60 border border-cyan-200/50 dark:border-cyan-700/50">
              <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 truncate">{s.label}</p>
              <p className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-0.5 sm:mt-1">{s.value}</p>
              <p className="text-[10px] sm:text-xs text-emerald-500 font-medium mt-0.5">{s.change}</p>
            </div>
          ))}
        </div>
        <div className="h-24 sm:h-32 rounded-xl bg-white/60 dark:bg-slate-800/60 border border-cyan-200/30 dark:border-cyan-700/20 flex items-end p-2.5 sm:p-3 gap-1 sm:gap-1.5">
          {[40, 65, 45, 80, 55, 70, 90, 60, 75, 85, 50, 95].map((h) => (
            <div key={h} className="flex-1 rounded-t bg-gradient-to-t from-sky-100 to-sky-200 opacity-70" style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'chat',
    label: 'Chat',
    icon: MessageSquare,
    gradient: 'from-sky-50 via-sky-100 to-sky-50/30',
    border: 'border-sky-200/50 dark:border-sky-700/30',
    render: () => (
      <div className="space-y-2.5 sm:space-y-3">
        {[
          { from: 'Alex', text: 'Project deadline updated', time: '2m ago' },
          { from: 'Sarah', text: 'Files uploaded to shared folder', time: '5m ago' },
          { from: 'Mike', text: 'Great progress on the report!', time: '10m ago' },
        ].map((msg) => (
          <div key={msg.from} className="flex items-start gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-xl bg-white/60 dark:bg-slate-800/60 border border-cyan-200/50 dark:border-cyan-700/50">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-sky-500/20 flex items-center justify-center text-sky-600 text-[10px] sm:text-xs font-bold shrink-0">
              {msg.from[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">{msg.from}</span>
                <span className="text-[10px] sm:text-xs text-slate-400">{msg.time}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-0.5 truncate">{msg.text}</p>
            </div>
          </div>
        ))}
        <div className="flex items-center gap-2 p-2 rounded-xl bg-white/60 dark:bg-slate-800/60 border border-cyan-200/50 dark:border-cyan-700/50">
          <div className="flex-1 px-3 py-1.5 text-xs sm:text-sm text-slate-400">Type a message...</div>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-sky-500 flex items-center justify-center shrink-0">
            <span className="text-slate-900 dark:text-white text-[10px] sm:text-xs">Send</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'tasks',
    label: 'Task Board',
    icon: Kanban,
    gradient: 'from-sky-50 via-sky-100 to-sky-50/30',
    border: 'border-sky-200/50 dark:border-sky-700/30',
    render: () => (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
        {(['To Do', 'In Progress', 'Review', 'Done'] as const).map((col, i) => (
          <div key={col} className="space-y-2">
            <div className="flex items-center justify-between px-1.5 sm:px-2">
              <span className="text-[10px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">{col}</span>
              <span className="text-[10px] sm:text-xs text-slate-400 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded-full shrink-0">{[5, 3, 2, 8][i]}</span>
            </div>
            {Array.from({ length: Math.min([5, 3, 2, 8][i], 2) }).map((_, j) => (
              <div key={j} className="p-2 sm:p-2.5 rounded-lg bg-white/60 dark:bg-slate-800/60 border border-cyan-200/50 dark:border-cyan-700/50">
                <div className={`h-1 w-full rounded-full mb-1.5 sm:mb-2 ${['bg-sky-400', 'bg-teal-400', 'bg-cyan-400', 'bg-mint-400'][i]}`} />
                <div className="h-1.5 sm:h-2 w-3/4 rounded bg-slate-200 dark:bg-slate-600 mb-0.5 sm:mb-1" />
                <div className="h-1.5 sm:h-2 w-1/2 rounded bg-slate-200 dark:bg-slate-600" />
              </div>
            ))}
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    gradient: 'from-sky-50 via-sky-100 to-sky-50/30',
    border: 'border-sky-200/50 dark:border-sky-700/30',
    render: () => (
      <div className="space-y-3 sm:space-y-4">
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {[
            { label: 'Completion Rate', value: '87%' },
            { label: 'Avg. Response', value: '2.4h' },
            { label: 'Productivity', value: '94/100' },
          ].map((m) => (
            <div key={m.label} className="p-2.5 sm:p-3 rounded-xl bg-white/60 dark:bg-slate-800/60 border border-cyan-200/50 dark:border-cyan-700/50 text-center">
              <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 truncate">{m.label}</p>
              <p className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-0.5 sm:mt-1">{m.value}</p>
            </div>
          ))}
        </div>
        <div className="h-24 sm:h-32 rounded-xl bg-white/60 dark:bg-slate-800/60 border border-cyan-200/50 dark:border-cyan-700/50 flex items-center justify-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-6 sm:border-8 border-sky-500 border-t-teal-500 border-r-cyan-500 border-b-mint-500" />
        </div>
      </div>
    ),
  },
]

export default function ScreenshotSection() {
  const [activeTab, setActiveTab] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="py-12 sm:py-16 lg:py-28 bg-slate-50/50 dark:bg-slate-900/50 overflow-hidden">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 lg:mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-sky-50 dark:bg-slate-950/50 text-sm font-semibold text-sky-600 dark:text-sky-400 border border-sky-200/50 dark:border-sky-800/50 mb-4">
            Screenshots
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
            See it in
            <br />
            <span className="bg-gradient-to-r from-sky-600 to-teal-500 bg-clip-text text-transparent">action</span>
          </h2>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id === 'analytics' ? 3 : tab.id === 'tasks' ? 2 : tab.id === 'chat' ? 1 : 0)}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
                activeTab === 0
                  ? 'bg-sky-600 text-white shadow-lg shadow-sky-500/25'
                  : activeTab === 1
                    ? 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-cyan-200 dark:border-cyan-700 hover:border-sky-300 dark:hover:border-sky-400'
                    : activeTab === 2
                      ? 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-cyan-200 dark:border-cyan-700 hover:border-sky-300 dark:hover:border-sky-400'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-cyan-200 dark:border-cyan-700 hover:border-sky-300 dark:hover:border-sky-400'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
            </button>
          ))}
        </motion.div>

        {/* Laptop Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="relative max-w-4xl mx-auto"
        >
          <div className="relative overflow-hidden">
            {/* Screen */}
            <div className={`relative rounded-t-xl sm:rounded-t-2xl overflow-hidden bg-gradient-to-br ${tabs[activeTab].gradient} ${tabs[activeTab].border} border border-b-0 p-4 sm:p-6 lg:p-8`}>
              {/* Browser Bar */}
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-400" />
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-400" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-3 sm:px-6 py-1 rounded-lg bg-white/60 dark:bg-slate-700/60 text-[10px] sm:text-xs text-slate-400 truncate max-w-[200px] sm:max-w-none">
                    app.studysphere.cloud/${tabs[activeTab].id}
                  </div>
                </div>
              </div>

              {/* Content */}
              {tabs[activeTab].render()}
            </div>

            {/* Laptop Base */}
            <div className="h-3 sm:h-4 bg-gradient-to-b from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-700 rounded-b-xl" />
            <div className="h-2.5 sm:h-3 mx-auto w-[50%] sm:w-[60%] bg-gradient-to-b from-slate-400 to-slate-500 dark:from-slate-500 dark:to-slate-600 rounded-b-lg" />
          </div>

          {/* Glow */}
          <div className="absolute -inset-6 sm:-inset-8 bg-gradient-to-r from-sky-500/10 to-teal-500/10 rounded-3xl blur-3xl -z-10" />
        </motion.div>
      </div>
    </section>
  )
}