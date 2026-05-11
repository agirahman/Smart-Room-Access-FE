import { getLogs } from "@/libs/action/data"
import Header from "../ui/Header"
import Controls from "./Control"
import Stats from "./Stats"
import List from "./List"

interface ReportsPageProps {
  searchParams: Promise<{
    start?: string
    end?: string
    q?: string
    room?: string
  }>
}

const ReportsPage = async ({ searchParams }: ReportsPageProps) => {
  const { start, end, q, room } = await searchParams
  const apiResponse = await getLogs()

  let filteredLogs = [...apiResponse.logs]

  // Search Filter (User Name / ID)
  if (q) {
    const query = q.toLowerCase()
    filteredLogs = filteredLogs.filter((log) => 
      (log.name || log.user_name || '').toLowerCase().includes(query) ||
      (log.user_id?.toString() || '').includes(query)
    )
  }

  // Room Filter
  if (room && room !== 'all') {
    filteredLogs = filteredLogs.filter((log) => log.room === room)
  }

  // Date Range Filter
  if (start || end) {
    const startDate = start ? new Date(start) : null
    const endDate = end ? new Date(end) : null

    if (endDate) endDate.setHours(23, 59, 59, 999)

    filteredLogs = filteredLogs.filter((log) => {
      const logDate = new Date(log.access_time)
      if (startDate && logDate < startDate) return false
      if (endDate && logDate > endDate) return false
      return true
    })
  }

  // Get unique rooms for the filter dropdown
  const allRooms = Array.from(new Set(apiResponse.logs.map(l => l.room)))

  return (
    <div 
      className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-8"
      style={{
        backgroundColor: 'var(--bg-base)',
        fontFamily: 'var(--font-body)'
      }}
    >
      <div className="max-w-7xl mx-auto">
        <Header title="Laporan & Audit" description="Log akses mendetail dan analisis statistik." />
        
        <div className="mt-8">
          <Controls rooms={allRooms} logs={filteredLogs} />
        </div>

        <div className="mt-8">
          <Stats logs={filteredLogs} />
        </div>
        
        <div className="mt-12">
          <div 
            className="flex items-center justify-between mb-6 pb-4 border-b"
            style={{ borderBottomColor: 'var(--border-default)' }}
          >
            <h3 
              className="text-xl font-bold tracking-tight"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--text-primary)',
                fontSize: '20px'
              }}
            >
              Log Audit
            </h3>
            <span 
              className="text-xs font-bold px-3 py-1 rounded-lg border"
              style={{
                backgroundColor: 'var(--bg-overlay)',
                color: 'var(--text-muted)',
                borderColor: 'var(--border-default)',
                fontFamily: 'var(--font-mono)'
              }}
            >
              {filteredLogs.length} Catatan Ditemukan
            </span>
          </div>
          <List logs={filteredLogs} />
        </div>
      </div>
    </div>
  )
}

export default ReportsPage