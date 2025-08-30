import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const getUserCartKey = () => {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("user");
    if (user) {
      const parsed = JSON.parse(user);
      return `cart_${parsed.email}`; // email ya id ke sath unique key
    }
  }
  return "cart_guest";
};

const loadCart = () => {
  if (typeof window !== "undefined") {
    return JSON.parse(localStorage.getItem(getUserCartKey()) || "[]");
  }
  return [];
};

const initialState: CartState = {
  items: loadCart(),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) {
        existing.quantity++;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      localStorage.setItem(getUserCartKey(), JSON.stringify(state.items));
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.id !== action.payload);
      localStorage.setItem(getUserCartKey(), JSON.stringify(state.items));
    },
    decreaseQuantity(state, action: PayloadAction<string>) {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) {
        if (item.quantity > 1) item.quantity--;
        else state.items = state.items.filter((i) => i.id !== action.payload);
      }
      localStorage.setItem(getUserCartKey(), JSON.stringify(state.items));
    },
    clearCart(state) {
      state.items = [];
      localStorage.setItem(getUserCartKey(), JSON.stringify([]));
    },
    loadUserCart(state) {
      state.items = loadCart();
    },
  },
});

export const { addToCart, removeFromCart, decreaseQuantity, clearCart, loadUserCart } =
  cartSlice.actions;
export default cartSlice.reducer;
