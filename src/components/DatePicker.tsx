"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon, XIcon } from "@phosphor-icons/react"

import { DayPicker } from "react-day-picker"
import { cn } from "@/libs/utils"

interface DatePickerProps {
  date?: Date
  setDate: (date?: Date) => void
  placeholder?: string
}

export function DatePicker({ date, setDate, placeholder = "Pick a date" }: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-sm transition-all hover:border-zinc-700 min-w-[140px] text-left",
          !date && "text-zinc-500",
          date && "text-white"
        )}
      >
        <CalendarIcon size={16} className="shrink-0" />
        <span className="truncate">
          {date ? format(date, "PPP") : placeholder}
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-110 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-4 animate-in fade-in zoom-in-95 duration-200 origin-top-left">
          <div className="flex items-center justify-between mb-4 border-b border-zinc-800 pb-2">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Select Date</span>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-zinc-500 hover:text-white transition-colors"
            >
              <XIcon size={16} weight="bold" />
            </button>

          </div>
          
          <style>{`
            .rdp {
              --rdp-cell-size: 40px;
              --rdp-accent-color: #3b82f6;
              --rdp-background-color: #27272a;
              margin: 0;
            }
            .rdp-day_selected, .rdp-day_selected:focus-visible, .rdp-day_selected:hover {
              background-color: var(--rdp-accent-color) !important;
              color: white !important;
              border-radius: 12px;
            }
            .rdp-button:hover:not([disabled]):not(.rdp-day_selected) {
              background-color: var(--rdp-background-color);
              border-radius: 12px;
            }
            .rdp-day {
              font-size: 0.875rem;
              font-weight: 500;
              color: #a1a1aa;
            }
            .rdp-head_cell {
              color: #71717a;
              font-size: 0.75rem;
              font-weight: 700;
              text-transform: uppercase;
              padding-bottom: 0.5rem;
            }
            .rdp-nav_button {
              color: #a1a1aa;
            }
            .rdp-nav_button:hover {
              color: white;
              background-color: #27272a;
              border-radius: 8px;
            }
            .rdp-caption_label {
              font-weight: 700;
              color: white;
            }
          `}</style>

          <DayPicker
            mode="single"
            selected={date}
            onSelect={(d) => {
              setDate(d)
              setIsOpen(false)
            }}
            initialFocus
          />
        </div>
      )}
    </div>
  )
}
