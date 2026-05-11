"use client"

import Header from '@/components/ui/Header'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { apiFetch } from '@/libs/api'
import type { AccessEvent } from '@/types/types'
import type { AccessLog } from '@/libs/action/data'
import { CheckCircleIcon, WarningCircleIcon, CalendarIcon, ClockIcon, MapPinIcon, UserCircleIcon, ImageIcon, XIcon } from '@phosphor-icons/react'
import { cn } from '@/libs/utils'
import Image from 'next/image'

const LiveFeed = dynamic(() => import('./LiveFeed'), { ssr: false })

// ─── Latest Event Card ────────────────────────────────────────────────────────
const LatestEventCard = ({ event }: { event: AccessEvent | null }) => {
  const allowed = event?.status === 'allowed'

  return (
    <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50 rounded-3xl overflow-hidden">
      <div className="px-5 py-4 border-b border-zinc-800/50 flex items-center justify-between">
        <h3 className="text-sm font-bold text-white uppercase tracking-widest">Latest Access</h3>
        {event && (
          <span className={cn(
            'flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border',
            allowed
              ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
              : 'text-red-400 bg-red-500/10 border-red-500/20'
          )}>
            {allowed
              ? <CheckCircleIcon size={12} weight="fill" />
              : <WarningCircleIcon size={12} weight="fill" />
            }
            {event.status}
          </span>
        )}
      </div>

      {event ? (
        <div className="p-5 space-y-4">
          {/* Photo */}
          {event.photo_url ? (
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-zinc-800">
              <Image
                src={event.photo_url}
                alt="Latest capture"
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3">
                <span className="text-[10px] text-white/60 uppercase font-bold tracking-widest">Evidence Capture</span>
              </div>
            </div>
          ) : (
            <div className="w-full aspect-video rounded-2xl bg-zinc-800/50 border border-zinc-800 flex flex-col items-center justify-center gap-2">
              <ImageIcon size={32} className="text-zinc-600" />
              <span className="text-xs text-zinc-600">No photo captured</span>
            </div>
          )}

          {/* User Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold text-lg uppercase">
                {event.user_name ? event.user_name[0] : '?'}
              </div>
              <div>
                <div className="font-bold text-white">{event.user_name || 'Unknown User'}</div>
                {event.user_role && (
                  <div className="text-xs text-zinc-500 capitalize">{event.user_role}</div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <MapPinIcon size={14} className="text-zinc-600" />
                {event.room}
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <ClockIcon size={14} className="text-zinc-600" />
                {new Date(event.timestamp).toLocaleTimeString('id-ID')}
              </div>
            </div>

            <div className={cn(
              'text-xs px-3 py-2 rounded-xl border',
              allowed
                ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400'
                : 'bg-red-500/5 border-red-500/20 text-red-400'
            )}>
              {event.message}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 flex flex-col items-center justify-center text-center gap-3">
          <UserCircleIcon size={40} className="text-zinc-700" />
          <p className="text-zinc-500 text-sm">No recent access</p>
          <p className="text-zinc-600 text-xs">Events will appear here when someone taps their card</p>
        </div>
      )}
    </div>
  )
}

// ─── Access History Log ───────────────────────────────────────────────────────
const AccessHistoryItem = ({ log }: { log: AccessLog }) => {
  const allowed = log.status === 'allowed'
  return (
    <div className="flex items-center gap-3 py-3 border-b border-zinc-800/50 last:border-0">
      <div className={cn(
        'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
        allowed ? 'bg-emerald-500/10' : 'bg-red-500/10'
      )}>
        {allowed
          ? <CheckCircleIcon size={18} className="text-emerald-500" weight="duotone" />
          : <WarningCircleIcon size={18} className="text-red-500" weight="duotone" />
        }
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-bold text-white truncate">
          {log.name || log.user_name || 'Unknown'}
        </div>
        <div className="text-xs text-zinc-500 truncate flex items-center gap-1">
          <MapPinIcon size={10} /> {log.room}
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <div className={cn('text-[10px] font-black uppercase', allowed ? 'text-emerald-400' : 'text-red-400')}>
          {log.status}
        </div>
        <div className="text-[10px] text-zinc-600">
          {new Date(log.access_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  )
}

const AccessHistory = ({ logs, loading, error }: { logs: AccessLog[]; loading: boolean; error: string | null }) => {
  return (
    <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50 rounded-3xl overflow-hidden flex flex-col">
      <div className="px-5 py-4 border-b border-zinc-800/50 flex items-center justify-between">
        <h3 className="text-sm font-bold text-white uppercase tracking-widest">Access History</h3>
        <div className="flex items-center gap-1.5">
          <CalendarIcon size={14} className="text-zinc-500" />
          <span className="text-xs text-zinc-500">Recent {logs.length} records</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 max-h-96">
        {loading && (
          <div className="py-8 text-center text-zinc-500 text-sm">Loading history...</div>
        )}
        {error && (
          <div className="py-4 text-center text-red-400 text-sm">{error}</div>
        )}
        {!loading && !error && logs.length === 0 && (
          <div className="py-8 text-center text-zinc-600 text-sm">No access history found</div>
        )}
        {!loading && !error && logs.map((log) => (
          <AccessHistoryItem key={log.id} log={log} />
        ))}
      </div>
    </div>
  )
}

// ─── Photo Modal ──────────────────────────────────────────────────────────────
const PhotoModal = ({ url, onClose }: { url: string; onClose: () => void }) => (
  <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
    <button
      onClick={onClose}
      className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all hover:rotate-90"
    >
      <XIcon size={24} weight="bold" />
    </button>
    <div className="relative max-w-4xl w-full aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl animate-in zoom-in-95 duration-200">
      <Image src={url} alt="Access Capture" fill className="object-cover" unoptimized />
    </div>
  </div>
)

// ─── Main Page ────────────────────────────────────────────────────────────────
const MonitoringPage = () => {
  const [logs, setLogs] = useState<AccessLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [latestEvent, setLatestEvent] = useState<AccessEvent | null>(null)
  const [photoModal, setPhotoModal] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const fetchLogs = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await apiFetch<{ logs: AccessLog[] } | AccessLog[]>('/logs')
        if (!mounted) return
        const payload = Array.isArray(res) ? res : (res as { logs: AccessLog[] }).logs || []
        setLogs((payload as AccessLog[]).slice(0, 50))
      } catch (err) {
        if (!mounted) return
        setError(err instanceof Error ? err.message : 'Failed to fetch logs')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    void fetchLogs()
    return () => { mounted = false }
  }, [])

  const handleNewEvent = (e: AccessEvent) => {
    setLatestEvent(e)
    // Prepend to local history list too
    setLogs(prev => [{
      id: Date.now(),
      user_id: e.user_id ?? 0,
      user_name: e.user_name ?? undefined,
      room: e.room,
      status: e.status,
      photo_url: e.photo_url ?? undefined,
      access_time: e.timestamp,
    } as AccessLog, ...prev].slice(0, 50))
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <Header
        title="Live Monitoring"
        description="Real-time access events and access history for all rooms."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
        {/* Left: Live Feed — takes 2 columns on large screens */}
        <div className="lg:col-span-2 min-h-[600px]">
          <LiveFeed onEvent={handleNewEvent} />
        </div>

        {/* Right: Latest capture + history */}
        <div className="flex flex-col gap-6">
          <LatestEventCard event={latestEvent} />
          <AccessHistory logs={logs} loading={loading} error={error} />
        </div>
      </div>

      {photoModal && (
        <PhotoModal url={photoModal} onClose={() => setPhotoModal(null)} />
      )}
    </div>
  )
}

export default MonitoringPage