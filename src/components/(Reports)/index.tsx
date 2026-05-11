import { getLogs } from "@/libs/action/data"
import Header from "../ui/Header"
import Controls from "./Control"
import Stats from "./Stats"
import List from "./List"
import { Pagination } from "@/components/ui/Pagination"

interface ReportsPageProps {
  searchParams: Promise<{
    start?: string
    end?: string
    q?: string
    room?: string
    page?: string
  }>
}

const ReportsPage = async ({ searchParams }: ReportsPageProps) => {
  const { start, end, q, room, page } = await searchParams
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

  filteredLogs.sort((a, b) => {
    const dateA = new Date(a.access_time).getTime()
    const dateB = new Date(b.access_time).getTime()
    return dateB - dateA
  })

  // Pagination Logic
  const itemsPerPage = 10
  const currentPage = parseInt(page || '1')
  const totalItems = filteredLogs.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <Header title="Reports & Audit" description="Detailed access logs and statistical analysis." />

      <div className="mb-8">
        <Controls rooms={allRooms} logs={filteredLogs} />
      </div>

      <Stats logs={filteredLogs} />

      <div className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white tracking-tight">Audit Logs</h3>
          <span className="text-xs font-bold text-zinc-500 bg-zinc-800/50 px-3 py-1 rounded-full border border-zinc-700/50">
            {filteredLogs.length} Records Found
          </span>
        </div>
        <List logs={paginatedLogs} />
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </div>
    </div>
  )
}

export default ReportsPage