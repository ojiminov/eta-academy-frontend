import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { BookOpen, Award, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import api from '@/lib/api'
import { ApiResponse, Enrollment } from '@/types'

type Tab = 'active' | 'completed'

function CourseCard({ enrollment, tab }: { enrollment: Enrollment; tab: Tab }) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      {/* Thumbnail */}
      <div className="h-40 bg-gradient-to-br from-primary/20 via-primary/30 to-primary/50 flex items-center justify-center relative">
        {enrollment.course.thumbnailUrl ? (
          <img
            src={enrollment.course.thumbnailUrl}
            alt={enrollment.course.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <BookOpen className="h-12 w-12 text-primary/60" />
        )}
        <div className="absolute top-2 left-2">
          <Badge variant="secondary" className="text-xs">
            {enrollment.course.level}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-sm line-clamp-2 mb-1">
          {enrollment.course.title}
        </h3>
        <p className="text-xs text-muted-foreground mb-3">
          {enrollment.course.teacher.firstName} {enrollment.course.teacher.lastName}
        </p>

        {tab === 'active' ? (
          <>
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
              <span>Progress</span>
              <span className="font-medium">{enrollment.progressPct}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden mb-3">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${enrollment.progressPct}%` }}
              />
            </div>
            <Button size="sm" className="w-full" asChild>
              <Link to={`/courses/${enrollment.course.slug}`}>
                Continue
                <ChevronRight className="h-3 w-3 ml-1" />
              </Link>
            </Button>
          </>
        ) : (
          <>
            <p className="text-xs text-green-600 font-medium mb-3">
              Completed{' '}
              {enrollment.completedAt
                ? new Date(enrollment.completedAt).toLocaleDateString()
                : ''}
            </p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="flex-1" asChild>
                <Link to={`/courses/${enrollment.course.slug}`}>Review</Link>
              </Button>
              {enrollment.course.certificateOnCompletion && (
                <Button size="sm" className="flex-1" asChild>
                  <Link to={`/student/certificates`}>
                    <Award className="h-3 w-3 mr-1" />
                    Certificate
                  </Link>
                </Button>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

function SkeletonCourseCard() {
  return (
    <Card className="overflow-hidden animate-pulse">
      <div className="h-40 bg-muted" />
      <CardContent className="p-4 space-y-2">
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-3 bg-muted rounded w-1/2" />
        <div className="h-2 bg-muted rounded w-full mt-3" />
        <div className="h-8 bg-muted rounded w-full mt-2" />
      </CardContent>
    </Card>
  )
}

export default function MyCoursesPage() {
  const [activeTab, setActiveTab] = useState<Tab>('active')

  const { data, isLoading, isError } = useQuery({
    queryKey: ['student-enrollments'],
    queryFn: () => api.get<ApiResponse<Enrollment[]>>('/students/enrollments'),
  })

  const allEnrollments = data?.data ?? []
  const activeEnrollments = allEnrollments.filter((e) => e.status === 'active')
  const completedEnrollments = allEnrollments.filter((e) => e.status === 'completed')

  const displayedEnrollments =
    activeTab === 'active' ? activeEnrollments : completedEnrollments

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Courses</h1>
        <p className="text-muted-foreground mt-1">Track your learning progress</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b">
        <button
          onClick={() => setActiveTab('active')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'active'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Active Courses
          {!isLoading && (
            <span className="ml-2 rounded-full bg-muted px-1.5 py-0.5 text-xs">
              {activeEnrollments.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'completed'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Completed Courses
          {!isLoading && (
            <span className="ml-2 rounded-full bg-muted px-1.5 py-0.5 text-xs">
              {completedEnrollments.length}
            </span>
          )}
        </button>
      </div>

      {/* Error state */}
      {isError && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-6 text-center">
          <p className="text-destructive">Failed to load your courses. Please try again.</p>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCourseCard key={i} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !isError && displayedEnrollments.length === 0 && (
        <div className="rounded-lg border border-dashed p-12 text-center">
          {activeTab === 'active' ? (
            <>
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-1">No active courses</h3>
              <p className="text-muted-foreground text-sm mb-6">
                Browse our catalog and enroll in a course to start learning
              </p>
              <Button asChild>
                <Link to="/">Browse Courses</Link>
              </Button>
            </>
          ) : (
            <>
              <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-1">No completed courses yet</h3>
              <p className="text-muted-foreground text-sm mb-6">
                Finish your active courses to see them here
              </p>
              <Button variant="outline" onClick={() => setActiveTab('active')}>
                View Active Courses
              </Button>
            </>
          )}
        </div>
      )}

      {/* Courses grid */}
      {!isLoading && !isError && displayedEnrollments.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedEnrollments.map((enrollment) => (
            <CourseCard key={enrollment.id} enrollment={enrollment} tab={activeTab} />
          ))}
        </div>
      )}
    </div>
  )
}
