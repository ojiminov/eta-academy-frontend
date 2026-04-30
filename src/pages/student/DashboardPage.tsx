import React from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  BookOpen, Award, Zap, Flame, ChevronRight, Trophy,
  Target, Clock, TrendingUp, Star, Play, BarChart3,
} from 'lucide-react'
import useAuthStore from '@/stores/authStore'
import api from '@/lib/api'
import { ApiResponse, StudentDashboard, Enrollment } from '@/types'
import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'

/* ─── Skeleton ─────────────────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="rounded-2xl border bg-white p-6 space-y-3 animate-pulse">
      <div className="h-4 bg-gray-100 rounded w-1/3" />
      <div className="h-8 bg-gray-100 rounded w-1/2" />
      <div className="h-3 bg-gray-100 rounded w-2/3" />
    </div>
  )
}

/* ─── Stat Card ─────────────────────────────────────────────────────── */
interface StatCardProps {
  icon: React.ElementType
  label: string
  value: string | number
  sub: string
  gradient: string
  iconBg: string
}
function StatCard({ icon: Icon, label, value, sub, gradient, iconBg }: StatCardProps) {
  return (
    <div className={cn('rounded-2xl p-5 text-white relative overflow-hidden', gradient)}>
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
      <div className="relative">
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3', iconBg)}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <p className="text-white/70 text-xs font-medium uppercase tracking-wider">{label}</p>
        <p className="text-3xl font-black mt-0.5">{value}</p>
        <p className="text-white/70 text-xs mt-1">{sub}</p>
      </div>
    </div>
  )
}

/* ─── Course Progress Card ───────────────────────────────────────────── */
const COURSE_GRADIENTS = [
  'from-violet-500 to-purple-600',
  'from-blue-500 to-indigo-600',
  'from-pink-500 to-rose-600',
  'from-emerald-500 to-teal-600',
  'from-orange-500 to-amber-600',
]

function CourseProgressCard({ enrollment, index }: { enrollment: Enrollment; index: number }) {
  const grad = COURSE_GRADIENTS[index % COURSE_GRADIENTS.length]
  const pct = enrollment.progressPct ?? 0

  return (
    <div className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-card-hover transition-all duration-200 group">
      <div className={cn(
        'h-14 w-20 flex-shrink-0 rounded-xl bg-gradient-to-br flex items-center justify-center',
        grad,
      )}>
        <BookOpen className="h-6 w-6 text-white/80" />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm text-gray-900 truncate">{enrollment.course.title}</h4>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-gray-400">{enrollment.course.level}</span>
          <span className="text-gray-200">·</span>
          <span className="text-xs font-medium text-violet-600">{pct}% complete</span>
        </div>
        <div className="mt-2 h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-600 transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <Link
        to={`/courses/${enrollment.course.slug}`}
        className="flex-shrink-0 w-9 h-9 rounded-xl bg-violet-50 hover:bg-violet-100 flex items-center justify-center transition-colors group-hover:bg-violet-500 group-hover:text-white"
      >
        <Play className="h-4 w-4 text-violet-600 group-hover:text-white" />
      </Link>
    </div>
  )
}

/* ─── Achievement Badge ─────────────────────────────────────────────── */
const BADGES = [
  { icon: '🏆', label: 'First Course', earned: true },
  { icon: '🔥', label: '7-Day Streak', earned: true },
  { icon: '⚡', label: '1000 XP', earned: true },
  { icon: '📚', label: 'Bookworm', earned: false },
  { icon: '🎯', label: 'Perfect Score', earned: false },
  { icon: '🌟', label: 'Top Student', earned: false },
]

