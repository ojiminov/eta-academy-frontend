import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { CheckCircle, XCircle, Clock, FileCheck } from 'lucide-react'
import api from '@/lib/api'
import { ApiResponse, ClassSession, Attendance, AttendanceStatus, Group } from '@/types'
import { PageHeader } from '@/components/ui/page-header'
import { Spinner } from '@/components/ui/spinner'
import { Label } from '@/components/ui/label'

type SessionsListResponse = { sessions: ClassSession[]; total: number }
type GroupsListResponse = { groups: Group[]; total: number }

interface StudentAttRow {
  groupStudentId: string
  studentId: string
  name: string
  status: AttendanceStatus
  existingId?: string
}

const statusConfig: Record<AttendanceStatus, { label: string; icon: React.ReactNode; color: string }> = {
  present: { label: 'Present', icon: <CheckCircle className="w-4 h-4" />, color: 'bg-green-100 text-green-700 border-green-200' },
  absent: { label: 'Absent', icon: <XCircle className="w-4 h-4" />, color: 'bg-red-100 text-red-700 border-red-200' },
  late: { label: 'Late', icon: <Clock className="w-4 h-4" />, color: 'bg-amber-100 text-amber-700 border-amber-200' },
  excused: { label: 'Excused', icon: <FileCheck className="w-4 h-4" />, color: 'bg-blue-100 text-blue-700 border-blue-200' },
}

export default function TeacherAttendancePage() {
  const qc = useQueryClient()
  const [selectedGroupId, setSelectedGroupId] = useState('')
  const [selectedSessionId, setSelectedSessionId] = useState('')
  const [rows, setRows] = useState<StudentAttRow[]>([])
  const [loaded, setLoaded] = useState(false)

  const { data: groupsData } = useQuery({
    queryKey: ['teacher-groups-att'],
    queryFn: () =>
      api.get<ApiResponse<GroupsListResponse>>('/groups?status=active&myGroups=true&limit=50'),
  })

  const { data: sessionsData } = useQuery({
    queryKey: ['teacher-sessions-att', selectedGroupId],
    queryFn: () =>
      api.get<ApiResponse<SessionsListResponse>>(
        `/sessions?groupId=${selectedGroupId}&limit=20&orderBy=date_desc`
      ),
    enabled: !!selectedGroupId,
  })

  const { isLoading: loadingSession } = useQuery({
    queryKey: ['session-attendance', selectedSessionId],
    queryFn: async () => {
      const [sessionRes, studentsRes] = await Promise.all([
        api.get<ApiResponse<ClassSession>>(`/sessions/${selectedSessionId}?include=attendance`),
        api.get<ApiResponse<{ students: Array<{ id: string; studentId: string; student: { user: { firstName: string; lastName: string } } }> }>>(`/groups/${selectedGroupId}/students`),
      ])
      const session = sessionRes.data
      const students = studentsRes.data?.students ?? []
      const attMap = new Map<string, Attendance>()
      ;(session.attendance ?? []).forEach((a: Attendance) => attMap.set(a.studentId, a))

      const newRows: StudentAttRow[] = students.map((gs) => ({
        groupStudentId: gs.id,
        studentId: gs.studentId,
        name: `${gs.student?.user?.firstName} ${gs.student?.user?.lastName}`,
        status: attMap.get(gs.studentId)?.status ?? 'present',
        existingId: attMap.get(gs.studentId)?.id,
      }))
      setRows(newRows)
      setLoaded(true)
      return session
    },
    enabled: !!selectedSessionId && !!selectedGroupId,
  })

  const saveAttendance = useMutation({
    mutationFn: () =>
      api.post(`/sessions/${selectedSessionId}/attendance`, {
        attendance: rows.map((r) => ({
          studentId: r.studentId,
          groupStudentId: r.groupStudentId,
          status: r.status,
        })),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['session-attendance', selectedSessionId] })
      alert('Attendance saved!')
    },
  })

  const groups: Group[] = groupsData?.data?.groups ?? []
  const sessions: ClassSession[] = sessionsData?.data?.sessions ?? []

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto">
      <PageHeader
        title="Mark Attendance"
        subtitle="Select a session to record student attendance"
      />

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Group</Label>
            <select
              value={selectedGroupId}
              onChange={(e) => { setSelectedGroupId(e.target.value); setSelectedSessionId(''); setLoaded(false) }}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select group…</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>
          <div>
            <Label>Session</Label>
            <select
              value={selectedSessionId}
              onChange={(e) => { setSelectedSessionId(e.target.value); setLoaded(false) }}
              disabled={!selectedGroupId}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              <option value="">Select session…</option>
              {sessions.map((s) => (
                <option key={s.id} value={s.id}>
                  {new Date(s.date).toLocaleDateString()}{s.topic ? ` — ${s.topic}` : ''}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loadingSession && (
        <div className="flex justify-center py-8">
          <Spinner className="w-6 h-6 text-indigo-500" />
        </div>
      )}

      {loaded && rows.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800">Students ({rows.length})</h3>
            <button
              onClick={() => saveAttendance.mutate()}
              disabled={saveAttendance.isPending}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {saveAttendance.isPending ? 'Saving…' : 'Save Attendance'}
            </button>
          </div>
          <div className="divide-y divide-slate-50">
            {rows.map((row, idx) => (
              <div key={row.studentId} className="flex items-center gap-3 px-5 py-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-xs shrink-0">
                  {row.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                </div>
                <span className="flex-1 text-sm font-medium text-slate-800">{row.name}</span>
                <div className="flex gap-1.5">
                  {(Object.keys(statusConfig) as AttendanceStatus[]).map((s) => {
                    const cfg = statusConfig[s]
                    return (
                      <button
                        key={s}
                        onClick={() => {
                          const updated = [...rows]
                          updated[idx] = { ...updated[idx], status: s }
                          setRows(updated)
                        }}
                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                          row.status === s ? cfg.color : 'border-slate-100 text-slate-400 hover:border-slate-200'
                        }`}
                      >
                        {cfg.icon}
                        <span className="hidden sm:inline">{cfg.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {loaded && rows.length === 0 && (
        <p className="text-center text-slate-400 py-8">No students enrolled in this group.</p>
      )}
    </div>
  )
}
