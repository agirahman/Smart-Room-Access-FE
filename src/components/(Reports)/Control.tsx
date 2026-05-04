"use client"

import { CalendarIcon } from "@phosphor-icons/react"
import { useRouter, useSearchParams } from 'next/navigation'
import { DatePicker } from '@/components/DatePicker'
import { formatLocalDate } from '@/libs/utils'

const Controls = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const startDate = searchParams.get('start') || ''
  const endDate = searchParams.get('end') || ''

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams)
    if (!value) {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 bg-zinc-900/50 p-3 rounded-2xl border border-zinc-800/50 mb-8">
      <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-2">
        <CalendarIcon size={16} />
        Date Range
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
  )
}

export default Controls
