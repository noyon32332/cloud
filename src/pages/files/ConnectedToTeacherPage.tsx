import { UserRoundCheck, MessagesSquare } from 'lucide-react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'

export default function ConnectedToTeacherPage() {
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
                <UserRoundCheck className="h-10 w-10" />
              </div>

              {/* Title */}
              <h2 className="mt-7 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                কি হলো? Teacher-এর সাথে যোগাযোগ করুন
              </h2>

              {/* Supporting text */}
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-blue-100/90 sm:text-base">
                যেকোনো সমস্যা, প্রশ্ন বা প্রয়োজনীয় সহায়তার জন্য আপনার শিক্ষকের সাথে যোগাযোগ করুন।
              </p>

              {/* Contact button → opens Google Meet */}
              <a
                href="https://meet.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="group/btn mt-9 inline-flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-2xl bg-white px-6 py-4 text-lg font-bold text-blue-700 shadow-lg shadow-blue-900/20 transition-all hover:bg-blue-50 active:scale-[0.98]"
              >
                <MessagesSquare className="h-6 w-6 transition-transform duration-300 group-hover/btn:scale-110" />
                Contact Teacher
              </a>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}