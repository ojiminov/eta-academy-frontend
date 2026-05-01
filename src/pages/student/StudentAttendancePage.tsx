import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { CheckCircle, XCircle, Clock, FileCheck } from 'lucide-react'
import api from '@/lib/api'
import { ApiResponse, Attendance, AttendanceStatus } from '@/types'
import { PageHeader } from '@/components/ui/page-header'
import { DataTable } from '@/components/ui/data-table'

type AttendanceListResponse = { attendance: Attendance[]; total: number }

const statusConfig: Record<AttendanceStatus, { label: string; icon: React.ReactNode; color: string }> = {
  present: { label: 'Present', icon: <CheckCircle className="w-3.5 h-3.5" />, color: 'bg-green-100 text-green-700' },
  absent: { label: 'Absent', icon: <XCircle className="w-3.5 h-3.5" />, color: 'bg-red-100 text-red-700' },
  late: { label: 'Late', icon: <Clock className="w-3.5 h-3.5" />, color: 'bg-amber-100 text-amber-700' },
  excused: { label: 'Excused', icon: <FileCheck className="w-3.5 h-3.5" />, color: 'bg-blue-100 text-blue-700' },
}

export default function StudentAttendancePage() {
  const { data, isLoading } = useQuery({
    queryKey: ['student-attendance'],
    queryFn: () =>
      api.get<ApiResponse<AttendanceListResponse>>(
        '/attendance?myAttendance=true&include=session,group,subject&limit=100&orderBy=date_desc'
      ),
  })

  const records: Attendance[] = data?.data?.attendance ?? []

  const summary = records.reduce((acc: Record<string, number>, r) => {
    acc[r.status] = (acc[r.status] ?? 0) + 1
    return acc
  }, {})
  const total = records.length
  const presentPct = total > 0 ? Math.round(((summary['present'] ?? 0) / total) * 100) : null

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <PageHeader
        title="My Attendance"
        subtitle={presentPct !== null ? `${presentPct}% attendance rate (${total} sessions)` : 'No attendance records yet'}
      />

      {total > 0 && (
        <div className="grid grid-cols-4 gap-3 mb-6">
          {(Object.keys(statusConfig) as AttendanceStatus[]).map((s) => {
            const cfg = statusConfig[s]
            const count = summary[s] ?? 0
            const pct = total > 0 ? Math.round((count / total) * 100) : 0
            return (
              <div key={s} className={`rounded-xl p-4 border ${cfg.color.replace('bg-', 'bg-').replace('text-', '')} border-current/10`} style={{ borderColor: 'transparent' }}>
                <div className={`inline-flex p-2 rounded-lg ${cfg.color.split(' ')[0]} mb-2`}>
                  <span className={cfg.color.split(' ')[1]}>{cfg.icon}</span>
                </div>
                <p className="text-2xl font-bold text-slate-900">{count}</p>
                <p className="text-xs text-slate-500 mt-0.5">{cfg.label} ({pct}%)</p>
              </div>
            )
          })}
        </div>
      )}

      <DataTable
        loading={isLoading}
        data={records}
        rowKey={(r) => r.id}
        emptyMessage="No attendance records yet."
        columns={[
          {
            key: 'date',
            header: 'Date',
            render: (r) => (
              <span className="font-medium text-slate-800">
                {new Date(r.createdAt).toLocaleDateString()}
              </span>
            ),
          },
          {
            key: 'status',
            header: 'Status',
            render: (r) => {
              const cfg = statusConfig[r.status]
              return (
                <span className={`inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-full font-medium ${cfg.color}`}>
                  {cfg.icon} {cfg.label}
                </span>
              )
            },
          },
          {
            key: 'note',
            header: 'Note',
            render: (r) => <span className="text-sm text-slate-500">{r.note ?? '—'}</span>,
          },
        ]}
      />
    </div>
  )
}
