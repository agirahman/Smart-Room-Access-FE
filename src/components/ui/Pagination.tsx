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
    <div 
      className="flex items-center justify-between mt-6 px-4 py-4 border rounded-lg"
      style={{
        borderColor: 'var(--border-default)',
        backgroundColor: 'var(--bg-elevated)'
      }}
    >
      <p 
        className="text-xs font-medium"
        style={{
          fontFamily: 'var(--font-body)',
          color: 'var(--text-muted)'
        }}
      >
        Halaman <span style={{ color: 'var(--text-primary)' }}>{currentPage}</span> dari <span style={{ color: 'var(--text-primary)' }}>{totalPages}</span>
      </p>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-2 rounded-lg border transition-all hover:disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            backgroundColor: 'var(--bg-overlay)',
            borderColor: 'var(--border-default)',
            color: 'var(--text-secondary)'
          }}
        >
          <CaretLeftIcon size={16} weight="bold" />
        </button>
        
        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            if (totalPages <= 5) {
              return i + 1
            }
            if (i < 2) {
              return i + 1
            }
            if (i === 2) {
              return currentPage
            }
            if (i === 3) {
              return currentPage + 1
            }
            return totalPages
          }).map((page, idx, arr) => {
            if (idx > 0 && arr[idx - 1] !== page - 1) {
              return (
                <div key={`${idx}-ellipsis`} style={{ color: 'var(--text-muted)' }}>
                  ...
                </div>
              )
            }
            return (
              <button
                key={page}
                onClick={() => handlePageChange(page as number)}
                className={cn(
                  "w-8 h-8 rounded-lg text-xs font-bold transition-all",
                  currentPage === page
                    ? "text-white"
                    : "hover:text-[var(--text-primary)]"
                )}
                style={
                  currentPage === page
                    ? {
                        backgroundColor: 'var(--accent-primary)',
                        color: 'white',
                        boxShadow: 'var(--shadow-accent)'
                      }
                    : {
                        backgroundColor: 'var(--bg-overlay)',
                        borderColor: 'var(--border-default)',
                        color: 'var(--text-secondary)',
                        border: '1px solid var(--border-default)'
                      }
                }
              >
                {page}
              </button>
            )
          })}
        </div>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="p-2 rounded-lg border transition-all hover:disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            backgroundColor: 'var(--bg-overlay)',
            borderColor: 'var(--border-default)',
            color: 'var(--text-secondary)'
          }}
        >
          <CaretRightIcon size={16} weight="bold" />
        </button>
      </div>
    </div>
  )
}
