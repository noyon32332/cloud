import { FolderOpen, CloudUpload, Plus } from 'lucide-react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'

export default function MyStorageFilePage() {
  return (
    <DashboardLayout>
      <div className="flex flex-1 items-center justify-center py-12">
        <div className="w-full max-w-[620px]">
          <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-10 shadow-[0_28px_70px_-20px_rgba(30,64,175,0.45)] ring-1 ring-blue-400/30 sm:p-14">
            {/* Ambient accents */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-indigo-400/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-16 h-52 w-52 rounded-full bg-sky-300/20 blur-3xl" />

            <div className="relative flex flex-col items-center text-center">
              {/* Icon */}
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/15 text-white ring-1 ring-white/25 backdrop-blur-sm">
                <FolderOpen className="h-10 w-10" />
              </div>

              {/* Title */}
              <h2 className="mt-7 text-3xl font-bold tracking-tight text-white">My Storage</h2>

              {/* Main text */}
              <p className="mt-3 text-xl font-medium text-white">
                Don&apos;t worry, upload your file here
              </p>

              {/* Supporting text */}
              <p className="mt-2 max-w-md text-[15px] leading-relaxed text-blue-100/90">
                Your files will be safely stored and available whenever you need them.
              </p>

              {/* Upload area */}
              <div className="group mt-8 w-full cursor-pointer rounded-3xl border-2 border-dashed border-white/40 bg-white/10 p-8 backdrop-blur-sm transition-all hover:border-blue-200/80 hover:bg-white/20">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-white ring-1 ring-white/25 transition-transform duration-300 group-hover:scale-105">
                  <CloudUpload className="h-8 w-8" />
                </div>
                <p className="mt-4 text-lg font-bold text-white">Drop your file here</p>
                <p className="mt-1 text-sm font-medium text-blue-100/80">or</p>
                <p className="mt-1 text-sm font-semibold text-blue-100 underline decoration-white/40 underline-offset-4">
                  Browse Files
                </p>
              </div>

              {/* Upload button → opens Google Drive */}
              <a
                href="https://drive.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="group/btn mt-6 inline-flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-2xl bg-white px-6 py-4 text-lg font-bold text-blue-700 shadow-lg shadow-blue-900/20 transition-all hover:bg-blue-50 active:scale-[0.98]"
              >
                <Plus className="h-6 w-6 transition-transform duration-300 group-hover/btn:rotate-90" />
                Upload File
              </a>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}