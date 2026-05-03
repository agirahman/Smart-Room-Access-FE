import React from 'react'
import { Sidebar } from '@/components/ui/Sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col lg:flex-row h-screen bg-black overflow-hidden selection:bg-blue-500/30">
      <Sidebar />
      <main className="flex-1 overflow-y-auto overflow-x-hidden bg-zinc-950/50">
        {children}
      </main>
    </div>
  )
}
