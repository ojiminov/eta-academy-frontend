import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import api from '@/lib/api'
import { ApiResponse, Subject } from '@/types'
import { PageHeader } from '@/components/ui/page-header'
import { DataTable } from '@/components/ui/data-table'
import { Button } from '@/components/ui/button'

type SubjectsListResponse = { subjects: Subject[]; total: number }

export default function SubjectsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-subjects'],
    queryFn: () => api.get<ApiResponse<SubjectsListResponse>>('/subjects?limit=100'),
  })

  const subjects: Subject[] = data?.data?.subjects ?? []

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <PageHeader
        title="Subjects"
        subtitle="Manage academic subjects offered by the academy"
        action={
          <Button size="sm" className="gap-1.5">
            <Plus className="w-4 h-4" /> Add Subject
          </Button>
        }
      />

      <DataTable
        loading={isLoading}
        data={subjects}
        rowKey={(s) => s.id}
        emptyMessage="No subjects found."
        columns={[
          {
            key: 'name',
            header: 'Subject',
            render: (s) => (
              <div>
                <p className="font-medium text-slate-900">{s.name}</p>
                <p className="text-xs text-slate-400 font-mono">{s.code}</p>
              </div>
            ),
          },
          {
            key: 'category',
            header: 'Category',
            render: (s) => (
              <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded capitalize">
                {s.category}
              </span>
            ),
          },
          {
            key: 'description',
            header: 'Description',
            render: (s) => (
              <span className="text-sm text-slate-500">{s.description ?? '—'}</span>
            ),
          },
          {
            key: 'status',
            header: 'Status',
            render: (s) => (
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${s.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                {s.isActive ? 'Active' : 'Inactive'}
              </span>
            ),
          },
        ]}
      />
    </div>
  )
}
