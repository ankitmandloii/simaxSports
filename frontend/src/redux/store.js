// store.js
import { configureStore } from '@reduxjs/toolkit';
import canvasReducer from './canvasSlice/CanvasSlice.js';
import TextFrontendDesignSlice from "./FrontendDesign/TextFrontendDesignSlice.js"
import ProductReducer from './ProductSlice/ProductSlice.js'
import collectionReducer from './ProductSlice/CollectionSlice.js'
import slectedProducts from './ProductSlice/SelectedProductSlice.js'
// import TextBackendDesignSlice from "./BackendDesign/TextBackendDesignSlice.js";

export const store = configureStore({
  reducer: {
    // canvas: canvasReducer,
    TextFrontendDesignSlice: TextFrontendDesignSlice,
    products: ProductReducer,
    collections: collectionReducer,
    slectedProducts: slectedProducts,
    // TextBackendDesignSlice: TextBackendDesignSlice
  },
});
