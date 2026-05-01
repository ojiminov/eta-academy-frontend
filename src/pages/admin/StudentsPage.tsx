import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Plus, Search, Mail, Phone } from 'lucide-react'
import api from '@/lib/api'
import { ApiResponse, Student, UserStatus } from '@/types'
import { PageHeader } from '@/components/ui/page-header'
import { DataTable } from '@/components/ui/data-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type StudentsListResponse = { students: Student[]; total: number }

const statusColors: Record<UserStatus, string> = {
  active: 'bg-green-100 text-green-700',
  suspended: 'bg-red-100 text-red-700',
  pending_verification: 'bg-amber-100 text-amber-700',
  deleted: 'bg-slate-100 text-slate-500',
}

export default function StudentsPage() {
  const [search, setSearch] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['admin-students', search],
    queryFn: () => api.get<ApiResponse<StudentsListResponse>>(`/students?search=${search}&limit=50`),
  })

  const students: Student[] = data?.data?.students ?? []

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <PageHeader
        title="Students"
        subtitle={`${data?.data?.total ?? 0} registered students`}
        action={
          <Button size="sm" className="gap-1.5">
            <Plus className="w-4 h-4" /> Add Student
          </Button>
        }
      />

      {/* Search */}
      <div className="relative mb-5 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Search by name or email…"
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <DataTable
        loading={isLoading}
        data={students}
        rowKey={(s) => s.id}
        emptyMessage="No students found."
        columns={[
          {
            key: 'name',
            header: 'Student',
            render: (s) => (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-xs shrink-0">
                  {s.user?.firstName?.[0]}{s.user?.lastName?.[0]}
                </div>
                <div>
                  <p className="font-medium text-slate-900">{s.user?.firstName} {s.user?.lastName}</p>
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    <Mail className="w-3 h-3" />{s.user?.email}
                  </p>
                </div>
              </div>
            ),
          },
          {
            key: 'phone',
            header: 'Contact',
            render: (s) => (
              <div className="text-sm text-slate-500">
                {s.user?.phone
                  ? <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{s.user.phone}</span>
                  : <span className="text-slate-300">—</span>
                }
              </div>
            ),
          },
          {
            key: 'parent',
            header: 'Parent',
            render: (s) => (
              <div className="text-sm">
                <p className="text-slate-700">{s.parentName ?? <span className="text-slate-300">—</span>}</p>
                {s.parentPhone && <p className="text-xs text-slate-400">{s.parentPhone}</p>}
              </div>
            ),
          },
          {
            key: 'status',
            header: 'Status',
            render: (s) => (
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[s.user?.status ?? 'pending_verification']}`}>
                {s.user?.status?.replace('_', ' ') ?? 'unknown'}
              </span>
            ),
          },
          {
            key: 'joined',
            header: 'Joined',
            render: (s) => (
              <span className="text-sm text-slate-500">
                {new Date(s.createdAt).toLocaleDateString()}
              </span>
            ),
          },
        ]}
      />
    </div>
  )
}
