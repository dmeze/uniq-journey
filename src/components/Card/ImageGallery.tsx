import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface ImageGalleryProps {
  imageURLs: string[]
  selectedImage: string
  setSelectedImage: (url: string) => void
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  imageURLs,
  selectedImage,
  setSelectedImage,
}) => {
  return (
    <div className="mt-2 flex space-x-2 overflow-x-auto">
      {imageURLs.map((url) => (
        <motion.div
          key={url}
          className={`relative size-16 cursor-pointer ${
            selectedImage === url
              ? 'rounded border-4 border-light-green-300'
              : ''
          }`}
          onClick={(e) => {
            e.stopPropagation()
            setSelectedImage(url)
          }}
          initial={{ opacity: 0.8, scale: 0.9 }}
          animate={{
            opacity: selectedImage === url ? 1 : 0.8,
            scale: selectedImage === url ? 1 : 0.9,
          }}
          transition={{ duration: 0.2 }}
        >
          <Image
            src={url}
            alt={url}
            fill
            sizes="16x16"
            className={`${
              selectedImage === url ? 'rounded-none' : 'rounded'
            } object-cover`}
          />
        </motion.div>
      ))}
    </div>
  )
}

export default ImageGallery
