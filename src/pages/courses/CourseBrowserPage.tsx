import React, { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Search, Star, ChevronLeft, ChevronRight, Filter, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import api from '@/lib/api'
import { ApiResponse, Course, CourseLevel, PricingType } from '@/types'
import { cn } from '@/lib/utils'

const LEVELS: CourseLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
const PAGE_SIZE = 9

interface CourseFilters {
  search: string
  levels: CourseLevel[]
  pricingType: PricingType | 'all'
  page: number
}

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1">
      <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
      <span className="text-xs font-medium">{rating.toFixed(1)}</span>
      <span className="text-xs text-muted-foreground">({count})</span>
    </div>
  )
}

function CourseCard({ course }: { course: Course }) {
  const gradients = [
    'from-blue-400 to-indigo-600',
    'from-emerald-400 to-teal-600',
    'from-violet-400 to-purple-600',
    'from-orange-400 to-red-500',
    'from-pink-400 to-rose-600',
    'from-cyan-400 to-blue-500',
  ]
  const gradientIndex = course.id.charCodeAt(0) % gradients.length

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 group">
      {/* Thumbnail */}
      <div
        className={cn(
          'h-44 flex items-center justify-center bg-gradient-to-br relative overflow-hidden',
          gradients[gradientIndex],
        )}
      >
        {course.thumbnailUrl ? (
          <img
            src={course.thumbnailUrl}
            alt={course.title}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <span className="text-4xl text-white/80 font-bold select-none">
            {course.title.charAt(0)}
          </span>
        )}
        <div className="absolute top-2 left-2 flex gap-1">
          <Badge variant="secondary" className="text-xs backdrop-blur-sm bg-white/80">
            {course.level}
          </Badge>
          {course.pricingType === 'free' && (
            <Badge className="text-xs bg-green-500 text-white border-0">Free</Badge>
          )}
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-sm line-clamp-2 mb-1 min-h-[2.5rem]">
          {course.title}
        </h3>
        <p className="text-xs text-muted-foreground mb-2">
          {course.teacher.firstName} {course.teacher.lastName}
        </p>

        {course.ratingCount > 0 && (
          <div className="mb-2">
            <StarRating rating={course.ratingAvg} count={course.ratingCount} />
          </div>
        )}

        <div className="flex items-center justify-between mt-3 pt-3 border-t">
          <div>
            {course.pricingType === 'free' ? (
              <span className="text-green-600 font-semibold text-sm">Free</span>
            ) : (
              <span className="font-bold text-sm">
                {course.currency} {course.price.toFixed(2)}
              </span>
            )}
          </div>
          <Button size="sm" asChild>
            <Link to={`/courses/${course.slug}`}>View</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function SkeletonCourseCard() {
  return (
    <Card className="overflow-hidden animate-pulse">
      <div className="h-44 bg-muted" />
      <CardContent className="p-4 space-y-2">
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-3 bg-muted rounded w-1/2" />
        <div className="h-3 bg-muted rounded w-1/3 mt-2" />
        <div className="flex justify-between mt-3 pt-3 border-t">
          <div className="h-4 bg-muted rounded w-1/4" />
          <div className="h-7 bg-muted rounded w-16" />
        </div>
      </CardContent>
    </Card>
  )
}

export default function CourseBrowserPage() {
  const [filters, setFilters] = useState<CourseFilters>({
    search: '',
    levels: [],
    pricingType: 'all',
    page: 1,
  })
  const [searchInput, setSearchInput] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const queryParams = new URLSearchParams()
  if (filters.search) queryParams.set('search', filters.search)
  if (filters.levels.length > 0) queryParams.set('levels', filters.levels.join(','))
  if (filters.pricingType !== 'all') queryParams.set('pricingType', filters.pricingType)
  queryParams.set('page', String(filters.page))
  queryParams.set('limit', String(PAGE_SIZE))

  const { data, isLoading } = useQuery({
    queryKey: ['courses', filters],
    queryFn: () =>
      api.get<ApiResponse<Course[]>>(`/courses?${queryParams.toString()}`),
    placeholderData: (prev) => prev,
  })

  const courses = data?.data ?? []
  const total = data?.meta?.total ?? 0
  const totalPages = data?.meta?.totalPages ?? Math.ceil(total / PAGE_SIZE)

  const handleSearchSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      setFilters((prev) => ({ ...prev, search: searchInput, page: 1 }))
    },
    [searchInput],
  )

  const toggleLevel = useCallback((level: CourseLevel) => {
    setFilters((prev) => ({
      ...prev,
      page: 1,
      levels: prev.levels.includes(level)
        ? prev.levels.filter((l) => l !== level)
        : [...prev.levels, level],
    }))
  }, [])

  const setPricingType = useCallback((type: PricingType | 'all') => {
    setFilters((prev) => ({ ...prev, pricingType: type, page: 1 }))
  }, [])

  const clearFilters = useCallback(() => {
    setFilters({ search: '', levels: [], pricingType: 'all', page: 1 })
    setSearchInput('')
  }, [])

  const hasActiveFilters =
    filters.search || filters.levels.length > 0 || filters.pricingType !== 'all'

  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Level filter */}
      <div>
        <h3 className="font-semibold text-sm mb-3">English Level</h3>
        <div className="space-y-2">
          {LEVELS.map((level) => (
            <label key={level} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.levels.includes(level)}
                onChange={() => toggleLevel(level)}
                className="h-4 w-4 rounded border-input text-primary"
              />
              <span className="text-sm group-hover:text-primary transition-colors">
                {level}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Pricing filter */}
      <div>
        <h3 className="font-semibold text-sm mb-3">Pricing</h3>
        <div className="space-y-2">
          {(['all', 'free', 'paid'] as const).map((type) => (
            <label key={type} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="pricingType"
                checked={filters.pricingType === type}
                onChange={() => setPricingType(type)}
                className="h-4 w-4 text-primary"
              />
              <span className="text-sm capitalize group-hover:text-primary transition-colors">
                {type === 'all' ? 'All courses' : type}
              </span>
            </label>
          ))}
        </div>
      </div>

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="w-full text-muted-foreground"
        >
          <X className="h-4 w-4 mr-1" />
          Clear filters
        </Button>
      )}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Browse Courses</h1>
        <p className="text-muted-foreground mt-1">
          Discover the perfect course to improve your English
        </p>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button type="submit">Search</Button>
        <Button
          type="button"
          variant="outline"
          className="md:hidden"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Filter className="h-4 w-4" />
        </Button>
      </form>

      <div className="flex gap-8">
        {/* Desktop sidebar */}
        <aside className="hidden md:block w-56 flex-shrink-0">
          <div className="sticky top-24">
            <FilterSidebar />
          </div>
        </aside>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 z-40 flex">
            <div className="fixed inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
            <div className="relative z-50 bg-background w-72 p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">Filters</h2>
                <button onClick={() => setSidebarOpen(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>
              <FilterSidebar />
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Results count + active filters */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              {isLoading ? 'Loading...' : `${total} course${total !== 1 ? 's' : ''} found`}
            </p>
            {hasActiveFilters && (
              <div className="flex items-center gap-2 flex-wrap">
                {filters.levels.map((level) => (
                  <Badge
                    key={level}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => toggleLevel(level)}
                  >
                    {level} <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
                {filters.pricingType !== 'all' && (
                  <Badge
                    variant="secondary"
                    className="cursor-pointer capitalize"
                    onClick={() => setPricingType('all')}
                  >
                    {filters.pricingType} <X className="h-3 w-3 ml-1" />
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {isLoading
              ? Array.from({ length: PAGE_SIZE }).map((_, i) => (
                  <SkeletonCourseCard key={i} />
                ))
              : courses.map((course) => <CourseCard key={course.id} course={course} />)}
          </div>

          {/* Empty state */}
          {!isLoading && courses.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-muted-foreground text-lg">
                No courses found matching your criteria.
              </p>
              <Button variant="outline" className="mt-4" onClick={clearFilters}>
                Clear filters
              </Button>
            </div>
          )}

          {/* Pagination */}
          {!isLoading && totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilters((prev) => ({ ...prev, page: prev.page - 1 }))}
                disabled={filters.page <= 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  const page = i + 1
                  return (
                    <button
                      key={page}
                      onClick={() => setFilters((prev) => ({ ...prev, page }))}
                      className={cn(
                        'h-8 w-8 rounded-md text-sm font-medium transition-colors',
                        filters.page === page
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-accent',
                      )}
                    >
                      {page}
                    </button>
                  )
                })}
                {totalPages > 7 && (
                  <span className="px-2 text-muted-foreground">...</span>
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilters((prev) => ({ ...prev, page: prev.page + 1 }))}
                disabled={filters.page >= totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
