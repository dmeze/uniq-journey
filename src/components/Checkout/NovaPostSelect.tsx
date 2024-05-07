import { useState } from 'react'

import Select from '@/components/Select/ActionSelect'
import { getCityRef, getWarehouseOptions } from '@/components/Checkout/helpers'

const NovaPostSelect = ({
  handleSubmit,
}: {
  handleSubmit: (city: string, warehouse: string) => void
}) => {
  const [city, setCity] = useState({ ref: '', label: '' })
  const [warehouseLabel, setWarehouseLabel] = useState('')

  return (
    <div className="space-y-4">
      <Select
        setSelectedValue={(option) => {
          setWarehouseLabel('')
          setCity({ ref: option.value, label: option.label })
        }}
        id="city"
        label="City"
        fetchOptions={getCityRef!}
      />
      <Select
        setSelectedValue={(option) => setWarehouseLabel(option.label)}
        id="warehouse"
        label="Warehouse"
        fetchOptions={(value) => getWarehouseOptions(city.ref, value)!}
        refreshValue={city.ref}
      />
      <button
        className="
          mt-6 w-full
          rounded bg-dark-green-300
          px-4 py-2 font-bold text-white
          shadow-lg
          transition duration-300
          ease-in-out hover:bg-dark-green-600 focus:opacity-50 focus:outline-none focus:ring-2
          focus:ring-dark-green-500"
        type="submit"
        onClick={() => handleSubmit(city.label, warehouseLabel)}
      >
        Submit
      </button>
    </div>
  )
}

export default NovaPostSelect
