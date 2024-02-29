'use client'

import WidgetContainer from '@/components/Home/WidgetContainer'
import Slider from '@/components/Slider'

const BestSellers = () => {
  return (
    <WidgetContainer title="Best Sellers">
      <Slider
        items={[
          {
            id: '1',
            name: 'Paris',
            description: 'Christmas Paris',
            imageURLs: ['/chicago.jpg'],
            price: 100,
          },
          {
            id: '2',
            name: 'Paris',
            description: 'Christmas Paris',
            imageURLs: ['/chicago.jpg'],
            price: 100,
          },
          {
            id: '3',
            name: 'Paris',
            description: 'Christmas Paris',
            imageURLs: ['/chicago.jpg'],
            price: 100,
          },
          {
            id: '4',
            name: 'Paris',
            description: 'Christmas Paris',
            imageURLs: ['/chicago.jpg'],
            price: 100,
          },
        ]}
      />
    </WidgetContainer>
  )
}

export default BestSellers
