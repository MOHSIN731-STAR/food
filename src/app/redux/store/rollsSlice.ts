// src/redux/store/rollsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface Roll {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
}

interface RollsState {
  rolls1: Roll[];
  loading: boolean;
  error: string | null;
}

const initialState: RollsState = {
  rolls1: [],
  loading: false,
  error: null,
};

export const fetchRolls = createAsyncThunk<Roll[]>(
  "rolls/fetfsdf",
  async () => {
    const response = await axios.get<Roll[]>("/rolls.json"); // ✅ API should return Roll[]
    return response.data;
  }
);

const rollsSlice = createSlice({
  name: "rolls",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRolls.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchRolls.fulfilled,
        (state, action: PayloadAction<Roll[]>) => {
          state.loading = false;
          state.rolls1 = action.payload;
        }
      )
      .addCase(fetchRolls.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load rolls";
      });
  },
});

export default rollsSlice.reducer;
