import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  confirmPasswordReset,
  applyActionCode,
  updateProfile as firebaseUpdateProfile,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  type User as FirebaseUser,
} from 'firebase/auth'
import { auth, googleAuthProvider } from '@/lib/firebase'
import type { User, LoginRequest, RegisterRequest } from '@/types'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (data: LoginRequest) => Promise<void>
  loginWithGoogle: () => Promise<void>
  register: (data: RegisterRequest) => Promise<{ message: string }>
  forgotPassword: (email: string) => Promise<void>
  resetPassword: (code: string, newPassword: string) => Promise<void>
  verifyEmail: (code: string) => Promise<void>
  logout: () => Promise<void>
  updateUser: (user: User) => void
  toggleRole: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const PROFILE_STORAGE_KEY = 'studysphere_profile'

function getStoredProfile(): Partial<User> | null {
  try {
    const stored = localStorage.getItem(PROFILE_STORAGE_KEY)
    return stored ? (JSON.parse(stored) as Partial<User>) : null
  } catch {
    return null
  }
}

function storeProfile(profile: Partial<User>) {
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile))
}

function toAppUser(firebaseUser: FirebaseUser): User {
  const stored = getStoredProfile()
  return {
    id: firebaseUser.uid,
    fullName: firebaseUser.displayName || stored?.fullName || '',
    email: firebaseUser.email || stored?.email || '',
    phone: stored?.phone || '',
    role: stored?.role || 'student',
    studentTeacherId: stored?.studentTeacherId || '',
    avatar: firebaseUser.photoURL || stored?.avatar || undefined,
    bio: stored?.bio,
    skills: stored?.skills,
    isEmailVerified: firebaseUser.emailVerified,
    createdAt: firebaseUser.metadata?.creationTime || new Date().toISOString(),
  }
}

const APP_ORIGIN = typeof window !== 'undefined' ? window.location.origin : ''

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser ? toAppUser(firebaseUser) : null)
      setIsLoading(false)
    })
    return unsubscribe
  }, [])

  const login = useCallback(async (data: LoginRequest) => {
    try {
      await setPersistence(auth, data.rememberMe ? browserLocalPersistence : browserSessionPersistence)
    } catch {
      // Persistence errors are non-fatal; fall back to the default persistence
    }
    await signInWithEmailAndPassword(auth, data.email, data.password)
  }, [])

  const loginWithGoogle = useCallback(async () => {
    await signInWithPopup(auth, googleAuthProvider)
  }, [])

  const register = useCallback(async (data: RegisterRequest) => {
    const { fullName, email, password, phone, studentTeacherId, role } = data
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    await firebaseUpdateProfile(userCredential.user, { displayName: fullName })
    storeProfile({ fullName, email, phone, role, studentTeacherId })
    setUser(toAppUser(userCredential.user))
    try {
      await sendEmailVerification(userCredential.user, {
        url: `${APP_ORIGIN}/verify-email`,
        handleCodeInApp: true,
      })
    } catch {
      // Verification email failures should not block account creation
    }
    return { message: 'Account created successfully. Please verify your email to activate your account.' }
  }, [])

  const forgotPassword = useCallback(async (email: string) => {
    await sendPasswordResetEmail(auth, email, {
      url: `${APP_ORIGIN}/reset-password`,
      handleCodeInApp: true,
    })
  }, [])

  const resetPassword = useCallback(async (code: string, newPassword: string) => {
    await confirmPasswordReset(auth, code, newPassword)
  }, [])

  const verifyEmail = useCallback(async (code: string) => {
    await applyActionCode(auth, code)
  }, [])

  const logout = useCallback(async () => {
    await signOut(auth)
    setUser(null)
  }, [])

  const updateUser = useCallback((updatedUser: User) => {
    storeProfile(updatedUser)
    setUser(updatedUser)
  }, [])

  const toggleRole = useCallback(() => {
    setUser((prev) => {
      if (!prev) return null
      const nextRole = prev.role === 'teacher' ? 'student' : 'teacher'
      const updated = { ...prev, role: nextRole as 'student' | 'teacher' }
      storeProfile(updated)
      return updated
    })
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginWithGoogle,
        register,
        forgotPassword,
        resetPassword,
        verifyEmail,
        logout,
        updateUser,
        toggleRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
