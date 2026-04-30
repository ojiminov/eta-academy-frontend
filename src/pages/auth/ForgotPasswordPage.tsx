import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { GraduationCap, Mail, ArrowLeft, Send, CheckCircle } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'
import api from '@/lib/api'

const forgotSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
})
type ForgotFormData = z.infer<typeof forgotSchema>

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotFormData>({
    resolver: zodResolver(forgotSchema),
  })

  const onSubmit = async (data: ForgotFormData) => {
    setServerError(null)
    try {
      await api.post('/auth/forgot-password', { email: data.email })
      setSubmitted(true)
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status
      if (status && status >= 500) {
        const error = err as { response?: { data?: { error?: { message?: string } } } }
        setServerError(error?.response?.data?.error?.message || 'Something went wrong. Please try again.')
      } else {
        setSubmitted(true)
      }
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left gradient panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12"
        style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #ec4899 100%)' }}>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-pink-300/20 rounded-full blur-3xl" />
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
            Don't worry, it happens!
          </h2>
          <p className="text-white/70 text-lg mb-8">
            We'll send you a secure link to reset your password and get back to learning.
          </p>
          <div className="space-y-4">
            {['Secure reset link sent to your email', 'Link expires after 24 hours', 'Contact support if you need help'].map((item) => (
              <div key={item} className="flex items-center gap-3 text-white/90">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">✓</div>
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10 bg-white/10 rounded-2xl p-4">
          <p className="text-white/80 text-sm">
            Remember your password?{' '}
            <Link to="/login" className="text-white font-semibold underline underline-offset-2">
              Sign in here
            </Link>
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2 justify-center mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center shadow-glow">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-black gradient-text">ETA Academy</span>
          </Link>

          {submitted ? (
            /* Success state */
            <div className="bg-white rounded-3xl shadow-card p-8 border border-gray-100 text-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-5">
                <CheckCircle className="h-8 w-8 text-emerald-500" />
              </div>
              <h1 className="text-2xl font-black text-gray-900 mb-2">Check your inbox!</h1>
              <p className="text-gray-500 text-sm mb-6">
                We've sent a password reset link to your email. It may take a minute to arrive.
              </p>
              <Link
                to="/login"
                className="w-full flex items-center justify-center gap-2 gradient-bg text-white font-semibold py-3.5 rounded-xl shadow-glow hover:shadow-glow-lg transition-all duration-200"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Login
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-4 shadow-glow">
                  <Mail className="h-7 w-7 text-white" />
                </div>
                <h1 className="text-3xl font-black text-gray-900 mb-2">Forgot password?</h1>
                <p className="text-gray-500">No worries — we'll email you a reset link.</p>
              </div>

              <div className="bg-white rounded-3xl shadow-card p-8 border border-gray-100">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                  {serverError && (
                    <div className="rounded-2xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
                      ⚠ {serverError}
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">Email address</label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      {...register('email')}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all"
                    />
                    {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 gradient-bg text-white font-semibold py-3.5 rounded-xl shadow-glow hover:shadow-glow-lg hover:scale-[1.02] transition-all duration-200 disabled:opacity-70 disabled:scale-100"
                  >
                    {isSubmitting ? (
                      <><Spinner size="sm" /> Sending...</>
                    ) : (
                      <><Send className="h-4 w-4" /> Send Reset Link</>
                    )}
                  </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-500">
                  Remember your password?{' '}
                  <Link to="/login" className="text-violet-600 hover:text-violet-700 font-semibold flex items-center gap-1 justify-center mt-1">
                    <ArrowLeft className="h-3 w-3" />
                    Back to login
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
