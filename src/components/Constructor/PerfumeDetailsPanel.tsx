import React, { useState } from 'react'
import { CaretDown, CaretUp } from 'phosphor-react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { isEmpty } from 'lodash'
import { useFormik } from 'formik'

import Input from '@/components/Input'
import ImageInput from '@/components/Input/ImageInput'
import {
  sizeOptions,
  userPerfumePriceBySize,
} from '@/components/Card/constants'
import {
  imageValidationSchema,
  nameDescriptionValidationSchema,
  perfumeDetailsFields,
} from '@/components/Constructor/constants'
import { createUserPerfume } from '@/app/actions/userPerfume/actions'
import { createOrAdd } from '@/app/actions/cart/actions'
import { setIsCartOpened } from '@/features/cart/cartSlice'

const PerfumeDetailsPanel = ({
  onImageChange,
  aromas,
}: {
  onImageChange: (image: string | null) => void
  aromas: { baseNotes: string[]; middleNotes: string[]; topNotes: string[] }
}) => {
  const dispatch = useDispatch()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [size, setSize] = useState('7ml')

  const toggleCollapse = () => {
    onImageChange(null)
    setIsCollapsed(!isCollapsed)
  }

  const handleSubmit = async (values: any) => {
    if (
      isEmpty(aromas.baseNotes) ||
      isEmpty(aromas.middleNotes) ||
      isEmpty(aromas.topNotes)
    ) {
      toast.error('You should select at least one aroma oil in each note!', {
        autoClose: 8000,
      })
    } else {
      const { userPerfume, success, message } = (await toast.promise(
        async () =>
          createUserPerfume({
            ...values,
            size,
            aromas,
          }),
        {
          pending: `Mixing your perfume...`,
          error: `Failed to add your perfume to cart. Please, try again.`,
        },
        { toastId: 'create-perfume' },
      )) as any

      if (!success) {
        toast.error(message)

        return
      }

      toast.promise(
        async () =>
          createOrAdd({
            userPerfumeId: userPerfume!.id,
            size: userPerfume!.size,
            price:
              userPerfumePriceBySize[
                userPerfume!.size as keyof typeof userPerfumePriceBySize
              ],
          }),
        {
          pending: `Adding your perfume to the cart...`,
          success: {
            render: ({ closeToast }) => (
              <span>
                {`Your perfume is added to the cart. `}
                <button
                  type="button"
                  className="text-light-green-300"
                  onClick={() => {
                    dispatch(setIsCartOpened())
                    closeToast()
                  }}
                >
                  Click here
                </button>
                {` to open the cart.`}
              </span>
            ),
          },
          error: `Failed to add your perfume to cart. Please, try again.`,
        },
        { toastId: 'add-to-cart' },
      )
    }
  }

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      image: null,
    },
    validationSchema: isCollapsed
      ? imageValidationSchema
      : nameDescriptionValidationSchema,
    onSubmit: handleSubmit,
  })

  return (
    <form
      className="flex h-full flex-col rounded-lg border border-gray-300 p-4"
      onSubmit={formik.handleSubmit}
    >
      <h2 className="mb-4 text-xl font-semibold">Perfume Details</h2>
      <div
        className={`transition duration-500 ${
          isCollapsed
            ? 'relative translate-y-0 opacity-100'
            : 'invisible absolute translate-y-full opacity-0'
        }`}
      >
        {isCollapsed && (
          <ImageInput id="image" label="Image" onImageChange={onImageChange} />
        )}
      </div>
      <div
        className={`transition duration-500 ${
          isCollapsed
            ? 'invisible absolute translate-y-full opacity-0'
            : 'relative translate-y-0 opacity-100'
        }`}
      >
        {!isCollapsed &&
          perfumeDetailsFields.map((field) => (
            <Input
              key={field.id}
              id={field.id}
              type={field.type}
              label={field.label}
              formik={formik}
            />
          ))}
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
        className="ml-auto rounded bg-light-green px-4 py-2 text-white hover:bg-dark-green"
      >
        Create
      </button>
    </form>
  )
}

export default PerfumeDetailsPanel
