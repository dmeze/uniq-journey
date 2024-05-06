import { useEffect, useState } from 'react'

import Select from '@/components/Select/ActionSelect'
import { getCityRef, getWarehouseOptions } from '@/components/Checkout/helpers'

const NovaPostSelect = ({ handleSubmit }: { handleSubmit: () => void }) => {
  const [cityRef, setCityRef] = useState('')
  const [warehouse, setWarehouse] = useState('')

  useEffect(() => {
    console.log(warehouse)
  }, [warehouse])

  return (
    <div className="space-y-4">
      <Select
        setSelectedValue={(option) => {
          setWarehouse('')
          setCityRef(option.value)
        }}
        id="city"
        label="City"
        fetchOptions={getCityRef!}
      />
      <Select
        setSelectedValue={(option) => setWarehouse(option.label)}
        id="warehouse"
        label="Warehouse"
        fetchOptions={(value) => getWarehouseOptions(cityRef, value)!}
        refreshValue={cityRef}
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
        onClick={handleSubmit}
      >
        Submit
      </button>
    </div>
  )
}

export default NovaPostSelect
