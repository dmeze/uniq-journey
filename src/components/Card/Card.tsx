'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'

import { setIsCartOpened } from '@/features/cart/cartSlice'
import { priceBySize, sevenMl, sizeOptions } from '@/components/Card/constants'
import { createOrAdd } from '@/app/actions/cart/actions'

interface CardProps {
  imageURLs: string[]
  name: string
  id: string
}

const Card = ({ imageURLs, name, id }: CardProps) => {
  const dispatch = useDispatch()
  const [selectedSize, setSelectedSize] = useState(sevenMl)

  const handleAddToCart = () => {
    toast.promise(
      async () => {
        await createOrAdd({
          perfumeId: id,
          size: selectedSize,
          price: priceBySize[selectedSize as keyof typeof priceBySize],
        })
      },
      {
        pending: `Adding ${name} to the cart...`,
        success: {
          render: ({ closeToast }) => (
            <span>
              {`${name} is added to the cart. `}
              <button
                type="button"
                className="text-light-green-300"
                onClick={() => {
                  dispatch(setIsCartOpened())
                  closeToast()
                }}
              >
                Click here
              </button>
              {` to open the cart.`}
            </span>
          ),
        },
        error: `Failed to add ${name} to cart. Please, try again.`,
      },
    )
  }

  return (
    <div className="mx-5 my-2.5 min-h-[450px] overflow-hidden rounded-lg bg-white transition-shadow duration-300 hover:shadow-xl">
      <div className="relative h-72 w-full">
        <Image
          priority
          src={imageURLs[0]}
          alt={name}
          layout="fill"
          objectFit="cover"
          className="rounded-t-lg"
        />
      </div>
      <div className="px-6 py-4">
        <h2 className="mb-2 text-xl font-bold">{name}</h2>
      </div>
      <div className="flex flex-wrap px-6 pb-2 pt-4">
        {sizeOptions.map((option) => (
          <button
            type="button"
            key={option}
            onClick={() => setSelectedSize(option)}
            className={`mb-2 mr-2 rounded-lg px-3 py-1 text-sm font-medium transition-all duration-300 ease-in-out
        ${
          selectedSize === option
            ? 'bg-light-green-100 text-white shadow-md'
            : 'bg-gray-100 text-dark-green hover:bg-light-green-700 hover:text-light-green-300'
        }
        `}
          >
            {option}
          </button>
        ))}
      </div>
      <div className="px-6 pb-4">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-dark-green">
            ₴{priceBySize[selectedSize as keyof typeof priceBySize]}
          </span>
          <button
            type="button"
            onClick={handleAddToCart}
            className="inline-block
              rounded-lg
              bg-light-green
              px-4 py-2
              text-sm font-bold text-white
              transition duration-300 hover:-translate-y-1 hover:shadow-lg
             "
          >
            Add To Cart
          </button>
        </div>
      </div>
    </div>
  )
}

export default Card
