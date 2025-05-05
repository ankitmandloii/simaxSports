// canvasSlice.js
import { createSlice } from '@reduxjs/toolkit';

const canvasSlice = createSlice({
  name: 'canvas',
  initialState: {
    text: 'Begain Typing....',
  },
  reducers: {
    setText: (state, action) => {
      state.text = action.payload;
    },
  },
});

export const { setText } = canvasSlice.actions;
export default canvasSlice.reducer;
