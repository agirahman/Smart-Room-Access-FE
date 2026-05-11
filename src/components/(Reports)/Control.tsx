"use client"

import { useState } from "react"
import { CalendarIcon, MagnifyingGlassIcon, FunnelIcon, FileArrowDownIcon, MicrosoftExcelLogo, FilePdfIcon } from "@phosphor-icons/react"
import { useRouter, useSearchParams } from 'next/navigation'
import { DatePicker } from '@/components/DatePicker'
import { formatLocalDate } from '@/libs/utils'
import { AccessLog } from '@/libs/action/data'
import * as XLSX from 'xlsx'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

interface ControlsProps {
  rooms: string[]
  logs: AccessLog[]
}

const Controls = ({ rooms, logs }: ControlsProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const q = searchParams.get('q') || ''
  const [localQ, setLocalQ] = useState(q)
  const room = searchParams.get('room') || 'all'
  const startDate = searchParams.get('start') || ''
  const endDate = searchParams.get('end') || ''

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams)
    if (!value || value === 'all') {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    router.push(`?${params.toString()}`)
  }

  const triggerSearch = () => {
    handleFilterChange('q', localQ)
  }

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(logs.map(log => ({
      ID: log.id,
      User: log.name || log.user_name,
      UserID: log.user_id,
      Room: log.room,
      Status: log.status,
      Time: new Date(log.access_time).toLocaleString()
    })))
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Access Logs")
    XLSX.writeFile(workbook, `SmartRoomAccess_Report_${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  const exportToPDF = () => {
    const doc = new jsPDF()
    doc.text("Smart Room Access Audit Report", 14, 15)
    doc.setFontSize(10)
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22)

    const tableColumn = ["Status", "User", "Room", "Date & Time"]
    const tableRows: (string | number)[][] = []

    logs.forEach(log => {
      const logData = [
        log.status.toUpperCase(),
        `${log.name || log.user_name} (#${log.user_id})`,
        log.room,
        new Date(log.access_time).toLocaleString()
      ]
      tableRows.push(logData)
    })

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] }
    })
    doc.save(`SmartRoomAccess_Report_${new Date().toISOString().split('T')[0]}.pdf`)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 bg-zinc-900/50 p-4 rounded-3xl border border-zinc-800/50">
        {/* Search */}
        <div className="relative flex items-center gap-2 w-full">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input
              type="text"
              placeholder="Search user or ID..."
              value={localQ}
              onChange={(e) => setLocalQ(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && triggerSearch()}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>
          <button
            onClick={triggerSearch}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 whitespace-nowrap"
          >
            Find Data
          </button>
        </div>


        <div className="flex justify-end items-center gap-2 w-full lg:w-auto">
          {/* Room Filter */}
          <div className="p-2 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
            <FunnelIcon size={18} className="text-zinc-400" />
          </div>
          <select
            value={room}
            onChange={(e) => handleFilterChange('room', e.target.value)}
            className="bg-zinc-950 border border-zinc-800 rounded-xl py-2 px-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
          >
            <option value="all">All Rooms</option>
            {rooms.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          {/* Clear Filters */}
          {(q || room !== 'all' || startDate || endDate) && (
            <button
              onClick={() => router.push('?')}
              className="text-xs text-red-500 hover:bg-red-500/10 px-4 py-2 rounded-xl transition-all"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-3 ">
        {/* Date Range */}
        <div className="flex sm:justify-start justify-between items-center gap-3 w-full">
          <DatePicker
            date={startDate ? new Date(startDate) : undefined}
            setDate={(date) => handleFilterChange('start', date ? formatLocalDate(date) : '')}
            placeholder="Start date"
          />
          <span className="text-zinc-700 font-bold">/</span>
          <DatePicker
            date={endDate ? new Date(endDate) : undefined}
            setDate={(date) => handleFilterChange('end', date ? formatLocalDate(date) : '')}
            placeholder="End date"
          />
        </div>



        {/* Export Options */}
        <div className="flex justify-end flex-col sm:flex-row items-center gap-2  w-full ">
          <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mr-2">Export Data</span>
          <div className="flex items-center gap-2">
            <button
              onClick={exportToExcel}
              className="flex items-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/20 px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95"
            >
              <MicrosoftExcelLogo size={18} weight="bold" />
              Excel
            </button>
            <button
              onClick={exportToPDF}
              className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95"
            >
              <FilePdfIcon size={18} weight="bold" />
              PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Controls
