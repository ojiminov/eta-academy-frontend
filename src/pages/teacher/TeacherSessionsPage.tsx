import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import api from '@/lib/api'
import { ApiResponse, ClassSession, Group } from '@/types'
import { PageHeader } from '@/components/ui/page-header'
import { DataTable } from '@/components/ui/data-table'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

type SessionsListResponse = { sessions: ClassSession[]; total: number }
type GroupsListResponse = { groups: Group[]; total: number }

export default function TeacherSessionsPage() {
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [groupId, setGroupId] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [topic, setTopic] = useState('')
  const [notes, setNotes] = useState('')
  const [homeworkDesc, setHomeworkDesc] = useState('')

  const { data: sessionsData, isLoading } = useQuery({
    queryKey: ['teacher-sessions'],
    queryFn: () =>
      api.get<ApiResponse<SessionsListResponse>>(
        '/sessions?myGroups=true&include=group,subject&limit=50&orderBy=date_desc'
      ),
  })

  const { data: groupsData } = useQuery({
    queryKey: ['teacher-groups-select'],
    queryFn: () =>
      api.get<ApiResponse<GroupsListResponse>>('/groups?status=active&myGroups=true&limit=50'),
  })

  const createSession = useMutation({
    mutationFn: () =>
      api.post('/sessions', { groupId, date, topic: topic || undefined, notes: notes || undefined, homeworkDesc: homeworkDesc || undefined }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['teacher-sessions'] })
      setShowForm(false)
      setGroupId(''); setTopic(''); setNotes(''); setHomeworkDesc('')
    },
  })

  const sessions: ClassSession[] = sessionsData?.data?.sessions ?? []
  const groups: Group[] = groupsData?.data?.groups ?? []

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <PageHeader
        title="Class Sessions"
        subtitle="Record and manage your teaching sessions"
        action={
          <Button size="sm" className="gap-1.5" onClick={() => setShowForm(!showForm)}>
            <Plus className="w-4 h-4" /> New Session
          </Button>
        }
      />

      {showForm && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mb-6">
          <h3 className="font-semibold text-slate-800 mb-4">Record New Session</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Group</Label>
              <select
                value={groupId}
                onChange={(e) => setGroupId(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select group…</option>
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>{g.name} – {g.subject?.name}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Date</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label>Topic (optional)</Label>
              <Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. Unit 5 – Present Perfect" className="mt-1" />
            </div>
            <div>
              <Label>Homework (optional)</Label>
              <Input value={homeworkDesc} onChange={(e) => setHomeworkDesc(e.target.value)} placeholder="Homework description…" className="mt-1" />
            </div>
            <div className="md:col-span-2">
              <Label>Notes (optional)</Label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Session notes…"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={() => createSession.mutate()} disabled={!groupId || !date || createSession.isPending}>
              {createSession.isPending ? 'Creating…' : 'Create Session'}
            </Button>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </div>
      )}

      <DataTable
        loading={isLoading}
        data={sessions}
        rowKey={(s) => s.id}
        emptyMessage="No sessions recorded yet."
        columns={[
          {
            key: 'date',
            header: 'Date',
            render: (s) => (
              <span className="font-medium text-slate-800">{new Date(s.date).toLocaleDateString()}</span>
            ),
          },
          {
            key: 'group',
            header: 'Group',
            render: (s) => (
              <div>
                <p className="text-sm font-medium text-slate-800">{s.group?.name ?? '—'}</p>
                <p className="text-xs text-slate-400">{s.group?.subject?.name}</p>
              </div>
            ),
          },
          {
            key: 'topic',
            header: 'Topic',
            render: (s) => <span className="text-sm text-slate-600">{s.topic ?? '—'}</span>,
          },
          {
            key: 'homework',
            header: 'Homework',
            render: (s) => (
              <span className="text-sm text-slate-500 truncate max-w-xs block">{s.homeworkDesc ?? '—'}</span>
            ),
          },
          {
            key: 'attendance',
            header: 'Attendance',
            render: (s) => (
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                (s.attendance?.length ?? 0) > 0 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
              }`}>
                {(s.attendance?.length ?? 0) > 0 ? `${s.attendance?.length} marked` : 'Pending'}
              </span>
            ),
          },
        ]}
      />
    </div>
  )
}
