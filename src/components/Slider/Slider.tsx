'use client'

import * as React from 'react'
import SlickSlider from 'react-slick'
import { Fragment } from 'react'
import { ArrowRight, ArrowLeft } from 'phosphor-react'

import Card from '@/components/Card'

import 'slick-carousel/slick/slick-theme.css'
import 'slick-carousel/slick/slick.css'

interface SliderProps {
  items: {
    id: string
    imageURLs: string[]
    name: string
    price?: number
  }[]
}

const Slider: React.FC<SliderProps> = ({ items }) => {
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
              <Card {...item} />
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
