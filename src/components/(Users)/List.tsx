"use client"

import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table'
import { Pagination } from '@/components/ui/Pagination'
import { User } from '@/libs/action/data'
import { TrashIcon, PencilSimpleIcon, IdentificationCardIcon, ClockIcon, CalendarIcon } from '@phosphor-icons/react'
import { deleteUser } from '@/libs/action/data'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { showSuccess, showError } from '@/components/ui/toast'
import { useRouter } from 'next/navigation'
import { cn } from '@/libs/utils'

interface UserListProps {
  users: User[]
  totalItems: number
  itemsPerPage: number
  currentPage: number
  onEditClick: (user: User) => void
}

const UserList = ({ users, totalItems, itemsPerPage, currentPage, onEditClick }: UserListProps) => {
  const router = useRouter()
  const [confirmOpen, setConfirmOpen] = React.useState(false)
  const [pendingUser, setPendingUser] = React.useState<User | null>(null)

  const openConfirm = (user: User) => {
    setPendingUser(user)
    setConfirmOpen(true)
  }

  const handleDelete = async () => {
    if (!pendingUser) return
    const id = pendingUser.id
    setConfirmOpen(false)
    const result = await deleteUser(id)
    if (result.success) {
      router.refresh()
      showSuccess('User deleted')
    } else {
      showError(result.message || 'Failed to delete user')
    }
    setPendingUser(null)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50 rounded-3xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>RFID UID</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Schedule</TableHead>
              <TableHead>Valid Until</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-zinc-500">
                  No users found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              users.map((item) => (
                <TableRow key={item.id} className="group">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold uppercase">
                        {item.name.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-white">{item.name}</span>
                        <span className="text-xs text-zinc-500">@{item.username || 'n/a'}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-zinc-400 font-mono text-xs">
                      <IdentificationCardIcon size={18} className="text-zinc-500" />
                      {item.rfid_uid}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        'px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border',
                        item.role === 'admin'
                          ? 'bg-red-500/10 text-red-500 border-red-500/20'
                          : item.role === 'staff'
                          ? 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                          : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                      )}
                    >
                      {item.role}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-zinc-400 text-xs">
                      <ClockIcon size={18} className="text-zinc-500" />
                      {item.schedule_start} - {item.schedule_end}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-zinc-400 text-xs">
                      <CalendarIcon size={18} className="text-zinc-500" />
                      {new Date(item.valid_until).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEditClick(item)}
                        className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-blue-500 hover:bg-blue-500/10 transition-all"
                      >
                        <PencilSimpleIcon size={18} />
                      </button>
                      <button
                        onClick={() => openConfirm(item)}
                        className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-all"
                      >
                        <TrashIcon size={18} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <Pagination currentPage={currentPage} totalPages={Math.ceil(totalItems / itemsPerPage)} />

      <ConfirmDialog
        open={confirmOpen}
        title="Delete user"
        description="This action will permanently delete the user."
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
      >
        {pendingUser ? (
          <div className="space-y-3 text-sm text-zinc-300">
            <div>
              <strong className="text-white">Name:</strong> {pendingUser.name}
            </div>
            <div>
              <strong className="text-white">Username:</strong> @{pendingUser.username || 'n/a'}
            </div>
            <div>
              <strong className="text-white">RFID:</strong> {pendingUser.rfid_uid}
            </div>
            <div>
              <strong className="text-white">Role:</strong> {pendingUser.role}
            </div>
            <div>
              <strong className="text-white">Valid Until:</strong> {new Date(pendingUser.valid_until).toLocaleDateString()}
            </div>
          </div>
        ) : null}
      </ConfirmDialog>
    </div>
  )
}

export default UserList
