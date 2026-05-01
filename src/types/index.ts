// ─── Enums ────────────────────────────────────────────────────────────────────
export type UserRole = 'admin' | 'teacher' | 'student'
export type UserStatus = 'active' | 'suspended' | 'pending_verification' | 'deleted'
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused'
export type GroupStatus = 'active' | 'completed' | 'archived'
export type PaymentStatus = 'pending' | 'paid' | 'overdue' | 'cancelled'
export type GradeType = 'exam' | 'quiz' | 'assignment' | 'oral' | 'homework' | 'midterm' | 'final'
export type AnnouncementTarget = 'all' | 'students' | 'teachers'
export type SubjectCategory = 'english' | 'math' | 'science' | 'history' | 'coding' | 'music' | 'art' | 'other'

// ─── Core Entities ────────────────────────────────────────────────────────────
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  avatarUrl?: string
  phone?: string
  role: UserRole
  status: UserStatus
  emailVerified: boolean
  timezone: string
  locale: string
  lastLoginAt?: string
  createdAt: string
  updatedAt: string
}

export interface Student {
  id: string
  userId: string
  dateOfBirth?: string
  bio?: string
  address?: string
  parentName?: string
  parentPhone?: string
  notes?: string
  createdAt: string
  updatedAt: string
  user?: User
}

export interface Teacher {
  id: string
  userId: string
  bio?: string
  subjects: string[]
  qualifications: string[]
  salary?: number
  salaryCurrency: string
  isVerified: boolean
  createdAt: string
  updatedAt: string
  user?: User
}

export interface Subject {
  id: string
  name: string
  code: string
  description?: string
  category: SubjectCategory
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Schedule {
  id: string
  groupId: string
  dayOfWeek: DayOfWeek
  startTime: string
  endTime: string
  room?: string
}

export interface Group {
  id: string
  name: string
  subjectId: string
  teacherId: string
  level: string
  room?: string
  maxStudents: number
  status: GroupStatus
  startDate: string
  endDate?: string
  monthlyFee: number
  currency: string
  description?: string
  createdAt: string
  updatedAt: string
  subject?: Subject
  teacher?: Teacher & { user?: User }
  schedules?: Schedule[]
  _count?: { students: number }
}

export interface GroupStudent {
  id: string
  groupId: string
  studentId: string
  enrolledAt: string
  droppedAt?: string
  isActive: boolean
  notes?: string
  group?: Group
  student?: Student & { user?: User }
}

export interface ClassSession {
  id: string
  groupId: string
  teacherId: string
  date: string
  topic?: string
  notes?: string
  homeworkDesc?: string
  createdAt: string
  updatedAt: string
  group?: Group & { subject?: Subject }
  teacher?: Teacher & { user?: User }
  attendance?: Attendance[]
}

export interface Attendance {
  id: string
  classSessionId: string
  studentId: string
  groupStudentId: string
  status: AttendanceStatus
  note?: string
  createdAt: string
  updatedAt: string
  student?: Student & { user?: User }
}

export interface Grade {
  id: string
  studentId: string
  groupStudentId: string
  gradedById?: string
  type: GradeType
  title: string
  score: number
  maxScore: number
  date: string
  notes?: string
  createdAt: string
  updatedAt: string
  groupStudent?: GroupStudent & { group?: Group & { subject?: Subject } }
  student?: Student & { user?: User }
}

export interface Payment {
  id: string
  studentId: string
  groupId: string
  amount: number
  currency: string
  month: number
  year: number
  status: PaymentStatus
  paidAt?: string
  method?: string
  receiptUrl?: string
  notes?: string
  createdAt: string
  updatedAt: string
  student?: Student & { user?: User }
  group?: Group & { subject?: Subject }
}

export interface Announcement {
  id: string
  title: string
  body: string
  authorId: string
  target: AnnouncementTarget
  isPinned: boolean
  createdAt: string
  updatedAt: string
  author?: { firstName: string; lastName: string }
}

// ─── Dashboard Responses ──────────────────────────────────────────────────────
export interface AdminDashboardData {
  kpis: {
    totalStudents: number
    totalTeachers: number
    activeGroups: number
    totalGroups: number
    pendingPayments: number
    overduePayments: number
    revenueThisMonth: number
  }
  revenueByMonth: { month: number; year: number; amount: number }[]
  attendanceSummary: Record<string, number>
  recentAnnouncements: Announcement[]
  upcomingSessions: ClassSession[]
}

export interface TeacherDashboardData {
  teacher: Teacher
  kpis: {
    activeGroups: number
    totalStudents: number
    todaySessions: number
  }
  myGroups: Group[]
  todaySessions: ClassSession[]
  recentSessions: ClassSession[]
}

export interface StudentDashboardData {
  student: Student
  kpis: {
    activeGroups: number
    avgGradePercentage: number | null
    attendanceThisMonth: Record<string, number>
    pendingPayments: number
  }
  myGroups: GroupStudent[]
  recentGrades: Grade[]
  payments: Payment[]
  announcements: Announcement[]
}

// ─── API Helpers ──────────────────────────────────────────────────────────────
export interface ApiMeta {
  page?: number
  limit?: number
  total?: number
  totalPages?: number
}

export interface ApiError {
  code: string
  message: string
  details?: Record<string, string[]>
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  meta?: ApiMeta
  error?: ApiError
}
