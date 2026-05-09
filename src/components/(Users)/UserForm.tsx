"use client"

import React, { useState } from 'react'
import { XIcon, IdentificationCardIcon, UserIcon, ClockIcon, CalendarIcon, ShieldCheckIcon } from "@phosphor-icons/react"
import { User, createUser, updateUser } from '@/libs/action/data'
import { useRouter } from 'next/navigation'

interface UserFormProps {
  user?: User | null
  onClose: () => void
}

const UserForm = ({ user, onClose }: UserFormProps) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState<Partial<User>>(() => {
    if (user) {
      return {
        ...user,
        valid_until: new Date(user.valid_until).toISOString().split('T')[0]
      }
    }

    // Default values for new user
    const nextYear = new Date()
    nextYear.setFullYear(nextYear.getFullYear() + 1)

    return {
      name: '',
      rfid_uid: '',
      username: '',
      role: 'student',
      schedule_start: '08:00:00',
      schedule_end: '17:00:00',
      valid_until: nextYear.toISOString().split('T')[0]
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = user?.id
        ? await updateUser(user.id, formData)
        : await createUser(formData)

      if (result.success) {
        router.refresh()
        onClose()
      } else {
        setError(result.message || 'Failed to save user')
      }
    } catch (err) {
      if (err instanceof Error) {
        setError('An error occurred while saving user')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-150 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between p-6 border-b border-zinc-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-500">
              <UserIcon size={24} weight="bold" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{user ? 'Edit User' : 'Add New User'}</h2>
              <p className="text-xs text-zinc-500">Set user permissions and details.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all"
          >
            <XIcon size={20} weight="bold" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold flex items-center gap-2">
              <ShieldCheckIcon size={18} />
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative group">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input
                  required
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 outline-none focus:border-blue-500/50 transition-all text-white placeholder:text-zinc-700"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Username</label>
              <input
                type="text"
                value={formData.username || ''}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="johndoe"
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-2.5 px-4 outline-none focus:border-blue-500/50 transition-all text-white placeholder:text-zinc-700"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">RFID UID</label>
              <div className="relative group">
                <IdentificationCardIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input
                  required
                  type="text"
                  value={formData.rfid_uid || ''}
                  onChange={(e) => setFormData({ ...formData, rfid_uid: e.target.value })}
                  placeholder="A1 B2 C3 D4"
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 outline-none focus:border-blue-500/50 transition-all text-white placeholder:text-zinc-700 font-mono"
                />
              </div>
            </div>

            <div className="col-span-2 space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">User Role</label>
              <div className="grid grid-cols-3 gap-2">
                {(['student', 'staff', 'admin'] as const).map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setFormData({ ...formData, role })}
                    className={`py-2 rounded-xl text-xs font-black uppercase tracking-wider border transition-all ${formData.role === role
                        ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                        : 'bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                      }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-1">
                <ClockIcon size={14} /> Schedule Start
              </label>
              <input
                required
                type="time"
                step="1"
                value={formData.schedule_start || ''}
                onChange={(e) => setFormData({ ...formData, schedule_start: e.target.value })}
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-2.5 px-4 outline-none focus:border-blue-500/50 transition-all text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-1">
                <ClockIcon size={14} /> Schedule End
              </label>
              <input
                required
                type="time"
                step="1"
                value={formData.schedule_end || ''}
                onChange={(e) => setFormData({ ...formData, schedule_end: e.target.value })}
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-2.5 px-4 outline-none focus:border-blue-500/50 transition-all text-white"
              />
            </div>

            <div className="col-span-2 space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-1">
                <CalendarIcon size={14} /> Valid Until
              </label>
              <input
                required
                type="date"
                value={formData.valid_until || ''}
                onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-2.5 px-4 outline-none focus:border-blue-500/50 transition-all text-white scheme-dark"
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl py-3 font-bold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl py-3 font-bold transition-all shadow-lg shadow-blue-500/20"
            >
              {loading ? 'Saving...' : user ? 'Update User' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UserForm
