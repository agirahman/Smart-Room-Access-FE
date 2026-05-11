"use client"

import { useEffect, useState, useRef } from "react"
import Header from "@/components/ui/Header"
import { getDashboardStats, DashboardStats } from "@/libs/action/data"
import { cn } from "@/libs/utils"
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  Activity, 
  ArrowUpRight, 
  DoorOpen, 
  UserCheck 
} from "lucide-react"
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

interface StatCardProps {
  title: string
  value: number
  icon: any
  statusColor: 'online' | 'offline' | 'warning' | 'primary'
  trend?: string
}

const StatCard = ({ title, value, icon: Icon, statusColor, trend }: StatCardProps) => {
  const colorMap = {
    online: { bg: 'var(--status-online-muted)', icon: 'var(--status-online)' },
    offline: { bg: 'var(--status-offline-muted)', icon: 'var(--status-offline)' },
    warning: { bg: 'var(--status-warning-muted)', icon: 'var(--status-warning)' },
    primary: { bg: 'var(--accent-muted)', icon: 'var(--accent-primary)' },
  }
  
  const colors = colorMap[statusColor]
  
  return (
    <div 
      className="border rounded-lg p-6 transition-all duration-200 hover:shadow-lg"
      style={{
        backgroundColor: 'var(--bg-elevated)',
        borderColor: 'var(--border-default)',
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      <div className="flex justify-between items-start mb-4">
        <div 
          className="p-3 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: colors.bg }}
        >
          <Icon size={20} style={{ color: colors.icon }} />
        </div>
        {trend && (
          <span 
            className="text-xs font-bold flex items-center gap-1 px-2 py-1 rounded-lg"
            style={{
              backgroundColor: 'var(--status-online-muted)',
              color: 'var(--status-online)'
            }}
          >
            <ArrowUpRight size={12} /> {trend}
          </span>
        )}
      </div>
      <h3 
        className="mb-1 text-sm font-medium"
        style={{
          fontFamily: 'var(--font-body)',
          color: 'var(--text-muted)'
        }}
      >
        {title}
      </h3>
      <p 
        className="text-2xl font-bold"
        style={{
          fontFamily: 'var(--font-display)',
          color: 'var(--text-primary)',
          fontSize: '24px'
        }}
      >
        {(value || 0).toLocaleString()}
      </p>
    </div>
  )
}

const DashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [range, setRange] = useState('today')
  
  const trendChartRef = useRef<HTMLCanvasElement>(null)
  const roomChartRef = useRef<HTMLCanvasElement>(null)
  
  const charts = useRef<{ trend?: Chart; room?: Chart }>({})

  const fetchData = async (selectedRange: string) => {
    setLoading(true)
    const data = await getDashboardStats(selectedRange)
    setStats(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchData(range)
  }, [range])

  useEffect(() => {
    if (!stats || !stats.trend) return

    // Trend Chart
    if (trendChartRef.current) {
      if (charts.current.trend) charts.current.trend.destroy()
      
      charts.current.trend = new Chart(trendChartRef.current, {
        type: 'line',
        data: {
          labels: stats.trend.map(d => d.label),
          datasets: [
            {
              label: 'Allowed',
              data: stats.trend.map(d => d.allowed),
              borderColor: 'var(--status-online)',
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              fill: true,
              tension: 0.4,
            },
            {
              label: 'Denied',
              data: stats.trend.map(d => d.denied),
              borderColor: 'var(--status-offline)',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              fill: true,
              tension: 0.4,
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
          },
          scales: {
            y: { 
              grid: { color: 'var(--border-subtle)' }, 
              ticks: { color: 'var(--text-muted)' },
              border: { color: 'var(--border-subtle)' }
            },
            x: { 
              grid: { display: false }, 
              ticks: { color: 'var(--text-muted)' },
              border: { color: 'var(--border-subtle)' }
            }
          }
        }
      })
    }

    // Room Chart
    if (roomChartRef.current) {
      if (charts.current.room) charts.current.room.destroy()
      
      charts.current.room = new Chart(roomChartRef.current, {
        type: 'bar',
        data: {
          labels: stats.roomStats.map(d => d.room),
          datasets: [{
            label: 'Access Count',
            data: stats.roomStats.map(d => d.count),
            backgroundColor: 'var(--accent-primary)',
            borderRadius: 6,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { 
              grid: { color: 'var(--border-subtle)' }, 
              ticks: { color: 'var(--text-muted)' },
              border: { color: 'var(--border-subtle)' }
            },
            x: { 
              grid: { display: false }, 
              ticks: { color: 'var(--text-muted)' },
              border: { color: 'var(--border-subtle)' }
            }
          }
        }
      })
    }

    return () => {
      Object.values(charts.current).forEach(c => c?.destroy())
    }
  }, [stats])

  return (
    <div 
      className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-8"
      style={{
        backgroundColor: 'var(--bg-base)',
        fontFamily: 'var(--font-body)'
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <Header 
            title="Dashboard Akses Ruangan" 
            description="Pantau akses real-time dan analitik sistem keamanan." 
          />
          
          {/* Range Selector */}
          <div 
            className="flex gap-1 p-1 rounded-lg border"
            style={{
              backgroundColor: 'var(--bg-overlay)',
              borderColor: 'var(--border-default)'
            }}
          >
            {[
              { id: 'today', label: 'Hari Ini' },
              { id: 'week', label: 'Minggu' },
              { id: 'month', label: 'Bulan' },
              { id: 'year', label: 'Tahun' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setRange(item.id)}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                  range === item.id 
                    ? "text-white"
                    : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                )}
                style={
                  range === item.id ? {
                    backgroundColor: 'var(--accent-primary)',
                    boxShadow: 'var(--shadow-accent)'
                  } : {}
                }
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1,2,3,4].map(i => (
                <div 
                  key={i} 
                  className="h-24 rounded-lg animate-pulse"
                  style={{ backgroundColor: 'var(--bg-overlay)' }}
                />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div 
                className="lg:col-span-2 h-80 rounded-lg animate-pulse"
                style={{ backgroundColor: 'var(--bg-overlay)' }}
              />
              <div 
                className="h-80 rounded-lg animate-pulse"
                style={{ backgroundColor: 'var(--bg-overlay)' }}
              />
            </div>
          </div>
        ) : (
          <>
            {/* Summary Grid */}
            {stats?.summary && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard 
                  title="Total Akses" 
                  value={stats.summary.total} 
                  icon={Activity} 
                  statusColor="primary" 
                />
                <StatCard 
                  title="Akses Diterima" 
                  value={stats.summary.allowed} 
                  icon={CheckCircle} 
                  statusColor="online" 
                />
                <StatCard 
                  title="Akses Ditolak" 
                  value={stats.summary.denied} 
                  icon={XCircle} 
                  statusColor="offline" 
                />
                <StatCard 
                  title="Pengguna Terdaftar" 
                  value={stats.summary.users} 
                  icon={Users} 
                  statusColor="warning" 
                />
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Trend Chart */}
              <div 
                className="lg:col-span-2 border rounded-lg p-6"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: 'var(--border-default)',
                  boxShadow: 'var(--shadow-md)'
                }}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 
                    className="font-bold flex items-center gap-2"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '18px',
                      color: 'var(--text-primary)'
                    }}
                  >
                    <Activity size={18} style={{ color: 'var(--accent-primary)' }} /> 
                    Tren Akses {range.charAt(0).toUpperCase() + range.slice(1)}
                  </h3>
                  <div className="flex gap-4 text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--status-online)' }} />
                      Diterima
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--status-offline)' }} />
                      Ditolak
                    </div>
                  </div>
                </div>
                <div className="h-80">
                  <canvas ref={trendChartRef} />
                </div>
              </div>

              {/* Room Distribution */}
              <div 
                className="border rounded-lg p-6"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: 'var(--border-default)',
                  boxShadow: 'var(--shadow-md)'
                }}
              >
                <h3 
                  className="font-bold mb-6 flex items-center gap-2"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '18px',
                    color: 'var(--text-primary)'
                  }}
                >
                  <DoorOpen size={18} style={{ color: 'var(--accent-primary)' }} /> Ruangan Aktif
                </h3>
                <div className="h-80">
                  <canvas ref={roomChartRef} />
                </div>
              </div>

              {/* Role Distribution */}
              <div 
                className="lg:col-span-3 border rounded-lg p-6"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderColor: 'var(--border-default)',
                  boxShadow: 'var(--shadow-md)'
                }}
              >
                <h3 
                  className="font-bold mb-6 flex items-center gap-2"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '18px',
                    color: 'var(--text-primary)'
                  }}
                >
                  <UserCheck size={18} style={{ color: 'var(--accent-primary)' }} /> Distribusi Pengguna
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {stats?.roleStats.map(role => (
                    <div 
                      key={role.role}
                      className="p-4 rounded-lg border transition-all duration-200 hover:shadow-lg"
                      style={{
                        backgroundColor: 'var(--bg-overlay)',
                        borderColor: 'var(--border-default)'
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{
                            backgroundColor: 'var(--accent-muted)',
                            color: 'var(--accent-primary)'
                          }}
                        >
                          <Users size={18} />
                        </div>
                        <div className="flex-1">
                          <p 
                            className="text-sm font-bold capitalize"
                            style={{
                              fontFamily: 'var(--font-body)',
                              color: 'var(--text-primary)'
                            }}
                          >
                            {role.role}
                          </p>
                          <p 
                            className="text-xs"
                            style={{
                              fontFamily: 'var(--font-body)',
                              color: 'var(--text-muted)'
                            }}
                          >
                            Izin Akses
                          </p>
                        </div>
                        <div className="text-right">
                          <p 
                            className="text-lg font-bold"
                            style={{
                              fontFamily: 'var(--font-display)',
                              color: 'var(--text-primary)'
                            }}
                          >
                            {role.count}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default DashboardPage