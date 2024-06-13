import React, { type SyntheticEvent } from 'react'

import { priceBySize, sizeOptions } from '@/components/Card/constants'
import { useCardActions } from '@/components/Card/useCardActions'

interface SizeOptionsProps {
  id: string
  name: string
  handleClose: (e: SyntheticEvent) => void
  selectedSize: string
  setSelectedSize: (size: string) => void
}

const SizeOptions: React.FC<SizeOptionsProps> = ({
  id,
  name,
  handleClose,
  selectedSize,
  setSelectedSize,
}) => {
  const { handleAddToCart } = useCardActions()

  return (
    <>
      <div className="flex w-full flex-wrap px-6 pb-2 pt-6">
        {sizeOptions.map((option) => (
          <button
            type="button"
            key={option}
            onClick={(e) => {
              e.stopPropagation()
              setSelectedSize(option)
            }}
            className={`mb-2 mr-2 rounded-lg px-3 py-1 text-sm font-medium transition-all duration-300 ease-in-out ${
              selectedSize === option
                ? 'bg-light-green-100 text-white shadow-md'
                : 'bg-gray-100 text-dark-green hover:bg-light-green-700 hover:text-light-green-300'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      <div className="w-full px-6 pb-4">
        <div className="flex w-full items-center justify-between">
          <span className="text-lg font-semibold text-dark-green">
            ₴{priceBySize[selectedSize as keyof typeof priceBySize]}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              handleAddToCart(id, name, selectedSize, handleClose)
            }}
            className="inline-block rounded-lg bg-light-green px-4 py-2 text-sm font-bold text-white transition duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            Add To Cart
          </button>
        </div>
      </div>
    </>
  )
}

export default SizeOptions
