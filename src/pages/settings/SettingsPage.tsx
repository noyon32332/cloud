import { useState } from 'react'
import {
  Bell,
  CheckCircle2,
  Save,
  User,
  Users,
} from 'lucide-react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { useAuth } from '@/contexts/AuthContext'

export default function SettingsPage() {
  const { user, updateUser, toggleRole } = useAuth()
  const [fullName, setFullName] = useState(user?.fullName || '')
  const [email, setEmail] = useState(user?.email || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [bio, setBio] = useState(user?.bio || '')
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [proctoringSound, setProctoringSound] = useState(true)
  const [savedSuccess, setSavedSuccess] = useState(false)

  const isTeacher = user?.role === 'teacher'

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (user) {
      updateUser({
        ...user,
        fullName,
        email,
        phone,
        bio,
      })
      setSavedSuccess(true)
      setTimeout(() => setSavedSuccess(false), 2500)
    }
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-3xl space-y-7">
        {/* Header */}
        <div className="rounded-xl border border-slate-200/60 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[9px] font-bold text-blue-700 uppercase tracking-wider">
            Account Preferences
          </span>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 mt-1">Platform Settings</h1>
          <p className="text-xs text-slate-500 font-medium">
            Manage profile details, notification triggers, and user role perspective.
          </p>
        </div>

        {savedSuccess && (
          <div className="rounded-xl border border-emerald-200/60 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 flex items-center gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            Profile settings updated!
          </div>
        )}

        {/* Role Toggle Card */}
        <div className="rounded-xl border border-slate-200/60 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                <Users className="h-4.5 w-4.5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">Active Workspace Role</h3>
                <p className="text-[11px] text-slate-400 font-medium">Operating in {user?.role || 'student'} mode</p>
              </div>
            </div>

            <button
              type="button"
              onClick={toggleRole}
              className="rounded-lg border border-slate-200/80 bg-slate-50 px-3.5 py-1.5 text-xs font-semibold text-blue-600 hover:bg-slate-100 transition-colors"
            >
              Switch to {isTeacher ? 'Student' : 'Teacher'} Role
            </button>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
            Role switching toggles dashboard metrics, exam permissions, and builder tools.
          </p>
        </div>

        {/* Profile Details Form */}
        <form onSubmit={handleSave} className="rounded-xl border border-slate-200/60 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-4">
          <h3 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <User className="h-4 w-4 text-blue-600" />
            Personal Profile
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-lg border border-slate-200/80 bg-slate-50/80 px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Academic Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-200/80 bg-slate-50/80 px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full rounded-lg border border-slate-200/80 bg-slate-50/80 px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">User ID</label>
              <input
                type="text"
                disabled
                value={user?.studentTeacherId || 'EDU-98421'}
                className="w-full rounded-lg border border-slate-200/80 bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Academic Bio</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Academic interests or department..."
              className="w-full rounded-lg border border-slate-200/80 bg-slate-50/80 p-3 text-xs font-medium text-slate-900 outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 active:scale-95 transition-all"
            >
              <Save className="h-3.5 w-3.5" />
              Save Changes
            </button>
          </div>
        </form>

        {/* Notifications & Security */}
        <div className="rounded-xl border border-slate-200/60 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-3">
          <h3 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Bell className="h-4 w-4 text-blue-600" />
            System Notifications & Security
          </h3>

          <div className="space-y-2.5">
            <label className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100 cursor-pointer">
              <div>
                <p className="text-xs font-semibold text-slate-900">Exam Deadline Reminders</p>
                <p className="text-[10px] text-slate-400">Receive alerts 24h before test close</p>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="h-4 w-4 rounded text-blue-600"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100 cursor-pointer">
              <div>
                <p className="text-xs font-semibold text-slate-900">Proctoring Warnings</p>
                <p className="text-[10px] text-slate-400">Chime on tab switch detection</p>
              </div>
              <input
                type="checkbox"
                checked={proctoringSound}
                onChange={(e) => setProctoringSound(e.target.checked)}
                className="h-4 w-4 rounded text-blue-600"
              />
            </label>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
