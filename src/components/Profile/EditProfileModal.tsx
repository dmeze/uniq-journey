import React, { useState } from 'react'
import type { User } from '@prisma/client'

import { getCityRef, getWarehouseOptions } from '@/components/Checkout/helpers'
import type { IOption } from '@/components/Select/ActionSelect'
import ActionSelect from '@/components/Select/ActionSelect'
import { userFields } from '@/components/Profile/constants'
import { updateUser } from '@/app/actions/user/actions'
import type { UserUpdateData } from '@/app/actions/user/actions'

import Modal from '../Modal'

export interface UserWithKey extends User {
  [key: string]: string | null
}

interface EditProfileModalProps {
  user: UserWithKey
  isOpen: boolean
  onClose: () => void
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  user,
  isOpen,
  onClose,
}) => {
  const [city, setCity] = useState({ value: '', label: user.city })
  const [warehouse, setWarehouse] = useState(user.warehouse)

  const handleCityChange = (option: IOption) => {
    setWarehouse('')
    setCity(option)
  }

  const handleWarehouseChange = (option: IOption) => {
    setWarehouse(option.label)
  }

  const handleSubmit = async (formData: FormData) => {
    onClose()

    const userData = {
      ...Object.fromEntries(formData),
      city: city.label,
      warehouse,
    } as UserUpdateData

    await updateUser(userData)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile">
      <form action={handleSubmit}>
        {userFields.map(
          ({ name, label, type }) =>
            type && (
              <div className="mb-4" key={name}>
                <label htmlFor={name} className="block text-gray-700">
                  {label}
                </label>
                <input
                  id={name}
                  type={type}
                  name={name}
                  defaultValue={user[name] || ''}
                  className="mt-1 w-full rounded border p-2"
                />
              </div>
            ),
        )}
        <ActionSelect
          setSelectedValue={handleCityChange}
          id="city"
          label="City"
          fetchOptions={getCityRef}
          defaultValue={user.city}
        />
        <ActionSelect
          setSelectedValue={handleWarehouseChange}
          id="warehouse"
          label="Warehouse"
          fetchOptions={(value) => getWarehouseOptions(city.value, value)}
          refreshValue={city.value}
          defaultValue={user.warehouse}
        />
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="mr-4 rounded-lg bg-transparent px-5 py-2 text-dark-green-500 transition duration-300 hover:border hover:border-light-green-500 hover:bg-light-green-600 hover:text-dark-green-900"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="
                  rounded-lg border-2 border-light-green
                  bg-light-green
                  px-6 py-2
                  font-bold text-white
                  transition duration-300 hover:-translate-y-1 hover:shadow-lg
                  disabled:opacity-70
                "
          >
            Save
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default EditProfileModal
