"use client"

import React from 'react'
import { XIcon } from "@phosphor-icons/react"

interface ConfirmDialogProps {
  open: boolean
  title?: string
  description?: string
  onClose: () => void
  onConfirm: () => void
  children?: React.ReactNode
}

const ConfirmDialog = ({ open, title = 'Konfirmasi', description, onClose, onConfirm, children }: ConfirmDialogProps) => {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
      <div className="absolute inset-0 backdrop-blur-sm" onClick={onClose} />

      <div 
        className="relative w-full max-w-md rounded-lg overflow-hidden shadow-lg border"
        style={{
          backgroundColor: 'var(--bg-elevated)',
          borderColor: 'var(--border-default)',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        <div 
          className="flex items-center justify-between p-6 border-b"
          style={{
            borderBottomColor: 'var(--border-subtle)'
          }}
        >
          <div>
            <h3 
              className="text-lg font-bold"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--text-primary)'
              }}
            >
              {title}
            </h3>
            {description && (
              <p 
                className="text-xs mt-1"
                style={{
                  fontFamily: 'var(--font-body)',
                  color: 'var(--text-secondary)'
                }}
              >
                {description}
              </p>
            )}
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-lg hover:bg-[var(--bg-overlay)] transition-colors"
            style={{ color: 'var(--text-secondary)' }}
          >
            <XIcon size={16} weight="bold" />
          </button>
        </div>

        <div className="p-6">
          {children}
        </div>

        <div 
          className="p-6 border-t flex gap-3"
          style={{ borderTopColor: 'var(--border-subtle)' }}
        >
          <button 
            onClick={onClose} 
            className="flex-1 rounded-lg py-2 font-bold transition-all duration-200 border"
            style={{
              backgroundColor: 'var(--bg-overlay)',
              color: 'var(--text-primary)',
              borderColor: 'var(--border-default)'
            }}
          >
            Batal
          </button>
          <button 
            onClick={onConfirm} 
            className="flex-1 rounded-lg py-2 font-bold transition-all duration-200 text-white"
            style={{
              backgroundColor: 'var(--status-offline)',
              color: 'white'
            }}
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
