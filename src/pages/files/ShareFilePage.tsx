import { useRef, useState } from 'react'
import { Mail, Paperclip, Send, Share2, X } from 'lucide-react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'

function formatBytes(bytes: number, decimals = 2) {
  if (!bytes || bytes === 0) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

function buildGmailComposeUrl(fileName?: string) {
  const subject = fileName ? `Shared file: ${fileName}` : 'Shared file'
  const body = fileName
    ? `Hi,\n\nI've shared the following file with you: ${fileName}\n\nBest regards`
    : 'Hi,\n\nI\'ve shared a file with you.\n\nBest regards'
  return `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

export default function ShareFilePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const gmailUrl = buildGmailComposeUrl(selectedFile?.name)

  return (
    <DashboardLayout>
      <div className="flex flex-col">
        {/* Header */}
        <section className="panel-card p-5 sm:p-6">
          <span className="eyebrow">File Sharing</span>
          <h1 className="mt-1 text-lg font-bold text-slate-900">Share File</h1>
          <p className="mt-0.5 text-xs font-medium text-slate-500">
            Securely share your academic documents with others.
          </p>
        </section>

        {/* Centered Share Card */}
        <div className="flex flex-1 items-center justify-center py-12">
          <div className="w-full max-w-[560px]">
            <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-10 sm:p-12 shadow-[0_28px_70px_-20px_rgba(30,64,175,0.45)] ring-1 ring-blue-400/30">
              {/* Ambient accents */}
              <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-indigo-400/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-20 -left-16 h-52 w-52 rounded-full bg-sky-300/20 blur-3xl" />

              <div className="relative flex flex-col">
                {/* Icon + badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-white ring-1 ring-white/25 backdrop-blur-sm">
                    <Mail className="h-8 w-8" />
                  </div>
                  <span className="chip shrink-0 bg-white/15 text-white ring-1 ring-white/25">Recommended</span>
                </div>

                {/* Title + description */}
                <div className="mt-8 space-y-3">
                  <h3 className="text-3xl font-bold tracking-tight text-white">Share via Email</h3>
                  <p className="text-lg leading-relaxed text-blue-100">
                    Send this file securely through email.
                  </p>
                </div>

                {/* Select a file */}
                <div className="mt-8">
                  {selectedFile ? (
                    <div className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-lg shadow-blue-900/10">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <Paperclip className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-base font-semibold text-slate-800">{selectedFile.name}</p>
                        <p className="text-[13px] font-medium text-slate-400">{formatBytes(selectedFile.size)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedFile(null)}
                        className="p-2 text-slate-400 transition-colors hover:text-red-600"
                        title="Remove file"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex w-full items-center justify-center gap-2.5 rounded-2xl border-2 border-dashed border-white/40 bg-white/10 px-5 py-4 text-lg font-bold text-white backdrop-blur-sm transition-all hover:border-white/70 hover:bg-white/20"
                    >
                      <Paperclip className="h-6 w-6" />
                      Select a file to share
                    </button>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
                    className="hidden"
                  />
                </div>

                {/* Gmail button */}
                <a
                  href={gmailUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-5 inline-flex w-full items-center justify-center gap-2.5 rounded-2xl bg-white px-6 py-4 text-lg font-bold text-blue-700 shadow-lg shadow-blue-900/20 transition-all hover:bg-blue-50 active:scale-[0.98]"
                >
                  <Send className="h-6 w-6 transition-transform group-hover:translate-x-0.5" />
                  Open Gmail Compose
                </a>

                {/* Supporting text */}
                <p className="mt-4 text-center text-[15px] leading-relaxed text-blue-100/80">
                  Gmail opens in a new tab. Use the paperclip icon there to attach your file and send normally.
                  {selectedFile && (
                    <span> Your selected file: <strong className="font-semibold text-white">{selectedFile.name}</strong>.</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Info note */}
        <p className="flex items-center justify-center gap-1.5 pb-2 text-[13px] font-medium text-slate-400">
          <Share2 className="h-4 w-4" />
          More sharing options are coming soon.
        </p>
      </div>
    </DashboardLayout>
  )
}