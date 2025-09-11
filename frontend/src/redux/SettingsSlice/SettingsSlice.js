
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const BASE_URL = process.env.REACT_APP_BASE_URL;
export const fetchSettings = createAsyncThunk("settings/fetch", async () => {
  const response = await axios.get(`${BASE_URL}design/admin-get-settings`); // your endpoint
  return response.data.result; // returns only `result` object
});

const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  },
});

export default settingsSlice.reducer;
