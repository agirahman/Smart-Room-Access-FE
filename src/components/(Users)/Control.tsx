"use client"

import React, { useState, useEffect } from 'react'
import { MagnifyingGlassIcon, PlusIcon, FunnelIcon } from "@phosphor-icons/react"
import { useRouter, useSearchParams } from 'next/navigation'
import { useDebounce } from '@/hooks/useDebounce'

interface ControlsProps {
  onAddClick: () => void
}

const Controls = ({ onAddClick }: ControlsProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [search, setSearch] = useState(searchParams.get('q') || '')
  
  const roleFilter = searchParams.get('role') || 'all'

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams)
    if (!value || value === 'all') {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    params.delete('page') // Reset page on filter
    router.push(`?${params.toString()}`)
  }

  const triggerSearch = () => {
    const params = new URLSearchParams(searchParams)
    if (search) {
      params.set('q', search)
    } else {
      params.delete('q')
    }
    params.delete('page') // Reset page on search
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      {/* Search */}
      <div className="relative flex-1 group flex gap-2">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-500 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search user or RFID UID..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && triggerSearch()}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all text-white placeholder:text-zinc-600"
          />
        </div>
        <button 
          onClick={triggerSearch}
          className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 whitespace-nowrap"
        >
          Find Data
        </button>
      </div>

      <div className="flex justify-between flex-wrap gap-2">
        {/* Role Filter */}
        <div className="relative">
          <select 
            value={roleFilter}
            onChange={(e) => handleFilterChange('role', e.target.value)}
            className="appearance-none bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-4 pr-10 outline-none focus:border-blue-500/50 transition-all text-white min-w-[140px]"
          >
            <option value="all">All Roles</option>
            <option value="student">Student</option>
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </select>
          <FunnelIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" size={18} />
        </div>

        {/* Add User Button */}
        <button 
          onClick={onAddClick}
          className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl px-4 py-2.5 flex items-center gap-2 transition-all font-semibold shadow-lg shadow-blue-500/20 active:scale-95"
        >
          <PlusIcon size={20} weight="bold" />
          <span>Add User</span>
        </button>
      </div>
    </div>
  )
}

export default Controls
