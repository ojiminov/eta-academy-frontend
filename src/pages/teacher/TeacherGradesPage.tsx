import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import api from '@/lib/api'
import { ApiResponse, Grade, GradeType, Group } from '@/types'
import { PageHeader } from '@/components/ui/page-header'
import { DataTable } from '@/components/ui/data-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type GradesListResponse = { grades: Grade[]; total: number }
type GroupsListResponse = { groups: Group[]; total: number }

const gradeTypeColors: Record<GradeType, string> = {
  exam: 'bg-red-100 text-red-700',
  quiz: 'bg-orange-100 text-orange-700',
  assignment: 'bg-blue-100 text-blue-700',
  oral: 'bg-purple-100 text-purple-700',
  homework: 'bg-slate-100 text-slate-600',
  midterm: 'bg-amber-100 text-amber-700',
  final: 'bg-rose-100 text-rose-700',
}

export default function TeacherGradesPage() {
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [groupId, setGroupId] = useState('')
  const [studentGroupStudentId, setStudentGroupStudentId] = useState('')
  const [type, setType] = useState<GradeType>('exam')
  const [title, setTitle] = useState('')
  const [score, setScore] = useState('')
  const [maxScore, setMaxScore] = useState('100')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [notes, setNotes] = useState('')

  const { data: gradesData, isLoading } = useQuery({
    queryKey: ['teacher-grades'],
    queryFn: () =>
      api.get<ApiResponse<GradesListResponse>>('/grades?myGroups=true&include=student,group&limit=50'),
  })

  const { data: groupsData } = useQuery({
    queryKey: ['teacher-groups-grades'],
    queryFn: () =>
      api.get<ApiResponse<GroupsListResponse>>('/groups?status=active&myGroups=true&limit=50'),
  })

  const { data: studentsData } = useQuery({
    queryKey: ['group-students-grades', groupId],
    queryFn: () =>
      api.get<ApiResponse<{ students: Array<{ id: string; student: { user: { firstName: string; lastName: string } }; studentId: string }> }>>(
        `/groups/${groupId}/students`
      ),
    enabled: !!groupId,
  })

  const createGrade = useMutation({
    mutationFn: () => {
      const sel = studentsData?.data?.students?.find(s => s.id === studentGroupStudentId)
      return api.post('/grades', {
        studentId: sel?.studentId,
        groupStudentId: studentGroupStudentId,
        type,
        title,
        score: parseFloat(score),
        maxScore: parseFloat(maxScore),
        date,
        notes: notes || undefined,
      })
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['teacher-grades'] })
      setShowForm(false)
      setGroupId(''); setStudentGroupStudentId(''); setTitle(''); setScore(''); setNotes('')
    },
  })

  const grades: Grade[] = gradesData?.data?.grades ?? []
  const groups: Group[] = groupsData?.data?.groups ?? []
  const students = studentsData?.data?.students ?? []

  const getScoreColor = (score: number, maxScore: number) => {
    const pct = (score / maxScore) * 100
    if (pct >= 80) return 'text-green-600'
    if (pct >= 60) return 'text-amber-600'
    return 'text-red-500'
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <PageHeader
        title="Grades"
        subtitle="Enter and review student grades"
        action={
          <Button size="sm" className="gap-1.5" onClick={() => setShowForm(!showForm)}>
            <Plus className="w-4 h-4" /> Add Grade
          </Button>
        }
      />

      {showForm && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mb-6">
          <h3 className="font-semibold text-slate-800 mb-4">Add Grade</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Group</Label>
              <select
                value={groupId}
                onChange={(e) => { setGroupId(e.target.value); setStudentGroupStudentId('') }}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select group…</option>
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Student</Label>
              <select
                value={studentGroupStudentId}
                onChange={(e) => setStudentGroupStudentId(e.target.value)}
                disabled={!groupId}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                <option value="">Select student…</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.student?.user?.firstName} {s.student?.user?.lastName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Type</Label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as GradeType)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {(['exam','quiz','assignment','oral','homework','midterm','final'] as GradeType[]).map(t => (
                  <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Unit 3 Exam" className="mt-1" />
            </div>
            <div>
              <Label>Score</Label>
              <Input type="number" value={score} onChange={(e) => setScore(e.target.value)} placeholder="e.g. 85" className="mt-1" />
            </div>
            <div>
              <Label>Max Score</Label>
              <Input type="number" value={maxScore} onChange={(e) => setMaxScore(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label>Date</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label>Notes</Label>
              <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional notes…" className="mt-1" />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button
              onClick={() => createGrade.mutate()}
              disabled={!studentGroupStudentId || !title || !score || createGrade.isPending}
            >
              {createGrade.isPending ? 'Saving…' : 'Save Grade'}
            </Button>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </div>
      )}

      <DataTable
        loading={isLoading}
        data={grades}
        rowKey={(g) => g.id}
        emptyMessage="No grades recorded yet."
        columns={[
          {
            key: 'student',
            header: 'Student',
            render: (g) => (
              <span className="font-medium text-slate-900">
                {g.student?.user ? `${g.student.user.firstName} ${g.student.user.lastName}` : '—'}
              </span>
            ),
          },
          {
            key: 'group',
            header: 'Group / Subject',
            render: (g) => (
              <div>
                <p className="text-sm text-slate-700">{g.groupStudent?.group?.name ?? '—'}</p>
                <p className="text-xs text-slate-400">{g.groupStudent?.group?.subject?.name}</p>
              </div>
            ),
          },
          {
            key: 'type',
            header: 'Type',
            render: (g) => (
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${gradeTypeColors[g.type]}`}>
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
            render: (g) => (
              <span className={`font-bold text-sm ${getScoreColor(Number(g.score), Number(g.maxScore))}`}>
                {Number(g.score)} / {Number(g.maxScore)}
                <span className="ml-1 text-xs font-normal text-slate-400">
                  ({Math.round((Number(g.score) / Number(g.maxScore)) * 100)}%)
                </span>
              </span>
            ),
          },
          {
            key: 'date',
            header: 'Date',
            render: (g) => <span className="text-sm text-slate-500">{new Date(g.date).toLocaleDateString()}</span>,
          },
        ]}
      />
    </div>
  )
}
