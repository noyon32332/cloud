import { useState, type ReactNode } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Sidebar from '@/components/dashboard/Sidebar'
import Topbar from '@/components/dashboard/Topbar'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    void logout()
  }

  return (
    <div className="flex min-h-screen overflow-x-clip bg-[#F8FAFC] text-[#0F172A]">
      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onLogout={handleLogout}
        user={user}
      />

      {/* Main content wrapper */}
      <div className="relative flex w-full min-w-0 flex-1 flex-col bg-[radial-gradient(ellipse_at_top_right,#EFF6FF_0%,rgba(248,250,252,0)_340px),#F8FAFC]">
        <Topbar
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((prev) => !prev)}
          onOpenMobileMenu={() => setMobileOpen(true)}
          user={user}
          onLogout={handleLogout}
        />
        <main className="flex min-h-[calc(100vh_-_3.5rem)] w-full max-w-full min-w-0 flex-1 flex-col p-4 pb-6 sm:p-6 sm:pb-8 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
