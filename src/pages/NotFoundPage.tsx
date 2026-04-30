import React from 'react'
import { Link } from 'react-router-dom'
import { GraduationCap, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[calc(100vh-12rem)] flex-col items-center justify-center text-center px-4">
      <div className="mb-8">
        <div className="flex justify-center mb-4">
          <GraduationCap className="h-16 w-16 text-primary/30" />
        </div>
        <h1 className="text-8xl font-extrabold text-primary/20 select-none">404</h1>
        <h2 className="text-2xl font-bold mt-2">Page not found</h2>
        <p className="text-muted-foreground mt-2 max-w-sm">
          Sorry, the page you are looking for doesn&apos;t exist or has been moved.
        </p>
      </div>

      <div className="flex gap-3">
        <Button asChild>
          <Link to="/">
            <Home className="h-4 w-4 mr-2" />
            Go Home
          </Link>
        </Button>
        <Button variant="outline" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </div>
    </div>
  )
}
