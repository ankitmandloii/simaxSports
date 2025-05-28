// src/redux/canvasExportSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  exportRequested: false,
  exportedImages: null,
};  

const canvasExportSlice = createSlice({
  name: "canvasExport",
  initialState,
  reducers: {
    requestExport: (state) => {
      state.exportRequested = true;
    },
    setExportedImages: (state, action) => {
      state.exportedImages = action.payload;
      state.exportRequested = false;
    },
    resetExportState: (state) => {
      state.exportRequested = false;
      state.exportedImages = null;
    },
  },
});

export const { requestExport, setExportedImages, resetExportState } = canvasExportSlice.actions;
export default canvasExportSlice.reducer;
