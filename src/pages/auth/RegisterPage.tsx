import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, User, Phone, Hash, Loader2, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useAuth } from '@/contexts/AuthContext'
import { getFirebaseErrorMessage } from '@/lib/firebaseErrors'
import { usePasswordStrength } from '@/hooks/useAuth'

const registerSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  studentTeacherId: z.string().min(3, 'ID must be at least 3 characters'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
  role: z.enum(['student', 'teacher']),
  acceptTerms: z.literal(true),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register: registerUser } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [serverError, setServerError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { evaluate: evalStrength, getLabel, getColor, getPercent } = usePasswordStrength()

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'student', acceptTerms: undefined as unknown as true },
  })

  const password = watch('password')
  const role = watch('role')

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setValue('password', value, { shouldValidate: true })
    evalStrength(value)
  }

  const onSubmit = async (data: RegisterFormData) => {
    setServerError('')
    setIsSubmitting(true)
    try {
      const { confirmPassword: _, acceptTerms: __, ...submitData } = data
      await registerUser(submitData)
      navigate('/account-created')
    } catch (err: unknown) {
      setServerError(getFirebaseErrorMessage(err, 'Registration failed. Please try again.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="border-0 shadow-2xl shadow-slate-200/30 dark:shadow-slate-900/30 backdrop-blur-xl bg-white/80 dark:bg-slate-800/80">
        <CardContent className="p-6 sm:p-8">
          <div className="text-center mb-10">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <UserPlus className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Create your account</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">Join StudySphere today</p>
          </div>

          {serverError && (
            <div className="mb-6 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 text-sm text-red-600 dark:text-red-400 text-center">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
            {/* Full Name */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="fullName" className="leading-5">Full Name</Label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 z-10 w-5 h-5 text-slate-400" />
                <Input id="fullName" className="h-12 pl-11 pr-4" {...register('fullName')} />
              </div>
              {errors.fullName && <p className="text-xs text-red-500">{errors.fullName.message}</p>}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="email" className="leading-5">Email</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 z-10 w-5 h-5 text-slate-400" />
                <Input id="email" type="email" className="h-12 pl-11 pr-4" {...register('email')} />
              </div>
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="phone" className="leading-5">Phone Number</Label>
              <div className="relative">
                <Phone className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 z-10 w-5 h-5 text-slate-400" />
                <Input id="phone" type="tel" className="h-12 pl-11 pr-4" {...register('phone')} />
              </div>
              {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
            </div>

            {/* Student/Teacher ID */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="studentTeacherId" className="leading-5">Student / Teacher ID</Label>
              <div className="relative">
                <Hash className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 z-10 w-5 h-5 text-slate-400" />
                <Input id="studentTeacherId" className="h-12 pl-11 pr-4" {...register('studentTeacherId')} />
              </div>
              {errors.studentTeacherId && <p className="text-xs text-red-500">{errors.studentTeacherId.message}</p>}
            </div>

            {/* Role Selection */}
            <div className="flex flex-col gap-2">
              <Label className="leading-5">I am a</Label>
              <div className="grid grid-cols-2 gap-3">
                {(['student', 'teacher'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setValue('role', r, { shouldValidate: true })}
                    className={`h-11 w-full flex items-center justify-center rounded-xl border-2 text-sm font-semibold transition-all duration-200 capitalize ${
                      role === r
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-blue-300 dark:hover:border-blue-600'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
              {errors.role && <p className="text-xs text-red-500">{errors.role.message}</p>}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="password" className="leading-5">Password</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 z-10 w-5 h-5 text-slate-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="h-12 pl-11 pr-11"
                  onChange={handlePasswordChange}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 z-10 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors" tabIndex={-1} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}

              {/* Password Strength */}
              {password && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Password strength</span>
                    <span className={`text-xs font-medium ${
                      getPercent() <= 33 ? 'text-red-500' : getPercent() <= 66 ? 'text-yellow-500' : getPercent() <= 83 ? 'text-blue-500' : 'text-green-500'
                    }`}>{getLabel()}</span>
                  </div>
                  <Progress value={getPercent()} className="h-1.5" indicatorClassName={getColor()} />
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="confirmPassword" className="leading-5">Confirm Password</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 z-10 w-5 h-5 text-slate-400" />
                <Input
                  id="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  className="h-12 pl-11 pr-11"
                  {...register('confirmPassword')}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3.5 top-1/2 -translate-y-1/2 z-10 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors" tabIndex={-1} aria-label={showConfirm ? 'Hide password' : 'Show password'}>
                  {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
            </div>

            {/* Accept Terms */}
            <div className="flex items-start gap-3">
              <Checkbox
                id="acceptTerms"
                checked={!!watch('acceptTerms')}
                onCheckedChange={(checked) => setValue('acceptTerms', (checked === true) as true, { shouldValidate: true })}
                className="mt-0.5 shrink-0"
              />
              <Label htmlFor="acceptTerms" className="text-sm font-normal text-slate-600 dark:text-slate-400 cursor-pointer leading-6">
                I agree to the{' '}
                <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Privacy Policy</a>
              </Label>
            </div>
            {errors.acceptTerms && <p className="text-xs text-red-500">{errors.acceptTerms.message}</p>}

            {/* Submit */}
            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create account'
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-8">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-500 transition-colors">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </motion.div>
  )
}
