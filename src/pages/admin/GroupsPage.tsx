import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Plus, Search, Users } from 'lucide-react'
import api from '@/lib/api'
import { ApiResponse, Group, GroupStatus } from '@/types'
import { PageHeader } from '@/components/ui/page-header'
import { DataTable } from '@/components/ui/data-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type GroupsListResponse = { groups: Group[]; total: number }

const statusColors: Record<GroupStatus, string> = {
  active: 'bg-green-100 text-green-700',
  completed: 'bg-blue-100 text-blue-700',
  archived: 'bg-slate-100 text-slate-500',
}

const DAY_ABBR: Record<string, string> = {
  monday: 'Mon', tuesday: 'Tue', wednesday: 'Wed',
  thursday: 'Thu', friday: 'Fri', saturday: 'Sat', sunday: 'Sun',
}

export default function GroupsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const { data, isLoading } = useQuery({
    queryKey: ['admin-groups', search, statusFilter],
    queryFn: () =>
      api.get<ApiResponse<GroupsListResponse>>(
        `/groups?search=${search}&status=${statusFilter === 'all' ? '' : statusFilter}&limit=50&include=subject,teacher,schedules`
      ),
  })

  const groups: Group[] = data?.data?.groups ?? []

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <PageHeader
        title="Groups"
        subtitle={`${data?.data?.total ?? 0} groups`}
        action={
          <Button size="sm" className="gap-1.5">
            <Plus className="w-4 h-4" /> New Group
          </Button>
        }
      />

      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search groups…"
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-1.5">
          {(['all', 'active', 'completed', 'archived'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === s
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <DataTable
        loading={isLoading}
        data={groups}
        rowKey={(g) => g.id}
        emptyMessage="No groups found."
        columns={[
          {
            key: 'name',
            header: 'Group',
            render: (g) => (
              <div>
                <p className="font-medium text-slate-900">{g.name}</p>
                <p className="text-xs text-slate-400">{g.subject?.name} · Level {g.level}</p>
              </div>
            ),
          },
          {
            key: 'teacher',
            header: 'Teacher',
            render: (g) => (
              <span className="text-sm text-slate-700">
                {g.teacher?.user ? `${g.teacher.user.firstName} ${g.teacher.user.lastName}` : '—'}
              </span>
            ),
          },
          {
            key: 'schedule',
            header: 'Schedule',
            render: (g) => (
              <div className="flex flex-wrap gap-1">
                {g.schedules?.map((s) => (
                  <span key={s.id} className="text-xs px-1.5 py-0.5 bg-indigo-50 text-indigo-600 rounded font-medium">
                    {DAY_ABBR[s.dayOfWeek]} {s.startTime}
                  </span>
                ))}
              </div>
            ),
          },
          {
            key: 'students',
            header: 'Students',
            render: (g) => (
              <div className="flex items-center gap-1.5 text-sm text-slate-700">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                {g._count?.students ?? 0} / {g.maxStudents}
              </div>
            ),
          },
          {
            key: 'fee',
            header: 'Monthly Fee',
            render: (g) => (
              <span className="text-sm font-medium text-slate-700">
                {g.currency} {Number(g.monthlyFee).toLocaleString()}
              </span>
            ),
          },
          {
            key: 'status',
            header: 'Status',
            render: (g) => (
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[g.status]}`}>
                {g.status}
              </span>
            ),
          },
        ]}
      />
    </div>
  )
}
