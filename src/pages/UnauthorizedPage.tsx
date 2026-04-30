import React from 'react'
import { Link } from 'react-router-dom'
import { ShieldX, Home, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-[calc(100vh-12rem)] flex-col items-center justify-center text-center px-4">
      <div className="mb-8">
        <div className="flex justify-center mb-4">
          <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center">
            <ShieldX className="h-10 w-10 text-destructive" />
          </div>
        </div>
        <h1 className="text-8xl font-extrabold text-muted/60 select-none">403</h1>
        <h2 className="text-2xl font-bold mt-2">Access Denied</h2>
        <p className="text-muted-foreground mt-2 max-w-sm">
          You don&apos;t have permission to view this page. Please contact your administrator
          if you believe this is an error.
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
          <ArrowLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>
      </div>
    </div>
  )
}
