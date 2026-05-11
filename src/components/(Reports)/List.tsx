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
        <p className="text-zinc-500 font-medium">No records found for the selected filters.</p>
      </div>
    )
  }

  return (
    <>
      <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50 rounded-3xl overflow-hidden shadow-2xl">
        <Table>
          <TableHeader className="bg-zinc-950/50">
            <TableRow>
              <TableHead className="w-[80px] text-center uppercase text-[10px] tracking-widest font-black">Status</TableHead>
              <TableHead className="uppercase text-[10px] tracking-widest font-black">User Details</TableHead>
              <TableHead className="uppercase text-[10px] tracking-widest font-black">Room Location</TableHead>
              <TableHead className="uppercase text-[10px] tracking-widest font-black">Timestamp</TableHead>
              <TableHead className="text-right uppercase text-[10px] tracking-widest font-black">Evidence</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id} className="group hover:bg-zinc-800/20 transition-colors">
                <TableCell className="text-center">
                  <div className={`w-9 h-9 mx-auto rounded-xl flex items-center justify-center shadow-lg ${
                    log.status === 'allowed' 
                      ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                      : 'bg-red-500/10 text-red-500 border border-red-500/20'
                  }`}>
                    {log.status === 'allowed' ? <CheckCircleIcon size={20} weight="duotone" /> : <WarningCircleIcon size={20} weight="duotone" />}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-bold text-white text-sm group-hover:text-blue-400 transition-colors">
                      {log.name || log.user_name || 'Unknown User'}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">ID: #{log.user_id}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-zinc-300 text-sm">
                    <MapPinIcon size={14} className="text-blue-500/50" />
                    {log.room}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 text-zinc-300 text-xs font-medium">
                      <CalendarIcon size={12} className="text-zinc-600" />
                      {formatDate(log.access_time)}
                    </div>
                    <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-bold">
                      <ClockIcon size={12} className="text-zinc-600" />
                      {formatTime(log.access_time)}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {log.photo_url ? (
                    <button 
                      onClick={() => setSelectedPhoto(log.photo_url || null)}
                      className="inline-flex items-center gap-2 bg-zinc-900/50 hover:bg-blue-600 border border-zinc-800 hover:border-blue-500 text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all hover:scale-105 active:scale-95"
                    >
                      <ImageIcon size={14} weight="bold" />
                      View Capture
                    </button>
                  ) : (
                    <span className="text-[10px] text-zinc-700 uppercase font-black tracking-tighter italic">Not Available</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Photo Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in duration-300">
          <button 
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-6 right-6 w-12 h-12 bg-white/5 hover:bg-red-500 text-white rounded-full flex items-center justify-center transition-all hover:rotate-90 z-210 shadow-2xl"
          >
            <XIcon size={24} weight="bold" />
          </button>
          
          <div className="relative max-w-5xl w-full aspect-video rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-300">
            <Image 
              src={selectedPhoto} 
              alt="Access Capture" 
              className="w-full h-full object-cover"
              width={1200}
              height={1200}
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />
            <div className="absolute bottom-10 left-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <p className="text-white/60 text-xs font-black uppercase tracking-[0.3em]">Surveillance Evidence</p>
              </div>
              <h2 className="text-white text-3xl font-black tracking-tighter">Security Archive Access</h2>
              <p className="text-white/40 text-sm font-medium mt-1 italic">Authorized personnel only</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default List
