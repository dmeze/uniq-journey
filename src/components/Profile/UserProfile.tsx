'use client'

import React, { useState } from 'react'
import { PencilSimple } from 'phosphor-react'
import type { User } from '@prisma/client'

import { userFields } from '@/components/Profile/constants'

import EditProfileModal, { type UserWithKey } from './EditProfileModal'

interface UserProfileProps {
  user: User
}

const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  const [isModalOpen, setModalOpen] = useState(false)

  const handleEditClick = () => {
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
  }

  return (
    <div className="flex h-full flex-col justify-center rounded bg-white p-6 shadow-md">
      <div className="flex items-center justify-between">
        <h2 className="mb-4 text-2xl font-semibold text-dark-green-300">
          User Information
        </h2>
        <button
          type="button"
          className="mb-4 cursor-pointer text-dark-green-100 hover:text-dark-green-600"
          onClick={handleEditClick}
          aria-label="Edit Profile"
        >
          <PencilSimple size={24} />
        </button>
      </div>
      <div className="mt-2 flex-1 space-y-4 text-lg text-dark-green">
        {userFields.map((field) => (
          <div key={field.label}>
            {field.label === 'City' && (
              <h2 className="my-6 text-2xl font-semibold text-dark-green-300">
                Mail Information
              </h2>
            )}
            <p className="mb-2">
              <strong>{field.label}:</strong>{' '}
              {(user as unknown as UserWithKey)[field.name]}
            </p>
          </div>
        ))}
      </div>
      <EditProfileModal
        user={user}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  )
}

export default UserProfile
