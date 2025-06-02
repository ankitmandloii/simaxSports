// src/redux/slices/adminSettingsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const fetchAdminSettings = createAsyncThunk(
  'adminSettings/fetchAdminSettings',
  async () => {
    const response = await fetch(`${BASE_URL}settings/getSettings`, {
      method: 'GET',
    });
    const data = await response.json();
    return data.result; // Assuming 'result' holds the settings object
  }
);
const adminSettingsSlice = createSlice({
  name: 'adminSettings',
  initialState: {
    settings: {},
    loading: false,
    error: null,
  },
  reducers: {
    updateAdminSettingsFromSocket: (state, action) => {
      state.settings = {
        ...state.settings,
        ...action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminSettings.fulfilled, (state, action) => {
        state.settings = action.payload;
        state.loading = false;
      })
      .addCase(fetchAdminSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { updateAdminSettingsFromSocket } = adminSettingsSlice.actions;
export default adminSettingsSlice.reducer;
