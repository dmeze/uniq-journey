'use server'

import BestSellers from '@/components/Home/Widgets/BestSellers'
import { getBestSellers } from '@/app/actions/perfume/actions'

const Home = async () => {
  const bestSellers = await getBestSellers()

  return (
    <div className="flex justify-center">
      <BestSellers perfumes={bestSellers} />
    </div>
  )
}

export default Home
