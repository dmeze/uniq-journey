import type { ChangeEvent, FormEvent } from 'react'
import React, { useState } from 'react'
import type { User } from '@prisma/client'

import { getCityRef, getWarehouseOptions } from '@/components/Checkout/helpers'
import type { IOption } from '@/components/Select/ActionSelect'
import ActionSelect from '@/components/Select/ActionSelect'

import Modal from '../Modal'

interface EditProfileModalProps {
  user: User
  isOpen: boolean
  onClose: () => void
  onSave: (updatedUser: User) => void
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  user,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<User>({ ...user })
  const [city, setCity] = useState({ value: '', label: user.city })
  const [warehouse, setWarehouse] = useState('')

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCityChange = (option: IOption) => {
    setWarehouse('')
    setCity(option)
    setFormData((prev) => ({ ...prev, city: option.label }))
  }

  const handleWarehouseChange = (option: IOption) => {
    setWarehouse(option.label)
    setFormData((prev) => ({ ...prev, warehouse: option.label }))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const inputsArray = [
    { label: 'Name', type: 'text', name: 'name', value: formData.name },
    { label: 'Email', type: 'email', name: 'email', value: formData.email },
    { label: 'Phone', type: 'text', name: 'phone', value: formData.phone },
  ]

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile">
      <form onSubmit={handleSubmit}>
        {inputsArray.map((input) => (
          <div className="mb-4" key={input.name}>
            <label htmlFor={input.name} className="block text-gray-700">
              {input.label}
            </label>
            <input
              id={input.name}
              type={input.type}
              name={input.name}
              value={input.value || ''}
              onChange={handleChange}
              className="mt-1 w-full rounded border p-2"
            />
          </div>
        ))}
        <ActionSelect
          setSelectedValue={handleCityChange}
          id="city"
          label="City"
          fetchOptions={getCityRef}
          defaultValue={city.label}
        />
        <ActionSelect
          setSelectedValue={handleWarehouseChange}
          id="warehouse"
          label="Warehouse"
          fetchOptions={(value) => getWarehouseOptions(city.value, value)}
          refreshValue={city.value}
          defaultValue={warehouse}
        />
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="mr-4 rounded bg-gray-500 px-6 py-2 text-white transition duration-300 hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded bg-green-500 px-6 py-2 text-white transition duration-300 hover:bg-green-700"
          >
            Save
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default EditProfileModal
