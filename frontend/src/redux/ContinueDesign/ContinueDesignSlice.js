import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  initialPopupShown: false,
};

const continueDesignSlice = createSlice({
  name: 'continueDesign',
  initialState,
  reducers: {
    setInitialPopupShown: (state) => {
      state.initialPopupShown = true;
    },
  },
});

export const { setInitialPopupShown } = continueDesignSlice.actions;
export default continueDesignSlice.reducer;