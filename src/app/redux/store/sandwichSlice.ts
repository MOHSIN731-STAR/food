
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface Sand {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
}

interface sandState {
  sandWich: Sand[];
  loading: boolean;
  error: string | null;
}

const initialState: sandState = {
  sandWich: [],
  loading: false,
  error: null,
};

export const fetchSand = createAsyncThunk<Sand[]>(
  "rolls/fksjdfls",
  async () => {
    const response = await axios.get<Sand[]>(`/api/categories?cat=Sandwich`); // ✅ API should return Roll[]
    return response.data;
  }
);

const SandSlice = createSlice({
  name: "sandWich",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchSand.fulfilled,
        (state, action: PayloadAction<Sand[]>) => {
          state.loading = false;
          state.sandWich = action.payload;
        }
      )
      .addCase(fetchSand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load rolls";
      });
  },
});

export default SandSlice.reducer;
