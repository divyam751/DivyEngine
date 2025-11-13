import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { toastError, toastSuccess } from "./toastSlice";

// ----------------------------------------
// 🚗 Async Thunks
// ----------------------------------------

// 🧾 Create new car listing (for listers)
export const createCar = createAsyncThunk(
  "car/createCar",
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      // ✅ Must send as multipart/form-data
      const res = await api.post("/car", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      dispatch(toastSuccess(res.data?.message || "Car listed successfully"));
      return res.data;
    } catch (err) {
      dispatch(toastError(err.response?.data?.message || "Failed to list car"));
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

// 🧾 Fetch all cars listed by the logged-in lister
export const getMyListedCars = createAsyncThunk(
  "car/getMyListedCars",
  async (params = {}, { rejectWithValue, dispatch }) => {
    try {
      const res = await api.get("/car/my-listed", { params });
      return res.data;
    } catch (err) {
      dispatch(
        toastError(err.response?.data?.message || "Failed to load cars")
      );
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

// 🧾 Fetch all available cars (for customers)
export const getAvailableCars = createAsyncThunk(
  "car/getAvailableCars",
  async (params = {}, { rejectWithValue, dispatch }) => {
    try {
      const res = await api.get("/car/available", { params });
      return res.data;
    } catch (err) {
      dispatch(
        toastError(
          err.response?.data?.message || "Failed to fetch available cars"
        )
      );
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

// ----------------------------------------
// 🚘 Slice
// ----------------------------------------

const initialState = {
  myCars: [],
  availableCars: [],
  newCar: null,
  loading: false,
  error: null,
  totalCars: 0,
  totalPages: 1,
  currentPage: 1,
};

const carSlice = createSlice({
  name: "cars",
  initialState,
  reducers: {
    resetCarState: (state) => {
      state.newCar = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // --------------------------
      // CREATE CAR
      // --------------------------
      .addCase(createCar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCar.fulfilled, (state, action) => {
        state.loading = false;
        state.newCar = action.payload?.data || null;
      })
      .addCase(createCar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to create car listing";
      })

      // --------------------------
      // MY LISTED CARS
      // --------------------------
      .addCase(getMyListedCars.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyListedCars.fulfilled, (state, action) => {
        state.loading = false;
        state.myCars = action.payload?.data?.listedCars || [];
        state.totalCars = action.payload?.data?.totalCars || 0;
        state.totalPages = action.payload?.data?.totalPages || 1;
        state.currentPage = action.payload?.data?.currentPage || 1;
      })
      .addCase(getMyListedCars.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to load listed cars";
      })

      // --------------------------
      // AVAILABLE CARS
      // --------------------------
      .addCase(getAvailableCars.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAvailableCars.fulfilled, (state, action) => {
        state.loading = false;
        state.availableCars = action.payload?.data?.cars || [];
      })
      .addCase(getAvailableCars.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to load available cars";
      });
  },
});

export const { resetCarState } = carSlice.actions;
export default carSlice.reducer;
