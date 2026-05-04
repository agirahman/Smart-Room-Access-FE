import { getLogs } from "@/libs/action/data"
import Header from "../ui/Header"
import Controls from "./Control"
import Stats from "./Stats"
import Charts from "./Charts"

interface ReportsPageProps {
  searchParams: Promise<{
    start?: string
    end?: string
  }>
}

const ReportsPage = async ({ searchParams }: ReportsPageProps) => {
  const { start, end } = await searchParams
  const apiResponse = await getLogs()

  let filteredLogs = [...apiResponse.logs]

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

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <Header title="Reports" description="Access statistics and analytics overview." />
      <Controls />
      <Stats logs={filteredLogs} />
      <Charts logs={filteredLogs} />
    </div>
  )
}

export default ReportsPage