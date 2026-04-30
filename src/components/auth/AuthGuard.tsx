import React, { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import useAuthStore from '@/stores/authStore'
import { FullPageSpinner } from '@/components/ui/spinner'

interface AuthGuardProps {
  children: ReactNode
  roles?: string[]
}

export function AuthGuard({ children, roles }: AuthGuardProps) {
  const { isAuthenticated, isLoading, user } = useAuthStore()
  const location = useLocation()

  if (isLoading) {
    return <FullPageSpinner />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (roles && roles.length > 0 && user && !roles.includes(user.role)) {
    return <Navigate to="/403" replace />
  }

  return <>{children}</>
}
