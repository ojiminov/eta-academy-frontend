import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { GraduationCap, Eye, EyeOff, ArrowRight, Zap, BookOpen, Award, BarChart3 } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'
import useAuthStore from '@/stores/authStore'
import { useI18n } from '@/lib/i18n'

const registerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[a-z]/, 'Must contain a lowercase letter')
    .regex(/[0-9]/, 'Must contain a number'),
})
type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const { register: registerUser } = useAuthStore()
  const { t } = useI18n()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    setServerError(null)
    try {
      await registerUser(data.firstName, data.lastName, data.email, data.password)
      navigate('/student/dashboard', { replace: true })
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: { message?: string } } } }
      setServerError(error?.response?.data?.error?.message || 'Registration failed. Please try again.')
    }
  }

  const benefits = [
    { icon: BookOpen, text: 'Access 50+ expert-led courses' },
    { icon: BarChart3, text: 'Track progress with XP & streaks' },
    { icon: Award, text: 'Earn recognized certificates' },
  ]

  return (
    <div className="min-h-screen flex">
      {/* Left gradient panel */}
      <div className="hidden lg:flex lg:w-1/2 gradient-bg-blue relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-violet-300/20 rounded-full blur-3xl" />
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
            Start your English journey today
          </h2>
          <p className="text-white/70 text-lg mb-8">
            Join thousands of students achieving their language goals with expert guidance.
          </p>
          <div className="space-y-4">
            {benefits.map((b) => {
              const Icon = b.icon
              return (
                <div key={b.text} className="flex items-center gap-3 bg-white/10 rounded-2xl px-4 py-3">
                  <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-white/90 text-sm font-medium">{b.text}</span>
                </div>
              )
            })}
          </div>
        </div>
        <div className="relative z-10 bg-white/10 rounded-2xl p-4">
          <p className="text-white/80 text-sm italic">
            "I achieved IELTS Band 7.5 in just 3 months thanks to ETA Academy!"
          </p>
          <div className="flex items-center gap-2 mt-3">
            <div className="w-7 h-7 rounded-full gradient-bg flex items-center justify-center text-white text-xs font-bold">SJ</div>
            <span className="text-white/70 text-xs">Sarah J. · IELTS Graduate</span>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50 overflow-y-auto">
        <div className="w-full max-w-md py-8">
          <Link to="/" className="flex items-center gap-2 justify-center mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center shadow-glow">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-black gradient-text">ETA Academy</span>
          </Link>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-gray-900 mb-2">{t.auth.registerTitle}</h1>
            <p className="text-gray-500">{t.auth.registerSubtitle}</p>
          </div>

          <div className="bg-white rounded-3xl shadow-card p-8 border border-gray-100">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              {serverError && (
                <div className="rounded-2xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
                  ⚠ {serverError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">{t.auth.firstName}</label>
                  <input type="text" placeholder="John" {...register('firstName')}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all" />
                  {errors.firstName && <p className="text-xs text-red-500">{errors.firstName.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">{t.auth.lastName}</label>
                  <input type="text" placeholder="Doe" {...register('lastName')}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all" />
                  {errors.lastName && <p className="text-xs text-red-500">{errors.lastName.message}</p>}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">{t.auth.email}</label>
                <input type="email" placeholder="you@example.com" autoComplete="email" {...register('email')}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all" />
                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">{t.auth.password}</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} placeholder="Min 8 chars, uppercase, number"
                    autoComplete="new-password" {...register('password')}
                    className="w-full px-4 py-3 pr-11 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
              </div>

              <button type="submit" disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 gradient-bg text-white font-semibold py-3.5 rounded-xl shadow-glow hover:shadow-glow-lg hover:scale-[1.02] transition-all duration-200 disabled:opacity-70 disabled:scale-100 mt-2">
                {isSubmitting ? (
                  <><Spinner size="sm" /> Creating account...</>
                ) : (
                  <><Zap className="h-4 w-4" /> {t.auth.registerButton} <ArrowRight className="h-4 w-4" /></>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              {t.auth.hasAccount}{' '}
              <Link to="/login" className="text-violet-600 hover:text-violet-700 font-semibold">{t.auth.signIn}</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
