"use client"

import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { AccessEvent } from '@/types/types'
import { CheckCircleIcon, WarningCircleIcon, WifiHighIcon, WifiSlashIcon } from '@phosphor-icons/react'
import { cn } from '@/libs/utils'
import Image from 'next/image'

interface LiveFeedProps {
  onEvent?: (e: AccessEvent) => void
}

const SOCKET_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000').replace(/^"|"$/g, '').trim()

const RoleBadge = ({ role }: { role?: string | null }) => {
  const colors: Record<string, string> = {
    admin: 'bg-red-500/10 text-red-400 border-red-500/20',
    staff: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    student: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  }
  if (!role) return null
  return (
    <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border', colors[role] || 'bg-zinc-800 text-zinc-400 border-zinc-700')}>
      {role}
    </span>
  )
}

const EventCard = ({ event, isLatest }: { event: AccessEvent; isLatest: boolean }) => {
  const allowed = event.status === 'allowed'
  const time = new Date(event.timestamp)

  return (
    <div className={cn(
      'flex items-center gap-4 p-4 rounded-2xl border transition-all',
      isLatest
        ? allowed
          ? 'bg-emerald-500/5 border-emerald-500/20 shadow-lg shadow-emerald-500/5'
          : 'bg-red-500/5 border-red-500/20 shadow-lg shadow-red-500/5'
        : 'bg-zinc-900/30 border-zinc-800/50'
    )}>
      {/* Photo or Avatar */}
      <div className={cn(
        'relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border',
        allowed ? 'border-emerald-500/30' : 'border-red-500/30'
      )}>
        {event.photo_url ? (
          <Image
            src={event.photo_url}
            alt="access photo"
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-500 text-xl font-bold">
            {event.user_name ? event.user_name[0].toUpperCase() : '?'}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-bold text-white text-sm truncate">
            {event.user_name || 'Unknown'}
          </span>
          <RoleBadge role={event.user_role} />
        </div>
        <div className="text-xs text-zinc-500 truncate">{event.room} • {event.message}</div>
      </div>

      {/* Status + Time */}
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        <div className={cn(
          'flex items-center gap-1 text-xs font-black uppercase tracking-wider',
          allowed ? 'text-emerald-400' : 'text-red-400'
        )}>
          {allowed
            ? <CheckCircleIcon size={14} weight="fill" />
            : <WarningCircleIcon size={14} weight="fill" />
          }
          {event.status}
        </div>
        <div className="text-[10px] text-zinc-600">
          {time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </div>
      </div>
    </div>
  )
}

const LiveFeed = ({ onEvent }: LiveFeedProps) => {
  const [events, setEvents] = useState<AccessEvent[]>([])
  const [connected, setConnected] = useState(false)
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    })

    socketRef.current = socket

    socket.on('connect', () => {
      console.log('[Socket] Connected:', socket.id)
      setConnected(true)
    })

    socket.on('disconnect', () => {
      console.log('[Socket] Disconnected')
      setConnected(false)
    })

    socket.on('access_event', (payload: AccessEvent) => {
      setEvents(prev => [payload, ...prev].slice(0, 50))
      if (onEvent) onEvent(payload)
    })

    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50 rounded-3xl overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/50">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-blue-500/10">
            <div className={cn(
              'w-2 h-2 rounded-full',
              connected ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'
            )} />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Live Access Feed</h3>
            <p className="text-xs text-zinc-500">{events.length} events received</p>
          </div>
        </div>

        <div className={cn(
          'flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full border',
          connected
            ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
            : 'text-red-400 bg-red-500/10 border-red-500/20'
        )}>
          {connected
            ? <><WifiHighIcon size={14} weight="bold" /> Connected</>
            : <><WifiSlashIcon size={14} weight="bold" /> Reconnecting...</>
          }
        </div>
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-zinc-800/50 flex items-center justify-center mb-4">
              <WifiHighIcon size={32} className="text-zinc-600" />
            </div>
            <p className="text-zinc-500 font-medium">Waiting for access events...</p>
            <p className="text-zinc-600 text-xs mt-1">
              {connected ? 'Connected and listening' : 'Trying to connect to server'}
            </p>
          </div>
        ) : (
          events.map((e, idx) => (
            <EventCard key={`${e.timestamp}-${idx}`} event={e} isLatest={idx === 0} />
          ))
        )}
      </div>
    </div>
  )
}

export default LiveFeed
