import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../../lib/api"; // custom axios instance
import { clearCart, loadUserCart } from "./cartSlice";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  token?: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

// ✅ Load user from localStorage
const storedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null;

const initialState: AuthState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  loading: false,
  error: null,
};

// ====================== ASYNC THUNKS ======================

// Register User
export const registerUser = createAsyncThunk(
  "auth/register",
  async (
    { name, email, password, role }: { name: string; email: string; password: string; role?: "user" | "admin" },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.post("/auth/register", { name, email, password, role });
      return res.data; // { user, token }
    } catch (err: unknown) {
      return rejectWithValue(err.response?.data?.error || "Registration failed");
    }
  }
);

// Login User
export const loginUser = createAsyncThunk(
  "auth/login",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const res = await api.post("/auth/login", { email, password });

      // ✅ Clear previous cart and load current user's cart
      dispatch(clearCart());
      setTimeout(() => dispatch(loadUserCart()), 0);

      return res.data; // { user, token }
    } catch (err: unknown) {
      return rejectWithValue(err.response?.data?.error || "Login failed");
    }
  }
);

// ====================== SLICE ======================

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state, action) {
      state.user = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");

      // ✅ Clear cart on logout
      action.asyncDispatch?.(clearCart());
    },
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
      if (action.payload.token) {
        localStorage.setItem("token", action.payload.token);
      }
    },
  },
  extraReducers: (builder) => {
    // Register
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = { ...action.payload.user, token: action.payload.token };
      localStorage.setItem("user", JSON.stringify(state.user));
      localStorage.setItem("token", action.payload.token);
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Login
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = { ...action.payload.user, token: action.payload.token };
      localStorage.setItem("user", JSON.stringify(state.user));
      localStorage.setItem("token", action.payload.token);
      state.error = null;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

// ====================== EXPORTS ======================

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;
