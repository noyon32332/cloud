import { useState, type ReactNode } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Sidebar from '@/components/dashboard/Sidebar'
import Topbar from '@/components/dashboard/Topbar'
import { cn } from '@/lib/utils'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    void logout()
  }

  return (
    <div className="flex min-h-screen bg-emerald-50 text-emerald-950 dark:bg-emerald-950 dark:text-emerald-50">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-green-500/10 blur-3xl dark:bg-green-500/5" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl dark:bg-emerald-500/5" />
        <div className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-teal-500/5 blur-3xl dark:bg-teal-500/3" />
      </div>

      {/* Sidebar - takes real layout space */}
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onLogout={handleLogout}
        user={user}
      />

      {/* Main content area - takes remaining width */}
      <div className="relative flex min-w-0 flex-1 flex-col">
        <Topbar
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((prev) => !prev)}
          onOpenMobileMenu={() => setMobileOpen(true)}
          user={user}
          onLogout={handleLogout}
        />
        <main className="flex min-w-0 flex-1 flex-col px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  )
}
