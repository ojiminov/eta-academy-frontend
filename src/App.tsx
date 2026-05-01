import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthGuard } from '@/components/auth/AuthGuard'
import ERPLayout from '@/components/layout/ERPLayout'

// Auth pages
import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage'

// Admin pages
import AdminDashboard from '@/pages/admin/AdminDashboard'
import StudentsPage from '@/pages/admin/StudentsPage'
import TeachersPage from '@/pages/admin/TeachersPage'
import GroupsPage from '@/pages/admin/GroupsPage'
import SubjectsPage from '@/pages/admin/SubjectsPage'
import PaymentsPage from '@/pages/admin/PaymentsPage'
import AnnouncementsPage from '@/pages/admin/AnnouncementsPage'

// Teacher pages
import TeacherDashboard from '@/pages/teacher/TeacherDashboard'
import TeacherGroupsPage from '@/pages/teacher/TeacherGroupsPage'
import TeacherSessionsPage from '@/pages/teacher/TeacherSessionsPage'
import TeacherAttendancePage from '@/pages/teacher/TeacherAttendancePage'
import TeacherGradesPage from '@/pages/teacher/TeacherGradesPage'

// Student pages
import StudentDashboard from '@/pages/student/StudentDashboard'
import StudentGroupsPage from '@/pages/student/StudentGroupsPage'
import StudentGradesPage from '@/pages/student/StudentGradesPage'
import StudentPaymentsPage from '@/pages/student/StudentPaymentsPage'
import StudentAttendancePage from '@/pages/student/StudentAttendancePage'

// Utility pages
import NotFoundPage from '@/pages/NotFoundPage'
import UnauthorizedPage from '@/pages/UnauthorizedPage'

// Role-based home redirect
function RoleRedirect() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
  if (!token) return <Navigate to="/login" replace />
  return <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      {/* ── Root redirect ── */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* ── Auth pages ── */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* ── Admin Portal ── */}
      <Route
        element={
          <AuthGuard roles={['admin']}>
            <ERPLayout />
          </AuthGuard>
        }
      >
        <Route path="/admin/dashboard"      element={<AdminDashboard />} />
        <Route path="/admin/students"        element={<StudentsPage />} />
        <Route path="/admin/teachers"        element={<TeachersPage />} />
        <Route path="/admin/groups"          element={<GroupsPage />} />
        <Route path="/admin/subjects"        element={<SubjectsPage />} />
        <Route path="/admin/payments"        element={<PaymentsPage />} />
        <Route path="/admin/announcements"   element={<AnnouncementsPage />} />
        <Route path="/admin"                 element={<Navigate to="/admin/dashboard" replace />} />
      </Route>

      {/* ── Teacher Portal ── */}
      <Route
        element={
          <AuthGuard roles={['teacher']}>
            <ERPLayout />
          </AuthGuard>
        }
      >
        <Route path="/teacher/dashboard"  element={<TeacherDashboard />} />
        <Route path="/teacher/groups"     element={<TeacherGroupsPage />} />
        <Route path="/teacher/sessions"   element={<TeacherSessionsPage />} />
        <Route path="/teacher/attendance" element={<TeacherAttendancePage />} />
        <Route path="/teacher/grades"     element={<TeacherGradesPage />} />
        <Route path="/teacher"            element={<Navigate to="/teacher/dashboard" replace />} />
      </Route>

      {/* ── Student Portal ── */}
      <Route
        element={
          <AuthGuard roles={['student']}>
            <ERPLayout />
          </AuthGuard>
        }
      >
        <Route path="/student/dashboard"  element={<StudentDashboard />} />
        <Route path="/student/groups"     element={<StudentGroupsPage />} />
        <Route path="/student/grades"     element={<StudentGradesPage />} />
        <Route path="/student/payments"   element={<StudentPaymentsPage />} />
        <Route path="/student/attendance" element={<StudentAttendancePage />} />
        <Route path="/student"            element={<Navigate to="/student/dashboard" replace />} />
      </Route>

      {/* ── Utility ── */}
      <Route path="/403" element={<UnauthorizedPage />} />
      <Route path="*"    element={<NotFoundPage />} />
    </Routes>
  )
}
