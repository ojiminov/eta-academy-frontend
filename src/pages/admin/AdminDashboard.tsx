import React from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  GraduationCap, Users, BookMarked, CreditCard,
  AlertTriangle, TrendingUp, CalendarDays, Megaphone,
} from 'lucide-react'
import api from '@/lib/api'
import { ApiResponse, AdminDashboardData } from '@/types'
import { StatCard } from '@/components/ui/stat-card'
import { PageHeader } from '@/components/ui/page-header'
import { Spinner } from '@/components/ui/spinner'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export default function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => api.get<ApiResponse<AdminDashboardData>>('/dashboard/admin'),
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner className="w-8 h-8 text-indigo-500" />
      </div>
    )
  }

  const d = data?.data

  const maxRevenue = d ? Math.max(...d.revenueByMonth.map(r => r.amount), 1) : 1

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <PageHeader
        title="Admin Dashboard"
        subtitle="Academy overview and key performance indicators"
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Students"
          value={d?.kpis.totalStudents ?? 0}
          icon={GraduationCap}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-50"
        />
        <StatCard
          label="Total Teachers"
          value={d?.kpis.totalTeachers ?? 0}
          icon={Users}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <StatCard
          label="Active Groups"
          value={d?.kpis.activeGroups ?? 0}
          icon={BookMarked}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
          subtitle={`of ${d?.kpis.totalGroups ?? 0} total`}
        />
        <StatCard
          label="Revenue This Month"
          value={`$${(d?.kpis.revenueThisMonth ?? 0).toLocaleString()}`}
          icon={TrendingUp}
          iconColor="text-violet-600"
          iconBg="bg-violet-50"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-8">
        <StatCard
          label="Pending Payments"
          value={d?.kpis.pendingPayments ?? 0}
          icon={CreditCard}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
        />
        <StatCard
          label="Overdue Payments"
          value={d?.kpis.overduePayments ?? 0}
          icon={AlertTriangle}
          iconColor="text-red-600"
          iconBg="bg-red-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h3 className="font-semibold text-slate-800 mb-4">Revenue — Last 6 Months</h3>
          {d?.revenueByMonth && d.revenueByMonth.length > 0 ? (
            <div className="flex items-end gap-2 h-36">
              {d.revenueByMonth.map((r, i) => {
                const pct = maxRevenue > 0 ? (r.amount / maxRevenue) * 100 : 0
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs text-slate-500">${r.amount > 0 ? (r.amount / 1000).toFixed(1) + 'k' : '0'}</span>
                    <div className="w-full bg-slate-100 rounded-md overflow-hidden" style={{ height: '80px' }}>
                      <div
                        className="w-full bg-indigo-500 rounded-md transition-all duration-500"
                        style={{ height: `${Math.max(pct, r.amount > 0 ? 4 : 0)}%`, marginTop: `${100 - Math.max(pct, r.amount > 0 ? 4 : 0)}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-400">{MONTHS[r.month - 1]}</span>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center py-8">No revenue data yet</p>
          )}
        </div>

        {/* Attendance Summary */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h3 className="font-semibold text-slate-800 mb-4">Attendance This Month</h3>
          {d?.attendanceSummary && Object.keys(d.attendanceSummary).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(d.attendanceSummary).map(([status, count]) => {
                const total = Object.values(d.attendanceSummary).reduce((a, b) => a + b, 0)
                const pct = total > 0 ? Math.round((count / total) * 100) : 0
                const colors: Record<string, string> = {
                  present: 'bg-emerald-500',
                  absent: 'bg-red-400',
                  late: 'bg-amber-400',
                  excused: 'bg-blue-400',
                }
                return (
                  <div key={status}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="capitalize text-slate-600">{status}</span>
                      <span className="font-medium text-slate-800">{count} ({pct}%)</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${colors[status] ?? 'bg-slate-400'}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center py-8">No attendance data this month</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Announcements */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <Megaphone className="w-4 h-4 text-indigo-500" />
            <h3 className="font-semibold text-slate-800">Recent Announcements</h3>
          </div>
          {d?.recentAnnouncements?.length ? (
            <div className="space-y-3">
              {d.recentAnnouncements.map((a) => (
                <div key={a.id} className="flex gap-3 py-2 border-b border-slate-50 last:border-0">
                  {a.isPinned && <span className="text-amber-500 text-xs mt-0.5">📌</span>}
                  <div>
                    <p className="text-sm font-medium text-slate-800">{a.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {a.author?.firstName} {a.author?.lastName} · {new Date(a.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center py-6">No announcements yet</p>
          )}
        </div>

        {/* Upcoming Sessions */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays className="w-4 h-4 text-indigo-500" />
            <h3 className="font-semibold text-slate-800">Upcoming Sessions</h3>
          </div>
          {d?.upcomingSessions?.length ? (
            <div className="space-y-2">
              {d.upcomingSessions.slice(0, 5).map((s) => (
                <div key={s.id} className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 flex flex-col items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-indigo-600">{new Date(s.date).getDate()}</span>
                    <span className="text-xs text-indigo-400">{MONTHS[new Date(s.date).getMonth()]}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">{s.group?.subject?.name ?? s.groupId}</p>
                    <p className="text-xs text-slate-400">
                      {s.teacher?.user?.firstName} {s.teacher?.user?.lastName}
                      {s.topic && ` · ${s.topic}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center py-6">No upcoming sessions</p>
          )}
        </div>
      </div>
    </div>
  )
}
