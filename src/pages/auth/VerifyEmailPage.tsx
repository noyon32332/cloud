import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle2, XCircle, Loader2, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'

type VerificationStatus = 'loading' | 'success' | 'error'

export default function VerifyEmailPage() {
  const { verifyEmail } = useAuth()
  const [searchParams] = useSearchParams()
  const code = searchParams.get('oobCode') || searchParams.get('token')
  const [status, setStatus] = useState<VerificationStatus>(code ? 'loading' : 'error')

  useEffect(() => {
    if (!code) {
      setStatus('error')
      return
    }

    verifyEmail(code)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'))
  }, [code, verifyEmail])

  if (status === 'loading') {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="border-0 shadow-2xl shadow-slate-200/30 dark:shadow-slate-900/30 backdrop-blur-xl bg-white/80 dark:bg-slate-800/80">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Verifying your email</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Please wait while we verify your email address...
            </p>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  if (status === 'success') {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="border-0 shadow-2xl shadow-slate-200/30 dark:shadow-slate-900/30 backdrop-blur-xl bg-white/80 dark:bg-slate-800/80">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Email verified!</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Your email has been verified successfully. You can now access all features of StudySphere.
            </p>
            <Link to="/login">
              <Button className="w-full">Sign in to your account</Button>
            </Link>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="border-0 shadow-2xl shadow-slate-200/30 dark:shadow-slate-900/30 backdrop-blur-xl bg-white/80 dark:bg-slate-800/80">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Verification failed</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            {code
              ? 'This verification link is invalid or has expired. Please request a new one.'
              : 'No verification link found. Please check your email for the correct link.'}
          </p>
          <div className="space-y-3">
            <Link to="/register">
              <Button className="w-full">Create new account</Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="w-4 h-4" />
                Back to login
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
