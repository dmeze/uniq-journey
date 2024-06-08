import React, { useContext, useState } from 'react'
import { CaretDown, CaretUp } from 'phosphor-react'
import { useDispatch } from 'react-redux'

import Input from '@/components/Input'
import ImageInput from '@/components/Input/ImageInput'
import {
  sizeOptions,
  userPerfumePriceBySize,
} from '@/components/Card/constants'
import { createUserPerfume } from '@/app/actions/userPerfume/actions'
import { PageLoaderContext } from '@/providers/PageLoaderProvider'
import { createOrAdd } from '@/app/actions/cart/actions'
import { setIsCartOpened } from '@/features/cart/cartSlice'
import { perfumeDetailsFields } from '@/components/Constructor/constants'

const PerfumeDetailsPanel = ({
  onImageChange,
  aromas,
}: {
  onImageChange: (image: string | null) => void
  aromas: { baseNotes: string[]; middleNotes: string[]; topNotes: string[] }
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [size, setSize] = useState('7ml')
  const { startTransition } = useContext(PageLoaderContext)!
  const dispatch = useDispatch()

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const { userPerfume } = await createUserPerfume(formData)

      await createOrAdd({
        userPerfumeId: userPerfume.id,
        size: userPerfume.size,
        price:
          userPerfumePriceBySize[
            userPerfume.size as keyof typeof userPerfumePriceBySize
          ],
      })

      dispatch(setIsCartOpened())
    })
  }

  return (
    <form
      className="flex h-full flex-col rounded-lg border border-gray-300 p-4"
      action={handleSubmit}
    >
      <h2 className="mb-4 text-xl font-semibold">Perfume Details</h2>

      <div className={isCollapsed ? 'absolute -z-10' : ''}>
        {!isCollapsed && (
          <>
            {perfumeDetailsFields.map((field) => (
              <Input key={field.id} {...field} />
            ))}
          </>
        )}
      </div>
      <div className={isCollapsed ? '' : 'absolute -z-10'}>
        {isCollapsed && (
          <ImageInput id="image" label="Image" onImageChange={onImageChange} />
        )}
      </div>

      <div className="relative my-4">
        <button
          type="button"
          onClick={toggleCollapse}
          className="relative inset-x-0 bottom-0 -mb-3 flex w-full flex-col items-center border-b-2 border-light-green-600 hover:border-dark-green-600"
        >
          <p
            className={`absolute text-dark-green-600 transition-all duration-500 ${
              isCollapsed ? 'bottom-[-28px]' : 'bottom-0'
            }`}
          >
            {isCollapsed
              ? 'Select a Photo or Enter Title and Description'
              : 'Enter Title and Description or Select a Photo'}
          </p>
          {isCollapsed ? (
            <CaretUp
              weight="bold"
              size={16}
              className="absolute bottom-[-2px] text-light-green-600 transition-all duration-500 hover:text-dark-green-600"
            />
          ) : (
            <CaretDown
              weight="bold"
              size={16}
              className="absolute bottom-[-16px] text-light-green-600 transition-all duration-500 hover:text-dark-green-600"
            />
          )}
        </button>
      </div>

      <div className="flex flex-wrap pb-2 pt-4">
        <input
          name="size"
          value={size}
          onChange={() => {}}
          className="hidden"
        />
        <input
          name="aromas"
          value={JSON.stringify(aromas)}
          onChange={() => {}}
          className="hidden"
        />
        {sizeOptions.map((option) => (
          <button
            type="button"
            key={option}
            onClick={() => setSize(option)}
            className={`my-2 mr-2 rounded-lg px-3 py-1 text-sm font-medium transition-all duration-300 ease-in-out${
              size === option
                ? ' bg-light-green-100 text-white shadow-md'
                : ' bg-gray-100 text-gray-700 hover:bg-light-green-700 hover:text-light-green-300'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <button
        type="submit"
        className="ml-auto mt-4 rounded bg-light-green px-4 py-2 text-white hover:bg-dark-green"
      >
        Create
      </button>
    </form>
  )
}

export default PerfumeDetailsPanel
