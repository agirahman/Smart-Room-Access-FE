"use client"

import * as React from "react"
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react"
import { cn } from "@/libs/utils"
import { useRouter, useSearchParams } from "next/navigation"

interface PaginationProps {
  currentPage: number
  totalPages: number
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams)
    params.set("page", pageNumber.toString())
    return `?${params.toString()}`
  }

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return
    router.push(createPageURL(page))
  }

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-between mt-6 px-2">
      <p className="text-xs font-medium text-zinc-500">
        Page <span className="text-white">{currentPage}</span> of <span className="text-white">{totalPages}</span>
      </p>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <CaretLeftIcon size={18} weight="bold" />
        </button>
        
        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={cn(
                "w-8 h-8 rounded-lg text-xs font-bold transition-all",
                currentPage === page
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-700"
              )}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <CaretRightIcon size={18} weight="bold" />
        </button>
      </div>
    </div>
  )
}
