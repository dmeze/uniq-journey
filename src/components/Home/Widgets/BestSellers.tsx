'use client'

import WidgetContainer from '@/components/Home/WidgetContainer'
import Slider from '@/components/Slider'

const BestSellers = () => {
  return (
    <WidgetContainer title="Best Sellers">
      <Slider
        items={[
          {
            title: 'Paris',
            description: 'Christmas Paris',
            imageUrl: '/chicago.jpg',
            price: '100UAH',
          },
          {
            title: 'Paris',
            description: 'Christmas Paris',
            imageUrl: '/chicago.jpg',
            price: '100UAH',
          },
          {
            title: 'Paris',
            description: 'Christmas Paris',
            imageUrl: '/chicago.jpg',
            price: '100UAH',
          },
          {
            title: 'Paris',
            description: 'Christmas Paris',
            imageUrl: '/chicago.jpg',
            price: '100UAH',
          },
        ]}
      />
    </WidgetContainer>
  )
}

export default BestSellers
