import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Search, CheckCircle } from 'lucide-react'
import api from '@/lib/api'
import { ApiResponse, Payment, PaymentStatus } from '@/types'
import { PageHeader } from '@/components/ui/page-header'
import { DataTable } from '@/components/ui/data-table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

type PaymentsListResponse = { payments: Payment[]; total: number }

const statusColors: Record<PaymentStatus, string> = {
  pending: 'bg-amber-100 text-amber-700',
  paid: 'bg-green-100 text-green-700',
  overdue: 'bg-red-100 text-red-700',
  cancelled: 'bg-slate-100 text-slate-500',
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export default function PaymentsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-payments', search, statusFilter],
    queryFn: () =>
      api.get<ApiResponse<PaymentsListResponse>>(
        `/payments?search=${search}&status=${statusFilter === 'all' ? '' : statusFilter}&limit=50&include=student,group`
      ),
  })

  const markPaid = useMutation({
    mutationFn: (id: string) => api.patch(`/payments/${id}/pay`, { method: 'cash' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-payments'] }),
  })

  const payments: Payment[] = data?.data?.payments ?? []

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <PageHeader
        title="Payments"
        subtitle={`${data?.data?.total ?? 0} payment records`}
      />

      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search by student…"
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-1.5">
          {(['all', 'pending', 'paid', 'overdue', 'cancelled'] as const).map((s) => (
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
        data={payments}
        rowKey={(p) => p.id}
        emptyMessage="No payments found."
        columns={[
          {
            key: 'student',
            header: 'Student',
            render: (p) => (
              <span className="font-medium text-slate-900">
                {p.student?.user ? `${p.student.user.firstName} ${p.student.user.lastName}` : p.studentId}
              </span>
            ),
          },
          {
            key: 'group',
            header: 'Group',
            render: (p) => (
              <div>
                <p className="text-sm text-slate-700">{p.group?.name ?? '—'}</p>
                <p className="text-xs text-slate-400">{p.group?.subject?.name}</p>
              </div>
            ),
          },
          {
            key: 'period',
            header: 'Period',
            render: (p) => (
              <span className="text-sm text-slate-700">{MONTHS[p.month - 1]} {p.year}</span>
            ),
          },
          {
            key: 'amount',
            header: 'Amount',
            render: (p) => (
              <span className="font-semibold text-slate-900">
                {p.currency} {Number(p.amount).toLocaleString()}
              </span>
            ),
          },
          {
            key: 'status',
            header: 'Status',
            render: (p) => (
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[p.status]}`}>
                {p.status}
              </span>
            ),
          },
          {
            key: 'paidAt',
            header: 'Paid At',
            render: (p) => (
              <span className="text-sm text-slate-500">
                {p.paidAt ? new Date(p.paidAt).toLocaleDateString() : '—'}
              </span>
            ),
          },
          {
            key: 'actions',
            header: '',
            render: (p) => (
              p.status === 'pending' || p.status === 'overdue' ? (
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1 text-green-600 border-green-200 hover:bg-green-50"
                  onClick={(e) => { e.stopPropagation(); markPaid.mutate(p.id) }}
                  disabled={markPaid.isPending}
                >
                  <CheckCircle className="w-3.5 h-3.5" /> Mark Paid
                </Button>
              ) : null
            ),
          },
        ]}
      />
    </div>
  )
}
