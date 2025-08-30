// redux/store/verifyOtpSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface VerifyOtpState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: VerifyOtpState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

// 🔥 Verify OTP API Call
export const verifyOtp = createAsyncThunk(
  "verifyOtp/verifyOtp",
  async (otp: string, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "OTP verification failed");

      return data; // { message, token, user }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const verifyOtpSlice = createSlice({
  name: "verifyOtp",
  initialState,
  reducers: {
    loadOtpFromStorage: (state) => {
      const savedUser = localStorage.getItem("user");
      const savedToken = localStorage.getItem("token");
      if (savedUser && savedToken) {
        state.user = JSON.parse(savedUser);
        state.token = savedToken;
      }
    },
    // ✅ Simple logout action (no API)
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      state.loading = false;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;

        // ✅ Save separately in localStorage
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(verifyOtp.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { loadOtpFromStorage, logout } = verifyOtpSlice.actions;
export default verifyOtpSlice.reducer;
