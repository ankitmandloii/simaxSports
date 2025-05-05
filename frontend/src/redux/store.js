// store.js
import { configureStore } from '@reduxjs/toolkit';
import canvasReducer from './canvasSlice/CanvasSlice.js';

export const store = configureStore({
  reducer: {
    canvas: canvasReducer,
  },
});
