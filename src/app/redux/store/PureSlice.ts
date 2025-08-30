// src/redux/store/rollsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface Pure {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
}

interface pureState {
  Pure: Pure[];
  loading: boolean;
  error: string | null;
}

const initialState: pureState = {
  Pure: [],
  loading: false,
  error: null,
};

export const fetchPure = createAsyncThunk<Pure[]>(
  "rolls/fetchRolls",
  async () => {
    const response = await axios.get<Pure[]>(`/api/categories?cat=Pure Veg`); // ✅ API should return Roll[]
    return response.data;
  }
);

const pureSlice = createSlice({
  name: "pure",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPure.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchPure.fulfilled,
        (state, action: PayloadAction<Pure[]>) => {
          state.loading = false;
          state.Pure = action.payload;
        }
      )
      .addCase(fetchPure.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load pure itmes";
      });
  },
});

export default pureSlice.reducer;
