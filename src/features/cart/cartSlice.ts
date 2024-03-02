import { createSlice } from '@reduxjs/toolkit'

import type { RootState } from '@/store'

const initialState: { isOpened: boolean } = {
  isOpened: false,
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

export const selectIsCartOpened = (state: RootState) => state.cart.isOpened

export default cartSlice.reducer
