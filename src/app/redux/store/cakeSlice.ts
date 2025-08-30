
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface cake {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
}

interface cakeState {
  Cake: cake[];
  loading: boolean;
  error: string | null;
}

const initialState: cakeState = {
  Cake: [],
  loading: false,
  error: null,
};

export const fetchCake = createAsyncThunk<cake[]>(
  "rolls/fetchCake",
  async () => {
    const response = await axios.get<cake[]>(`/api/categories?cat=Cake`); // ✅ API should return Roll[]
    return response.data;
  }
);

const SandSlice = createSlice({
  name: "cake",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCake.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCake.fulfilled,
        (state, action: PayloadAction<cake[]>) => {
          state.loading = false;
          state.Cake = action.payload;
        }
      )
      .addCase(fetchCake.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load cakes";
      });
  },
});

export default SandSlice.reducer;
