import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

import type { RootState } from '@/store'

export interface Perfume {
  id: string
  name: string
  price: number
  aromas: string[]
  description: string
  imageURLs: string[]
}

interface PerfumesState {
  data: Perfume[]
  pending: boolean
  error: string | null
}

const initialState: PerfumesState = {
  data: [],
  pending: false,
  error: null,
}

export const fetchPerfumes = createAsyncThunk(
  'perfumes/fetchPerfumes',
  async () => {
    const { data } = await axios.get('/api/perfumes')

    return data as Perfume[]
  },
)

const perfumesSlice = createSlice({
  name: 'perfumes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPerfumes.pending, (state) => ({
        ...state,
        pending: true,
      }))
      .addCase(
        fetchPerfumes.fulfilled,
        (state, action: PayloadAction<Perfume[]>) => ({
          ...state,
          pending: false,
          data: action.payload,
        }),
      )
  },
})

export const selectPerfumes = (state: RootState) => state.perfumes.data
export const selectIsPerfumesPending = (state: RootState) =>
  state.perfumes.pending

export default perfumesSlice.reducer
