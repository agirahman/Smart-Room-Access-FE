"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  SquaresFourIcon, 
  DesktopIcon, 
  UsersIcon, 
  FileTextIcon, 
  ChartBarIcon, 
  SignOutIcon,
  CaretLeft
} from '@phosphor-icons/react'
import { logoutAction } from '@/libs/action/auth'
import { cn } from '@/libs/utils'

const navItems = [
  { name: 'Overview', href: '/dashboard', icon: SquaresFourIcon },
  { name: 'Monitoring', href: '/dashboard/monitoring', icon: DesktopIcon },
  { name: 'Users', href: '/dashboard/users', icon: UsersIcon },
  { name: 'Logs', href: '/dashboard/logs', icon: FileTextIcon },
  { name: 'Reports', href: '/dashboard/reports', icon: ChartBarIcon },
]

export function Sidebar() {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await logoutAction()
    window.location.href = '/login'
  }

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg hover:bg-[var(--bg-overlay)] transition-colors"
      >
        <CaretLeft size={20} weight="bold" />
      </button>

      {/* Sidebar Backdrop (Mobile) */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static top-0 left-0 h-screen bg-[var(--bg-surface)] border-r border-[var(--border-default)]",
          "flex flex-col transition-all duration-300 z-40",
          "w-220px lg:w-56 lg:w-[220px]",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          "lg:w-[220px] md:w-[220px]"
        )}
      >
        {/* Logo Section */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-[var(--border-subtle)]">
          <div className="w-10 h-10 rounded-lg bg-[var(--accent-primary)] flex items-center justify-center shadow-[var(--shadow-accent)] flex-shrink-0">
            <span className="text-white font-bold text-base" style={{ fontFamily: 'var(--font-display)' }}>SR</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[var(--text-primary)] font-bold text-sm" style={{ fontFamily: 'var(--font-display)' }}>
              Smart Room
            </span>
            <span className="text-[var(--text-muted)] text-xs font-medium" style={{ fontFamily: 'var(--font-body)' }}>
              Access Control
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-6">
          <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-4 px-3" style={{ fontFamily: 'var(--font-body)', letterSpacing: '0.08em' }}>
            Menu
          </p>
          
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                    "text-sm font-medium",
                    isActive
                      ? "bg-[var(--accent-muted)] text-[var(--accent-hover)] border-l-3 border-[var(--accent-primary)] pl-2.5"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-overlay)]"
                  )}
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  <item.icon
                    size={18}
                    weight={isActive ? "fill" : "regular"}
                    className={cn(
                      "flex-shrink-0",
                      isActive ? "text-[var(--accent-primary)]" : "text-[var(--text-secondary)]"
                    )}
                  />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Logout Section */}
        <div className="border-t border-[var(--border-subtle)] px-3 py-4">
          <button
            onClick={handleLogout}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
              "text-sm font-medium",
              "text-[var(--status-offline)] hover:bg-[var(--status-offline-muted)] hover:text-[var(--status-offline)]"
            )}
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <SignOutIcon size={18} weight="regular" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}
