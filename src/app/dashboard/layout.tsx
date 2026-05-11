import React from 'react'
import { Sidebar } from '@/components/ui/Sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div 
      className="flex h-screen overflow-hidden"
      style={{ backgroundColor: 'var(--bg-base)' }}
    >
      <Sidebar />
      <main 
        className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col"
        style={{ backgroundColor: 'var(--bg-base)' }}
      >
        {children}
      </main>
    </div>
  )
}
