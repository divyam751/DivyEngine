import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import Cookies from "js-cookie";
import { toastError, toastSuccess } from "./toastSlice";

// --------------------------
// Async Thunks
// --------------------------

// REGISTER
export const registerUser = createAsyncThunk(
  "auth/register",
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.post("/auth/register", payload);
      dispatch(toastSuccess(res.data?.message));
      return res.data;
    } catch (err) {
      dispatch(toastError(err.response?.data?.message));
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

// LOGIN
export const loginUser = createAsyncThunk(
  "auth/login",
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.post("/auth/login", payload);
      dispatch(toastSuccess(res.data.message));
      return res.data;
    } catch (err) {
      console.log({ err });
      dispatch(toastError(err.response?.data?.message));
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

// LOGOUT
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      console.log("logout called");
      const res = await api.post("/auth/logout");
      dispatch(toastSuccess(res.data.message));
      return res.data;
    } catch (err) {
      dispatch(toastError(err.response?.data?.message));
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);
// VERIFY USER SESSION (check cookie token)
// ✅ checkAuth - silent version
export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      // Browser automatically sends HttpOnly cookie
      const res = await api.get("/auth/me", { withCredentials: true });
      return res.data;
    } catch (err) {
      // 🔇 Suppress console warnings
      if (err.response?.status === 401) {
        // Return controlled rejection, but no console output
        return rejectWithValue({ silent: true });
      }

      // Handle other errors gracefully
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

// --------------------------
// Slice
// --------------------------

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // ------------------------
      // REGISTER
      // ------------------------
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Registration failed. Please try again.";
      })

      // ------------------------
      // LOGIN
      // ------------------------
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload?.data?.user || null;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload?.message || "Login failed.";
      })

      // ------------------------
      // LOGOUT
      // ------------------------
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Logout failed.";
      })
      // ------------------------
      // CheckAuth
      // ------------------------
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload?.data?.user || null;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.loading = false;
        // Only reset auth if not a silent rejection
        if (!action.payload?.silent) {
          state.isAuthenticated = false;
          state.user = null;
          state.error = null; // Don’t show any message to the user
        }
      });
  },
});

export const { logout, setCredentials, setError, setLoading } =
  authSlice.actions;

export default authSlice.reducer;
