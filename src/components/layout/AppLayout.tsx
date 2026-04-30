import React from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'

export function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 pt-24">
        <Outlet />
      </main>
      <footer className="border-t bg-white">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} ETA Academy. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
