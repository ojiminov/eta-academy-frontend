import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { BookMarked, GraduationCap, CreditCard, CalendarDays, Pin } from 'lucide-react'
import api from '@/lib/api'
import { ApiResponse, StudentDashboardData } from '@/types'
import { StatCard } from '@/components/ui/stat-card'
import { PageHeader } from '@/components/ui/page-header'
import { Spinner } from '@/components/ui/spinner'
import useAuthStore from '@/stores/authStore'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

const gradeColor = (pct: number | null) => {
  if (pct === null) return 'text-slate-400'
  if (pct >= 80) return 'text-green-600'
  if (pct >= 60) return 'text-amber-600'
  return 'text-red-500'
}

const gradeTypeColors: Record<string, string> = {
  exam: 'bg-red-100 text-red-700', quiz: 'bg-orange-100 text-orange-700',
  assignment: 'bg-blue-100 text-blue-700', oral: 'bg-purple-100 text-purple-700',
  homework: 'bg-slate-100 text-slate-600', midterm: 'bg-amber-100 text-amber-700',
  final: 'bg-rose-100 text-rose-700',
}

export default function StudentDashboard() {
  const { user } = useAuthStore()

  const { data, isLoading } = useQuery({
    queryKey: ['student-dashboard'],
    queryFn: () => api.get<ApiResponse<StudentDashboardData>>('/dashboard/student'),
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner className="w-8 h-8 text-indigo-500" />
      </div>
    )
  }

  const d = data?.data
  const attTotal = d ? Object.values(d.kpis.attendanceThisMonth).reduce((a, b) => a + b, 0) : 0
  const attPresent = d?.kpis.attendanceThisMonth['present'] ?? 0
  const attRate = attTotal > 0 ? Math.round((attPresent / attTotal) * 100) : null

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <PageHeader
        title={`Hello, ${user?.firstName}!`}
        subtitle="Your academic summary"
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Active Groups"
          value={d?.kpis.activeGroups ?? 0}
          icon={BookMarked}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-50"
        />
        <StatCard
          label="Avg Grade"
          value={d?.kpis.avgGradePercentage !== null && d?.kpis.avgGradePercentage !== undefined ? `${d.kpis.avgGradePercentage}%` : '—'}
          icon={GraduationCap}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
        <StatCard
          label="Attendance"
          value={attRate !== null ? `${attRate}%` : '—'}
          icon={CalendarDays}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
          subtitle="this month"
        />
        <StatCard
          label="Pending Payments"
          value={d?.kpis.pendingPayments ?? 0}
          icon={CreditCard}
          iconColor={d?.kpis.pendingPayments ? 'text-amber-600' : 'text-slate-400'}
          iconBg={d?.kpis.pendingPayments ? 'bg-amber-50' : 'bg-slate-50'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* My Groups */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h3 className="font-semibold text-slate-800 mb-4">My Groups</h3>
          {d?.myGroups?.length ? (
            <div className="space-y-3">
              {d.myGroups.map((gs) => (
                <div key={gs.id} className="flex items-center gap-3 py-2.5 border-b border-slate-50 last:border-0">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shrink-0">
                    <BookMarked className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-800 text-sm">{gs.group?.name}</p>
                    <p className="text-xs text-slate-400">
                      {gs.group?.subject?.name} · {gs.group?.teacher?.user?.firstName} {gs.group?.teacher?.user?.lastName}
                    </p>
                  </div>
                  <span className="text-xs text-slate-400">Level {gs.group?.level}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center py-6">No active groups</p>
          )}
        </div>

        {/* Recent Grades */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h3 className="font-semibold text-slate-800 mb-4">Recent Grades</h3>
          {d?.recentGrades?.length ? (
            <div className="space-y-2">
              {d.recentGrades.slice(0, 5).map((g) => (
                <div key={g.id} className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0">
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${gradeTypeColors[g.type] ?? 'bg-slate-100 text-slate-600'}`}>
                    {g.type}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{g.title}</p>
                    <p className="text-xs text-slate-400">{g.groupStudent?.group?.subject?.name}</p>
                  </div>
                  <span className={`font-bold text-sm ${gradeColor(Math.round((Number(g.score) / Number(g.maxScore)) * 100))}`}>
                    {Number(g.score)}/{Number(g.maxScore)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center py-6">No grades yet</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Payments */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h3 className="font-semibold text-slate-800 mb-4">Recent Payments</h3>
          {d?.payments?.length ? (
            <div className="space-y-2">
              {d.payments.slice(0, 4).map((p) => (
                <div key={p.id} className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${
                    p.status === 'paid' ? 'bg-green-500' :
                    p.status === 'overdue' ? 'bg-red-500' : 'bg-amber-400'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm text-slate-700">{MONTHS[p.month - 1]} {p.year}</p>
                    <p className="text-xs text-slate-400">{p.group?.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-800">{p.currency} {Number(p.amount).toLocaleString()}</p>
                    <p className={`text-xs font-medium ${
                      p.status === 'paid' ? 'text-green-600' :
                      p.status === 'overdue' ? 'text-red-500' : 'text-amber-600'
                    }`}>{p.status}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center py-6">No payment records</p>
          )}
        </div>

        {/* Announcements */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h3 className="font-semibold text-slate-800 mb-4">Announcements</h3>
          {d?.announcements?.length ? (
            <div className="space-y-3">
              {d.announcements.map((a) => (
                <div key={a.id} className="flex gap-2.5 py-2 border-b border-slate-50 last:border-0">
                  {a.isPinned && <Pin className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />}
                  <div>
                    <p className="text-sm font-medium text-slate-800">{a.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{a.body}</p>
                    <p className="text-xs text-slate-400 mt-1">{new Date(a.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center py-6">No announcements</p>
          )}
        </div>
      </div>
    </div>
  )
}
