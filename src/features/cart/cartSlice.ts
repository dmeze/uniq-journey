import { createSlice } from '@reduxjs/toolkit'

import type { RootState } from '@/store'

interface Perfume {
  id: string
  name: string
  price: number
  aromas: string[]
  description: string
  imageURLs: string[]
}

interface CartState {
  data: Perfume[]
  isOpened: boolean
  pending: boolean
  error: string | null
}

const initialState: CartState = {
  data: [],
  isOpened: false,
  pending: false,
  error: null,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setIsCartOpened: (state) => ({
      ...state,
      isOpened: !state.isOpened,
    }),
  },
})

export const { setIsCartOpened } = cartSlice.actions

export const selectCartProducts = (state: RootState) => state.cart.data
export const selectIsCartPending = (state: RootState) => state.cart.pending
export const selectIsCartOpened = (state: RootState) => state.cart.isOpened

export default cartSlice.reducer
