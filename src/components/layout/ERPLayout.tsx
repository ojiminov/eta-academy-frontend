import React, { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Users, BookOpen, Group, CalendarDays,
  ClipboardList, GraduationCap, CreditCard, Megaphone,
  LogOut, Menu, X, ChevronRight, Settings, BookMarked,
} from 'lucide-react'
import useAuthStore from '@/stores/authStore'
import { UserRole } from '@/types'

interface NavItem {
  label: string
  to: string
  icon: React.ComponentType<{ className?: string }>
}

const adminNav: NavItem[] = [
  { label: 'Dashboard',     to: '/admin/dashboard',      icon: LayoutDashboard },
  { label: 'Students',      to: '/admin/students',       icon: GraduationCap   },
  { label: 'Teachers',      to: '/admin/teachers',       icon: Users           },
  { label: 'Groups',        to: '/admin/groups',         icon: Group           },
  { label: 'Subjects',      to: '/admin/subjects',       icon: BookOpen        },
  { label: 'Payments',      to: '/admin/payments',       icon: CreditCard      },
  { label: 'Announcements', to: '/admin/announcements',  icon: Megaphone       },
]

const teacherNav: NavItem[] = [
  { label: 'Dashboard',  to: '/teacher/dashboard', icon: LayoutDashboard },
  { label: 'My Groups',  to: '/teacher/groups',    icon: BookMarked      },
  { label: 'Sessions',   to: '/teacher/sessions',  icon: CalendarDays    },
  { label: 'Attendance', to: '/teacher/attendance',icon: ClipboardList   },
  { label: 'Grades',     to: '/teacher/grades',    icon: ClipboardList   },
]

const studentNav: NavItem[] = [
  { label: 'Dashboard',  to: '/student/dashboard',  icon: LayoutDashboard },
  { label: 'My Groups',  to: '/student/groups',     icon: BookMarked      },
  { label: 'Grades',     to: '/student/grades',     icon: ClipboardList   },
  { label: 'Payments',   to: '/student/payments',   icon: CreditCard      },
  { label: 'Attendance', to: '/student/attendance', icon: CalendarDays    },
]

const navByRole: Record<UserRole, NavItem[]> = {
  admin:   adminNav,
  teacher: teacherNav,
  student: studentNav,
}

const roleLabel: Record<UserRole, string> = {
  admin:   'Admin',
  teacher: 'Teacher',
  student: 'Student',
}

const roleBadgeColor: Record<UserRole, string> = {
  admin:   'bg-purple-500/20 text-purple-300',
  teacher: 'bg-blue-500/20 text-blue-300',
  student: 'bg-green-500/20 text-green-300',
}

export default function ERPLayout() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (!user) return null

  const nav = navByRole[user.role] ?? []
  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
          E
        </div>
        <span className="text-white font-semibold text-lg tracking-tight">ETA Academy</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                isActive
                  ? 'bg-white/15 text-white'
                  : 'text-slate-300 hover:bg-white/8 hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                <span>{item.label}</span>
                {isActive && <ChevronRight className="ml-auto w-3.5 h-3.5 text-slate-400" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Footer */}
      <div className="px-3 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/8 transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-semibold shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user.firstName} {user.lastName}</p>
            <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${roleBadgeColor[user.role]}`}>
              {roleLabel[user.role]}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-md text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 bg-slate-900 flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-64 bg-slate-900 flex flex-col z-50">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Top Bar */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-semibold text-slate-800">ETA Academy</span>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-semibold">
            {initials}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
