'use client'

import React from 'react'
import Image from 'next/image'

interface CardProps {
  imageUrl: string
  title: string
  description: string
  price: string
}

const Card: React.FC<CardProps> = ({ imageUrl, title, description, price }) => {
  return (
    <div className="mx-auto max-w-xs overflow-hidden rounded-lg bg-white shadow-md">
      <div className="relative h-64">
        <Image
          src={imageUrl}
          alt={title}
          layout="fill"
          objectFit="cover"
          objectPosition="center"
          className="rounded-t-lg"
        />
      </div>
      <div className="px-6 py-4">
        <div className="mb-2 text-xl font-semibold">{title}</div>
        <p className="text-base text-gray-700">{description}</p>
      </div>
      <div className="px-6 pb-2 pt-4">
        <span className="inline-block rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-900">
          {price}
        </span>
      </div>
    </div>
  )
}

export default Card
