// store/settingsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  settingsForTextSection: {},
  settingsforAddNamesAndNumbers: {},
  settingsforAddArtSection: {},
  uploadSettings: {},
  artworkEditorSettings: {},
  otherSettings: {},
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setAllSettings: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setAllSettings } = settingsSlice.actions;
export default settingsSlice.reducer;
