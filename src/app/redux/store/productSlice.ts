import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Product type
interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
}

// State type
interface ProductState {
  items: Product[];
  loading: boolean;
}

const initialState: ProductState = {
  items: [],
  loading: false,
};

// Async thunk to get dummy data from local JSON
export const getProducts = createAsyncThunk("products/getProducts", async () => {
  // Simulate fetching from JSON file
  const res = await fetch(`/api/categories?cat=Salad`);
  const data: Product[] = await res.json();
  return data;
});

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(getProducts.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default productSlice.reducer;
