import React, { useContext } from 'react'
import type { User } from '@prisma/client'
import { toast } from 'react-toastify'

import {
  userFields,
  userValidationSchema,
} from '@/components/Profile/constants'
import Form from '@/components/Form'
import { updateUser } from '@/app/actions/user/actions'
import { PageLoaderContext } from '@/providers/PageLoaderProvider'

import Modal from '../Modal'

export interface UserWithKey extends User {
  [key: string]: string | null
}

interface EditProfileModalProps {
  user: UserWithKey
  isOpen: boolean
  onClose: () => void
}

interface UserUpdatedFormata {
  name: string
  surname: string
  city: { value: string; label: string }
  warehouse: { value: string; label: string }
  email: string
  phone: string
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  user,
  isOpen,
  onClose,
}) => {
  const { startTransition, isPending } = useContext(PageLoaderContext)!

  const handleSubmit = async (data: UserUpdatedFormata) => {
    const city = data.city as any
    const warehouse = data.warehouse as any

    if (user.city !== city.label && user.warehouse !== warehouse.label) {
      if (!city.value || city.value === ' ') {
        toast.error('Please select the city from the list.')
        return
      }

      if (!warehouse.value || warehouse.value === ' ') {
        toast.error('Please select the warehouse from the list.')
        return
      }
    }

    const finalData = {
      name: `${data.name} ${data.surname}`,
      city: city.label,
      warehouse: warehouse.label,
      phone: data.phone,
      email: data.email,
    }

    startTransition(async () => {
      const { success, message } = await updateUser(finalData, true)

      if (success) {
        onClose()
      } else {
        toast.error(message)
      }
    })
  }

  const nameSurname = user?.name?.split(' ') || []

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile">
      <Form
        initialValues={{
          ...user,
          name: nameSurname[0],
          surname: nameSurname[1],
          city: { label: user.city, ref: '' },
          warehouse: { label: user.warehouse, ref: '' },
        }}
        action={handleSubmit}
        fields={userFields}
        isPending={isPending}
        validationSchema={userValidationSchema}
        submitText="Update User Info"
      />
    </Modal>
  )
}

export default EditProfileModal