/* ─── Main Component ─────────────────────────────────────────────────── */
export default function DashboardPage() {
  const { user } = useAuthStore()
  const { t } = useI18n()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['student-dashboard'],
    queryFn: () => api.get<ApiResponse<StudentDashboard>>('/students/dashboard'),
  })

  const dashboard = data?.data
  const activeEnrollments = dashboard?.enrollments?.filter((e) => e.status === 'active') ?? []

  /* loading */
  if (isLoading) {
    return (
      <div className="space-y-6 pt-2">
        <div className="h-8 bg-gray-100 rounded-xl w-1/3 animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  /* error */
  if (isError) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center">
        <p className="text-red-600 font-semibold">Failed to load dashboard. Please refresh.</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-5 py-2 rounded-xl border border-red-200 text-red-600 text-sm hover:bg-red-100 transition-colors"
        >
          Try again
        </button>
      </div>
    )
  }

  const xp = dashboard?.xpPoints ?? 0
  const streak = dashboard?.streakDays ?? 0
  const totalCourses = dashboard?.enrollments?.length ?? 0
  const certs = dashboard?.certificatesCount ?? 0

  return (
    <div className="space-y-8">
      {/* ── Welcome Banner ── */}
      <div className="rounded-3xl gradient-bg p-6 md:p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-56 h-56 bg-white/10 rounded-full -translate-y-20 translate-x-20" />
        <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-white/5 rounded-full translate-y-12" />
        <div className="relative">
          <p className="text-white/70 text-sm font-medium">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          <h1 className="text-2xl md:text-3xl font-black mt-1">
            Welcome back, {user?.firstName}! 👋
          </h1>
          <p className="text-white/70 mt-1 text-sm">
            {streak > 0
              ? `You're on a ${streak}-day streak. Keep it going!`
              : 'Start learning today to build your streak!'}
          </p>
          <div className="flex items-center gap-3 mt-4">
            <Link
              to="/courses"
              className="flex items-center gap-2 bg-white text-violet-700 font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-violet-50 transition-colors shadow-sm"
            >
              <BookOpen className="h-4 w-4" />
              Browse Courses
            </Link>
            {activeEnrollments.length > 0 && (
              <Link
                to={`/courses/${activeEnrollments[0].course.slug}`}
                className="flex items-center gap-2 bg-white/20 text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-white/30 transition-colors"
              >
                <Play className="h-4 w-4" />
                Continue Learning
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Zap}
          label="XP Points"
          value={xp.toLocaleString()}
          sub="Experience earned"
          gradient="bg-gradient-to-br from-violet-500 to-purple-700"
          iconBg="bg-white/20"
        />
        <StatCard
          icon={Flame}
          label="Day Streak"
          value={streak}
          sub="Consecutive days"
          gradient="bg-gradient-to-br from-orange-500 to-red-600"
          iconBg="bg-white/20"
        />
        <StatCard
          icon={BookOpen}
          label="Enrolled"
          value={totalCourses}
          sub={`${activeEnrollments.length} active`}
          gradient="bg-gradient-to-br from-blue-500 to-indigo-700"
          iconBg="bg-white/20"
        />
        <StatCard
          icon={Award}
          label="Certificates"
          value={certs}
          sub="Earned so far"
          gradient="bg-gradient-to-br from-emerald-500 to-teal-700"
          iconBg="bg-white/20"
        />
      </div>

      {/* ── Two-Column Section ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Continue Learning */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-gray-900">Continue Learning</h2>
            <Link
              to="/student/courses"
              className="text-sm font-semibold text-violet-600 hover:text-violet-700 flex items-center gap-1"
            >
              View all <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {activeEnrollments.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-gray-200 p-10 text-center bg-gray-50/50">
              <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-4 shadow-glow">
                <BookOpen className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-lg font-black text-gray-900 mb-1">No courses yet</h3>
              <p className="text-gray-500 text-sm mb-5">Start your English journey today</p>
              <Link
                to="/courses"
                className="inline-flex items-center gap-2 gradient-bg text-white font-semibold text-sm px-6 py-2.5 rounded-xl shadow-glow hover:shadow-glow-lg transition-all"
              >
                <BookOpen className="h-4 w-4" />
                Browse Courses
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {activeEnrollments.slice(0, 4).map((enrollment, i) => (
                <CourseProgressCard key={enrollment.id} enrollment={enrollment} index={i} />
              ))}
            </div>
          )}
        </div>

        {/* Right column: Achievements + Goals */}
        <div className="space-y-5">
          {/* Achievements */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <h3 className="font-black text-gray-900">Achievements</h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {BADGES.map((badge) => (
                <div
                  key={badge.label}
                  className={cn(
                    'flex flex-col items-center gap-1 p-2 rounded-xl text-center transition-all',
                    badge.earned
                      ? 'bg-violet-50 hover:bg-violet-100'
                      : 'opacity-30 grayscale bg-gray-50',
                  )}
                  title={badge.label}
                >
                  <span className="text-2xl">{badge.icon}</span>
                  <span className="text-xs font-medium text-gray-600 leading-tight">{badge.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Goal */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-violet-500" />
              <h3 className="font-black text-gray-900">Weekly Goal</h3>
            </div>
            <div className="flex items-center justify-center">
              {/* SVG ring */}
              <div className="relative w-28 h-28">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#f3f4f6" strokeWidth="10" />
                  <circle
                    cx="50" cy="50" r="38" fill="none"
                    stroke="url(#goalGrad)" strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 38}`}
                    strokeDashoffset={`${2 * Math.PI * 38 * (1 - 0.6)}`}
                    className="transition-all duration-700"
                  />
                  <defs>
                    <linearGradient id="goalGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#7c3aed" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black gradient-text">60%</span>
                  <span className="text-xs text-gray-400">3 / 5 days</span>
                </div>
              </div>
            </div>
            <p className="text-center text-xs text-gray-500 mt-3">Study 2 more days to hit your goal!</p>
          </div>
        </div>
      </div>

      {/* ── Quick Stats Row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: TrendingUp, label: 'Lessons Completed', value: totalCourses * 5 + (activeEnrollments.length * 3), color: 'text-violet-600', bg: 'bg-violet-50' },
          { icon: Clock, label: 'Hours Studied', value: `${Math.max(1, Math.round(xp / 100))}h`, color: 'text-blue-600', bg: 'bg-blue-50' },
          { icon: Star, label: 'Level Progress', value: `${Math.min(99, Math.round((xp % 1000) / 10))}%`, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4">
            <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center', bg)}>
              <Icon className={cn('h-5 w-5', color)} />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900">{value}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Quick Actions ── */}
      <div className="flex flex-wrap gap-3">
        <Link
          to="/courses"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-violet-200 text-violet-700 font-semibold text-sm hover:bg-violet-50 transition-colors"
        >
          <BookOpen className="h-4 w-4" />
          Browse Courses
        </Link>
        <Link
          to="/student/certificates"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors"
        >
          <Award className="h-4 w-4" />
          My Certificates
        </Link>
        <Link
          to="/profile"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors"
        >
          <BarChart3 className="h-4 w-4" />
          View Progress
        </Link>
      </div>
    </div>
  )
}
