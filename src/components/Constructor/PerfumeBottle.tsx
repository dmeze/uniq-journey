/* eslint-disable react/no-array-index-key */
import React from 'react'
import Image from 'next/image'

import PerfumeAnimation from '@/components/Constructor/PerfumeAnimation'
import { colorsMap } from '@/components/Constructor/constants'

import logo from '../../../public/logo.png'

interface PerfumeBottleProps {
  baseNotes: string[]
  middleNotes: string[]
  topNotes: string[]
  selectedImage: string | null
}

const PerfumeBottle = ({
  baseNotes,
  middleNotes,
  topNotes,
  selectedImage,
}: PerfumeBottleProps) => {
  const allNotes = [...baseNotes, ...middleNotes, ...topNotes]

  const colorMap = new Map<string, string>()

  allNotes.forEach((aroma) => {
    if (!colorMap.has(aroma)) {
      colorMap.set(aroma, colorsMap[colorMap.size % colorsMap.length])
    }
  })

  return (
    <div className="mb-6 flex flex-col items-center">
      <div className="relative h-80 w-60 overflow-hidden">
        <svg
          viewBox="0 0 72 128"
          className="size-full"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: 'absolute', zIndex: 1 }}
        >
          <rect x="16" y="0" width="32" height="10" fill="#ccc" />
          <rect x="18" y="10" width="28" height="10" fill="#aaa" />
          <path
            d="M10 20 H54 A10 10 0 0 1 64 30 V128 H0 V30 A10 10 0 0 1 10 20 Z"
            fill="#eee"
          />
        </svg>
        {selectedImage && (
          <div className="absolute bottom-6 left-[30px] z-30 h-52 w-[160px] bg-white-yellow">
            <Image
              src={logo}
              alt="logo"
              height={80}
              width={80}
              className="absolute left-[40px] top-1.5 size-[80px]"
            />
            <Image
              src={selectedImage}
              alt="Selected"
              height={110}
              width={110}
              className="absolute bottom-2 left-[25px] z-40 size-[110px]"
            />
          </div>
        )}
        <div className="relative left-[30px] top-[55px] h-[250px] w-[160px]">
          {allNotes.map((aroma, index) => {
            const color = colorMap.get(aroma) || colorsMap[index]

            return (
              <PerfumeAnimation
                key={aroma + index}
                index={index}
                total={allNotes.length}
                color={color}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default PerfumeBottle
