import { getLogs } from "@/libs/action/data";
import Controls from "./Control";
import List from "./List";
import { Pagination } from "@/components/ui/Pagination";
import { LogsPageProps } from '@/types/types'
import Header from "../ui/Header"

const LogsPage = async ({ searchParams }: LogsPageProps) => {
  const { q, status, order = 'desc', start, end, page = '1' } = await searchParams;
  const apiResponse = await getLogs();

  let filteredLogs = [...apiResponse.logs];

  // Search Filter
  if (q) {
    const query = q.toLowerCase();
    filteredLogs = filteredLogs.filter(log =>
      log.user_name?.toLowerCase().includes(query) ||
      log.name?.toLowerCase().includes(query) ||
      log.room.toLowerCase().includes(query)
    );
  }

  // Status Filter
  if (status && status !== 'all') {
    filteredLogs = filteredLogs.filter(log => log.status === status);
  }

  // Date Range Filter
  if (start || end) {
    const startDate = start ? new Date(start) : null;
    const endDate = end ? new Date(end) : null;

    if (endDate) endDate.setHours(23, 59, 59, 999);

    filteredLogs = filteredLogs.filter(log => {
      const logDate = new Date(log.access_time);
      if (startDate && logDate < startDate) return false;
      if (endDate && logDate > endDate) return false;
      return true;
    });
  }

  // Sorting (Date)
  filteredLogs.sort((a, b) => {
    const dateA = new Date(a.access_time).getTime();
    const dateB = new Date(b.access_time).getTime();
    return order === 'asc' ? dateA - dateB : dateB - dateA;
  });

  // Pagination Logic
  const itemsPerPage = 10;
  const currentPage = parseInt(page);
  const totalItems = filteredLogs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <Header title="Access Logs" description="Monitor and manage all room access activities." />
      <Controls />
      <List logs={paginatedLogs} />
      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  )
}


export default LogsPage
