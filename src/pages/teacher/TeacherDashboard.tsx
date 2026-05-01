import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { BookMarked, Users, CalendarDays, Clock } from 'lucide-react'
import api from '@/lib/api'
import { ApiResponse, TeacherDashboardData } from '@/types'
import { StatCard } from '@/components/ui/stat-card'
import { PageHeader } from '@/components/ui/page-header'
import { Spinner } from '@/components/ui/spinner'
import useAuthStore from '@/stores/authStore'

const DAY_ABBR: Record<string, string> = {
  monday: 'Mon', tuesday: 'Tue', wednesday: 'Wed',
  thursday: 'Thu', friday: 'Fri', saturday: 'Sat', sunday: 'Sun',
}

export default function TeacherDashboard() {
  const { user } = useAuthStore()

  const { data, isLoading } = useQuery({
    queryKey: ['teacher-dashboard'],
    queryFn: () => api.get<ApiResponse<TeacherDashboardData>>('/dashboard/teacher'),
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner className="w-8 h-8 text-indigo-500" />
      </div>
    )
  }

  const d = data?.data

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <PageHeader
        title={`Welcome, ${user?.firstName}!`}
        subtitle="Your teaching overview for today"
      />

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard
          label="Active Groups"
          value={d?.kpis.activeGroups ?? 0}
          icon={BookMarked}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-50"
        />
        <StatCard
          label="Total Students"
          value={d?.kpis.totalStudents ?? 0}
          icon={Users}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <StatCard
          label="Sessions Today"
          value={d?.kpis.todaySessions ?? 0}
          icon={CalendarDays}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Sessions */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays className="w-4 h-4 text-indigo-500" />
            <h3 className="font-semibold text-slate-800">Today's Sessions</h3>
          </div>
          {d?.todaySessions?.length ? (
            <div className="space-y-3">
              {d.todaySessions.map((s) => (
                <div key={s.id} className="flex items-start gap-3 p-3 rounded-lg bg-indigo-50 border border-indigo-100">
                  <div className="w-9 h-9 rounded-lg bg-indigo-500 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{s.group?.subject?.name ?? 'Class'}</p>
                    <p className="text-xs text-slate-500">{s.group?.name}</p>
                    {s.topic && <p className="text-xs text-indigo-600 mt-0.5">Topic: {s.topic}</p>}
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                        (s.attendance?.length ?? 0) > 0 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {(s.attendance?.length ?? 0) > 0 ? `${s.attendance?.length} marked` : 'Attendance pending'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center py-8">No sessions scheduled for today</p>
          )}
        </div>

        {/* My Groups */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <BookMarked className="w-4 h-4 text-indigo-500" />
            <h3 className="font-semibold text-slate-800">My Active Groups</h3>
          </div>
          {d?.myGroups?.length ? (
            <div className="space-y-3">
              {d.myGroups.map((g) => (
                <div key={g.id} className="flex items-center gap-3 py-2.5 border-b border-slate-50 last:border-0">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shrink-0">
                    <BookMarked className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-800 text-sm">{g.name}</p>
                    <p className="text-xs text-slate-400">{g.subject?.name} · Level {g.level}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-700">{g._count?.students ?? 0}</p>
                    <p className="text-xs text-slate-400">students</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center py-8">No active groups</p>
          )}
        </div>

        {/* Recent Sessions */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 lg:col-span-2">
          <h3 className="font-semibold text-slate-800 mb-4">Recent Sessions</h3>
          {d?.recentSessions?.length ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left py-2 px-3 text-xs font-semibold text-slate-500 uppercase">Date</th>
                    <th className="text-left py-2 px-3 text-xs font-semibold text-slate-500 uppercase">Group</th>
                    <th className="text-left py-2 px-3 text-xs font-semibold text-slate-500 uppercase">Subject</th>
                    <th className="text-left py-2 px-3 text-xs font-semibold text-slate-500 uppercase">Topic</th>
                  </tr>
                </thead>
                <tbody>
                  {d.recentSessions.map((s) => (
                    <tr key={s.id} className="border-b border-slate-50 hover:bg-slate-50">
                      <td className="py-2.5 px-3 text-slate-700">{new Date(s.date).toLocaleDateString()}</td>
                      <td className="py-2.5 px-3 text-slate-700">{s.group?.name ?? '—'}</td>
                      <td className="py-2.5 px-3 text-slate-500">{s.group?.subject?.name ?? '—'}</td>
                      <td className="py-2.5 px-3 text-slate-500">{s.topic ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center py-8">No recent sessions</p>
          )}
        </div>
      </div>
    </div>
  )
}
