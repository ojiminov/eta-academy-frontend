import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { BookMarked, User, CalendarDays } from 'lucide-react'
import api from '@/lib/api'
import { ApiResponse, GroupStudent } from '@/types'
import { PageHeader } from '@/components/ui/page-header'
import { Spinner } from '@/components/ui/spinner'

type GroupsResponse = { groups: GroupStudent[]; total: number }

const DAY_ABBR: Record<string, string> = {
  monday: 'Mon', tuesday: 'Tue', wednesday: 'Wed',
  thursday: 'Thu', friday: 'Fri', saturday: 'Sat', sunday: 'Sun',
}

export default function StudentGroupsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['student-groups'],
    queryFn: () =>
      api.get<ApiResponse<GroupsResponse>>(
        '/students/me/groups?include=group,subject,teacher,schedules&limit=50'
      ),
  })

  const groups: GroupStudent[] = data?.data?.groups ?? []

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
        <div className="text-center py-16 text-slate-400">You are not enrolled in any groups yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {groups.map((gs) => (
            <div key={gs.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shrink-0">
                  <BookMarked className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{gs.group?.name}</h3>
                  <p className="text-sm text-slate-500">{gs.group?.subject?.name} · Level {gs.group?.level}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-sm text-slate-600 mb-3">
                <User className="w-3.5 h-3.5 text-slate-400" />
                {gs.group?.teacher?.user
                  ? `${gs.group.teacher.user.firstName} ${gs.group.teacher.user.lastName}`
                  : 'Teacher TBD'
                }
              </div>

              {gs.group?.schedules && gs.group.schedules.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {gs.group.schedules.map((s) => (
                    <span key={s.id} className="text-xs px-2 py-1 bg-indigo-50 text-indigo-600 rounded-md font-medium flex items-center gap-1">
                      <CalendarDays className="w-3 h-3" />
                      {DAY_ABBR[s.dayOfWeek]} {s.startTime}–{s.endTime}
                    </span>
                  ))}
                </div>
              )}

              <div className="pt-3 border-t border-slate-50 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Enrolled {new Date(gs.enrolledAt).toLocaleDateString()}
                </span>
                <span className="text-xs font-semibold text-emerald-600">
                  {gs.group?.currency} {Number(gs.group?.monthlyFee ?? 0).toLocaleString()} / mo
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
