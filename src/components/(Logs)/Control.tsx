"use client"

import React, { useState, useEffect } from 'react'
import { MagnifyingGlassIcon, FunnelIcon, SortAscendingIcon, SortDescendingIcon, CalendarIcon } from "@phosphor-icons/react"
import { useRouter, useSearchParams } from 'next/navigation'
import { useDebounce } from '@/hooks/useDebounce'
import { DatePicker } from '@/components/DatePicker'
import { formatLocalDate } from '@/libs/utils'


const Controls = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [search, setSearch] = useState(searchParams.get('q') || '')
  const debouncedSearch = useDebounce(search, 500)
  
  const statusFilter = searchParams.get('status') || 'all'
  const sortBy = searchParams.get('sortBy') || 'date'
  const sortOrder = searchParams.get('order') || 'desc'

  const startDate = searchParams.get('start') || ''
  const endDate = searchParams.get('end') || ''

  useEffect(() => {
    const currentQ = searchParams.get('q') || ''
    if (debouncedSearch === currentQ) return

    const params = new URLSearchParams(searchParams)
    if (debouncedSearch) {
      params.set('q', debouncedSearch)
    } else {
      params.delete('q')
    }
    router.push(`?${params.toString()}`)
  }, [debouncedSearch, router, searchParams])


  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams)
    if (!value || value === 'all') {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    router.push(`?${params.toString()}`)
  }

  const toggleSort = () => {
    const params = new URLSearchParams(searchParams)
    params.set('order', sortOrder === 'asc' ? 'desc' : 'asc')
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="flex flex-col gap-4 mb-8">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1 group">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-500 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search user or room..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all text-white placeholder:text-zinc-600"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Status Filter */}
          <div className="relative">
            <select 
              value={statusFilter}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="appearance-none bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-4 pr-10 outline-none focus:border-blue-500/50 transition-all text-white min-w-[140px]"
            >
              <option value="all">All Status</option>
              <option value="allowed">Allowed</option>
              <option value="denied">Denied</option>
            </select>
            <FunnelIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" size={18} />
          </div>

          {/* Sort */}
          <button 
            onClick={toggleSort}
            className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 flex items-center gap-2 text-white hover:bg-zinc-800 transition-all "
          >
            {sortOrder === 'desc' ? <SortDescendingIcon size={20} /> : <SortAscendingIcon size={20} />}
            <span className="text-sm font-medium">Date</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 bg-zinc-900/50 p-3 rounded-2xl border border-zinc-800/50">
        <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-2">
          <CalendarIcon size={16} />
          Range
        </span>
        <div className="flex items-center gap-3 w-full sm:w-auto">
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
        {(startDate || endDate) && (
          <button 
            onClick={() => {
              const params = new URLSearchParams(searchParams)
              params.delete('start')
              params.delete('end')
              router.push(`?${params.toString()}`)
            }}
            className="text-xs text-red-500/80 hover:text-red-500 font-bold uppercase tracking-wider ml-auto px-3 py-1.5 bg-red-500/5 rounded-lg border border-red-500/10 transition-all hover:bg-red-500/10"
          >
            Reset Range
          </button>
        )}
      </div>
    </div>
  )


}

export default Controls
