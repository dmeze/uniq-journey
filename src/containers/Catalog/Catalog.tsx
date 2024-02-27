'use client'

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Card from '@/components/Card'
import type { AppDispatch } from '@/store'
import {
  fetchPerfumes,
  selectPerfumes,
} from '@/features/perfumes/perfumesSlice'

const Catalog = () => {
  const dispatch = useDispatch<AppDispatch>()
  const perfumes = useSelector(selectPerfumes)

  useEffect(() => {
    dispatch(fetchPerfumes())
  }, [dispatch])

  return (
    <div className="flex min-h-screen flex-col px-6 py-10 lg:px-16">
      <div className="mx-auto w-full">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Perfume Catalog</h1>
          <div>
            <span className="mr-2">Size:</span>
            <select className="rounded border border-gray-300 p-2">
              <option value="">All Sizes</option>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
        </div>
        <div className="-mx-4 flex flex-wrap">
          {perfumes.map((perfume) => (
            <div
              key={perfume.id}
              className="w-full sm:w-1/2 md:w-1/3 lg:w-1/3 2xl:w-1/4"
            >
              <Card
                imageUrl={perfume.imageURLs[0]}
                title={perfume.name}
                description={perfume.description}
                price={perfume.price}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Catalog
