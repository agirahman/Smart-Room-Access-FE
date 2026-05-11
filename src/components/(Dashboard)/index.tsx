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
  color: string
  trend?: string
}

const StatCard = ({ title, value, icon: Icon, color, trend }: StatCardProps) => (
  <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50 p-6 rounded-3xl">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
      {trend && (
        <span className="text-emerald-400 text-xs font-bold flex items-center gap-1 bg-emerald-500/10 px-2 py-1 rounded-full">
          <ArrowUpRight size={14} /> {trend}
        </span>
      )}
    </div>
    <h3 className="text-zinc-500 text-sm font-medium mb-1">{title}</h3>
    <p className="text-3xl font-black text-white">{(value || 0).toLocaleString()}</p>
  </div>
)

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
              borderColor: '#10b981',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              fill: true,
              tension: 0.4,
            },
            {
              label: 'Denied',
              data: stats.trend.map(d => d.denied),
              borderColor: '#ef4444',
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
            y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#71717a' } },
            x: { grid: { display: false }, ticks: { color: '#71717a' } }
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
            backgroundColor: '#3b82f6',
            borderRadius: 8,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#71717a' } },
            x: { grid: { display: false }, ticks: { color: '#71717a' } }
          }
        }
      })
    }

    return () => {
      Object.values(charts.current).forEach(c => c?.destroy())
    }
  }, [stats])

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <Header 
          title="Access Dashboard" 
          description="Real-time analytics and system monitoring overview." 
        />
        
        {/* Range Selector */}
        <div className="flex bg-zinc-900/60 p-1 rounded-2xl border border-zinc-800/50">
          {[
            { id: 'today', label: 'Today' },
            { id: 'week', label: 'Week' },
            { id: 'month', label: 'Month' },
            { id: 'year', label: 'Year' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setRange(item.id)}
              className={cn(
                "px-4 py-2 text-xs font-bold rounded-xl transition-all",
                range === item.id 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                  : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="animate-pulse mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1,2,3,4].map(i => <div key={i} className="h-32 bg-zinc-900/40 rounded-3xl border border-zinc-800/50" />)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-[400px] bg-zinc-900/40 rounded-3xl border border-zinc-800/50" />
            <div className="h-[400px] bg-zinc-900/40 rounded-3xl border border-zinc-800/50" />
          </div>
        </div>
      ) : (
        <>
          {/* Summary Grid */}
          {stats?.summary && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-8">
              <StatCard 
                title="Total Access" 
                value={stats.summary.total} 
                icon={Activity} 
                color="bg-blue-500" 
              />
              <StatCard 
                title="Allowed Access" 
                value={stats.summary.allowed} 
                icon={CheckCircle} 
                color="bg-emerald-500" 
              />
              <StatCard 
                title="Denied Access" 
                value={stats.summary.denied} 
                icon={XCircle} 
                color="bg-red-500" 
              />
              <StatCard 
                title="Registered Users" 
                value={stats.summary.users} 
                icon={Users} 
                color="bg-purple-500" 
              />
            </div>
          )}

          <div className="flex flex-col">
            {/* Trend Chart */}
            <div className="lg:col-span-2 bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50 p-6 rounded-3xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white font-bold flex items-center gap-2">
                  <Activity size={18} className="text-blue-500" /> 
                  {range.charAt(0).toUpperCase() + range.slice(1)}&apos;s Access Trend
                </h3>
                <div className="flex gap-4 text-xs font-medium">
                  <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500"/> Allowed</div>
                  <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-500"/> Denied</div>
                </div>
              </div>
              <div className="h-[300px]">
                <canvas ref={trendChartRef} />
              </div>
            </div>

            {/* Room Distribution */}
            <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50 p-6 rounded-3xl">
              <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                <DoorOpen size={18} className="text-blue-500" /> Active Rooms
              </h3>
              <div className="h-[300px]">
                <canvas ref={roomChartRef} />
              </div>
            </div>

            {/* Role Distribution */}
            <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50 p-6 rounded-3xl w-full">
              <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                <UserCheck size={18} className="text-purple-500" /> User Roles
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stats?.roleStats.map(role => (
                  <div key={role.role} className="flex items-center justify-between p-4 rounded-2xl bg-zinc-800/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400">
                        <Users size={20} />
                      </div>
                      <div>
                        <p className="text-white text-sm font-bold capitalize">{role.role}</p>
                        <p className="text-zinc-500 text-xs">Access Permissions</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-black">{role.count}</p>
                      <p className="text-zinc-500 text-[10px]">TOTAL</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default DashboardPage