import React, { type SyntheticEvent } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'

import { setIsCartOpened } from '@/features/cart/cartSlice'
import { createOrAdd } from '@/app/actions/cart/actions'
import { priceBySize } from '@/components/Card/constants'

export const useCardActions = () => {
  const dispatch = useDispatch()

  const handleAddToCart = async (
    id: string,
    name: string,
    selectedSize: string,
    handleClose: (e: SyntheticEvent) => void,
  ) => {
    toast.promise(
      async () => {
        await createOrAdd({
          perfumeId: id,
          size: selectedSize,
          price: priceBySize[selectedSize as keyof typeof priceBySize],
        })
      },
      {
        pending: `Adding ${name} to the cart...`,
        success: {
          render: ({ closeToast }) => (
            <span>
              {`${name} is added to the cart. `}
              <button
                type="button"
                className="text-light-green-300"
                onClick={(e: SyntheticEvent) => {
                  dispatch(setIsCartOpened())
                  closeToast()
                  handleClose(e)
                }}
              >
                Click here
              </button>
              {` to open the cart.`}
            </span>
          ),
        },
        error: `Failed to add ${name} to cart. Please, try again.`,
      },
    )
  }

  return { handleAddToCart }
}
