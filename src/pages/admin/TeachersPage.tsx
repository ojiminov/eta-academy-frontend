import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Plus, Search, Mail, CheckCircle } from 'lucide-react'
import api from '@/lib/api'
import { ApiResponse, Teacher } from '@/types'
import { PageHeader } from '@/components/ui/page-header'
import { DataTable } from '@/components/ui/data-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type TeachersListResponse = { teachers: Teacher[]; total: number }

export default function TeachersPage() {
  const [search, setSearch] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['admin-teachers', search],
    queryFn: () => api.get<ApiResponse<TeachersListResponse>>(`/teachers?search=${search}&limit=50`),
  })

  const teachers: Teacher[] = data?.data?.teachers ?? []

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <PageHeader
        title="Teachers"
        subtitle={`${data?.data?.total ?? 0} registered teachers`}
        action={
          <Button size="sm" className="gap-1.5">
            <Plus className="w-4 h-4" /> Add Teacher
          </Button>
        }
      />

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
        data={teachers}
        rowKey={(t) => t.id}
        emptyMessage="No teachers found."
        columns={[
          {
            key: 'name',
            header: 'Teacher',
            render: (t) => (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-xs shrink-0">
                  {t.user?.firstName?.[0]}{t.user?.lastName?.[0]}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="font-medium text-slate-900">{t.user?.firstName} {t.user?.lastName}</p>
                    {t.isVerified && <CheckCircle className="w-3.5 h-3.5 text-blue-500" />}
                  </div>
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    <Mail className="w-3 h-3" />{t.user?.email}
                  </p>
                </div>
              </div>
            ),
          },
          {
            key: 'subjects',
            header: 'Subjects',
            render: (t) => (
              <div className="flex flex-wrap gap-1">
                {t.subjects.slice(0, 3).map((s, i) => (
                  <span key={i} className="text-xs px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
                    {s}
                  </span>
                ))}
                {t.subjects.length > 3 && (
                  <span className="text-xs text-slate-400">+{t.subjects.length - 3}</span>
                )}
              </div>
            ),
          },
          {
            key: 'salary',
            header: 'Salary',
            render: (t) => (
              <span className="text-sm text-slate-700">
                {t.salary ? `${t.salaryCurrency} ${Number(t.salary).toLocaleString()}` : '—'}
              </span>
            ),
          },
          {
            key: 'status',
            header: 'Status',
            render: (t) => (
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                t.user?.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
              }`}>
                {t.user?.status ?? 'unknown'}
              </span>
            ),
          },
          {
            key: 'joined',
            header: 'Joined',
            render: (t) => (
              <span className="text-sm text-slate-500">{new Date(t.createdAt).toLocaleDateString()}</span>
            ),
          },
        ]}
      />
    </div>
  )
}
