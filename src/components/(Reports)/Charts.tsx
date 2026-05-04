"use client"

import { useEffect, useRef } from 'react'
import { AccessLog } from '@/libs/action/data'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

interface ChartsProps {
  logs: AccessLog[]
}

function groupByDate(logs: AccessLog[]) {
  const map: Record<string, { allowed: number; denied: number }> = {}

  logs.forEach((log) => {
    const dateKey = new Date(log.access_time).toISOString().split('T')[0]
    if (!map[dateKey]) {
      map[dateKey] = { allowed: 0, denied: 0 }
    }
    if (log.status.toLowerCase() === 'allowed') {
      map[dateKey].allowed++
    } else {
      map[dateKey].denied++
    }
  })

  const sorted = Object.entries(map).sort(([a], [b]) => a.localeCompare(b))
  return {
    labels: sorted.map(([date]) => {
      const d = new Date(date)
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }),
    allowed: sorted.map(([, v]) => v.allowed),
    denied: sorted.map(([, v]) => v.denied),
  }
}

function groupByRoom(logs: AccessLog[]) {
  const map: Record<string, number> = {}
  logs.forEach((log) => {
    map[log.room] = (map[log.room] || 0) + 1
  })
  const sorted = Object.entries(map).sort(([, a], [, b]) => b - a)
  return {
    labels: sorted.map(([room]) => room),
    values: sorted.map(([, count]) => count),
  }
}

function groupByHour(logs: AccessLog[]) {
  const hours = Array.from({ length: 24 }, (_, i) => i)
  const counts = new Array(24).fill(0)
  logs.forEach((log) => {
    const hour = new Date(log.access_time).getHours()
    counts[hour]++
  })
  return {
    labels: hours.map((h) => `${h.toString().padStart(2, '0')}:00`),
    values: counts,
  }
}

const Charts = ({ logs }: ChartsProps) => {
  const dailyChartRef = useRef<HTMLCanvasElement>(null)
  const roomChartRef = useRef<HTMLCanvasElement>(null)
  const hourChartRef = useRef<HTMLCanvasElement>(null)

  const dailyInstanceRef = useRef<Chart | null>(null)
  const roomInstanceRef = useRef<Chart | null>(null)
  const hourInstanceRef = useRef<Chart | null>(null)

  useEffect(() => {
    // Destroy old instances
    dailyInstanceRef.current?.destroy()
    roomInstanceRef.current?.destroy()
    hourInstanceRef.current?.destroy()

    const daily = groupByDate(logs)
    const room = groupByRoom(logs)
    const hour = groupByHour(logs)

    // Daily Access Chart (Bar)
    if (dailyChartRef.current) {
      dailyInstanceRef.current = new Chart(dailyChartRef.current, {
        type: 'bar',
        data: {
          labels: daily.labels,
          datasets: [
            {
              label: 'Allowed',
              data: daily.allowed,
              backgroundColor: 'rgba(16, 185, 129, 0.6)',
              borderColor: 'rgba(16, 185, 129, 1)',
              borderWidth: 1,
              borderRadius: 6,
            },
            {
              label: 'Denied',
              data: daily.denied,
              backgroundColor: 'rgba(239, 68, 68, 0.6)',
              borderColor: 'rgba(239, 68, 68, 1)',
              borderWidth: 1,
              borderRadius: 6,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: { color: '#a1a1aa', font: { weight: 'bold', size: 11 } },
            },
          },
          scales: {
            x: {
              ticks: { color: '#71717a', font: { size: 10 } },
              grid: { color: 'rgba(63, 63, 70, 0.3)' },
            },
            y: {
              beginAtZero: true,
              ticks: { color: '#71717a', stepSize: 1, font: { size: 10 } },
              grid: { color: 'rgba(63, 63, 70, 0.3)' },
            },
          },
        },
      })
    }

    // Room Distribution Chart (Doughnut)
    if (roomChartRef.current) {
      const colors = [
        'rgba(59, 130, 246, 0.7)',
        'rgba(16, 185, 129, 0.7)',
        'rgba(168, 85, 247, 0.7)',
        'rgba(245, 158, 11, 0.7)',
        'rgba(239, 68, 68, 0.7)',
        'rgba(236, 72, 153, 0.7)',
        'rgba(14, 165, 233, 0.7)',
        'rgba(34, 197, 94, 0.7)',
      ]
      roomInstanceRef.current = new Chart(roomChartRef.current, {
        type: 'doughnut',
        data: {
          labels: room.labels,
          datasets: [
            {
              data: room.values,
              backgroundColor: colors.slice(0, room.labels.length),
              borderColor: 'rgba(9, 9, 11, 1)',
              borderWidth: 3,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: { color: '#a1a1aa', font: { weight: 'bold', size: 11 }, padding: 16 },
            },
          },
        },
      })
    }

    // Hourly Activity Chart (Line)
    if (hourChartRef.current) {
      hourInstanceRef.current = new Chart(hourChartRef.current, {
        type: 'line',
        data: {
          labels: hour.labels,
          datasets: [
            {
              label: 'Access Count',
              data: hour.values,
              borderColor: 'rgba(59, 130, 246, 1)',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              fill: true,
              tension: 0.4,
              pointBackgroundColor: 'rgba(59, 130, 246, 1)',
              pointBorderColor: 'rgba(9, 9, 11, 1)',
              pointBorderWidth: 2,
              pointRadius: 4,
              pointHoverRadius: 6,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: { color: '#a1a1aa', font: { weight: 'bold', size: 11 } },
            },
          },
          scales: {
            x: {
              ticks: { color: '#71717a', font: { size: 9 }, maxRotation: 45 },
              grid: { color: 'rgba(63, 63, 70, 0.3)' },
            },
            y: {
              beginAtZero: true,
              ticks: { color: '#71717a', stepSize: 1, font: { size: 10 } },
              grid: { color: 'rgba(63, 63, 70, 0.3)' },
            },
          },
        },
      })
    }

    return () => {
      dailyInstanceRef.current?.destroy()
      roomInstanceRef.current?.destroy()
      hourInstanceRef.current?.destroy()
    }
  }, [logs])

  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-zinc-900/30 border border-zinc-800 border-dashed rounded-3xl">
        <p className="text-zinc-500 font-medium">No log data available for charts.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Daily Access Chart */}
      <div className="lg:col-span-2 bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50 rounded-3xl p-6">
        <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">Daily Access</h3>
        <div className="h-[320px]">
          <canvas ref={dailyChartRef} />
        </div>
      </div>

      {/* Room Distribution Chart */}
      <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50 rounded-3xl p-6">
        <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">Room Distribution</h3>
        <div className="h-[320px] flex items-center justify-center">
          <canvas ref={roomChartRef} />
        </div>
      </div>

      {/* Hourly Activity Chart */}
      <div className="lg:col-span-3 bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50 rounded-3xl p-6">
        <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">Hourly Activity</h3>
        <div className="h-[280px]">
          <canvas ref={hourChartRef} />
        </div>
      </div>
    </div>
  )
}

export default Charts
