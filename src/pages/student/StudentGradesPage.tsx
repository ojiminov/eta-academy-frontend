import React from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { ApiResponse, Grade } from '@/types'
import { PageHeader } from '@/components/ui/page-header'
import { DataTable } from '@/components/ui/data-table'

type GradesListResponse = { grades: Grade[]; total: number }

const gradeTypeColors: Record<string, string> = {
  exam: 'bg-red-100 text-red-700', quiz: 'bg-orange-100 text-orange-700',
  assignment: 'bg-blue-100 text-blue-700', oral: 'bg-purple-100 text-purple-700',
  homework: 'bg-slate-100 text-slate-600', midterm: 'bg-amber-100 text-amber-700',
  final: 'bg-rose-100 text-rose-700',
}

export default function StudentGradesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['student-grades'],
    queryFn: () =>
      api.get<ApiResponse<GradesListResponse>>('/grades?myGrades=true&include=group,subject&limit=100'),
  })

  const grades: Grade[] = data?.data?.grades ?? []

  const avgPct = grades.length
    ? Math.round(grades.reduce((s, g) => s + (Number(g.score) / Number(g.maxScore)) * 100, 0) / grades.length)
    : null

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <PageHeader
        title="My Grades"
        subtitle={avgPct !== null ? `Overall average: ${avgPct}%` : 'No grades recorded yet'}
      />

      <DataTable
        loading={isLoading}
        data={grades}
        rowKey={(g) => g.id}
        emptyMessage="No grades recorded yet."
        columns={[
          {
            key: 'date',
            header: 'Date',
            render: (g) => <span className="text-sm text-slate-600">{new Date(g.date).toLocaleDateString()}</span>,
          },
          {
            key: 'subject',
            header: 'Subject',
            render: (g) => (
              <div>
                <p className="text-sm font-medium text-slate-800">{g.groupStudent?.group?.subject?.name ?? '—'}</p>
                <p className="text-xs text-slate-400">{g.groupStudent?.group?.name}</p>
              </div>
            ),
          },
          {
            key: 'type',
            header: 'Type',
            render: (g) => (
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${gradeTypeColors[g.type] ?? 'bg-slate-100 text-slate-600'}`}>
                {g.type}
              </span>
            ),
          },
          {
            key: 'title',
            header: 'Title',
            render: (g) => <span className="text-sm text-slate-700">{g.title}</span>,
          },
          {
            key: 'score',
            header: 'Score',
            render: (g) => {
              const pct = Math.round((Number(g.score) / Number(g.maxScore)) * 100)
              return (
                <div className="flex items-center gap-2">
                  <span className={`font-bold text-sm ${pct >= 80 ? 'text-green-600' : pct >= 60 ? 'text-amber-600' : 'text-red-500'}`}>
                    {Number(g.score)} / {Number(g.maxScore)}
                  </span>
                  <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${pct >= 80 ? 'bg-green-500' : pct >= 60 ? 'bg-amber-400' : 'bg-red-400'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-400">{pct}%</span>
                </div>
              )
            },
          },
          {
            key: 'notes',
            header: 'Notes',
            render: (g) => <span className="text-xs text-slate-400">{g.notes ?? '—'}</span>,
          },
        ]}
      />
    </div>
  )
}
