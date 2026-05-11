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
    <div 
      className="border rounded-lg overflow-hidden flex flex-col"
      style={{
        backgroundColor: 'var(--bg-elevated)',
        borderColor: 'var(--border-default)',
        boxShadow: 'var(--shadow-md)'
      }}
    >
      <div 
        className="px-6 py-4 border-b flex items-center justify-between"
        style={{
          borderBottomColor: 'var(--border-subtle)',
          fontFamily: 'var(--font-body)'
        }}
      >
        <h3 
          className="text-sm font-bold uppercase tracking-wide"
          style={{
            fontFamily: 'var(--font-body)',
            color: 'var(--text-muted)',
            letterSpacing: '0.08em'
          }}
        >
          Akses Terbaru
        </h3>
        {event && (
          <span 
            className={cn(
              'flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide border'
            )}
            style={{
              backgroundColor: allowed ? 'var(--status-online-muted)' : 'var(--status-offline-muted)',
              color: allowed ? 'var(--status-online)' : 'var(--status-offline)',
              borderColor: allowed ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'
            }}
          >
            {allowed
              ? <CheckCircleIcon size={12} weight="fill" />
              : <WarningCircleIcon size={12} weight="fill" />
            }
            {event.status === 'allowed' ? 'DITERIMA' : 'DITOLAK'}
          </span>
        )}
      </div>

      {event ? (
        <div className="p-6 space-y-4">
          {/* Photo */}
          {event.photo_url ? (
            <div className="relative w-full aspect-video rounded-lg overflow-hidden border" style={{ borderColor: 'var(--border-default)' }}>
              <Image
                src={event.photo_url}
                alt="Latest capture"
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3">
                <span className="text-xs text-white/70 uppercase font-bold tracking-wider" style={{ fontFamily: 'var(--font-mono)' }}>
                  BUKTI CAPTURE
                </span>
              </div>
            </div>
          ) : (
            <div 
              className="w-full aspect-video rounded-lg border flex flex-col items-center justify-center gap-2"
              style={{
                backgroundColor: 'var(--bg-overlay)',
                borderColor: 'var(--border-default)'
              }}
            >
              <ImageIcon size={32} style={{ color: 'var(--text-muted)' }} />
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Tidak ada foto terambil</span>
            </div>
          )}

          {/* User Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold uppercase"
                style={{
                  backgroundColor: 'var(--accent-muted)',
                  color: 'var(--accent-primary)'
                }}
              >
                {event.user_name ? event.user_name[0] : '?'}
              </div>
              <div>
                <div 
                  className="font-bold"
                  style={{
                    fontFamily: 'var(--font-body)',
                    color: 'var(--text-primary)'
                  }}
                >
                  {event.user_name || 'Pengguna Tidak Dikenal'}
                </div>
                {event.user_role && (
                  <div 
                    className="text-xs capitalize"
                    style={{
                      fontFamily: 'var(--font-body)',
                      color: 'var(--text-muted)'
                    }}
                  >
                    {event.user_role}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 text-xs" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}>
              <div className="flex items-center gap-2">
                <MapPinIcon size={14} style={{ color: 'var(--text-muted)' }} />
                {event.room}
              </div>
              <div className="flex items-center gap-2">
                <ClockIcon size={14} style={{ color: 'var(--text-muted)' }} />
                {new Date(event.timestamp).toLocaleTimeString('id-ID')}
              </div>
            </div>

            <div 
              className={cn('text-xs px-3 py-2 rounded-lg border')}
              style={{
                backgroundColor: allowed ? 'var(--status-online-muted)' : 'var(--status-offline-muted)',
                color: allowed ? 'var(--status-online)' : 'var(--status-offline)',
                borderColor: allowed ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)',
                fontFamily: 'var(--font-body)'
              }}
            >
              {event.message}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 flex flex-col items-center justify-center text-center gap-3">
          <UserCircleIcon size={40} style={{ color: 'var(--text-muted)' }} />
          <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}>
            Tidak ada akses terakhir
          </p>
          <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)', fontSize: '12px' }}>
            Event akan muncul ketika seseorang menyentuh kartu
          </p>
        </div>
      )}
    </div>
  )
}

// ─── Access History Log ───────────────────────────────────────────────────────
const AccessHistoryItem = ({ log }: { log: AccessLog }) => {
  const allowed = log.status === 'allowed'
  return (
    <div 
      className="flex items-center gap-3 py-3 border-b last:border-0"
      style={{ borderBottomColor: 'var(--border-subtle)' }}
    >
      <div 
        className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0')}
        style={{
          backgroundColor: allowed ? 'var(--status-online-muted)' : 'var(--status-offline-muted)'
        }}
      >
        {allowed
          ? <CheckCircleIcon size={16} style={{ color: 'var(--status-online)' }} weight="duotone" />
          : <WarningCircleIcon size={16} style={{ color: 'var(--status-offline)' }} weight="duotone" />
        }
      </div>
      <div className="flex-1 min-w-0">
        <div 
          className="text-sm font-bold truncate"
          style={{
            fontFamily: 'var(--font-body)',
            color: 'var(--text-primary)'
          }}
        >
          {log.name || log.user_name || 'Tidak Dikenal'}
        </div>
        <div 
          className="text-xs truncate flex items-center gap-1"
          style={{
            fontFamily: 'var(--font-body)',
            color: 'var(--text-muted)'
          }}
        >
          <MapPinIcon size={10} /> {log.room}
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <div 
          className={cn('text-xs font-bold uppercase')}
          style={{
            fontFamily: 'var(--font-mono)',
            color: allowed ? 'var(--status-online)' : 'var(--status-offline)'
          }}
        >
          {log.status === 'allowed' ? 'DITERIMA' : 'DITOLAK'}
        </div>
        <div 
          className="text-xs"
          style={{
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-muted)'
          }}
        >
          {new Date(log.access_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  )
}

const AccessHistory = ({ logs, loading, error }: { logs: AccessLog[]; loading: boolean; error: string | null }) => {
  return (
    <div 
      className="border rounded-lg overflow-hidden flex flex-col"
      style={{
        backgroundColor: 'var(--bg-elevated)',
        borderColor: 'var(--border-default)',
        boxShadow: 'var(--shadow-md)'
      }}
    >
      <div 
        className="px-6 py-4 border-b flex items-center justify-between"
        style={{
          borderBottomColor: 'var(--border-subtle)'
        }}
      >
        <h3 
          className="text-sm font-bold uppercase tracking-wide"
          style={{
            fontFamily: 'var(--font-body)',
            color: 'var(--text-muted)',
            letterSpacing: '0.08em'
          }}
        >
          Riwayat Akses
        </h3>
        <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>
          <CalendarIcon size={14} />
          <span>{logs.length} catatan</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 max-h-96">
        {loading && (
          <div className="py-8 text-center" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)', fontSize: '14px' }}>
            Memuat riwayat...
          </div>
        )}
        {error && (
          <div className="py-4 text-center" style={{ color: 'var(--status-offline)', fontFamily: 'var(--font-body)', fontSize: '14px' }}>
            {error}
          </div>
        )}
        {!loading && !error && logs.length === 0 && (
          <div className="py-8 text-center" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)', fontSize: '14px' }}>
            Tidak ada riwayat akses
          </div>
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
  <div 
    className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md"
    style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }}
  >
    <button
      onClick={onClose}
      className="absolute top-6 right-6 w-12 h-12 rounded-lg flex items-center justify-center transition-all hover:scale-110"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        color: 'var(--text-primary)'
      }}
    >
      <XIcon size={24} weight="bold" />
    </button>
    <div className="relative max-w-4xl w-full aspect-video rounded-lg overflow-hidden border shadow-lg" style={{ borderColor: 'var(--border-strong)' }}>
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
        setError(err instanceof Error ? err.message : 'Gagal memuat log')
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
    <div 
      className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-8"
      style={{
        backgroundColor: 'var(--bg-base)',
        fontFamily: 'var(--font-body)'
      }}
    >
      <div className="max-w-7xl mx-auto">
        <Header
          title="Pemantauan Live"
          description="Event akses real-time dan riwayat akses untuk semua ruangan."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
          {/* Left: Live Feed — takes 2 columns on large screens */}
          <div className="lg:col-span-2 min-h-96">
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
    </div>
  )
}

export default MonitoringPage