import api from './api'
import type {
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyEmailRequest,
  ProfileSetupRequest,
  AuthResponse,
  ApiResponse,
  User,
} from '@/types'

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', data)
    return response.data.data
  },

  async register(data: RegisterRequest): Promise<{ user: User; message: string }> {
    const response = await api.post<ApiResponse<{ user: User; message: string }>>('/auth/register', data)
    return response.data.data
  },

  async forgotPassword(data: ForgotPasswordRequest): Promise<{ message: string }> {
    const response = await api.post<ApiResponse<{ message: string }>>('/auth/forgot-password', data)
    return response.data.data
  },

  async resetPassword(data: ResetPasswordRequest): Promise<{ message: string }> {
    const response = await api.post<ApiResponse<{ message: string }>>('/auth/reset-password', data)
    return response.data.data
  },

  async verifyEmail(data: VerifyEmailRequest): Promise<{ message: string }> {
    const response = await api.post<ApiResponse<{ message: string }>>('/auth/verify-email', data)
    return response.data.data
  },

  async getProfile(): Promise<User> {
    const response = await api.get<ApiResponse<User>>('/auth/profile')
    return response.data.data
  },

  async updateProfile(data: ProfileSetupRequest): Promise<User> {
    const response = await api.put<ApiResponse<User>>('/auth/profile', data)
    return response.data.data
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout')
    } catch {
      // Ignore logout errors
    }
  },
}
