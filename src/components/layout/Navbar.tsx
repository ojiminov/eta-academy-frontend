import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { GraduationCap, Menu, X, ChevronDown, BookOpen, Award, LayoutDashboard, LogOut, Globe } from 'lucide-react'
import useAuthStore from '@/stores/authStore'
import { useI18n, Language } from '@/lib/i18n'
import { cn } from '@/lib/utils'

function getInitials(firstName: string, lastName: string) {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

function getDashboardPath(role: string): string {
  switch (role) {
    case 'student': return '/student/dashboard'
    case 'teacher': return '/teacher/dashboard'
    case 'admin': return '/admin/dashboard'
    default: return '/'
  }
}

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const { language, setLanguage, t } = useI18n()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const isLanding = location.pathname === '/'

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/')
    setDropdownOpen(false)
  }

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'uz' : 'en')
  }

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isLanding && !scrolled
          ? 'bg-transparent'
          : 'bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm',
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-all duration-300">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <span className={cn(
            'font-black text-xl tracking-tight',
            isLanding && !scrolled ? 'text-white' : 'gradient-text',
          )}>
            ETA Academy
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            to="/courses"
            className={cn(
              'text-sm font-medium px-4 py-2 rounded-xl transition-all duration-200',
              isLanding && !scrolled
                ? 'text-white/80 hover:text-white hover:bg-white/10'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
            )}
          >
            {t.nav.browseCourses}
          </Link>

          {/* Language toggle */}
          <button
            onClick={toggleLanguage}
            className={cn(
              'flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-xl transition-all duration-200',
              isLanding && !scrolled
                ? 'text-white/80 hover:text-white hover:bg-white/10'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
            )}
            title="Switch language"
          >
            <Globe className="h-4 w-4" />
            <span className="uppercase font-semibold">{language}</span>
          </button>

          {!isAuthenticated ? (
            <div className="flex items-center gap-2 ml-2">
              <Link
                to="/login"
                className={cn(
                  'text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-200',
                  isLanding && !scrolled
                    ? 'text-white hover:bg-white/10'
                    : 'text-gray-700 hover:bg-gray-100',
                )}
              >
                {t.nav.login}
              </Link>
              <Link
                to="/register"
                className="text-sm font-semibold px-5 py-2 rounded-xl gradient-bg text-white shadow-glow hover:shadow-glow-lg hover:scale-105 transition-all duration-200"
              >
                {t.nav.getStarted}
              </Link>
            </div>
          ) : (
            <div className="relative ml-2">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 rounded-xl hover:bg-gray-100 px-2 py-1.5 transition-colors"
              >
                <div className="h-8 w-8 rounded-xl gradient-bg flex items-center justify-center text-white text-sm font-bold shadow-glow">
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt="" className="h-full w-full object-cover rounded-xl" />
                  ) : (
                    user ? getInitials(user.firstName, user.lastName) : '?'
                  )}
                </div>
                <div className="hidden lg:flex flex-col items-start">
                  <span className="text-sm font-semibold text-gray-800 leading-none">
                    {user?.firstName} {user?.lastName}
                  </span>
                  <span className="text-xs text-violet-600 capitalize mt-0.5">
                    {user?.role?.replace('_', ' ')}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>

              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-gray-100 bg-white shadow-card-hover z-20 overflow-hidden">
                    {/* User info header */}
                    <div className="p-4 border-b border-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl gradient-bg flex items-center justify-center text-white font-bold shadow-glow">
                          {user ? getInitials(user.firstName, user.lastName) : '?'}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{user?.firstName} {user?.lastName}</p>
                          <p className="text-xs text-gray-500">{user?.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-2">
                      <Link
                        to={getDashboardPath(user?.role ?? 'student')}
                        className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm hover:bg-violet-50 hover:text-violet-700 transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        {t.nav.dashboard}
                      </Link>
                      <Link
                        to="/student/courses"
                        className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm hover:bg-violet-50 hover:text-violet-700 transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <BookOpen className="h-4 w-4" />
                        {t.nav.myCourses}
                      </Link>
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm hover:bg-violet-50 hover:text-violet-700 transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <Award className="h-4 w-4" />
                        {t.nav.profile}
                      </Link>
                      <div className="my-1 h-px bg-gray-100" />
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm hover:bg-red-50 text-red-600 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        {t.nav.logout}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className={cn(
            'md:hidden p-2 rounded-xl transition-colors',
            isLanding && !scrolled ? 'text-white hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100',
          )}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pb-4 pt-2 space-y-1 shadow-lg">
          <Link
            to="/courses"
            className="flex items-center gap-2 py-3 px-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-violet-50 hover:text-violet-700"
            onClick={() => setMobileOpen(false)}
          >
            <BookOpen className="h-4 w-4" />
            {t.nav.browseCourses}
          </Link>

          <button
            onClick={toggleLanguage}
            className="flex w-full items-center gap-2 py-3 px-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-violet-50 hover:text-violet-700"
          >
            <Globe className="h-4 w-4" />
            Switch to {language === 'en' ? 'Uzbek 🇺🇿' : 'English 🇬🇧'}
          </button>

          <div className="pt-2 border-t border-gray-100">
            {!isAuthenticated ? (
              <div className="flex flex-col gap-2">
                <Link
                  to="/login"
                  className="py-3 px-4 text-center rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  onClick={() => setMobileOpen(false)}
                >
                  {t.nav.login}
                </Link>
                <Link
                  to="/register"
                  className="py-3 px-4 text-center rounded-xl gradient-bg text-white text-sm font-semibold shadow-glow"
                  onClick={() => setMobileOpen(false)}
                >
                  {t.nav.getStarted}
                </Link>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="flex items-center gap-3 py-3 px-3 border-b border-gray-100 mb-2">
                  <div className="h-9 w-9 rounded-xl gradient-bg flex items-center justify-center text-white font-bold">
                    {user ? getInitials(user.firstName, user.lastName) : '?'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{user?.firstName} {user?.lastName}</p>
                    <p className="text-xs text-violet-600 capitalize">{user?.role?.replace('_', ' ')}</p>
                  </div>
                </div>
                <Link to={getDashboardPath(user?.role ?? 'student')} className="flex items-center gap-2 py-2.5 px-3 rounded-xl text-sm hover:bg-violet-50 hover:text-violet-700" onClick={() => setMobileOpen(false)}>
                  <LayoutDashboard className="h-4 w-4" /> {t.nav.dashboard}
                </Link>
                <button onClick={() => { setMobileOpen(false); handleLogout() }} className="flex w-full items-center gap-2 py-2.5 px-3 rounded-xl text-sm text-red-600 hover:bg-red-50">
                  <LogOut className="h-4 w-4" /> {t.nav.logout}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
