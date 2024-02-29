import React, { useState } from 'react'
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import { v4 } from 'uuid'
import { isEmpty } from 'lodash'

import {
  addCartItem,
  createCart,
  selectCartData,
  setIsCartOpened,
} from '@/features/cart/cartSlice'
import type { AppDispatch } from '@/store'
import { get } from '@/app/[locale]/actions'
import { priceBySize, sevenMl, sizeOptions } from '@/components/Card/constants'

interface CardProps {
  imageURLs: string[]
  name: string
  description: string
  id: string
}

const Card: React.FC<CardProps> = ({ imageURLs, name, description, id }) => {
  const dispatch = useDispatch<AppDispatch>()
  const cartData = useSelector(selectCartData)
  const [selectedSize, setSelectedSize] = useState(sevenMl)

  const handleAddToCart = async (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault()
    const uuid = v4()
    const userIdCookie = await get('uuid')

    if (isEmpty(cartData)) {
      await dispatch(
        createCart({
          id: uuid,
          userId: userIdCookie?.value as string,
          count: 0,
          total: 0,
        }),
      )
    }

    dispatch(
      addCartItem({
        cartId: cartData.id || uuid,
        perfumeId: id,
        size: selectedSize,
        price: priceBySize[selectedSize as keyof typeof priceBySize],
      }),
    )
    dispatch(setIsCartOpened())
  }

  return (
    <div className="mx-5 my-2.5 overflow-hidden rounded-lg bg-white transition-shadow duration-300 hover:shadow-xl">
      <div className="relative h-64">
        <Image
          priority
          src={imageURLs[0]}
          alt={name}
          width={300}
          height={300}
          className="size-full rounded-t-lg object-cover object-center"
        />
      </div>
      <div className="px-6 py-4">
        <h2 className="mb-2 text-xl font-semibold text-gray-900">{name}</h2>
        <p className="text-base text-gray-700">{description}</p>
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
            ? 'bg-green-600 text-white shadow-md'
            : 'bg-gray-100 text-gray-700 hover:bg-green-200 hover:text-green-700'
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
