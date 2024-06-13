'use client'

import type { SyntheticEvent } from 'react'
import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import Image from 'next/image'
import { motion } from 'framer-motion'
import type { AromaType } from '@prisma/client'

import { sevenMl } from '@/components/Card/constants'

import ExpandedCard from './ExpandedCard'
import SizeOptions from './SizeOptions'

interface Aroma {
  aromaId: string
  name: string
  aroma: { id: string; name: string }
  noteType: AromaType
}

export interface PerfumeCardProps {
  imageURLs: string[]
  name: string
  id: string
  description: string
  aromas: Aroma[]
  withoutId?: boolean
}

const Card = ({
  imageURLs,
  name,
  id,
  description,
  aromas,
  withoutId,
}: PerfumeCardProps) => {
  const [selectedSize, setSelectedSize] = useState(sevenMl)
  const [isExpanded, setIsExpanded] = useState(false)

  const handleCardClick = () => {
    setIsExpanded(true)
  }

  const handleClose = (e: SyntheticEvent) => {
    e.stopPropagation()
    setIsExpanded(false)
  }

  return (
    <>
      <motion.div
        layoutId={!withoutId ? `card-container-${id}` : undefined}
        className="mx-5 my-2.5 min-h-[450px] overflow-hidden rounded-lg bg-white transition-shadow duration-300 hover:shadow-xl"
        onClick={handleCardClick}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        layout
      >
        <div className="relative h-72 w-full cursor-pointer">
          <Image
            src={imageURLs[0]}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="rounded-t-lg object-cover"
          />
        </div>
        <div className="px-6 pt-4">
          <h2 className="mb-2 text-xl font-bold">{name}</h2>
        </div>
        <SizeOptions
          id={id}
          name={name}
          handleClose={handleClose}
          selectedSize={selectedSize}
          setSelectedSize={setSelectedSize}
        />
      </motion.div>
      {isExpanded &&
        ReactDOM.createPortal(
          <ExpandedCard
            imageURLs={imageURLs}
            name={name}
            id={id}
            description={description}
            aromas={aromas}
            handleClose={handleClose}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
            withoutId
          />,
          document.body,
        )}
    </>
  )
}

export default Card
