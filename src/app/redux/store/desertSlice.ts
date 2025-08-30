// src/redux/store/rollsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface desert {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
}

interface desertState {
  desert: desert[];
  loading: boolean;
  error: string | null;
}

const initialState: desertState = {
  desert: [],
  loading: false,
  error: null,
};

export const fetchdesert = createAsyncThunk<desert[]>(
  "Desert/fetchDesert",
  async () => {
    const response = await axios.get<desert[]>(`/api/categories?cat=Deserts`); // ✅ API should return Roll[]
    return response.data;
  }
);

const desertSlice = createSlice({
  name: "deserts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchdesert.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchdesert.fulfilled,
        (state, action: PayloadAction<desert[]>) => {
          state.loading = false;
          state.desert = action.payload;
        }
      )
      .addCase(fetchdesert.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load rolls";
      });
  },
});

export default desertSlice.reducer;
