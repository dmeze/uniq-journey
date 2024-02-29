import type { PayloadAction } from '@reduxjs/toolkit'
import { isAnyOf, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

import type { RootState } from '@/store'
import type { Perfume } from '@/features/perfumes/perfumesSlice'

export interface CartItem extends Perfume {
  quantity: number
  price: number
  size: string
  itemId: string
}

export interface CartItemProps {
  cartId: string
  perfumeId: string
  price?: number
  size?: string
}

export interface Cart {
  id: string
  userId: string
  products: CartItem[]
  count: number
  total: number
}

export interface CreateCartProps {
  id: string
  userId: string
  count: number
  total: number
}

interface CartState {
  data: Cart
  isOpened: boolean
  pending: boolean
  error: string | null
}

const initialState: CartState = {
  data: {} as Cart,
  isOpened: false,
  pending: false,
  error: null,
}

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (id: string) => {
    const { data } = await axios.get('/api/cart', { params: { id } })

    return data as Cart
  },
)

export const createCart = createAsyncThunk(
  'cart/createCart',
  async (cart: CreateCartProps) => {
    const { data } = await axios({
      url: '/api/cart',
      method: 'post',
      data: cart,
    })

    return data as Cart
  },
)

export const addCartItem = createAsyncThunk(
  'cart/addCartItem',
  async (cartItem: CartItemProps) => {
    const { data } = await axios({
      url: '/api/cart/add',
      method: 'post',
      data: cartItem,
    })

    return data as Cart
  },
)

export const removeCartItem = createAsyncThunk(
  'cart/removeCartItem',
  async (cartItem: CartItemProps) => {
    const { data } = await axios({
      url: '/api/cart/remove',
      method: 'post',
      data: cartItem,
    })

    return data as Cart
  },
)

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (cartId: string) => {
    const { data } = await axios.delete('/api/cart', {
      params: { id: cartId },
    })

    return data as Cart
  },
)

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setIsCartOpened: (state) => ({
      ...state,
      isOpened: !state.isOpened,
    }),
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action: PayloadAction<Cart>) => ({
        ...state,
        pending: false,
        data: action.payload,
      }))
      .addCase(createCart.fulfilled, (state, action: PayloadAction<Cart>) => ({
        ...state,
        pending: false,
        data: action.payload,
      }))
      .addCase(addCartItem.fulfilled, (state, action: PayloadAction<Cart>) => ({
        ...state,
        pending: false,
        data: action.payload,
      }))
      .addCase(
        removeCartItem.fulfilled,
        (state, action: PayloadAction<Cart>) => ({
          ...state,
          pending: false,
          data: action.payload,
        }),
      )
      .addCase(clearCart.fulfilled, (state, action: PayloadAction<Cart>) => ({
        ...state,
        pending: false,
        data: action.payload,
      }))
    builder.addMatcher(
      isAnyOf(
        fetchCart.pending,
        createCart.pending,
        addCartItem.pending,
        removeCartItem.pending,
        clearCart.pending,
      ),
      (state: CartState) => ({
        ...state,
        pending: true,
      }),
    )
  },
})

export const { setIsCartOpened } = cartSlice.actions

export const selectCartData = (state: RootState) => state.cart.data
export const selectIsCartPending = (state: RootState) => state.cart.pending
export const selectIsCartOpened = (state: RootState) => state.cart.isOpened

export default cartSlice.reducer
