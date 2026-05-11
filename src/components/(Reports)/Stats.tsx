"use client"

import { AccessLog } from '@/libs/action/data'
import { CheckCircleIcon, WarningCircleIcon, DoorIcon, UsersIcon } from "@phosphor-icons/react"

interface StatsProps {
  logs: AccessLog[]
}

const Stats = ({ logs }: StatsProps) => {
  const totalAccess = logs.length
  const totalAllowed = logs.filter(l => l.status.toLowerCase() === 'allowed').length
  const totalDenied = logs.filter(l => l.status.toLowerCase() === 'denied').length

  const uniqueUsers = new Set(logs.map(l => l.user_id)).size
  const uniqueRooms = new Set(logs.map(l => l.room)).size
  const allowRate = totalAccess > 0 ? ((totalAllowed / totalAccess) * 100).toFixed(1) : '0'

  const cards = [
    {
      label: 'Total Access',
      value: totalAccess,
      icon: DoorIcon,
      color: 'blue',
      bgClass: 'bg-blue-500/10 border-blue-500/20',
      iconClass: 'text-blue-500',
    },
    {
      label: 'Allowed',
      value: totalAllowed,
      icon: CheckCircleIcon,
      color: 'emerald',
      bgClass: 'bg-emerald-500/10 border-emerald-500/20',
      iconClass: 'text-emerald-500',
    },
    {
      label: 'Denied',
      value: totalDenied,
      icon: WarningCircleIcon,
      color: 'red',
      bgClass: 'bg-red-500/10 border-red-500/20',
      iconClass: 'text-red-500',
    },
    {
      label: 'Unique Users',
      value: uniqueUsers,
      icon: UsersIcon,
      color: 'purple',
      bgClass: 'bg-purple-500/10 border-purple-500/20',
      iconClass: 'text-purple-500',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`relative overflow-hidden rounded-2xl border p-5 ${card.bgClass} transition-all hover:scale-[1.02]`}
        >
          <div className="flex items-center justify-between mb-3">
            <card.icon size={28} weight="duotone" className={card.iconClass} />
          </div>
          <p className="text-2xl font-black text-white tracking-tight">{card.value}</p>
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">{card.label}</p>
        </div>
      ))}

      {/* Extra info row */}
      <div className="col-span-2 lg:col-span-4 flex sm:justify-start justify-center flex-wrap gap-4">
        <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl px-4 py-2.5 flex items-center gap-2">
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Rooms:</span>
          <span className="text-sm font-bold text-white">{uniqueRooms}</span>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl px-4 py-2.5 flex items-center gap-2">
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Allow Rate:</span>
          <span className="text-sm font-bold text-emerald-400">{allowRate}%</span>
        </div>
      </div>
    </div>
  )
}

export default Stats
