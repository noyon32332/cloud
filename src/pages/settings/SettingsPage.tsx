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
        <section className="panel-card p-5 sm:p-6">
          <span className="eyebrow">Account Preferences</span>
          <h1 className="mt-1 text-lg font-bold text-slate-900">Platform Settings</h1>
          <p className="mt-0.5 text-xs font-medium text-slate-500">
            Manage profile details, notification triggers, and user role perspective.
          </p>
        </section>

        {savedSuccess && (
          <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200/60 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            Profile settings updated!
          </div>
        )}

        {/* Role Toggle Card */}
        <div className="panel-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                <Users className="h-4.5 w-4.5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">Active Workspace Role</h3>
                <p className="text-[11px] font-medium text-slate-400">Operating in {user?.role || 'student'} mode</p>
              </div>
            </div>

            <button
              type="button"
              onClick={toggleRole}
              className="rounded-lg border border-slate-200/80 bg-white px-3.5 py-1.5 text-xs font-semibold text-blue-600 transition-colors hover:bg-slate-50"
            >
              Switch to {isTeacher ? 'Student' : 'Teacher'} Role
            </button>
          </div>
          <p className="text-[11px] font-medium leading-relaxed text-slate-500">
            Role switching toggles dashboard metrics, exam permissions, and builder tools.
          </p>
        </div>

        {/* Profile Details Form */}
        <form onSubmit={handleSave} className="panel-card space-y-4 p-5">
          <h3 className="flex items-center gap-2 border-b border-slate-100 pb-3 text-xs font-bold text-slate-900">
            <User className="h-4 w-4 text-blue-600" />
            Personal Profile
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="field-label">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label className="field-label">Academic Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label className="field-label">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="input-field"
              />
            </div>

            <div>
              <label className="field-label">User ID</label>
              <input
                type="text"
                disabled
                value={user?.studentTeacherId || 'EDU-98421'}
                className="input-field cursor-not-allowed bg-slate-100 text-slate-500"
              />
            </div>
          </div>

          <div>
            <label className="field-label">Academic Bio</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Academic interests or department..."
              className="input-area"
            />
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={handleSave}
              className="btn-primary"
            >
              <Save className="h-3.5 w-3.5" />
              Save Changes
            </button>
          </div>
        </form>

        {/* Notifications & Security */}
        <div className="panel-card space-y-3 p-5">
          <h3 className="flex items-center gap-2 border-b border-slate-100 pb-3 text-xs font-bold text-slate-900">
            <Bell className="h-4 w-4 text-blue-600" />
            System Notifications & Security
          </h3>

          <div className="space-y-2.5">
            <label className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-100 bg-slate-50/70 p-3">
              <div>
                <p className="text-xs font-semibold text-slate-900">Exam Deadline Reminders</p>
                <p className="text-[10px] text-slate-400">Receive alerts 24h before test close</p>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="h-4 w-4 rounded accent-blue-600"
              />
            </label>

            <label className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-100 bg-slate-50/70 p-3">
              <div>
                <p className="text-xs font-semibold text-slate-900">Proctoring Warnings</p>
                <p className="text-[10px] text-slate-400">Chime on tab switch detection</p>
              </div>
              <input
                type="checkbox"
                checked={proctoringSound}
                onChange={(e) => setProctoringSound(e.target.checked)}
                className="h-4 w-4 rounded accent-blue-600"
              />
            </label>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}