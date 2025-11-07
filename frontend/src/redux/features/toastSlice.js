import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  toastStatus: null,
  toastMessage: null,
  toastTrigger: null,
};

const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    toastSuccess: (state, action) => {
      state.toastStatus = "success";
      state.toastMessage = action.payload;
      state.toastTrigger = Date.now();
    },
    toastError: (state, action) => {
      state.toastStatus = "error";
      state.toastMessage = action.payload;
      state.toastTrigger = Date.now();
    },
  },
});

export const { toastError, toastSuccess } = toastSlice.actions;

export default toastSlice.reducer;
