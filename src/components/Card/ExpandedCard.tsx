'use client'

import type { SyntheticEvent } from 'react'
import React, { useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import type { AromaType } from '@prisma/client'
import { useTranslations } from 'next-intl'

import type { PerfumeCardProps } from './Card'
import SizeOptions from './SizeOptions'
import ImageGallery from './ImageGallery'

const ExpandedCard = ({
  imageURLs,
  name,
  id,
  description,
  aromas,
  handleClose,
  selectedSize,
  setSelectedSize,
}: PerfumeCardProps & {
  handleClose: (e: SyntheticEvent) => void
  selectedSize: string
  setSelectedSize: (size: string) => void
}) => {
  const tAroma = useTranslations('Aroma')
  const [selectedImage, setSelectedImage] = useState(imageURLs[0])

  const renderAromaList = (noteType: AromaType) => {
    return aromas
      .filter((aroma) => aroma.noteType === noteType)
      .map((aroma) => (
        <li key={aroma.aromaId} className="text-sm">
          {tAroma(`title.${aroma.aroma.name}`)}
        </li>
      ))
  }

  return (
    <AnimatePresence>
      <motion.div
        key="expanded-card"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 sm:p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        onClick={handleClose}
      >
        <motion.div
          layoutId={`card-container-${id}`}
          className="relative flex w-full max-w-3xl flex-col items-center rounded-lg bg-white p-4 sm:p-6"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.95 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-4 flex w-full justify-end">
            <button
              type="button"
              className="text-gray-500 hover:text-gray-800"
              onClick={handleClose}
            >
              Close
            </button>
          </div>
          <motion.div
            key={selectedImage || 'empty'}
            layoutId={`card-image-${id}`}
            className="relative h-64 w-2/3 sm:h-96"
            initial={{ y: 10, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -10, opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <Image
              src={selectedImage}
              alt={name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="rounded-t-lg object-cover"
            />
          </motion.div>
          <ImageGallery
            imageURLs={imageURLs}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
          />
          <div className="px-6">
            <h3 className="mb-0.5 mt-2 w-full text-left text-lg font-semibold">
              {name}
            </h3>
            <p>{description}</p>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <h4 className="font-semibold">High Notes</h4>
                <ul className="list-disc pl-4">{renderAromaList('HIGH')}</ul>
              </div>
              <div>
                <h4 className="font-semibold">Middle Notes</h4>
                <ul className="list-disc pl-4">{renderAromaList('MIDDLE')}</ul>
              </div>
              <div>
                <h4 className="font-semibold">Base Notes</h4>
                <ul className="list-disc pl-4">{renderAromaList('BASE')}</ul>
              </div>
            </div>
          </div>
          <SizeOptions
            id={id}
            name={name}
            handleClose={handleClose}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default ExpandedCard
