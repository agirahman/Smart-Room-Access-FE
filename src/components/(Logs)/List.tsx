"use client"

import { useState } from 'react'
import { AccessLog } from '@/libs/action/data'
import { CalendarIcon, ClockIcon, MapPinIcon, ImageIcon, WarningCircleIcon, CheckCircleIcon, XIcon } from "@phosphor-icons/react"
import Image from 'next/image'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table"

interface ListProps {
  logs: AccessLog[]
}

const List = ({ logs }: ListProps) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    }).format(new Date(dateStr))
  }

  const formatTime = (dateStr: string) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(new Date(dateStr))
  }

  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-zinc-900/30 border border-zinc-800 border-dashed rounded-3xl">
        <WarningCircleIcon size={48} className="text-zinc-700 mb-4" />
        <p className="text-zinc-500 font-medium">No logs found matching your criteria.</p>
      </div>
    )
  }

  return (
    <>
      <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50 rounded-3xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px] text-center">Status</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id} className="group">
                <TableCell className="text-center">
                  <div className={`w-10 h-10 mx-auto rounded-xl flex items-center justify-center shadow-lg ${
                    log.status === 'allowed' 
                      ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                      : 'bg-red-500/10 text-red-500 border border-red-500/20'
                  }`}>
                    {log.status === 'allowed' ? <CheckCircleIcon size={24} weight="duotone" /> : <WarningCircleIcon size={24} weight="duotone" />}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-bold text-white text-base">
                      {log.name || log.user_name || 'Unknown User'}
                    </span>
                    <span className="text-xs text-zinc-500 font-medium">ID: #{log.user_id}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-zinc-300">
                    <MapPinIcon size={16} className="text-zinc-500" />
                    {log.room}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 text-zinc-300 text-sm">
                      <CalendarIcon size={14} className="text-zinc-600" />
                      {formatDate(log.access_time)}
                    </div>
                    <div className="flex items-center gap-2 text-zinc-500 text-xs">
                      <ClockIcon size={14} className="text-zinc-600" />
                      {formatTime(log.access_time)}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {log.photo_url ? (
                    <button 
                      onClick={() => setSelectedPhoto(log.photo_url || null)}
                      className="inline-flex items-center gap-2 bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700/50 text-white px-3 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95 group/btn"
                    >
                      <ImageIcon size={16} weight="bold" className="text-blue-400" />
                      Preview
                    </button>
                  ) : (
                    <span className="text-[10px] text-zinc-600 uppercase font-black tracking-tighter">No Media</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Photo Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
          <button 
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all hover:rotate-90"
          >
            <XIcon size={24} weight="bold" />
          </button>
          
          <div className="relative max-w-4xl w-full aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl animate-in zoom-in-95 duration-300">
            <Image 
              src={selectedPhoto} 
              alt="Access Capture" 
              className="w-full h-full object-cover"
              width={1000}
              height={1000}
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-8 left-8">
              <p className="text-white/60 text-sm font-medium uppercase tracking-widest mb-1">Evidence Capture</p>
              <h2 className="text-white text-2xl font-bold">Smart Room Security</h2>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default List
