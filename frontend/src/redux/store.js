// store.js
import { configureStore } from '@reduxjs/toolkit';
import canvasReducer from './canvasSlice/CanvasSlice.js';
import TextFrontendDesignSlice from "./FrontendDesign/TextFrontendDesignSlice.js"

export const store = configureStore({
  reducer: {
    canvas: canvasReducer,
    TextFrontendDesignSlice:TextFrontendDesignSlice
  },
});
