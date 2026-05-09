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
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <Header 
        title="User Management" 
        description="Configure access permissions, RFID tags, and schedules for students and staff." 
      />

      <button onClick={() => showToast("This is a success message!", "success")}>Show Success Toast</button>
      
      <Controls onAddClick={handleAddClick} />
      
      <UserList 
        users={paginatedUsers}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        currentPage={page}
        onEditClick={handleEditClick}
      />

      {showForm && (
        <UserForm 
          key={selectedUser?.id || 'new'}
          user={selectedUser}
          onClose={handleCloseForm}
        />
      )}
    </div>
  )
}

export default UserPage