export type UserRole = 'student' | 'teacher' | 'admin'

export interface User {
  id: string
  fullName: string
  email: string
  phone: string
  role: UserRole
  studentTeacherId: string
  avatar?: string
  bio?: string
  skills?: string[]
  isEmailVerified: boolean
  createdAt: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface LoginRequest {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterRequest {
  fullName: string
  email: string
  phone: string
  password: string
  studentTeacherId: string
  role: 'student' | 'teacher'
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  password: string
  confirmPassword: string
}

export interface VerifyEmailRequest {
  token: string
}

export interface ProfileSetupRequest {
  avatar?: string
  bio?: string
  skills?: string[]
}

export interface AuthResponse {
  user: User
  tokens: AuthTokens
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message: string
}
