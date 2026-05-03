"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  SquaresFourIcon, 
  DesktopIcon, 
  UsersIcon, 
  FileTextIcon, 
  ChartBarIcon, 
  SignOutIcon
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

  const handleLogout = async () => {
    await logoutAction()
    window.location.href = '/login'
  }

  return (
    <aside className="shrink-0 bg-zinc-950 border-zinc-800 border-b lg:border-b-0 lg:border-r flex lg:flex-col w-full lg:w-72 h-[72px] lg:h-screen lg:static sticky top-0 z-50">
      {/* Desktop Logo */}
      <div className="hidden lg:flex items-center gap-3 p-6 border-b border-zinc-800/50">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
          <span className="text-white font-bold text-lg">SR</span>
        </div>
        <div className="flex flex-col">
          <span className="text-white font-bold tracking-tight leading-tight">Smart Room</span>
          <span className="text-zinc-500 text-xs font-medium">Access Control</span>
        </div>
      </div>

      {/* Mobile Logo */}
      <div className="lg:hidden flex items-center justify-center w-[72px] border-r border-zinc-800 shrink-0">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <span className="text-white font-bold text-sm">SR</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-x-auto lg:overflow-y-auto flex flex-row lg:flex-col lg:py-6 lg:px-4 gap-1 lg:gap-2 scrollbar-none lg:scrollbar-thin lg:scrollbar-thumb-zinc-800 items-center lg:items-stretch px-2 ">
        <p className="hidden lg:block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 px-2">Menu</p>
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link 
              key={item.href} 
              href={item.href}
              title={item.name}
              className={cn(
                "flex items-center justify-center lg:justify-start gap-3 p-3 lg:px-3 lg:py-3 rounded-xl transition-all font-medium text-sm group shrink-0 lg:shrink",
                isActive 
                  ? "bg-blue-600/10 text-blue-500" 
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900"
              )}
            >
              <item.icon 
                size={24} 
                weight={isActive ? "fill" : "regular"} 
                className={cn(
                  "transition-transform group-hover:scale-110 lg:w-5 lg:h-5",
                  isActive ? "text-blue-500" : "text-zinc-500 group-hover:text-white"
                )} 
              />
              <span className="hidden lg:block">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Logout Section */}
      <div className="border-l lg:border-l-0 lg:border-t border-zinc-800/50 flex items-center justify-center lg:p-4 shrink-0 px-2 lg:px-0">
        <button 
          onClick={handleLogout}
          title="Logout"
          className="flex items-center justify-center lg:justify-start gap-3 p-3 lg:px-3 lg:py-3 lg:w-full rounded-xl transition-all font-medium text-sm text-red-500/80 hover:text-red-500 hover:bg-red-500/10 group"
        >
          <SignOutIcon 
            size={24} 
            className="text-red-500/50 group-hover:text-red-500 transition-transform lg:group-hover:-translate-x-1 lg:w-5 lg:h-5" 
          />
          <span className="hidden lg:block">Logout</span>
        </button>
      </div>
    </aside>
  )
}
