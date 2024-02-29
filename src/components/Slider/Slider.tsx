'use client'

import * as React from 'react'
import SlickSlider from 'react-slick'
import { Fragment } from 'react'

import { ArrowLeft, ArrowRight } from '@/components/Icons/Icons'
import Card from '@/components/Card'

import 'slick-carousel/slick/slick-theme.css'
import 'slick-carousel/slick/slick.css'

interface SliderProps {
  items: {
    id: string
    imageURLs: string[]
    name: string
    description: string
    price: number
  }[]
}

const Slider: React.FC<SliderProps> = ({ items }) => {
  const sliderRef = React.useRef<SlickSlider>(null)

  return (
    <div className="flex w-full items-center justify-center">
      <button
        type="button"
        aria-label="prev-arrow"
        className="z-10"
        onClick={() => sliderRef.current?.slickPrev()}
      >
        <ArrowLeft />
      </button>
      <div className="w-[calc(100%-72px)]">
        <SlickSlider
          infinite
          lazyLoad="progressive"
          speed={500}
          slidesToShow={3}
          slidesToScroll={3}
          arrows={false}
          ref={sliderRef}
          responsive={[
            {
              breakpoint: 1285,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
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
        className="z-10 rounded-full"
        onClick={() => sliderRef.current?.slickNext()}
      >
        <ArrowRight />
      </button>
    </div>
  )
}

export default Slider
