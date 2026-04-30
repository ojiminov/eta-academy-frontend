import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { GraduationCap, Eye, EyeOff, ArrowRight, Zap } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'
import useAuthStore from '@/stores/authStore'
import { useI18n } from '@/lib/i18n'

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})
type LoginFormData = z.infer<typeof loginSchema>

function getDashboardPath(role: string): string {
  switch (role) {
    case 'student': return '/student/dashboard'
    case 'teacher': return '/teacher/dashboard'
    case 'admin': return '/admin/dashboard'
    default: return '/'
  }
}

export default function LoginPage() {
  const { login } = useAuthStore()
  const { t } = useI18n()
  const navigate = useNavigate()
  const location = useLocation()
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null)
    try {
      await login(data.email, data.password)
      const currentUser = useAuthStore.getState().user
      if (from) navigate(from, { replace: true })
      else if (currentUser) navigate(getDashboardPath(currentUser.role), { replace: true })
      else navigate('/', { replace: true })
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: { message?: string } } } }
      setServerError(error?.response?.data?.error?.message || 'Invalid email or password.')
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel — gradient */}
      <div className="hidden lg:flex lg:w-1/2 gradient-bg relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-pink-300/20 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2 text-white">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <GraduationCap className="h-6 w-6" />
            </div>
            <span className="text-2xl font-black">ETA Academy</span>
          </Link>
        </div>
        <div className="relative z-10">
          <h2 className="text-4xl font-black text-white mb-4 leading-tight">
            Continue your English journey
          </h2>
          <p className="text-white/70 text-lg mb-8">
            Thousands of students are already mastering English. Your next lesson is waiting.
          </p>
          <div className="space-y-3">
            {['Track your progress', 'Learn from experts', 'Earn certificates'].map((item) => (
              <div key={item} className="flex items-center gap-3 text-white/90">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">✓</div>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex -space-x-2">
            {['SJ', 'AT', 'MC', 'RK'].map((init, i) => (
              <div key={i} className="w-8 h-8 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-white text-xs font-bold">
                {init}
              </div>
            ))}
          </div>
          <span className="text-white/80 text-sm">5,000+ students learning</span>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2 justify-center mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center shadow-glow">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-black gradient-text">ETA Academy</span>
          </Link>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-gray-900 mb-2">{t.auth.loginTitle}</h1>
            <p className="text-gray-500">{t.auth.loginSubtitle}</p>
          </div>

          <div className="bg-white rounded-3xl shadow-card p-8 border border-gray-100">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              {serverError && (
                <div className="rounded-2xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600 flex items-center gap-2">
                  <span className="text-red-500">⚠</span> {serverError}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">{t.auth.email}</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  {...register('email')}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all"
                />
                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-gray-700">{t.auth.password}</label>
                  <Link to="/forgot-password" className="text-xs text-violet-600 hover:text-violet-700 font-medium">
                    {t.auth.forgotPassword}
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    {...register('password')}
                    className="w-full px-4 py-3 pr-11 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 gradient-bg text-white font-semibold py-3.5 rounded-xl shadow-glow hover:shadow-glow-lg hover:scale-[1.02] transition-all duration-200 disabled:opacity-70 disabled:scale-100"
              >
                {isSubmitting ? (
                  <><Spinner size="sm" /> Signing in...</>
                ) : (
                  <><Zap className="h-4 w-4" /> {t.auth.loginButton} <ArrowRight className="h-4 w-4" /></>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              {t.auth.noAccount}{' '}
              <Link to="/register" className="text-violet-600 hover:text-violet-700 font-semibold">
                {t.auth.signUp}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
