import React from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { ApiResponse, Payment, PaymentStatus } from '@/types'
import { PageHeader } from '@/components/ui/page-header'
import { DataTable } from '@/components/ui/data-table'

type PaymentsListResponse = { payments: Payment[]; total: number }

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

const statusColors: Record<PaymentStatus, string> = {
  pending: 'bg-amber-100 text-amber-700',
  paid: 'bg-green-100 text-green-700',
  overdue: 'bg-red-100 text-red-700',
  cancelled: 'bg-slate-100 text-slate-500',
}

export default function StudentPaymentsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['student-payments'],
    queryFn: () =>
      api.get<ApiResponse<PaymentsListResponse>>(
        '/payments?myPayments=true&include=group&limit=50&orderBy=year_desc,month_desc'
      ),
  })

  const payments: Payment[] = data?.data?.payments ?? []

  const totalPaid = payments.filter(p => p.status === 'paid').reduce((s, p) => s + Number(p.amount), 0)
  const totalOwed = payments.filter(p => p.status === 'pending' || p.status === 'overdue').reduce((s, p) => s + Number(p.amount), 0)

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <PageHeader
        title="My Payments"
        subtitle="Track your tuition fees and payment history"
      />

      {payments.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-green-50 border border-green-100 rounded-xl p-4">
            <p className="text-sm text-green-700 font-medium">Total Paid</p>
            <p className="text-2xl font-bold text-green-800 mt-1">
              {payments[0]?.currency ?? 'USD'} {totalPaid.toLocaleString()}
            </p>
          </div>
          <div className={`border rounded-xl p-4 ${totalOwed > 0 ? 'bg-amber-50 border-amber-100' : 'bg-slate-50 border-slate-100'}`}>
            <p className={`text-sm font-medium ${totalOwed > 0 ? 'text-amber-700' : 'text-slate-500'}`}>Remaining Balance</p>
            <p className={`text-2xl font-bold mt-1 ${totalOwed > 0 ? 'text-amber-800' : 'text-slate-600'}`}>
              {payments[0]?.currency ?? 'USD'} {totalOwed.toLocaleString()}
            </p>
          </div>
        </div>
      )}

      <DataTable
        loading={isLoading}
        data={payments}
        rowKey={(p) => p.id}
        emptyMessage="No payment records found."
        columns={[
          {
            key: 'period',
            header: 'Period',
            render: (p) => (
              <span className="font-medium text-slate-800">{MONTHS[p.month - 1]} {p.year}</span>
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
            header: 'Paid Date',
            render: (p) => (
              <span className="text-sm text-slate-500">
                {p.paidAt ? new Date(p.paidAt).toLocaleDateString() : '—'}
              </span>
            ),
          },
          {
            key: 'method',
            header: 'Method',
            render: (p) => <span className="text-sm text-slate-500 capitalize">{p.method ?? '—'}</span>,
          },
        ]}
      />
    </div>
  )
}
