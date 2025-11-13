import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice.js";
import toastReducer from "./features/toastSlice.js";
import carReducer from "./features/carSlice.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
    toast: toastReducer,
    cars: carReducer,
  },
});

export default store;
