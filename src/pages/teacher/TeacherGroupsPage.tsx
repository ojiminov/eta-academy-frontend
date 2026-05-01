import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Users, ChevronRight } from 'lucide-react'
import api from '@/lib/api'
import { ApiResponse, Group } from '@/types'
import { PageHeader } from '@/components/ui/page-header'
import { Spinner } from '@/components/ui/spinner'

type GroupsListResponse = { groups: Group[]; total: number }

const DAY_ABBR: Record<string, string> = {
  monday: 'Mon', tuesday: 'Tue', wednesday: 'Wed',
  thursday: 'Thu', friday: 'Fri', saturday: 'Sat', sunday: 'Sun',
}

export default function TeacherGroupsPage() {
  const navigate = useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: ['teacher-groups'],
    queryFn: () =>
      api.get<ApiResponse<GroupsListResponse>>(
        '/groups?status=active&include=subject,schedules&myGroups=true&limit=50'
      ),
  })

  const groups: Group[] = data?.data?.groups ?? []

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner className="w-8 h-8 text-indigo-500" />
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <PageHeader
        title="My Groups"
        subtitle={`${groups.length} active groups`}
      />

      {groups.length === 0 ? (
        <div className="text-center py-16 text-slate-400">No active groups assigned to you.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {groups.map((g) => (
            <div
              key={g.id}
              onClick={() => navigate(`/teacher/groups/${g.id}`)}
              className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 cursor-pointer hover:border-indigo-300 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {g.name}
                  </h3>
                  <p className="text-sm text-slate-500 mt-0.5">{g.subject?.name} · Level {g.level}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors mt-1" />
              </div>

              <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  {g._count?.students ?? 0} / {g.maxStudents} students
                </div>
                {g.room && <span className="text-slate-400">Room {g.room}</span>}
              </div>

              {g.schedules && g.schedules.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {g.schedules.map((s) => (
                    <span key={s.id} className="text-xs px-2 py-1 bg-indigo-50 text-indigo-600 rounded-md font-medium">
                      {DAY_ABBR[s.dayOfWeek]} {s.startTime}–{s.endTime}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-3 pt-3 border-t border-slate-50 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Since {new Date(g.startDate).toLocaleDateString()}
                </span>
                <span className="text-xs font-medium text-emerald-600">
                  {g.currency} {Number(g.monthlyFee).toLocaleString()} / mo
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
