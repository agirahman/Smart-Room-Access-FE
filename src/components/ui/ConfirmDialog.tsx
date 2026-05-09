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

const ConfirmDialog = ({ open, title = 'Confirm', description, onClose, onConfirm, children }: ConfirmDialogProps) => {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-zinc-800/50">
          <div>
            <h3 className="text-lg font-bold text-white">{title}</h3>
            {description && <p className="text-xs text-zinc-500">{description}</p>}
          </div>
          <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white">
            <XIcon size={16} />
          </button>
        </div>

        <div className="p-4">
          {children}
        </div>

        <div className="p-4 border-t border-zinc-800/50 flex gap-3">
          <button onClick={onClose} className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl py-2 font-bold">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 bg-red-600 hover:bg-red-500 text-white rounded-xl py-2 font-bold">
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
