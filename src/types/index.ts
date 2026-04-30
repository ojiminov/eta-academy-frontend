export type UserRole = 'student' | 'teacher' | 'admin' | 'billing_manager'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  avatarUrl?: string
  role: UserRole
  status: 'active' | 'inactive' | 'suspended'
  emailVerified: boolean
  timezone: string
  createdAt?: string
  updatedAt?: string
}

export interface StudentProfile {
  id: string
  userId: string
  englishLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
  bio?: string
  goals?: string
  xpPoints: number
  streakDays: number
  lastActivityAt?: string
}

export interface TeacherProfile {
  id: string
  userId: string
  bio?: string
  specializations: string[]
  qualifications: string[]
  ratingAvg: number
  ratingCount: number
  isVerified: boolean
}

export interface TeacherSummary {
  id: string
  firstName: string
  lastName: string
  avatarUrl?: string
}

export interface CourseCategory {
  id: string
  name: string
  slug: string
}

export type CourseLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'all_levels'
export type CourseStatus = 'draft' | 'published' | 'archived'
export type PricingType = 'free' | 'paid' | 'subscription'

export interface Course {
  id: string
  title: string
  slug: string
  shortDescription: string
  thumbnailUrl?: string
  level: CourseLevel
  status: CourseStatus
  pricingType: PricingType
  price: number
  currency: string
  durationHours: number
  ratingAvg: number
  ratingCount: number
  enrollmentCount: number
  teacher: TeacherSummary
  category?: CourseCategory
  certificateOnCompletion: boolean
  createdAt?: string
  updatedAt?: string
}

export type ContentType = 'video' | 'audio' | 'text' | 'quiz' | 'assignment'

export interface Lesson {
  id: string
  courseId: string
  title: string
  slug: string
  contentType: ContentType
  videoUrl?: string
  audioUrl?: string
  contentHtml?: string
  durationSeconds: number
  sortOrder: number
  isPreview: boolean
  isPublished: boolean
  createdAt?: string
  updatedAt?: string
}

export type EnrollmentStatus = 'active' | 'completed' | 'dropped' | 'expired'

export interface Enrollment {
  id: string
  studentId: string
  courseId: string
  status: EnrollmentStatus
  enrolledAt: string
  completedAt?: string
  progressPct: number
  course: Course
}

export type CertificateStatus = 'pending' | 'issued' | 'revoked'

export interface Certificate {
  id: string
  studentId: string
  courseId: string
  certificateNumber: string
  status: CertificateStatus
  pdfUrl?: string
  verificationUrl?: string
  issuedAt: string
}

export interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

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

export interface StudentDashboard {
  student: StudentProfile
  enrollments: Enrollment[]
  xpPoints: number
  streakDays: number
  completedCoursesCount: number
  certificatesCount: number
}
