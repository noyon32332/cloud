import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle2, ArrowRight, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function AccountCreatedPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="border-0 shadow-2xl shadow-slate-200/30 dark:shadow-slate-900/30 backdrop-blur-xl bg-white/80 dark:bg-slate-800/80">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Account created!</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Your account has been created successfully. Please check your email to verify your account.
          </p>

          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-800/50 mb-6">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
              <div className="text-left">
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Verify your email</p>
                <p className="text-xs text-blue-600/70 dark:text-blue-400/70 mt-0.5">
                  We&apos;ve sent a verification link to your email address. Click the link to activate your account.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Link to="/verify-email">
              <Button className="w-full">
                Go to Email Verification
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" className="w-full">
                Sign in instead
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
