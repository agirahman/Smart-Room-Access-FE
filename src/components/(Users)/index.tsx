"use client"

import { useState } from 'react'
import Header from "@/components/ui/Header"
import Controls from "./Control"
import UserList from "./List"
import UserForm from "./UserForm"
import { User } from '@/libs/action/data'
import showToast from '@/components/ui/toast'

interface UserPageProps {
  initialUsers: User[]
  searchParams: {
    q?: string
    role?: string
    page?: string
  }
}

const UserPage = ({ initialUsers, searchParams }: UserPageProps) => {
  const [showForm, setShowForm] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const q = searchParams.q?.toLowerCase() || ''
  const role = searchParams.role || 'all'
  const page = parseInt(searchParams.page || '1')
  const itemsPerPage = 10

  // Filtering
  const filteredUsers = initialUsers.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(q) || 
      user.rfid_uid.toLowerCase().includes(q) ||
      user.username?.toLowerCase().includes(q)
    
    const matchesRole = role === 'all' || user.role === role

    return matchesSearch && matchesRole
  })

  // Pagination
  const totalItems = filteredUsers.length
  const startIndex = (page - 1) * itemsPerPage
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage)

  const handleAddClick = () => {
    setSelectedUser(null)
    setShowForm(true)
  }

  const handleEditClick = (user: User) => {
    setSelectedUser(user)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setSelectedUser(null)
  }

  return (
    <div 
      className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-8"
      style={{
        backgroundColor: 'var(--bg-base)',
        fontFamily: 'var(--font-body)'
      }}
    >
      <div className="max-w-7xl mx-auto">
        <Header 
          title="Manajemen Pengguna" 
          description="Konfigurasi izin akses, tag RFID, dan jadwal untuk siswa dan staf." 
        />

        <div className="mt-8">
          <Controls onAddClick={handleAddClick} />
        </div>
        
        <div className="mt-6">
          <UserList 
            users={paginatedUsers}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            currentPage={page}
            onEditClick={handleEditClick}
          />
        </div>

        {showForm && (
          <UserForm 
            key={selectedUser?.id || 'new'}
            user={selectedUser}
            onClose={handleCloseForm}
          />
        )}
      </div>
    </div>
  )
}

export default UserPage