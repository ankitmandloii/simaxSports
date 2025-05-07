// store.js
import { configureStore } from '@reduxjs/toolkit';
import canvasReducer from './canvasSlice/CanvasSlice.js';
import TextFrontendDesignSlice from "./FrontendDesign/TextFrontendDesignSlice.js"
// import TextBackendDesignSlice from "./BackendDesign/TextBackendDesignSlice.js";

export const store = configureStore({
  reducer: {
    // canvas: canvasReducer,
    TextFrontendDesignSlice:TextFrontendDesignSlice,
    // TextBackendDesignSlice: TextBackendDesignSlice
  },
});
