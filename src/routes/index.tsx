import { createBrowserRouter, Navigate } from 'react-router-dom'
import LandingPage from '@/pages/LandingPage'
import AuthLayout from '@/pages/auth/AuthLayout'
import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage'
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage'
import VerifyEmailPage from '@/pages/auth/VerifyEmailPage'
import AccountCreatedPage from '@/pages/auth/AccountCreatedPage'
import ProfileSetupPage from '@/pages/auth/ProfileSetupPage'
import DashboardPage from '@/pages/dashboard/DashboardPage'
import CoursesPage from '@/pages/courses/CoursesPage'
import ChaptersPage from '@/pages/chapters/ChaptersPage'
import ExamsListPage from '@/pages/exams/ExamsListPage'
import ExamBuilderPage from '@/pages/exams/ExamBuilderPage'
import ExamTakingPage from '@/pages/exams/ExamTakingPage'
import ResultsPage from '@/pages/results/ResultsPage'
import SettingsPage from '@/pages/settings/SettingsPage'
import CalendarPage from '@/pages/dashboard/CalendarPage'
import { ProtectedRoute, PublicRoute } from '@/routes/ProtectedRoute'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/login',
        element: (
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        ),
      },
      {
        path: '/register',
        element: (
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        ),
      },
      {
        path: '/forgot-password',
        element: (
          <PublicRoute>
            <ForgotPasswordPage />
          </PublicRoute>
        ),
      },
      {
        path: '/reset-password',
        element: (
          <PublicRoute>
            <ResetPasswordPage />
          </PublicRoute>
        ),
      },
      {
        path: '/verify-email',
        element: <VerifyEmailPage />,
      },
      {
        path: '/account-created',
        element: (
          <PublicRoute>
            <AccountCreatedPage />
          </PublicRoute>
        ),
      },
      {
        path: '/profile-setup',
        element: (
          <ProtectedRoute>
            <ProfileSetupPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/courses',
    element: (
      <ProtectedRoute>
        <CoursesPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/chapters',
    element: (
      <ProtectedRoute>
        <ChaptersPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/exams',
    element: (
      <ProtectedRoute>
        <ExamsListPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/exams/builder',
    element: (
      <ProtectedRoute>
        <ExamBuilderPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/exams/take/:id',
    element: (
      <ProtectedRoute>
        <ExamTakingPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/results',
    element: (
      <ProtectedRoute>
        <ResultsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/results/:id',
    element: (
      <ProtectedRoute>
        <ResultsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/analytics',
    element: (
      <ProtectedRoute>
        <ResultsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/calendar',
    element: (
      <ProtectedRoute>
        <CalendarPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/settings',
    element: (
      <ProtectedRoute>
        <SettingsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <SettingsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/workspaces',
    element: <Navigate to="/courses" replace />,
  },
  {
    path: '/files',
    element: <Navigate to="/courses" replace />,
  },
])
