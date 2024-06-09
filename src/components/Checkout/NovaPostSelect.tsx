'use client'

import React from 'react'
import { toast } from 'react-toastify'

import Form from '@/components/Form'
import {
  mailInformationFields,
  mailInformationValidationSchema,
} from '@/components/Checkout/constants'

const NovaPostSelect = ({
  cityLabel,
  warehouseLabel,
  handleSubmit,
}: {
  cityLabel: string | null
  warehouseLabel: string | null
  handleSubmit: (city: string, warehouse: string) => void
}) => {
  const handleSubmitAction = (data: {
    city: { label: string; value: string }
    warehouse: { value: string; label: string }
  }) => {
    const city = data.city as any
    const warehouse = data.warehouse as any

    if (cityLabel !== city.label && warehouseLabel !== warehouse.label) {
      if (!city.value || city.value === ' ') {
        toast.error('Please select the city from the list.')
        return
      }

      if (!warehouse.value || warehouse.value === ' ') {
        toast.error('Please select the warehouse from the list.')
        return
      }
    }

    handleSubmit(city.label, warehouse.label)
  }

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <Form
        initialValues={{
          city: { value: '', label: cityLabel },
          warehouse: { value: '', label: warehouseLabel },
        }}
        action={handleSubmitAction}
        fields={mailInformationFields}
        validationSchema={mailInformationValidationSchema}
        submitText="Next"
      />
    </div>
  )
}

export default NovaPostSelect
