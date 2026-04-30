import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { AuthGuard } from '@/components/auth/AuthGuard'

// Landing page (has its own full layout)
import LandingPage from '@/pages/LandingPage'

// Auth pages (have their own full-screen layouts)
import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage'

// Course pages
import CourseBrowserPage from '@/pages/courses/CourseBrowserPage'

// Student pages
import DashboardPage from '@/pages/student/DashboardPage'
import MyCoursesPage from '@/pages/student/MyCoursesPage'

// Utility pages
import NotFoundPage from '@/pages/NotFoundPage'
import UnauthorizedPage from '@/pages/UnauthorizedPage'

export default function App() {
  return (
    <Routes>
      {/* ── Full-page routes (own layout) ── */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* ── App routes with shared layout ── */}
      <Route element={<AppLayout />}>
        <Route path="/courses" element={<CourseBrowserPage />} />

        {/* Student */}
        <Route
          path="/student/dashboard"
          element={
            <AuthGuard roles={['student']}>
              <DashboardPage />
            </AuthGuard>
          }
        />
        <Route
          path="/student/courses"
          element={
            <AuthGuard roles={['student']}>
              <MyCoursesPage />
            </AuthGuard>
          }
        />

        {/* Error pages */}
        <Route path="/403" element={<UnauthorizedPage />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
