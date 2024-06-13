'use client'

import * as React from 'react'
import { Fragment } from 'react'
import SlickSlider from 'react-slick'
import { ArrowLeft, ArrowRight } from 'phosphor-react'
import { useTranslations } from 'next-intl'
import type { AromaType } from '@prisma/client'

import Card from '@/components/Card'

import 'slick-carousel/slick/slick-theme.css'
import 'slick-carousel/slick/slick.css'

interface Aroma {
  aromaId: string
  name: string
  aroma: { id: string; name: string }
  noteType: AromaType
}

interface SliderProps {
  items: {
    id: string
    imageURLs: string[]
    name: string
    price?: number
    aromas?: Aroma[]
  }[]
}

const Slider: React.FC<SliderProps> = ({ items }) => {
  const tPerfume = useTranslations('Perfume')
  const sliderRef = React.useRef<SlickSlider>(null)

  return (
    <div className="relative flex items-center justify-center">
      <button
        type="button"
        aria-label="prev-arrow"
        className="absolute left-0 z-10 hover:text-dark-green-300"
        onClick={() => sliderRef.current?.slickPrev()}
      >
        <ArrowLeft size={28} weight="bold" />
      </button>
      <div className="w-[calc(100%-72px)]">
        <SlickSlider
          infinite
          speed={300}
          slidesToShow={3}
          slidesToScroll={1}
          arrows={false}
          ref={sliderRef}
          responsive={[
            {
              breakpoint: 1285,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
              },
            },
            {
              breakpoint: 768,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
              },
            },
          ]}
        >
          {items.map((item) => (
            <Fragment key={item.id}>
              <Card
                description={tPerfume(`description.${item.name}`)}
                {...item}
                aromas={item.aromas as unknown as Aroma[]}
                withoutId
              />
            </Fragment>
          ))}
        </SlickSlider>
      </div>
      <button
        type="button"
        aria-label="next-arrow"
        className="absolute right-0 z-10 rounded-full hover:text-dark-green-300"
        onClick={() => sliderRef.current?.slickNext()}
      >
        <ArrowRight size={28} weight="bold" />
      </button>
    </div>
  )
}

export default Slider
