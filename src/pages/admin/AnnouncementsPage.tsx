import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Pin } from 'lucide-react'
import api from '@/lib/api'
import { ApiResponse, Announcement, AnnouncementTarget } from '@/types'
import { PageHeader } from '@/components/ui/page-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type AnnouncementsListResponse = { announcements: Announcement[]; total: number }

const targetColors: Record<AnnouncementTarget, string> = {
  all: 'bg-indigo-100 text-indigo-700',
  students: 'bg-green-100 text-green-700',
  teachers: 'bg-blue-100 text-blue-700',
}

export default function AnnouncementsPage() {
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [target, setTarget] = useState<AnnouncementTarget>('all')
  const [isPinned, setIsPinned] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-announcements'],
    queryFn: () => api.get<ApiResponse<AnnouncementsListResponse>>('/announcements?limit=50'),
  })

  const create = useMutation({
    mutationFn: () => api.post('/announcements', { title, body, target, isPinned }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-announcements'] })
      setShowForm(false)
      setTitle(''); setBody(''); setTarget('all'); setIsPinned(false)
    },
  })

  const announcements: Announcement[] = data?.data?.announcements ?? []

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <PageHeader
        title="Announcements"
        subtitle="Post updates for students and teachers"
        action={
          <Button size="sm" className="gap-1.5" onClick={() => setShowForm(!showForm)}>
            <Plus className="w-4 h-4" /> New Announcement
          </Button>
        }
      />

      {showForm && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mb-6">
          <h3 className="font-semibold text-slate-800 mb-4">New Announcement</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Announcement title…" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="body">Message</Label>
              <textarea
                id="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write your announcement…"
                rows={4}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>
            <div className="flex items-center gap-4">
              <div>
                <Label>Audience</Label>
                <div className="flex gap-2 mt-1">
                  {(['all', 'students', 'teachers'] as AnnouncementTarget[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTarget(t)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                        target === t
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 mt-5">
                <input
                  type="checkbox"
                  id="pinned"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="rounded border-slate-300"
                />
                <Label htmlFor="pinned">Pin announcement</Label>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button onClick={() => create.mutate()} disabled={!title || !body || create.isPending}>
                {create.isPending ? 'Posting…' : 'Post Announcement'}
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-20 bg-slate-100 rounded-xl animate-pulse" />)}
        </div>
      ) : announcements.length === 0 ? (
        <div className="text-center py-16 text-slate-400">No announcements yet.</div>
      ) : (
        <div className="space-y-3">
          {announcements.map((a) => (
            <div key={a.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <div className="flex items-start gap-3">
                {a.isPinned && <Pin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-semibold text-slate-900">{a.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${targetColors[a.target]}`}>
                      {a.target}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 whitespace-pre-wrap">{a.body}</p>
                  <p className="text-xs text-slate-400 mt-2">
                    By {a.author?.firstName} {a.author?.lastName} · {new Date(a.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
